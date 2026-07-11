import { TestimonialsColumn, type Testimonial } from "@/components/ui/testimonials-columns-1";

const TESTIMONIALS: Testimonial[] = [
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
  {
    name: "Emily R.",
    rating: 5,
    text: "Ordered a set as bridesmaid gifts and they turned out even better than I imagined. So much love went into each one!",
    item: "Keyring: EMILY, string: Lavender",
  },
  {
    name: "Grace L.",
    rating: 5,
    text: "My son carries his keyring everywhere and shows it off to everyone. The letters are so sturdy and well made.",
    item: "Keyring: NOAH",
  },
  {
    name: "Aisha B.",
    rating: 5,
    text: "The attention to detail is incredible. You can really tell these are handmade with care, not mass produced.",
    item: "Keyring: AISHA, string: Blue",
  },
  {
    name: "Chloe W.",
    rating: 5,
    text: "Bought one for myself and ended up ordering three more for friends. The present box option made gifting so easy!",
    item: "Keyring: CHLOE, Present Box",
  },
  {
    name: "Megan P.",
    rating: 5,
    text: "Fast shipping and the cutest packaging. My daughter hasn't taken hers off her backpack since it arrived.",
    item: "Keyring: MEG",
  },
  {
    name: "Fatima H.",
    rating: 5,
    text: "Such a thoughtful, personal gift. The extra character parts made it even more special for my niece.",
    item: "Keyring: FATIMA, Extra Parts",
  },
] as const;

const firstColumn = TESTIMONIALS.slice(0, 3);
const secondColumn = TESTIMONIALS.slice(3, 6);
const thirdColumn = TESTIMONIALS.slice(6, 9);

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

        <div className="flex max-h-[720px] justify-center gap-6 overflow-hidden [mask-image:linear-gradient(to_bottom,transparent,black_15%,black_85%,transparent)]">
          <TestimonialsColumn testimonials={firstColumn} duration={15} className="w-full max-w-sm" />
          <TestimonialsColumn
            testimonials={secondColumn}
            duration={19}
            className="hidden w-full max-w-sm sm:block"
          />
          <TestimonialsColumn
            testimonials={thirdColumn}
            duration={17}
            className="hidden w-full max-w-sm lg:block"
          />
        </div>
      </div>
    </section>
  );
}
