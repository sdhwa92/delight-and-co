"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { motion, type PanInfo } from "motion/react";
import Image from "next/image";

export interface StackImage {
  id: string | number;
  src: string;
  alt: string;
}

interface VerticalImageStackProps {
  images: StackImage[];
}

const AUTO_ROTATE_INTERVAL_MS = 3000;

export function VerticalImageStack({ images }: VerticalImageStackProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const lastNavigationTime = useRef(0);
  const navigationCooldown = 400; // ms between navigations

  const navigate = useCallback(
    (newDirection: number) => {
      const now = Date.now();
      if (now - lastNavigationTime.current < navigationCooldown) return;
      lastNavigationTime.current = now;

      setCurrentIndex((prev) => {
        if (newDirection > 0) {
          return prev === images.length - 1 ? 0 : prev + 1;
        }
        return prev === 0 ? images.length - 1 : prev - 1;
      });
    },
    [images.length],
  );

  useEffect(() => {
    if (isPaused) return;
    const id = setInterval(() => navigate(1), AUTO_ROTATE_INTERVAL_MS);
    return () => clearInterval(id);
  }, [isPaused, navigate]);

  const handleDragEnd = (
    _: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo,
  ) => {
    setIsPaused(false);
    const threshold = 50;
    if (info.offset.y < -threshold) {
      navigate(1);
    } else if (info.offset.y > threshold) {
      navigate(-1);
    }
  };

  const getCardStyle = (index: number) => {
    const total = images.length;
    let diff = index - currentIndex;
    if (diff > total / 2) diff -= total;
    if (diff < -total / 2) diff += total;

    if (diff === 0) {
      return { y: 0, scale: 1, opacity: 1, zIndex: 5, rotateX: 0 };
    } else if (diff === -1) {
      return { y: -160, scale: 0.82, opacity: 0.6, zIndex: 4, rotateX: 8 };
    } else if (diff === -2) {
      return { y: -280, scale: 0.7, opacity: 0.3, zIndex: 3, rotateX: 15 };
    } else if (diff === 1) {
      return { y: 160, scale: 0.82, opacity: 0.6, zIndex: 4, rotateX: -8 };
    } else if (diff === 2) {
      return { y: 280, scale: 0.7, opacity: 0.3, zIndex: 3, rotateX: -15 };
    } else {
      return {
        y: diff > 0 ? 400 : -400,
        scale: 0.6,
        opacity: 0,
        zIndex: 0,
        rotateX: diff > 0 ? -20 : 20,
      };
    }
  };

  const isVisible = (index: number) => {
    const total = images.length;
    let diff = index - currentIndex;
    if (diff > total / 2) diff -= total;
    if (diff < -total / 2) diff += total;
    return Math.abs(diff) <= 2;
  };

  return (
    <div className="relative flex h-[560px] w-full items-center justify-center overflow-hidden [mask-image:linear-gradient(to_bottom,transparent,black_12%,black_88%,transparent)]">
      <div
        className="relative flex h-[500px] w-[280px] items-center justify-center"
        style={{ perspective: "1200px" }}
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        {images.map((image, index) => {
          if (!isVisible(index)) return null;
          const style = getCardStyle(index);
          const isCurrent = index === currentIndex;

          return (
            <motion.div
              key={image.id}
              className="absolute cursor-grab active:cursor-grabbing"
              animate={{
                y: style.y,
                scale: style.scale,
                opacity: style.opacity,
                rotateX: style.rotateX,
                zIndex: style.zIndex,
              }}
              transition={{ type: "spring", stiffness: 300, damping: 30, mass: 1 }}
              drag={isCurrent ? "y" : false}
              dragConstraints={{ top: 0, bottom: 0 }}
              dragElastic={0.2}
              onDragStart={() => setIsPaused(true)}
              onDragEnd={handleDragEnd}
              style={{ transformStyle: "preserve-3d", zIndex: style.zIndex }}
            >
              <div
                className="relative h-[420px] w-[260px] overflow-hidden rounded-3xl shadow-2xl ring-1 ring-black/10"
              >
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  className="h-full w-full object-cover"
                  draggable={false}
                  priority={isCurrent}
                />
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Navigation dots */}
      <div className="absolute right-2 top-1/2 flex -translate-y-1/2 flex-col gap-2 sm:right-4">
        {images.map((_, index) => (
          <button
            key={index}
            type="button"
            onClick={() => {
              if (index !== currentIndex) setCurrentIndex(index);
            }}
            className="h-2 w-2 cursor-pointer appearance-none rounded-full border-0 p-0 transition-all duration-300"
            style={{
              backgroundColor:
                index === currentIndex
                  ? "var(--brand-coral)"
                  : "color-mix(in oklch, var(--brand-coral) 30%, transparent)",
              height: index === currentIndex ? "22px" : "8px",
            }}
            aria-label={`Go to photo ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
