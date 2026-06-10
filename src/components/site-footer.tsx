import Image from "next/image";

export function SiteFooter() {
  return (
    <footer
      className="py-10"
      style={{ backgroundColor: "var(--brand-brown)" }}
    >
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 px-4 text-center">
        <Image
          src="/logo.png"
          alt="Delight & Co"
          width={56}
          height={56}
          className="object-contain opacity-90"
        />
        <p className="text-sm font-semibold text-white/80">
          Handmade Gifts for Little Smiles
        </p>
        <p className="text-xs text-white/50">
          © {new Date().getFullYear()} Delight &amp; Co. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
