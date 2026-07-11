"use client";

import React from "react";
import { motion } from "motion/react";
import { Star } from "lucide-react";

export interface Testimonial {
  name: string;
  rating: number;
  text: string;
  item: string;
}

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

export function TestimonialsColumn(props: {
  className?: string;
  testimonials: Testimonial[];
  duration?: number;
}) {
  return (
    <div className={props.className}>
      <motion.div
        animate={{ translateY: "-50%" }}
        transition={{
          duration: props.duration || 10,
          repeat: Infinity,
          ease: "linear",
          repeatType: "loop",
        }}
        className="flex flex-col gap-6 pb-6"
      >
        {[
          ...new Array(2).fill(0).map((_, index) => (
            <React.Fragment key={index}>
              {props.testimonials.map((t, i) => (
                <div
                  key={i}
                  className="flex w-full flex-col gap-3 rounded-2xl bg-white p-6 shadow-sm"
                >
                  <StarRating rating={t.rating} />
                  <p className="text-base leading-relaxed" style={{ color: "var(--brand-brown)" }}>
                    &quot;{t.text}&quot;
                  </p>
                  <div className="mt-auto pt-2">
                    <p className="text-base font-bold" style={{ color: "var(--brand-brown)" }}>
                      {t.name}
                    </p>
                    <p className="text-sm" style={{ color: "var(--brand-green)" }}>
                      {t.item}
                    </p>
                  </div>
                </div>
              ))}
            </React.Fragment>
          )),
        ]}
      </motion.div>
    </div>
  );
}
