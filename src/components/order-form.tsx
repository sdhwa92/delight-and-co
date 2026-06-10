"use client";

import { useState } from "react";
import { Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  calculateOrderTotal,
  formatPrice,
  BASE_PRICE,
  FREE_LETTERS,
  EXTRA_LETTER_PRICE,
  type OrderItem,
} from "@/lib/pricing";

const STRING_COLORS = [
  { value: "pink", label: "Pink", hex: "#F2C4CE" },
  { value: "mint", label: "Mint", hex: "#B8E0D4" },
  { value: "lavender", label: "Lavender", hex: "#C5B8E0" },
  { value: "peach", label: "Peach", hex: "#F9D4B8" },
  { value: "white", label: "White", hex: "#FFFFFF" },
  { value: "baby-blue", label: "Baby Blue", hex: "#B8D4E0" },
  { value: "lemon", label: "Lemon Yellow", hex: "#F9E4B7" },
] as const;

interface Row {
  letters: string;
  stringColor: string;
  error: string;
}

function createRow(): Row {
  return { letters: "", stringColor: "pink", error: "" };
}

function validateLetters(value: string): string {
  if (!value.trim()) return "Please enter at least one letter.";
  if (!/^[A-Z\s]+$/.test(value))
    return "Only uppercase letters A–Z are allowed.";
  return "";
}

export function OrderForm() {
  const [rows, setRows] = useState<Row[]>([createRow()]);

  const quantity = rows.length;

  function setQuantity(n: number) {
    const clamped = Math.max(1, Math.min(10, n));
    if (clamped > rows.length) {
      setRows((prev) => [
        ...prev,
        ...Array.from({ length: clamped - prev.length }, createRow),
      ]);
    } else {
      setRows((prev) => prev.slice(0, clamped));
    }
  }

  function updateRow(index: number, patch: Partial<Row>) {
    setRows((prev) =>
      prev.map((row, i) => (i === index ? { ...row, ...patch } : row)),
    );
  }

  function handleLettersChange(index: number, raw: string) {
    const upper = raw.toUpperCase().replace(/[^A-Z\s]/g, "");
    updateRow(index, { letters: upper, error: "" });
  }

  function handleLettersBlur(index: number) {
    const error = validateLetters(rows[index].letters);
    updateRow(index, { error });
  }

  const orderItems: OrderItem[] = rows.map((r) => ({ letters: r.letters }));
  const total = calculateOrderTotal(orderItems);

  function handleSubmit() {
    const validated = rows.map((row) => ({
      ...row,
      error: validateLetters(row.letters),
    }));
    setRows(validated);
    if (validated.some((r) => r.error)) return;
    alert("Order ready! Stripe integration coming soon.");
  }

  return (
    <section
      id="order"
      className="py-20"
      style={{ backgroundColor: "var(--brand-cream)" }}
    >
      <div className="mx-auto max-w-2xl px-4">
        {/* Section heading */}
        <div className="mb-10 text-center">
          <h2
            className="text-3xl font-extrabold sm:text-4xl"
            style={{ color: "var(--brand-brown)" }}
          >
            Customize Your Keyring
          </h2>
          <p className="mt-2 text-sm" style={{ color: "var(--brand-brown)" }}>
            Starting from {formatPrice(BASE_PRICE)} · Up to {FREE_LETTERS}{" "}
            letters free · +{formatPrice(EXTRA_LETTER_PRICE)} per extra letter
          </p>
        </div>

        {/* Quantity stepper */}
        <div className="mb-8 flex items-center gap-4">
          <span
            className="text-sm font-bold"
            style={{ color: "var(--brand-brown)" }}
          >
            Quantity
          </span>
          <div className="flex items-center gap-2 rounded-full border px-3 py-1">
            <button
              onClick={() => setQuantity(quantity - 1)}
              disabled={quantity <= 1}
              aria-label="Decrease quantity"
              className="text-[var(--brand-brown)] disabled:opacity-30"
            >
              <Minus size={16} />
            </button>
            <span className="w-6 text-center font-bold">{quantity}</span>
            <button
              onClick={() => setQuantity(quantity + 1)}
              disabled={quantity >= 10}
              aria-label="Increase quantity"
              className="text-[var(--brand-brown)] disabled:opacity-30"
            >
              <Plus size={16} />
            </button>
          </div>
        </div>

        {/* Per-item rows */}
        <div className="flex flex-col gap-4">
          {rows.map((row, i) => {
            const letterCount = row.letters.replace(/\s/g, "").length;
            const extra = Math.max(0, letterCount - FREE_LETTERS);
            return (
              <div
                key={i}
                className="rounded-2xl border bg-white p-4 shadow-sm"
              >
                <p
                  className="mb-3 text-xs font-bold uppercase tracking-wider"
                  style={{ color: "var(--brand-brown)" }}
                >
                  Item {i + 1}
                </p>
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start">
                  {/* Alphabet input */}
                  <div className="flex-1">
                    <Input
                      value={row.letters}
                      onChange={(e) => handleLettersChange(i, e.target.value)}
                      onBlur={() => handleLettersBlur(i)}
                      placeholder="e.g. EMMA"
                      maxLength={20}
                      aria-invalid={row.error ? true : undefined}
                      aria-describedby={row.error ? `error-${i}` : undefined}
                      className="uppercase"
                    />
                    {row.error ? (
                      <p
                        id={`error-${i}`}
                        className="mt-1 text-xs text-red-500"
                      >
                        {row.error}
                      </p>
                    ) : extra > 0 ? (
                      <p className="mt-1 text-xs text-[var(--brand-coral)]">
                        {letterCount} letters — +
                        {formatPrice(extra * EXTRA_LETTER_PRICE)} extra
                      </p>
                    ) : (
                      <p
                        className="mt-1 text-xs"
                        style={{ color: "var(--brand-brown)", opacity: 0.5 }}
                      >
                        {letterCount}/{FREE_LETTERS} letters
                      </p>
                    )}
                  </div>

                  {/* String color select */}
                  <div className="w-full sm:w-48">
                    <Select
                      value={row.stringColor}
                      onValueChange={(val) => {
                        if (val !== null) {
                          updateRow(i, { stringColor: val });
                        }
                      }}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="String color" />
                      </SelectTrigger>
                      <SelectContent>
                        {STRING_COLORS.map((color) => (
                          <SelectItem key={color.value} value={color.value}>
                            <span
                              className="inline-block size-3 shrink-0 rounded-full border border-gray-200"
                              style={{ backgroundColor: color.hex }}
                            />
                            {color.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Price summary */}
        <div
          className="mt-8 rounded-2xl p-5"
          style={{ backgroundColor: "var(--brand-green)", color: "white" }}
        >
          <div className="flex flex-col gap-1 text-sm">
            {rows.map((row, i) => {
              const letters = row.letters.replace(/\s/g, "");
              const extra = Math.max(0, letters.length - FREE_LETTERS);
              const itemTotal = BASE_PRICE + extra * EXTRA_LETTER_PRICE;
              return (
                <div key={i} className="flex justify-between">
                  <span>
                    Item {i + 1}
                    {row.letters ? ` (${row.letters})` : ""}
                    {extra > 0 ? ` +${extra} extra` : ""}
                  </span>
                  <span>{formatPrice(itemTotal)}</span>
                </div>
              );
            })}
          </div>
          <div className="mt-3 flex justify-between border-t border-white/30 pt-3 text-lg font-extrabold">
            <span>Total</span>
            <span>{formatPrice(total)}</span>
          </div>
        </div>

        {/* CTA */}
        <Button
          onClick={handleSubmit}
          size="lg"
          className="mt-6 w-full rounded-full text-base font-bold text-white"
          style={{ backgroundColor: "var(--brand-coral)" }}
        >
          Proceed to Payment →
        </Button>
      </div>
    </section>
  );
}
