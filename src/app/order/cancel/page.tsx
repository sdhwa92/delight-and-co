import Link from "next/link";
import { XCircle } from "lucide-react";

export default function OrderCancelPage() {
  return (
    <section
      className="flex flex-1 items-center justify-center py-24"
      style={{ backgroundColor: "var(--brand-cream)" }}
    >
      <div className="mx-auto max-w-md px-4 text-center">
        <XCircle
          size={56}
          className="mx-auto mb-6"
          style={{ color: "var(--brand-coral)" }}
        />
        <h1
          className="text-3xl font-extrabold"
          style={{ color: "var(--brand-brown)" }}
        >
          Checkout cancelled
        </h1>
        <p className="mt-3 text-sm" style={{ color: "var(--brand-brown)" }}>
          No payment was taken. Your keyring order is still waiting for you
          whenever you&apos;re ready.
        </p>
        <Link
          href="/#order"
          className="mt-8 inline-block rounded-full px-6 py-3 text-sm font-bold text-white"
          style={{ backgroundColor: "var(--brand-coral)" }}
        >
          Return to order form
        </Link>
      </div>
    </section>
  );
}
