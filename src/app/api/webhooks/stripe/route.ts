import { NextRequest, NextResponse } from "next/server";
import type Stripe from "stripe";
import { stripe } from "@/lib/stripe";
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

    // Fix 3: prefer confirmed customer email over pre-fill value
    const customerEmail = session.customer_details?.email ?? session.customer_email;
    const meta = session.metadata ?? {};

    if (customerEmail && meta.items) {
      // Fix 2: wrap fulfillment in try/catch — return 200 on failure so Stripe won't retry
      try {
        const rawItems: Array<{ letters: string; presentBox: boolean; extraCharacterParts: boolean }> =
          JSON.parse(meta.items);

        const stringColors = meta.stringColors ? meta.stringColors.split(",") : [];
        const freeAccPerItem = decodeFreeAccessories(meta.freeAcc ?? "", rawItems.length);

        const emailItems: EmailOrderItem[] = rawItems.map((it, i) => ({
          letters: it.letters,
          stringColor: stringColors[i] ?? "pink",
          presentBox: it.presentBox,
          extraCharacterParts: it.extraCharacterParts,
          freeAccessories: freeAccPerItem[i],
        }));

        const ctx = {
          items: emailItems,
          customerName: meta.customerName ?? "",
          customerPhone: meta.customerPhone || undefined,
          deliveryAddress: meta.deliveryAddress ?? "",
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
            subject: `New order from ${meta.customerName || customerEmail}`,
            html: buildOwnerNotificationEmail({
              customer_name: meta.customerName ?? "",
              customer_email: customerEmail,
              customer_phone: meta.customerPhone || undefined,
              delivery_address: meta.deliveryAddress ?? "",
              items: emailItems,
              total_cents: totalCents,
            }),
          });
        }
      } catch (err) {
        console.error("Order fulfillment failed:", err);
        // Return 200 so Stripe does not retry — failure is logged for manual follow-up
      }
    }
  }

  return NextResponse.json({ received: true });
}
