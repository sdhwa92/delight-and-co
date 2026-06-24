import { NextResponse, type NextRequest } from "next/server";
import type Stripe from "stripe";
import { stripe } from "@/lib/stripe";
import {
  calculateItemTotal,
  calculateShipping,
  type OrderItem,
} from "@/lib/pricing";

const CURRENCY = "aud";

interface CheckoutItem {
  letters: unknown;
  presentBox?: unknown;
  extraCharacterParts?: unknown;
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

export async function POST(request: NextRequest) {
  let body: { items?: CheckoutItem[]; customerEmail?: string };
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

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items,
      shipping_address_collection: { allowed_countries: ["AU"] },
      success_url: `${origin}/order/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/order/cancel`,
      customer_email:
        typeof body.customerEmail === "string" ? body.customerEmail : undefined,
      metadata: {
        items: JSON.stringify(
          items.map((item) => ({
            letters: item.letters,
            presentBox: item.presentBox ?? false,
            extraCharacterParts: item.extraCharacterParts ?? false,
          })),
        ),
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error("Stripe checkout session creation failed:", err);
    return NextResponse.json(
      { error: "Unable to start checkout. Please try again." },
      { status: 500 },
    );
  }
}
