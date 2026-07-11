import Image from "next/image";
import { Gift, Heart, Sparkles, Star } from "lucide-react";

const TRUST_LIST = [
  { icon: Heart, label: "Custom Names" },
  { icon: Sparkles, label: "Handmade" },
  { icon: Gift, label: "Made With Love" },
  { icon: Star, label: "One Of A Kind" },
] as const;

export function BrandStorySection() {
  return (
    <section className="py-20" style={{ backgroundColor: "var(--brand-cream)" }}>
      <div className="mx-auto max-w-6xl px-4">
        <div className="flex flex-col items-center gap-10 md:flex-row md:gap-16">
          {/* Left: text */}
          <div className="flex flex-1 flex-col items-center text-center md:items-start md:text-left">
            <h2
              className="font-heading text-3xl leading-tight font-extrabold sm:text-4xl"
              style={{ color: "var(--brand-brown)" }}
            >
              Made{" "}
              <span className="italic tracking-wide" style={{ color: "var(--brand-coral)" }}>
                with love
              </span>
              , just for your family <span aria-hidden>🩷</span>
            </h2>
            <p
              className="mt-4 max-w-sm text-base"
              style={{ color: "var(--brand-brown)", opacity: 0.8 }}
            >
              Every family keyring is hand-strung letter by letter, so each
              name, initial, and little charm is one-of-a-kind — a small
              keepsake made to be carried close, every day.
            </p>

            <div className="mt-8 flex w-full max-w-xs flex-col gap-4 rounded-2xl bg-white p-6">
              {TRUST_LIST.map(({ icon: Icon, label }) => (
                <div key={label} className="flex items-center gap-3">
                  <Icon size={18} style={{ color: "var(--brand-coral)" }} />
                  <span
                    className="text-sm font-bold tracking-wide uppercase"
                    style={{ color: "var(--brand-brown)" }}
                  >
                    {label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Right: product photo */}
          <div className="relative aspect-[4/5] w-full max-w-sm flex-1 overflow-hidden rounded-3xl">
            <Image
              src="/brand-story-keyrings.png"
              alt="Three handmade custom alphabet keyrings spelling LEONZ, CHEYNE, and SUZIA"
              fill
              className="object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
