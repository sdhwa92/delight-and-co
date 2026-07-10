import { NextResponse, type NextRequest } from "next/server";
import { stripe } from "@/lib/stripe";

// TEMPORARY — production smoke-test route. Remove after verifying live payments work.
export async function POST(request: NextRequest) {
  const origin = process.env.NEXT_PUBLIC_BASE_URL ?? request.nextUrl.origin;

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "aud",
            // Stripe's AUD minimum charge is $0.50 — $0.10 is rejected by the API.
            product_data: { name: "Production Test Payment ($0.50)" },
            unit_amount: 50,
          },
          quantity: 1,
        },
      ],
      success_url: `${origin}/test-payment?result=success`,
      cancel_url: `${origin}/test-payment?result=canceled`,
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error("Test payment checkout session creation failed:", err);
    return NextResponse.json(
      { error: "Unable to start test checkout." },
      { status: 500 },
    );
  }
}
