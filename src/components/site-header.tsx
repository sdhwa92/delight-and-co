import Image from "next/image";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-[var(--brand-coral)]/40 bg-[var(--brand-cream)]/90 backdrop-blur-sm">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <a href="#home" className="flex items-center gap-2">
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
        </a>

        <nav className="flex items-center gap-6 text-base font-semibold">
          <a
            href="#home"
            className="transition-colors hover:text-[var(--brand-coral)]"
            style={{ color: "var(--brand-brown)" }}
          >
            Home
          </a>
          <a
            href="#order"
            className="transition-colors hover:text-[var(--brand-coral)]"
            style={{ color: "var(--brand-brown)" }}
          >
            Order
          </a>
          <a
            href="#reviews"
            className="transition-colors hover:text-[var(--brand-coral)]"
            style={{ color: "var(--brand-brown)" }}
          >
            Reviews
          </a>
        </nav>
      </div>
    </header>
  );
}
