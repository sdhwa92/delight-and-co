import Link from "next/link";
import { CheckCircle2 } from "lucide-react";

export default async function OrderSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>;
}) {
  const { session_id } = await searchParams;

  return (
    <section
      className="flex flex-1 items-center justify-center py-24"
      style={{ backgroundColor: "var(--brand-cream)" }}
    >
      <div className="mx-auto max-w-md px-4 text-center">
        <CheckCircle2
          size={56}
          className="mx-auto mb-6"
          style={{ color: "var(--brand-green)" }}
        />
        <h1
          className="text-3xl font-extrabold"
          style={{ color: "var(--brand-brown)" }}
        >
          Thank you for your order!
        </h1>
        <p className="mt-3 text-sm" style={{ color: "var(--brand-brown)" }}>
          Your payment was successful. We&apos;ll start handcrafting your
          keyrings and send a confirmation email shortly.
        </p>
        {session_id ? (
          <p
            className="mt-4 text-xs"
            style={{ color: "var(--brand-brown)", opacity: 0.5 }}
          >
            Order reference: {session_id}
          </p>
        ) : null}
        <Link
          href="/"
          className="mt-8 inline-block rounded-full px-6 py-3 text-sm font-bold text-white"
          style={{ backgroundColor: "var(--brand-coral)" }}
        >
          Back to home
        </Link>
      </div>
    </section>
  );
}
