"use client";

import { useFormContext } from "react-hook-form";
import { Input } from "@/components/ui/input";
import type { OrderFormValues } from "@/lib/schemas";

function Field({
  label,
  name,
  type = "text",
  placeholder,
  optional,
}: {
  label: string;
  name: keyof OrderFormValues["details"];
  type?: string;
  placeholder?: string;
  optional?: boolean;
}) {
  const {
    register,
    formState: { errors },
  } = useFormContext<OrderFormValues>();

  const error = errors.details?.[name];

  return (
    <div className="flex flex-col gap-1">
      <label
        className="text-sm font-bold"
        style={{ color: "var(--brand-brown)" }}
      >
        {label}
        {optional && (
          <span className="ml-1 font-normal opacity-50">(optional)</span>
        )}
      </label>
      <Input
        type={type}
        placeholder={placeholder}
        aria-invalid={error ? true : undefined}
        {...register(`details.${name}`)}
      />
      {error && (
        <p className="text-sm text-red-500">{error.message as string}</p>
      )}
    </div>
  );
}

export function CustomerDetailsForm() {
  return (
    <div className="flex flex-col gap-4">
      <Field label="Full name" name="name" placeholder="Emma Smith" />
      <Field
        label="Email address"
        name="email"
        type="email"
        placeholder="you@example.com"
      />
      <Field
        label="Phone number"
        name="phone"
        type="tel"
        placeholder="+61 400 000 000"
        optional
      />
      <Field
        label="Street address"
        name="street"
        placeholder="123 Example Street"
      />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field label="Suburb" name="suburb" placeholder="Melbourne" />
        <Field label="State" name="state" placeholder="VIC" />
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field label="Postcode" name="postcode" placeholder="3000" />
      </div>
    </div>
  );
}
