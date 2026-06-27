import { z } from "zod";

export const keyringItemSchema = z.object({
  letters: z
    .string()
    .min(1, "Please enter at least one letter.")
    .regex(/^[A-Z\s]+$/, "Only uppercase letters A–Z are allowed."),
  stringColor: z.string(),
  presentBox: z.boolean(),
  extraCharacterParts: z.boolean(),
  freeAccessories: z.array(z.string()),
});

export const customerDetailsSchema = z.object({
  name: z.string().min(1, "Name is required."),
  email: z.string().email("Please enter a valid email address."),
  phone: z.string().optional(),
  street: z.string().min(1, "Street address is required."),
  suburb: z.string().min(1, "Suburb is required."),
  state: z.string().min(1, "State is required."),
  postcode: z
    .string()
    .regex(/^\d{4}$/, "Enter a valid 4-digit postcode."),
});

export const orderFormSchema = z.object({
  items: z.array(keyringItemSchema).min(1),
  details: customerDetailsSchema,
});

export type KeyringItemValues = z.infer<typeof keyringItemSchema>;
export type CustomerDetailsValues = z.infer<typeof customerDetailsSchema>;
export type OrderFormValues = z.infer<typeof orderFormSchema>;
