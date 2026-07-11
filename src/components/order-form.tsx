"use client";

import { useRef, useState } from "react";
import {
  useForm,
  FormProvider,
  useFieldArray,
  useFormContext,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { orderFormSchema, type OrderFormValues } from "@/lib/schemas";
import { StepIndicator } from "@/components/step-indicator";
import { OrderReview } from "@/components/order-review";

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

const STEP_LABELS = ["Keyring", "Review"];

function createItem(): OrderFormValues["items"][number] {
  return {
    letters: "",
    stringColor: "pink",
    presentBox: false,
    extraCharacterParts: false,
    freeAccessories: [...OPTIONAL_FREE_ACCESSORIES],
  };
}

function IncludedFreePanel() {
  return (
    <div
      className="mb-8 rounded-2xl p-5"
      style={{
        backgroundColor: "var(--brand-pink)",
        color: "var(--brand-brown)",
      }}
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

function KeyringCard({
  index,
  canRemove,
  onRemove,
}: {
  index: number;
  canRemove: boolean;
  onRemove: () => void;
}) {
  const {
    register,
    watch,
    setValue,
    formState: { errors },
  } = useFormContext<OrderFormValues>();
  const item = watch(`items.${index}`);
  const letterCount = (item.letters ?? "").replace(/\s/g, "").length;
  const extra = Math.max(0, letterCount - FREE_LETTERS);
  const subtotal = calculateItemTotal({
    letters: item.letters ?? "",
    presentBox: item.presentBox,
    extraCharacterParts: item.extraCharacterParts,
  });
  const lettersError = errors.items?.[index]?.letters?.message;

  return (
    <div className="relative rounded-2xl border bg-white p-4 shadow-sm">
      <div className="mb-3 flex items-center justify-between">
        <p
          className="text-sm font-bold tracking-wider uppercase"
          style={{ color: "var(--brand-brown)" }}
        >
          Keyring {index + 1}
        </p>
        {canRemove && (
          <button
            type="button"
            onClick={onRemove}
            aria-label={`Remove keyring ${index + 1}`}
            className="text-[var(--brand-brown)] opacity-40 transition-opacity hover:opacity-100"
          >
            <Trash2 size={16} />
          </button>
        )}
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-start">
        <div className="flex-1">
          <Input
            placeholder="e.g. EMMA"
            maxLength={20}
            aria-invalid={lettersError ? true : undefined}
            className="uppercase"
            {...register(`items.${index}.letters`, {
              onChange: (e) => {
                const upper = e.target.value
                  .toUpperCase()
                  .replace(/[^A-Z\s]/g, "");
                setValue(`items.${index}.letters`, upper, {
                  shouldValidate: false,
                });
              },
            })}
          />
          {lettersError ? (
            <p className="mt-1 text-sm text-red-500">{lettersError}</p>
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

        <div className="w-full sm:w-48">
          <Select
            value={item.stringColor}
            onValueChange={(val) => {
              if (val) setValue(`items.${index}.stringColor`, val);
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

      {/* Free accessories */}
      <div className="mt-4 flex flex-col gap-2">
        <p
          className="text-sm font-bold tracking-wider uppercase"
          style={{ color: "var(--brand-brown)" }}
        >
          Free accessories included
        </p>
        <label className="flex items-center gap-2 text-base">
          <input
            type="checkbox"
            checked
            readOnly
            onClick={(e) => e.preventDefault()}
            className="size-4 accent-[var(--brand-green)]"
            suppressHydrationWarning
          />
          <span style={{ color: "var(--brand-brown)" }}>
            O-ring key chain{" "}
            <span className="font-semibold text-[var(--brand-green)]">
              Free
            </span>
          </span>
        </label>
        {OPTIONAL_FREE_ACCESSORIES.map((accessory) => {
          const included = (item.freeAccessories ?? []).includes(accessory);
          return (
            <label
              key={accessory}
              className="flex cursor-pointer items-center gap-2 text-base"
            >
              <input
                type="checkbox"
                checked={included}
                onChange={() => {
                  const next = included
                    ? (item.freeAccessories ?? []).filter(
                        (a) => a !== accessory,
                      )
                    : [...(item.freeAccessories ?? []), accessory];
                  setValue(`items.${index}.freeAccessories`, next);
                }}
                className="size-4 accent-[var(--brand-green)]"
                suppressHydrationWarning
              />
              <span style={{ color: "var(--brand-brown)" }}>
                {accessory}{" "}
                <span className="font-semibold text-[var(--brand-green)]">
                  Free
                </span>
              </span>
            </label>
          );
        })}
      </div>

      {/* Paid add-ons */}
      <div className="mt-4 flex flex-col gap-2">
        <p
          className="text-sm font-bold tracking-wider uppercase"
          style={{ color: "var(--brand-brown)" }}
        >
          Extra Accessories
        </p>
        <label className="flex cursor-pointer items-center gap-2 text-base">
          <input
            type="checkbox"
            checked={item.presentBox}
            onChange={(e) =>
              setValue(`items.${index}.presentBox`, e.target.checked)
            }
            className="size-4 accent-[var(--brand-green)]"
            suppressHydrationWarning
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
              setValue(`items.${index}.extraCharacterParts`, e.target.checked)
            }
            className="size-4 accent-[var(--brand-green)]"
            suppressHydrationWarning
          />
          <span style={{ color: "var(--brand-brown)" }}>
            Additional Character Parts ×2{" "}
            <span className="text-[var(--brand-coral)]">
              +{formatPrice(EXTRA_PARTS_PRICE)}
            </span>
          </span>
        </label>
      </div>

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

export function OrderSummary({ items }: { items: OrderFormValues["items"] }) {
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
      style={{
        backgroundColor: "var(--brand-pink)",
        color: "var(--brand-brown)",
      }}
    >
      <div className="flex flex-col gap-3 text-base">
        {items.map((item, i) => {
          const stringLabel =
            STRING_COLORS.find((c) => c.value === item.stringColor)?.label ??
            item.stringColor;
          const extraDetails: string[] = [];
          if (item.presentBox) extraDetails.push("Present Box");
          if (item.extraCharacterParts) extraDetails.push("Extra Parts ×2");
          const allFreeAccessories = [
            "O-ring key chain",
            ...(item.freeAccessories ?? []),
          ];
          return (
            <div key={i}>
              <div className="flex justify-between">
                <span>
                  Keyring {i + 1}
                  {item.letters ? ` (${item.letters})` : ""}
                </span>
                <span>{formatPrice(calculateItemTotal(orderItems[i]))}</span>
              </div>
              <div
                className="mt-0.5 flex flex-col gap-0.5 text-sm"
                style={{ color: "var(--brand-brown)", opacity: 0.6 }}
              >
                {item.letters && (
                  <span>
                    Letters:{" "}
                    {item.letters.replace(/\s/g, "").split("").join(", ")}
                  </span>
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

      {!freeShipping && (
        <div
          className="mt-3 flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold"
          style={{ backgroundColor: "rgba(61,43,31,0.08)" }}
        >
          <Truck size={16} className="shrink-0" />
          <span>
            Add {remaining} more keyring{remaining > 1 ? "s" : ""} for FREE
            shipping!
          </span>
        </div>
      )}

      <div className="mt-3 flex justify-between border-t border-[var(--brand-brown)]/20 pt-3 text-lg font-extrabold">
        <span>Total</span>
        <span>{formatPrice(total)}</span>
      </div>
    </div>
  );
}

export function OrderForm() {
  const [step, setStep] = useState<1 | 2>(1);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const sectionRef = useRef<HTMLElement>(null);

  const methods = useForm<OrderFormValues>({
    resolver: zodResolver(orderFormSchema),
    defaultValues: {
      items: [createItem()],
    },
    mode: "onTouched",
  });

  const { fields, append, remove } = useFieldArray({
    control: methods.control,
    name: "items",
  });

  function scrollToForm() {
    sectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  async function goToStep(next: 1 | 2) {
    if (next === 2) {
      const ok = await methods.trigger("items");
      if (!ok) return;
    }
    setStep(next);
    scrollToForm();
  }

  async function handleSubmit(values: OrderFormValues) {
    setSubmitError("");
    setSubmitting(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: values.items.map((it) => ({
            letters: it.letters,
            presentBox: it.presentBox,
            extraCharacterParts: it.extraCharacterParts,
            freeAccessories: it.freeAccessories,
            stringColor: it.stringColor,
          })),
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.url)
        throw new Error(data.error ?? "Checkout failed.");
      window.location.href = data.url;
    } catch (err) {
      setSubmitError(
        err instanceof Error ? err.message : "Something went wrong.",
      );
      setSubmitting(false);
    }
  }

  const watchedItems = methods.watch("items");

  return (
    <section
      ref={sectionRef}
      className="py-20"
      style={{ backgroundColor: "var(--brand-cream)" }}
    >
      <div className="mx-auto max-w-2xl px-4">
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

        <StepIndicator steps={STEP_LABELS} current={step} />

        <FormProvider {...methods}>
          <div
            key={step}
            className="animate-in fade-in slide-in-from-bottom-2 duration-200"
          >
            {step === 1 && (
              <>
                <IncludedFreePanel />
                <div className="flex flex-col gap-4">
                  {fields.map((field, i) => (
                    <KeyringCard
                      key={field.id}
                      index={i}
                      canRemove={fields.length > 1}
                      onRemove={() => remove(i)}
                    />
                  ))}
                </div>
                <button
                  type="button"
                  onClick={() => append(createItem())}
                  className="mt-4 flex w-full cursor-pointer items-center justify-center gap-2 rounded-full border-2 border-dashed border-[var(--brand-coral)] bg-transparent py-3 text-lg font-bold text-[var(--brand-coral)] transition-colors hover:border-solid hover:bg-[var(--brand-coral)] hover:text-white"
                >
                  <Plus size={18} />
                  Add another keyring
                </button>
                <OrderSummary items={watchedItems} />
                <Button
                  type="button"
                  onClick={() => goToStep(2)}
                  size="lg"
                  className="mt-6 h-auto w-full cursor-pointer rounded-full py-3 text-lg font-bold text-white transition-all hover:scale-105 active:scale-95"
                  style={{ backgroundColor: "var(--brand-coral)" }}
                >
                  Continue →
                </Button>
              </>
            )}

            {step === 2 && (
              <>
                <OrderReview
                  onEditItems={() => {
                    setStep(1);
                    scrollToForm();
                  }}
                />
                <div className="mt-6 flex flex-col gap-3">
                  <Button
                    type="button"
                    onClick={methods.handleSubmit(handleSubmit)}
                    disabled={submitting}
                    size="lg"
                    className="h-auto w-full cursor-pointer rounded-full py-3 text-lg font-bold text-white transition-all hover:scale-105 active:scale-95 disabled:opacity-60"
                    style={{ backgroundColor: "var(--brand-coral)" }}
                  >
                    {submitting
                      ? "Redirecting to checkout…"
                      : "Proceed to Payment →"}
                  </Button>
                  <button
                    type="button"
                    onClick={() => goToStep(1)}
                    className="w-full cursor-pointer rounded-full py-3 text-lg font-bold transition-all hover:scale-105 active:scale-95"
                    style={{ backgroundColor: "var(--brand-gray)", color: "var(--brand-brown)" }}
                  >
                    ← Back
                  </button>
                </div>
                {submitError && (
                  <p className="mt-3 text-center text-sm text-red-500">
                    {submitError}
                  </p>
                )}
              </>
            )}
          </div>
        </FormProvider>
      </div>
    </section>
  );
}
