"use client";

import { useState } from "react";
import { Plus, Trash2, Check, Truck } from "lucide-react";
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
  calculateItemTotal,
  calculateSubtotal,
  calculateShipping,
  formatPrice,
  BASE_PRICE,
  FREE_LETTERS,
  EXTRA_LETTER_PRICE,
  FREE_SHIPPING_THRESHOLD,
  PRESENT_BOX_PRICE,
  EXTRA_PARTS_PRICE,
  type OrderItem,
} from "@/lib/pricing";

const STRING_COLORS = [
  { value: "pink", label: "Pink", hex: "#F2C4CE" },
  { value: "yellow", label: "Yellow", hex: "#F9E4B7" },
  { value: "purple", label: "Purple", hex: "#C5B8E0" },
  { value: "blue", label: "Blue", hex: "#B8D4E0" },
  { value: "green", label: "Green", hex: "#B8E0C4" },
  { value: "white", label: "White", hex: "#FFFFFF" },
  { value: "beige", label: "Beige", hex: "#EAD9C4" },
] as const;

const INCLUDED_FREE = [
  "Alphabet letters (up to 6)",
  "O-ring key chain",
  "Silicon tie",
  "4 Beads",
  "2 Character parts",
] as const;

const OPTIONAL_FREE_ACCESSORIES = [
  "Silicon tie",
  "4 Beads",
  "2 Character parts",
] as const;

type OptionalAccessory = (typeof OPTIONAL_FREE_ACCESSORIES)[number];

interface KeyringItem {
  letters: string;
  stringColor: string;
  presentBox: boolean;
  extraCharacterParts: boolean;
  freeAccessories: OptionalAccessory[];
  error: string;
}

function createItem(): KeyringItem {
  return {
    letters: "",
    stringColor: "pink",
    presentBox: false,
    extraCharacterParts: false,
    freeAccessories: [...OPTIONAL_FREE_ACCESSORIES],
    error: "",
  };
}

function validateLetters(value: string): string {
  if (!value.trim()) return "Please enter at least one letter.";
  if (!/^[A-Z\s]+$/.test(value))
    return "Only uppercase letters A–Z are allowed.";
  return "";
}

function IncludedFreePanel() {
  return (
    <div
      className="mb-8 rounded-2xl p-5"
      style={{ backgroundColor: "var(--brand-yellow)", color: "var(--brand-brown)" }}
    >
      <p className="mb-3 text-base font-extrabold tracking-wider uppercase">
        Every keyring includes — free
      </p>
      <ul className="grid grid-cols-1 gap-x-6 gap-y-2 sm:grid-cols-2">
        {INCLUDED_FREE.map((item) => (
          <li key={item} className="flex items-center gap-2 text-base">
            <Check size={16} className="shrink-0" strokeWidth={3} />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

interface KeyringCardProps {
  item: KeyringItem;
  index: number;
  canRemove: boolean;
  onChange: (patch: Partial<KeyringItem>) => void;
  onLettersChange: (raw: string) => void;
  onLettersBlur: () => void;
  onRemove: () => void;
}

function KeyringCard({
  item,
  index,
  canRemove,
  onChange,
  onLettersChange,
  onLettersBlur,
  onRemove,
}: KeyringCardProps) {
  const letterCount = item.letters.replace(/\s/g, "").length;
  const extra = Math.max(0, letterCount - FREE_LETTERS);
  const subtotal = calculateItemTotal(item);

  return (
    <div className="relative rounded-2xl border bg-white p-4 shadow-sm">
      <div className="mb-3 flex items-center justify-between">
        <p
          className="text-sm font-bold tracking-wider uppercase"
          style={{ color: "var(--brand-brown)" }}
        >
          Keyring {index + 1}
        </p>
        {canRemove ? (
          <button
            onClick={onRemove}
            aria-label={`Remove keyring ${index + 1}`}
            className="text-[var(--brand-brown)] opacity-40 transition-opacity hover:opacity-100"
          >
            <Trash2 size={16} />
          </button>
        ) : null}
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-start">
        {/* Alphabet input + live counter */}
        <div className="flex-1">
          <Input
            value={item.letters}
            onChange={(e) => onLettersChange(e.target.value)}
            onBlur={onLettersBlur}
            placeholder="e.g. EMMA"
            maxLength={20}
            aria-invalid={item.error ? true : undefined}
            aria-describedby={item.error ? `error-${index}` : undefined}
            className="uppercase"
          />
          {item.error ? (
            <p id={`error-${index}`} className="mt-1 text-sm text-red-500">
              {item.error}
            </p>
          ) : extra > 0 ? (
            <p className="mt-1 text-sm text-[var(--brand-coral)]">
              {letterCount}/{FREE_LETTERS} · +
              {formatPrice(extra * EXTRA_LETTER_PRICE)}
            </p>
          ) : (
            <p
              className="mt-1 text-sm"
              style={{ color: "var(--brand-brown)", opacity: 0.5 }}
            >
              {letterCount}/{FREE_LETTERS} letters · free
            </p>
          )}
        </div>

        {/* String color select */}
        <div className="w-full sm:w-48">
          <Select
            value={item.stringColor}
            onValueChange={(val) => {
              if (val !== null) onChange({ stringColor: val });
            }}
          >
            <SelectTrigger className="w-full">
              <SelectValue />
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

      {/* Free accessories opt-out */}
      <div className="mt-4 flex flex-col gap-2">
        <p className="text-sm font-bold tracking-wider uppercase" style={{ color: "var(--brand-brown)" }}>
          Free accessories included
        </p>
        {/* O-ring: required, always included */}
        <label className="flex items-center gap-2 text-base">
          <input
            type="checkbox"
            checked
            onChange={() => {}}
            onClick={(e) => e.preventDefault()}
            className="size-4 accent-[var(--brand-green)]"
          />
          <span style={{ color: "var(--brand-brown)" }}>
            O-ring key chain{" "}
            <span className="text-[var(--brand-green)] font-semibold">Free</span>
          </span>
        </label>
        {OPTIONAL_FREE_ACCESSORIES.map((accessory) => {
          const included = item.freeAccessories.includes(accessory);
          return (
            <label key={accessory} className="flex cursor-pointer items-center gap-2 text-base">
              <input
                type="checkbox"
                checked={included}
                onChange={() => {
                  const next = included
                    ? item.freeAccessories.filter((a) => a !== accessory)
                    : [...item.freeAccessories, accessory];
                  onChange({ freeAccessories: next });
                }}
                className="size-4 accent-[var(--brand-green)]"
              />
              <span style={{ color: "var(--brand-brown)" }}>
                {accessory}{" "}
                <span className="text-[var(--brand-green)] font-semibold">Free</span>
              </span>
            </label>
          );
        })}
      </div>

      {/* Paid add-ons */}
      <div className="mt-4 flex flex-col gap-2">
        <p className="text-sm font-bold tracking-wider uppercase" style={{ color: "var(--brand-brown)" }}>
          Extra Accessories
        </p>
        <label className="flex cursor-pointer items-center gap-2 text-base">
          <input
            type="checkbox"
            checked={item.presentBox}
            onChange={(e) => onChange({ presentBox: e.target.checked })}
            className="size-4 accent-[var(--brand-green)]"
          />
          <span style={{ color: "var(--brand-brown)" }}>
            Special Present Box{" "}
            <span className="text-[var(--brand-coral)]">
              +{formatPrice(PRESENT_BOX_PRICE)}
            </span>
          </span>
        </label>
        <label className="flex cursor-pointer items-center gap-2 text-base">
          <input
            type="checkbox"
            checked={item.extraCharacterParts}
            onChange={(e) =>
              onChange({ extraCharacterParts: e.target.checked })
            }
            className="size-4 accent-[var(--brand-green)]"
          />
          <span style={{ color: "var(--brand-brown)" }}>
            Additional Character Parts ×2{" "}
            <span className="text-[var(--brand-coral)]">
              +{formatPrice(EXTRA_PARTS_PRICE)}
            </span>
          </span>
        </label>
      </div>

      {/* Per-keyring subtotal */}
      <div
        className="mt-4 flex justify-between border-t pt-3 text-base font-bold"
        style={{ color: "var(--brand-brown)" }}
      >
        <span>Keyring subtotal</span>
        <span>{formatPrice(subtotal)}</span>
      </div>
    </div>
  );
}

interface OrderSummaryProps {
  items: KeyringItem[];
}

function OrderSummary({ items }: OrderSummaryProps) {
  const orderItems: OrderItem[] = items.map((it) => ({
    letters: it.letters,
    presentBox: it.presentBox,
    extraCharacterParts: it.extraCharacterParts,
  }));
  const subtotal = calculateSubtotal(orderItems);
  const shipping = calculateShipping(items.length);
  const total = subtotal + shipping;
  const freeShipping = shipping === 0;
  const remaining = FREE_SHIPPING_THRESHOLD - items.length;

  return (
    <div
      className="mt-8 rounded-2xl p-5"
      style={{ backgroundColor: "var(--brand-yellow)", color: "var(--brand-brown)" }}
    >
      <div className="flex flex-col gap-3 text-base">
        {items.map((item, i) => {
          const stringLabel = STRING_COLORS.find((c) => c.value === item.stringColor)?.label ?? item.stringColor;
          const extraDetails: string[] = [];
          if (item.presentBox) extraDetails.push("Present Box");
          if (item.extraCharacterParts) extraDetails.push("Extra Parts ×2");
          const allFreeAccessories = ["O-ring key chain", ...item.freeAccessories];
          return (
            <div key={i}>
              <div className="flex justify-between">
                <span>
                  Keyring {i + 1}
                  {item.letters ? ` (${item.letters})` : ""}
                </span>
                <span>{formatPrice(calculateItemTotal(orderItems[i]))}</span>
              </div>
              <div className="mt-0.5 flex flex-col gap-0.5 text-sm" style={{ color: "var(--brand-brown)", opacity: 0.6 }}>
                {item.letters && (
                  <span>Letters: {item.letters.replace(/\s/g, "").split("").join(", ")}</span>
                )}
                <span>String: {stringLabel}</span>
                {allFreeAccessories.length > 0 && (
                  <span>Includes: {allFreeAccessories.join(" / ")}</span>
                )}
                {extraDetails.length > 0 && (
                  <span>Extras: {extraDetails.join(" / ")}</span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-3 flex justify-between border-t border-[var(--brand-brown)]/20 pt-3 text-base">
        <span>Subtotal</span>
        <span>{formatPrice(subtotal)}</span>
      </div>
      <div className="mt-1 flex justify-between text-base">
        <span>Shipping</span>
        <span>{freeShipping ? "FREE" : formatPrice(shipping)}</span>
      </div>

      {!freeShipping ? (
        <div className="mt-3 flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold" style={{ backgroundColor: "rgba(61,43,31,0.08)" }}>
          <Truck size={16} className="shrink-0" />
          <span>
            Add {remaining} more keyring{remaining > 1 ? "s" : ""} for FREE
            shipping!
          </span>
        </div>
      ) : null}

      <div className="mt-3 flex justify-between border-t border-[var(--brand-brown)]/20 pt-3 text-lg font-extrabold">
        <span>Total</span>
        <span>{formatPrice(total)}</span>
      </div>
    </div>
  );
}

export function OrderForm() {
  const [items, setItems] = useState<KeyringItem[]>([createItem()]);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  function updateItem(index: number, patch: Partial<KeyringItem>) {
    setItems((prev) =>
      prev.map((item, i) => (i === index ? { ...item, ...patch } : item)),
    );
  }

  function handleLettersChange(index: number, raw: string) {
    const upper = raw.toUpperCase().replace(/[^A-Z\s]/g, "");
    updateItem(index, { letters: upper, error: "" });
  }

  function handleLettersBlur(index: number) {
    updateItem(index, { error: validateLetters(items[index].letters) });
  }

  function addItem() {
    setItems((prev) => [...prev, createItem()]);
  }

  function removeItem(index: number) {
    setItems((prev) => prev.filter((_, i) => i !== index));
  }

  async function handleSubmit() {
    const validated = items.map((item) => ({
      ...item,
      error: validateLetters(item.letters),
    }));
    setItems(validated);
    if (validated.some((it) => it.error)) return;

    setSubmitError("");
    setSubmitting(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: validated.map((it) => ({
            letters: it.letters,
            presentBox: it.presentBox,
            extraCharacterParts: it.extraCharacterParts,
            freeAccessories: it.freeAccessories,
          })),
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.url) {
        throw new Error(data.error ?? "Checkout failed.");
      }
      window.location.href = data.url;
    } catch (err) {
      setSubmitError(
        err instanceof Error ? err.message : "Something went wrong.",
      );
      setSubmitting(false);
    }
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
          <p className="mt-2 text-base" style={{ color: "var(--brand-brown)" }}>
            {formatPrice(BASE_PRICE)} each · {FREE_LETTERS} letters free · +
            {formatPrice(EXTRA_LETTER_PRICE)} per extra letter
          </p>
        </div>

        <IncludedFreePanel />

        {/* Keyring cards */}
        <div className="flex flex-col gap-4">
          {items.map((item, i) => (
            <KeyringCard
              key={i}
              item={item}
              index={i}
              canRemove={items.length > 1}
              onChange={(patch) => updateItem(i, patch)}
              onLettersChange={(raw) => handleLettersChange(i, raw)}
              onLettersBlur={() => handleLettersBlur(i)}
              onRemove={() => removeItem(i)}
            />
          ))}
        </div>

        {/* Add another keyring */}
        <button
          onClick={addItem}
          className="mt-4 flex w-full items-center justify-center gap-2 rounded-full border-2 border-dashed py-3 text-base font-bold transition-colors hover:bg-white/60"
          style={{
            borderColor: "var(--brand-green)",
            color: "var(--brand-green)",
          }}
        >
          <Plus size={18} />
          Add another keyring
        </button>

        <OrderSummary items={items} />

        {/* CTA */}
        <Button
          onClick={handleSubmit}
          disabled={submitting}
          size="lg"
          className="mt-6 w-full rounded-full text-lg font-bold text-white disabled:opacity-60"
          style={{ backgroundColor: "var(--brand-coral)" }}
        >
          {submitting ? "Redirecting to checkout…" : "Proceed to Payment →"}
        </Button>

        {submitError ? (
          <p className="mt-3 text-center text-sm text-red-500">{submitError}</p>
        ) : null}
      </div>
    </section>
  );
}
