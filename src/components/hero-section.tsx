"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const cardsVariants = {
  hidden: { opacity: 0, x: 50 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.8,
      ease: "easeOut" as const,
      staggerChildren: 0.2,
    },
  },
};

const cardItemVariants = {
  hidden: { opacity: 0, x: 50 },
  visible: { opacity: 1, x: 0 },
};

const HERO_PHOTOS = [
  {
    src: "/hero-keyring-1.png",
    alt: "Custom keyring spelling PHILIP on a navy backpack",
  },
  {
    src: "/hero-keyring-2.png",
    alt: "Custom keyring spelling ZARA on a pink backpack",
  },
  {
    src: "/hero-keyring-3.png",
    alt: "Custom keyring spelling ARIA on a black handbag",
  },
] as const;

// Visual slots the photos rotate through: back-left, front-center, back-right.
const SLOTS = [
  { rotate: -10, x: "-42%", y: "-6%", z: 0 },
  { rotate: 0, x: "0%", y: "0%", z: 20 },
  { rotate: 10, x: "42%", y: "-6%", z: 10 },
] as const;

const ROTATE_INTERVAL_MS = 3000;

function useCyclingOffset(count: number, intervalMs: number, paused: boolean) {
  const [offset, setOffset] = useState(0);
  useEffect(() => {
    if (paused) return;
    const id = setInterval(
      () => setOffset((prev) => (prev + 1) % count),
      intervalMs,
    );
    return () => clearInterval(id);
  }, [count, intervalMs, paused]);
  return offset;
}

export function HeroSection() {
  const [isPaused, setIsPaused] = useState(false);
  const offset = useCyclingOffset(SLOTS.length, ROTATE_INTERVAL_MS, isPaused);

  return (
    <section
      id="home"
      className="relative overflow-hidden"
      style={{ backgroundColor: "var(--brand-pink)" }}
    >
      <motion.div
        className="mx-auto flex max-w-6xl flex-col items-center gap-12 px-4 py-20 md:flex-row md:gap-16 md:py-28"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        {/* Left: text */}
        <div className="flex flex-col items-center gap-6 text-center md:w-1/2 md:items-start md:text-left">
          <motion.span
            variants={itemVariants}
            className="text-base font-semibold tracking-widest uppercase"
            style={{ color: "var(--brand-brown)", opacity: 0.7 }}
          >
            ✦ Handmade with love
          </motion.span>
          <motion.h1
            variants={itemVariants}
            className="text-4xl leading-tight font-extrabold sm:text-5xl lg:text-6xl"
            style={{ color: "var(--brand-brown)" }}
          >
            Your Name,
            <br />
            Your Keyring
          </motion.h1>
          <motion.p
            variants={itemVariants}
            className="max-w-md text-lg"
            style={{ color: "var(--brand-brown)", opacity: 0.8 }}
          >
            Custom alphabet keyrings made by hand. Pick your letters, choose
            your string color, and carry a little piece of joy everywhere you
            go.
          </motion.p>
          <motion.div variants={itemVariants}>
            <Link
              href="/order"
              className="inline-block cursor-pointer rounded-full px-8 py-3 text-lg font-bold text-white shadow-lg transition-transform hover:scale-105 active:scale-95"
              style={{ backgroundColor: "var(--brand-coral)" }}
            >
              Order Yours →
            </Link>
          </motion.div>
        </div>

        {/* Right: overlapping photo stack */}
        <motion.div
          className="relative flex items-center justify-center md:w-1/2"
          variants={cardsVariants}
        >
          <div
            className="relative h-72 w-56 sm:h-80 sm:w-64 md:h-[380px] md:w-[300px]"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            {HERO_PHOTOS.map((photo, i) => {
              const slot = SLOTS[(i + offset) % SLOTS.length];
              return (
                <Dialog key={photo.src}>
                  <DialogTrigger
                    aria-label={`View larger photo: ${photo.alt}`}
                    className="absolute inset-0 cursor-pointer appearance-none border-0 bg-transparent p-0"
                    style={{ zIndex: slot.z }}
                  >
                    {/* Entrance fade-in, driven by the parent's stagger */}
                    <motion.div
                      variants={cardItemVariants}
                      className="h-full w-full"
                    >
                      {/* Ongoing slot-position cycling */}
                      <motion.div
                        animate={{ rotate: slot.rotate, x: slot.x, y: slot.y }}
                        transition={{ duration: 0.6, ease: "easeInOut" }}
                        className="h-full w-full"
                      >
                        <motion.div
                          whileHover={{ y: -10, transition: { duration: 0.3 } }}
                          className="relative h-full w-full overflow-hidden rounded-2xl shadow-2xl"
                        >
                          <Image
                            src={photo.src}
                            alt={photo.alt}
                            fill
                            className="object-cover"
                            priority={photo.src === "/hero-keyring-2.png"}
                          />
                        </motion.div>
                      </motion.div>
                    </motion.div>
                  </DialogTrigger>
                  <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-lg">
                    <DialogHeader>
                      <DialogTitle className="sr-only">{photo.alt}</DialogTitle>
                    </DialogHeader>
                    <div className="relative aspect-[3/4] w-full overflow-hidden rounded-xl">
                      <Image
                        src={photo.src}
                        alt={photo.alt}
                        fill
                        className="object-cover"
                      />
                    </div>
                  </DialogContent>
                </Dialog>
              );
            })}
          </div>
        </motion.div>
      </motion.div>

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
