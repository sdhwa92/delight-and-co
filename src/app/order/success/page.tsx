import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { stripe } from "@/lib/stripe";
import {
  formatPrice,
  calculateItemTotal,
  calculateSubtotal,
  calculateShipping,
} from "@/lib/pricing";

interface OrderItem {
  letters: string;
  presentBox: boolean;
  extraCharacterParts: boolean;
}

async function getSession(sessionId: string) {
  try {
    return await stripe.checkout.sessions.retrieve(sessionId);
  } catch {
    return null;
  }
}

export default async function OrderSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>;
}) {
  const { session_id } = await searchParams;

  const session = session_id ? await getSession(session_id) : null;
  const fullName =
    session?.customer_details?.name ??
    session?.metadata?.customerName ??
    "";
  const firstName = fullName ? fullName.split(" ")[0] : null;

  let orderItems: OrderItem[] = [];
  try {
    if (session?.metadata?.items) {
      orderItems = JSON.parse(session.metadata.items) as OrderItem[];
    }
  } catch {
    // metadata parse failure — show page without order summary
  }

  const subtotal = calculateSubtotal(orderItems);
  const shipping = calculateShipping(orderItems.length);
  const total = subtotal + shipping;

  return (
    <section
      className="flex flex-1 items-center justify-center py-24"
      style={{ backgroundColor: "var(--brand-cream)" }}
    >
      <div className="mx-auto max-w-md px-4 text-center">
        <CheckCircle2
          size={56}
          className="mx-auto mb-6"
          style={{ color: "var(--brand-coral)" }}
        />
        <h1
          className="text-3xl font-extrabold"
          style={{ color: "var(--brand-brown)" }}
        >
          {firstName ? `Thank you, ${firstName}!` : "Thank you for your order!"}
        </h1>
        <p className="mt-3 text-base" style={{ color: "var(--brand-brown)" }}>
          Your payment was successful. We&apos;ll start handcrafting your
          keyrings and send a confirmation email shortly.
        </p>

        {orderItems.length > 0 && (
          <div
            className="mt-6 rounded-2xl p-5 text-left"
            style={{
              backgroundColor: "var(--brand-yellow)",
              color: "var(--brand-brown)",
            }}
          >
            <p className="mb-3 text-sm font-extrabold tracking-wider uppercase">
              Order Summary
            </p>
            <div className="flex flex-col gap-2 text-sm">
              {orderItems.map((item, i) => (
                <div key={i} className="flex justify-between">
                  <span>
                    Keyring {i + 1}
                    {item.letters ? ` (${item.letters})` : ""}
                  </span>
                  <span>{formatPrice(calculateItemTotal(item))}</span>
                </div>
              ))}
            </div>
            <div className="mt-3 flex justify-between border-t border-[var(--brand-brown)]/20 pt-3 text-sm">
              <span>Subtotal</span>
              <span>{formatPrice(subtotal)}</span>
            </div>
            <div className="mt-1 flex justify-between text-sm">
              <span>Shipping</span>
              <span>{shipping === 0 ? "FREE" : formatPrice(shipping)}</span>
            </div>
            <div className="mt-3 flex justify-between border-t border-[var(--brand-brown)]/20 pt-3 text-base font-extrabold">
              <span>Total</span>
              <span>{formatPrice(total)}</span>
            </div>
          </div>
        )}

        {session_id && (
          <p
            className="mt-4 text-sm"
            style={{ color: "var(--brand-brown)", opacity: 0.5 }}
          >
            Order reference: {session_id}
          </p>
        )}
        <Link
          href="/"
          className="mt-8 inline-block rounded-full px-6 py-3 text-base font-bold text-white"
          style={{ backgroundColor: "var(--brand-coral)" }}
        >
          Back to home
        </Link>
      </div>
    </section>
  );
}
