export function HeroSection() {
  return (
    <section
      id="home"
      className="relative overflow-hidden"
      style={{ backgroundColor: "var(--brand-green)" }}
    >
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-10 px-4 py-20 md:flex-row md:gap-16 md:py-28">
        {/* Left: text */}
        <div className="flex flex-1 flex-col items-center gap-6 text-center md:items-start md:text-left">
          <span className="text-sm font-semibold tracking-widest text-white/80 uppercase">
            ✦ Handmade with love
          </span>
          <h1 className="text-4xl leading-tight font-extrabold text-white sm:text-5xl lg:text-6xl">
            Your Name,
            <br />
            Your Keyring
          </h1>
          <p className="max-w-md text-base text-white/85">
            Custom alphabet keyrings made by hand. Pick your letters, choose
            your string color, and carry a little piece of joy everywhere you
            go.
          </p>
          <a
            href="#order"
            className="inline-block rounded-full px-8 py-3 text-base font-bold text-white shadow-lg transition-transform hover:scale-105 active:scale-95"
            style={{ backgroundColor: "var(--brand-coral)" }}
          >
            Order Yours →
          </a>
        </div>

        {/* Right: product image placeholder */}
        <div className="relative flex flex-1 items-center justify-center">
          <div className="relative h-72 w-72 rounded-3xl bg-white/20 sm:h-80 sm:w-80 lg:h-96 lg:w-96 flex items-center justify-center">
            <span className="text-white/50 text-sm font-medium">Product Photo</span>
          </div>
        </div>
      </div>

      {/* Wave divider */}
      <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none">
        <svg
          viewBox="0 0 1440 48"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
          className="h-12 w-full"
        >
          <path
            d="M0,32 C360,0 1080,64 1440,32 L1440,48 L0,48 Z"
            fill="var(--brand-cream)"
          />
        </svg>
      </div>
    </section>
  );
}
