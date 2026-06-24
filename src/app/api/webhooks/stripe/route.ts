import { NextRequest, NextResponse } from "next/server";
import type Stripe from "stripe";
import { stripe } from "@/lib/stripe";
import { transporter } from "@/lib/mailer";
import { buildOrderConfirmationEmail } from "@/lib/email-template";
import type { OrderItem } from "@/lib/pricing";

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

    const customerEmail = session.customer_email;
    const rawItems = session.metadata?.items;

    if (customerEmail && rawItems) {
      const items: OrderItem[] = JSON.parse(rawItems);

      await transporter.sendMail({
        from: `"Delight & Co" <${process.env.GMAIL_USER}>`,
        to: customerEmail,
        subject: "🎁 Your Delight & Co order is confirmed!",
        html: buildOrderConfirmationEmail(items),
      });

      if (process.env.OWNER_EMAIL) {
        await transporter.sendMail({
          from: `"Delight & Co" <${process.env.GMAIL_USER}>`,
          to: process.env.OWNER_EMAIL,
          subject: `New order from ${customerEmail}`,
          html: buildOrderConfirmationEmail(items),
        });
      }
    }
  }

  return NextResponse.json({ received: true });
}
