import {
  VerticalImageStack,
  type StackImage,
} from "@/components/ui/vertical-image-stack";

const INSTAGRAM_URL = "https://www.instagram.com/i_delight_co/";

const CUSTOMER_PHOTOS: StackImage[] = [
  {
    id: 1,
    src: "/client_insta_post_1.jpg",
    alt: "Customer's navy backpacks with two custom keyrings attached",
  },
  {
    id: 2,
    src: "/client_insta_post_2.jpg",
    alt: "Custom keyring spelling WOOJU and NARA held up outdoors",
  },
  {
    id: 3,
    src: "/client_insta_post_3.jpg",
    alt: "Custom keyring on a purple Frozen backpack",
  },
];

export function InstagramShowcaseSection() {
  return (
    <section
      id="gallery"
      className="py-20"
      style={{ backgroundColor: "var(--brand-cream)" }}
    >
      <div className="mx-auto max-w-6xl px-4 text-center">
        <h2
          className="mb-3 text-3xl font-extrabold sm:text-4xl"
          style={{ color: "var(--brand-brown)" }}
        >
          Loved by Real Customers 📸
        </h2>
        <p
          className="mx-auto mb-10 max-w-md text-base"
          style={{ color: "var(--brand-brown)", opacity: 0.8 }}
        >
          Real keyrings, shared by real customers on Instagram. Drag the photos
          to browse.
        </p>

        <VerticalImageStack images={CUSTOMER_PHOTOS} />

        <a
          href={INSTAGRAM_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-10 inline-block text-sm font-semibold underline"
          style={{ color: "var(--brand-coral)" }}
        >
          Follow @i_delight_co on Instagram
        </a>
      </div>
    </section>
  );
}
