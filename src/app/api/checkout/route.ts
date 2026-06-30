import { randomUUID } from "crypto";
import { NextResponse, type NextRequest } from "next/server";
import type Stripe from "stripe";
import { stripe } from "@/lib/stripe";
import { supabase } from "@/lib/supabase";
import {
  calculateItemTotal,
  calculateShipping,
  calculateSubtotal,
  type OrderItem,
} from "@/lib/pricing";

const CURRENCY = "aud";

const FREE_ACCESSORY_KEYS = ["Silicon tie", "4 Beads", "2 Character parts"] as const;

interface CheckoutItem {
  letters: unknown;
  presentBox?: unknown;
  extraCharacterParts?: unknown;
  stringColor?: unknown;
  freeAccessories?: unknown;
}

function sanitizeItem(raw: CheckoutItem): OrderItem | null {
  if (typeof raw.letters !== "string") return null;
  const letters = raw.letters.toUpperCase().replace(/[^A-Z\s]/g, "");
  if (!letters.replace(/\s/g, "").length) return null;
  return {
    letters,
    presentBox: raw.presentBox === true,
    extraCharacterParts: raw.extraCharacterParts === true,
  };
}

function describeItem(item: OrderItem): string {
  const extras: string[] = [];
  if (item.presentBox) extras.push("Present Box");
  if (item.extraCharacterParts) extras.push("Extra Character Parts ×2");
  const suffix = extras.length ? ` (${extras.join(", ")})` : "";
  return `Custom Keyring — ${item.letters.trim()}${suffix}`;
}

// Encodes freeAccessories per item as compact pipe-separated 3-bit strings.
// e.g. two items: "110|011" — bits = [Silicon tie, 4 Beads, 2 Character parts]
function encodeFreeAccessories(rawItems: CheckoutItem[]): string {
  return rawItems
    .map((it) => {
      const acc = Array.isArray(it.freeAccessories) ? it.freeAccessories : [];
      return FREE_ACCESSORY_KEYS.map((k) => (acc.includes(k) ? "1" : "0")).join("");
    })
    .join("|");
}

export async function POST(request: NextRequest) {
  let body: { items?: CheckoutItem[] };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid request body." },
      { status: 400 },
    );
  }

  if (!Array.isArray(body.items) || body.items.length === 0) {
    return NextResponse.json({ error: "No items in order." }, { status: 400 });
  }

  const items = body.items
    .map(sanitizeItem)
    .filter((it): it is OrderItem => it !== null);

  if (items.length === 0) {
    return NextResponse.json(
      { error: "No valid items in order." },
      { status: 400 },
    );
  }

  const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] = items.map(
    (item) => ({
      price_data: {
        currency: CURRENCY,
        product_data: { name: describeItem(item) },
        unit_amount: calculateItemTotal(item),
      },
      quantity: 1,
    }),
  );

  const shipping = calculateShipping(items.length);
  if (shipping > 0) {
    line_items.push({
      price_data: {
        currency: CURRENCY,
        product_data: { name: "Shipping" },
        unit_amount: shipping,
      },
      quantity: 1,
    });
  }

  const origin = process.env.NEXT_PUBLIC_BASE_URL ?? request.nextUrl.origin;

  const orderId = randomUUID();

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items,
      client_reference_id: orderId,
      shipping_address_collection: { allowed_countries: ["AU"] },
      phone_number_collection: { enabled: true },
      success_url: `${origin}/order/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/order/cancel`,
      metadata: {
        // Core order items (letters, extras) — kept small for 500-char limit
        items: JSON.stringify(
          items.map((item) => ({
            letters: item.letters,
            presentBox: item.presentBox ?? false,
            extraCharacterParts: item.extraCharacterParts ?? false,
          })),
        ),
        // String colors: comma-separated per item (e.g. "pink,yellow,purple")
        stringColors: body.items
          .map((it) => (typeof it.stringColor === "string" ? it.stringColor : "pink"))
          .join(","),
        // Free accessories: compact 3-bit encoding per item (e.g. "111|110")
        freeAcc: encodeFreeAccessories(body.items),
        subtotalCents: String(calculateSubtotal(items)),
        shippingCents: String(calculateShipping(items.length)),
      },
    });

    const { error: orderError } = await supabase.from("orders").insert({
      id: orderId,
      stripe_session_id: session.id,
      status: "pending",
      subtotal_cents: calculateSubtotal(items),
      shipping_cents: calculateShipping(items.length),
      total_cents: calculateSubtotal(items) + calculateShipping(items.length),
    });

    if (!orderError) {
      const orderItemRows = items.map((it, i) => ({
        order_id: orderId,
        product_type: "keyring",
        quantity: 1,
        unit_price_cents: calculateItemTotal(it),
        config: {
          letters: it.letters,
          stringColor: body.items[i].stringColor ?? "pink",
          presentBox: it.presentBox,
          extraCharacterParts: it.extraCharacterParts,
          freeAccessories: Array.isArray(body.items[i].freeAccessories)
            ? body.items[i].freeAccessories
            : [],
        },
      }));
      const { error: itemsError } = await supabase.from("order_items").insert(orderItemRows);
      if (itemsError) console.error("Failed to insert order_items:", itemsError);
    } else {
      console.error("Failed to insert order:", orderError);
    }

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error("Stripe checkout session creation failed:", err);
    return NextResponse.json(
      { error: "Unable to start checkout. Please try again." },
      { status: 500 },
    );
  }
}
