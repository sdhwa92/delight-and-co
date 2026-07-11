import Image from "next/image";
import Link from "next/link";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-[var(--brand-coral)]/40 bg-[var(--brand-cream)]/90 backdrop-blur-sm">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/logo.png"
            alt="Delight & Co"
            width={48}
            height={48}
            className="object-contain"
          />
          <span
            className="hidden text-xl font-extrabold sm:block"
            style={{ color: "var(--brand-brown)" }}
          >
            delight &amp; co
          </span>
        </Link>

        <nav className="flex items-center gap-6 text-base font-semibold">
          <Link
            href="/#home"
            className="transition-colors hover:text-[var(--brand-coral)]"
            style={{ color: "var(--brand-brown)" }}
          >
            Home
          </Link>
          <Link
            href="/order"
            className="transition-colors hover:text-[var(--brand-coral)]"
            style={{ color: "var(--brand-brown)" }}
          >
            Order
          </Link>
          <Link
            href="/#reviews"
            className="transition-colors hover:text-[var(--brand-coral)]"
            style={{ color: "var(--brand-brown)" }}
          >
            Reviews
          </Link>
        </nav>
      </div>
    </header>
  );
}
