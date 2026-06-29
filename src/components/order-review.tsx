"use client";

import { useFormContext } from "react-hook-form";
import { calculateItemTotal, formatPrice } from "@/lib/pricing";
import type { OrderFormValues } from "@/lib/schemas";
import { OrderSummary } from "@/components/order-form";

const STRING_COLOR_LABELS: Record<string, string> = {
  pink: "Pink",
  yellow: "Yellow",
  purple: "Purple",
  blue: "Blue",
  green: "Green",
  white: "White",
  beige: "Beige",
};

interface OrderReviewProps {
  onEditItems: () => void;
}

export function OrderReview({ onEditItems }: OrderReviewProps) {
  const { getValues } = useFormContext<OrderFormValues>();
  const { items } = getValues();

  return (
    <div className="flex flex-col gap-6">
      {/* Items section */}
      <div>
        <div className="mb-3 flex items-center justify-between">
          <h3
            className="text-sm font-extrabold tracking-wider uppercase"
            style={{ color: "var(--brand-brown)" }}
          >
            Your Keyrings
          </h3>
          <button
            type="button"
            onClick={onEditItems}
            className="text-sm font-semibold underline"
            style={{ color: "var(--brand-coral)" }}
          >
            Edit
          </button>
        </div>
        <div className="flex flex-col gap-3">
          {items.map((item, i) => {
            const colorLabel =
              STRING_COLOR_LABELS[item.stringColor] ?? item.stringColor;
            const extras: string[] = [];
            if (item.presentBox) extras.push("Present Box");
            if (item.extraCharacterParts) extras.push("Extra Parts ×2");
            return (
              <div
                key={i}
                className="flex items-start justify-between rounded-xl border bg-white px-4 py-3"
              >
                <div>
                  <p
                    className="font-bold"
                    style={{ color: "var(--brand-brown)" }}
                  >
                    Keyring {i + 1}
                    {item.letters ? ` — ${item.letters}` : ""}
                  </p>
                  <p
                    className="text-sm"
                    style={{ color: "var(--brand-brown)", opacity: 0.6 }}
                  >
                    String: {colorLabel}
                    {extras.length > 0 && ` · ${extras.join(", ")}`}
                  </p>
                </div>
                <span
                  className="text-sm font-bold"
                  style={{ color: "var(--brand-brown)" }}
                >
                  {formatPrice(calculateItemTotal(item))}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Order summary panel */}
      <OrderSummary items={items} />
    </div>
  );
}
