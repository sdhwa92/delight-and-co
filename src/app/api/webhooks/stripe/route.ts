import { NextRequest, NextResponse } from "next/server";
import type Stripe from "stripe";
import { stripe } from "@/lib/stripe";
import { supabase } from "@/lib/supabase";
import { transporter } from "@/lib/mailer";
import {
  buildOrderConfirmationEmail,
  buildOwnerNotificationEmail,
  type EmailOrderItem,
} from "@/lib/email-template";

const FREE_ACCESSORY_KEYS = ["Silicon tie", "4 Beads", "2 Character parts"] as const;

// Decodes the compact freeAcc metadata string back to per-item arrays.
// "111|110" → [["Silicon tie","4 Beads","2 Character parts"], ["Silicon tie","4 Beads"]]
function decodeFreeAccessories(encoded: string, itemCount: number): string[][] {
  const groups = encoded ? encoded.split("|") : [];
  return Array.from({ length: itemCount }, (_, i) => {
    const bits = groups[i] ?? "";
    return FREE_ACCESSORY_KEYS.filter((_, j) => bits[j] === "1");
  });
}

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature");

  if (!sig) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!,
    );
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;

    // Fix 1: skip async-payment sessions that haven't been paid yet
    if (session.payment_status !== "paid") {
      return NextResponse.json({ received: true });
    }

    // Customer info now comes from Stripe Checkout, not the order form
    const customerEmail = session.customer_details?.email ?? session.customer_email;
    const customerName = session.customer_details?.name ?? "";
    const customerPhone = session.customer_details?.phone ?? undefined;
    const addr = session.collected_information?.shipping_details?.address;
    const deliveryAddress = addr
      ? [addr.line1, addr.line2, addr.city, addr.state, addr.postal_code]
          .filter(Boolean)
          .join(", ")
      : "";
    const meta = session.metadata ?? {};

    const orderId = session.client_reference_id;

    if (customerEmail && (meta.items || orderId)) {
      // Fix 2: wrap fulfillment in try/catch — return 200 on failure so Stripe won't retry
      try {
        // Upsert order record in Supabase
        let order: { confirmed_at?: string | null } | null = null;
        if (orderId) {
          const { data: upsertedOrder, error: upsertError } = await supabase
            .from("orders")
            .upsert(
              {
                id: orderId,
                stripe_session_id: session.id,
                status: "paid",
                customer_name: customerName,
                customer_email: customerEmail ?? "",
                customer_phone: customerPhone ?? null,
                delivery_address: deliveryAddress,
                paid_at: new Date().toISOString(),
              },
              { onConflict: "id" },
            )
            .select()
            .single();
          if (upsertError) {
            console.error("Failed to upsert order:", upsertError);
          } else {
            order = upsertedOrder;
          }
        }

        // Idempotency guard — skip if confirmation email already sent
        if (order?.confirmed_at) {
          return NextResponse.json({ received: true });
        }

        // Fetch order items from DB for email content
        const { data: orderItems } = orderId
          ? await supabase
              .from("order_items")
              .select("product_type, config")
              .eq("order_id", orderId)
          : { data: null };

        // Build emailItems from DB rows, or fall back to session metadata
        let emailItems: EmailOrderItem[];
        if (orderItems && orderItems.length > 0) {
          emailItems = orderItems
            .filter((row) => row.product_type === "keyring")
            .map((row) => row.config as EmailOrderItem);
        } else {
          const rawItems: Array<{ letters: string; presentBox: boolean; extraCharacterParts: boolean }> =
            JSON.parse(meta.items);

          const stringColors = meta.stringColors ? meta.stringColors.split(",") : [];
          const freeAccPerItem = decodeFreeAccessories(meta.freeAcc ?? "", rawItems.length);

          emailItems = rawItems.map((it, i) => ({
            letters: it.letters,
            stringColor: stringColors[i] ?? "pink",
            presentBox: it.presentBox,
            extraCharacterParts: it.extraCharacterParts,
            freeAccessories: freeAccPerItem[i],
          }));
        }

        const ctx = {
          items: emailItems,
          customerName,
          customerPhone,
          deliveryAddress,
        };

        await transporter.sendMail({
          from: `"Delight & Co" <${process.env.GMAIL_USER}>`,
          to: customerEmail,
          subject: "🎁 Your Delight & Co order is confirmed!",
          html: buildOrderConfirmationEmail(ctx),
        });

        if (process.env.OWNER_EMAIL) {
          const totalCents = meta.subtotalCents && meta.shippingCents
            ? Number(meta.subtotalCents) + Number(meta.shippingCents)
            : undefined;

          await transporter.sendMail({
            from: `"Delight & Co" <${process.env.GMAIL_USER}>`,
            to: process.env.OWNER_EMAIL,
            subject: `New order from ${customerName || customerEmail}`,
            html: buildOwnerNotificationEmail({
              customer_name: customerName,
              customer_email: customerEmail,
              customer_phone: customerPhone,
              delivery_address: deliveryAddress,
              items: emailItems,
              total_cents: totalCents,
            }),
          });
        }

        // Stamp confirmed_at to prevent duplicate emails
        if (orderId) {
          await supabase
            .from("orders")
            .update({ confirmed_at: new Date().toISOString() })
            .eq("id", orderId);
        }
      } catch (err) {
        console.error("Order fulfillment failed:", err);
        // Return 200 so Stripe does not retry — failure is logged for manual follow-up
      }
    }
  }

  return NextResponse.json({ received: true });
}
