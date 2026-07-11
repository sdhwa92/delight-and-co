import Image from "next/image";
import Link from "next/link";
import { Gift, Heart, Smile, Star } from "lucide-react";

const CATEGORIES = [
  {
    label: "Flowers",
    description:
      "Sweet, colorful little blooms in every shade of the rainbow. Clip one on for a soft, playful pop of color that pairs beautifully with any string.",
    image: "/charms-flowers.png",
    alt: "Colorful flower-shaped charm accessories for custom keyrings",
  },
  {
    label: "Rainbow & Cute Friends",
    description:
      "Smiling rainbows, stars, moons, and clouds ready to bring a little extra joy. Perfect for adding personality and a touch of whimsy to your keyring.",
    image: "/charms-rainbow.png",
    alt: "Rainbow, star, and cloud character charm accessories for custom keyrings",
  },
  {
    label: "Bears & More",
    description:
      "Cuddly bears, bows, and other adorable details handpicked for extra charm. A sweet finishing touch that makes every keyring feel one-of-a-kind.",
    image: "/charms-bears.png",
    alt: "Bear and bow charm accessories for custom keyrings",
  },
] as const;

const TRUST_BADGES = [
  { icon: Heart, label: "Handpicked with love" },
  { icon: Star, label: "High quality & lightweight" },
  { icon: Smile, label: "Perfect for every style" },
  { icon: Gift, label: "Makes a great gift" },
] as const;

export function CharmsSection() {
  return (
    <section className="py-20" style={{ backgroundColor: "var(--brand-gray)" }}>
      <div className="mx-auto max-w-6xl px-4">
        <div className="mx-auto mb-12 flex max-w-lg flex-col items-center text-center">
          <span
            className="text-sm font-semibold tracking-widest uppercase"
            style={{ color: "var(--brand-coral)" }}
          >
            Make it extra cute!
          </span>
          <h2
            className="font-heading mt-2 text-3xl font-extrabold sm:text-4xl"
            style={{ color: "var(--brand-brown)" }}
          >
            Adorable Charms
          </h2>
          <p className="mt-3 text-base" style={{ color: "var(--brand-brown)", opacity: 0.8 }}>
            Mix, match & make it yours
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {CATEGORIES.map((c) => (
            <div
              key={c.label}
              className="flex flex-col items-center rounded-3xl bg-white p-8 text-center"
            >
              <div
                className="relative size-28 overflow-hidden rounded-full"
                style={{ backgroundColor: "var(--brand-pink)" }}
              >
                <Image src={c.image} alt={c.alt} fill className="object-cover" />
              </div>
              <p
                className="mt-5 text-lg font-bold"
                style={{ color: "var(--brand-brown)" }}
              >
                {c.label}
              </p>
              <p
                className="mt-2 text-sm leading-relaxed"
                style={{ color: "var(--brand-brown)", opacity: 0.65 }}
              >
                {c.description}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-14 grid grid-cols-2 gap-6 sm:grid-cols-4">
          {TRUST_BADGES.map(({ icon: Icon, label }) => (
            <div key={label} className="flex flex-col items-center gap-2 text-center">
              <Icon size={28} style={{ color: "var(--brand-coral)" }} />
              <p
                className="text-sm font-bold tracking-wide uppercase"
                style={{ color: "var(--brand-brown)" }}
              >
                {label}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-12 flex justify-center">
          <Link
            href="/order"
            className="inline-block cursor-pointer rounded-full px-8 py-3 text-lg font-bold text-white shadow-lg transition-transform hover:scale-105 active:scale-95"
            style={{ backgroundColor: "var(--brand-coral)" }}
          >
            Add Charms to Your Order →
          </Link>
        </div>
      </div>
    </section>
  );
}
