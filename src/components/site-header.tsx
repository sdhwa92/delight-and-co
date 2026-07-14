"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Menu, X } from "lucide-react";

const NAV_LINKS = [
  { href: "/#home", label: "Home" },
  { href: "/order", label: "Order" },
  { href: "/#gallery", label: "Gallery" },
] as const;

export function SiteHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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

        <nav className="hidden items-center gap-6 text-base font-semibold md:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="transition-colors hover:text-[var(--brand-coral)]"
              style={{ color: "var(--brand-brown)" }}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <button
          type="button"
          onClick={() => setIsMenuOpen((open) => !open)}
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          aria-expanded={isMenuOpen}
          className="cursor-pointer appearance-none border-0 bg-transparent p-1 md:hidden"
          style={{ color: "var(--brand-brown)" }}
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {isMenuOpen && (
        <nav
          className="flex flex-col gap-1 border-t border-[var(--brand-coral)]/40 px-4 py-3 text-base font-semibold md:hidden"
          style={{ backgroundColor: "var(--brand-cream)" }}
        >
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setIsMenuOpen(false)}
              className="rounded-lg px-2 py-2 transition-colors hover:text-[var(--brand-coral)]"
              style={{ color: "var(--brand-brown)" }}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
