import { Star } from "lucide-react";

const TESTIMONIALS = [
  {
    name: "Sarah M.",
    rating: 5,
    text: "I ordered one for my daughter and she absolutely loves it! The quality is amazing and it arrived so quickly. Will definitely order again!",
    item: "Keyring: LILY",
  },
  {
    name: "Jessica K.",
    rating: 5,
    text: "These make the most adorable gifts. I bought them for my whole friend group with our initials. Everyone was obsessed!",
    item: "Keyring: JK",
  },
  {
    name: "Priya T.",
    rating: 5,
    text: "Beautifully handmade and the pastel string colors are so pretty. The mint string is my favorite. Packaging was super cute too!",
    item: "Keyring: PRIYA, string: Mint",
  },
] as const;

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          size={14}
          className={i < rating ? "fill-[var(--brand-coral)] text-[var(--brand-coral)]" : "text-gray-200"}
        />
      ))}
    </div>
  );
}

export function TestimonialsSection() {
  return (
    <section id="reviews" className="py-20" style={{ backgroundColor: "var(--brand-cream)" }}>
      <div className="mx-auto max-w-6xl px-4">
        <h2
          className="mb-12 text-center text-3xl font-extrabold sm:text-4xl"
          style={{ color: "var(--brand-brown)" }}
        >
          What Our Customers Say 💬
        </h2>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {TESTIMONIALS.map((t) => (
            <div
              key={t.name}
              className="flex flex-col gap-3 rounded-2xl bg-white p-6 shadow-sm"
            >
              <StarRating rating={t.rating} />
              <p className="text-sm leading-relaxed" style={{ color: "var(--brand-brown)" }}>
                "{t.text}"
              </p>
              <div className="mt-auto pt-2">
                <p className="text-sm font-bold" style={{ color: "var(--brand-brown)" }}>
                  {t.name}
                </p>
                <p className="text-xs" style={{ color: "var(--brand-green)" }}>
                  {t.item}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
