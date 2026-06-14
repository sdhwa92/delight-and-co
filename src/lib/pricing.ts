export const BASE_PRICE = 1590; // cents: $15.90
export const FREE_LETTERS = 6;
export const EXTRA_LETTER_PRICE = 50; // cents: $0.50
export const SHIPPING_FEE = 990; // cents: $9.90
export const FREE_SHIPPING_THRESHOLD = 3; // keyrings
export const PRESENT_BOX_PRICE = 350; // cents: $3.50
export const EXTRA_PARTS_PRICE = 100; // cents: $1.00

export interface OrderItem {
  letters: string; // e.g. "EMMA"
  presentBox?: boolean;
  extraCharacterParts?: boolean;
}

/** Returns the price in cents for a single keyring item. */
export function calculateItemTotal(item: OrderItem): number {
  const letterCount = item.letters.replace(/\s/g, "").length;
  const extraLetters = Math.max(0, letterCount - FREE_LETTERS);
  let total = BASE_PRICE + extraLetters * EXTRA_LETTER_PRICE;
  if (item.presentBox) total += PRESENT_BOX_PRICE;
  if (item.extraCharacterParts) total += EXTRA_PARTS_PRICE;
  return total;
}

/** Returns the subtotal in cents for all keyring items (before shipping). */
export function calculateSubtotal(items: OrderItem[]): number {
  return items.reduce((sum, item) => sum + calculateItemTotal(item), 0);
}

/** Returns the shipping fee in cents. Free when keyring count meets the threshold. */
export function calculateShipping(itemCount: number): number {
  return itemCount >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE;
}

/** Returns the grand total in cents (subtotal + shipping). */
export function calculateOrderTotal(items: OrderItem[]): number {
  return calculateSubtotal(items) + calculateShipping(items.length);
}

/** Format cents to a human-readable USD string, e.g. 1850 → "$18.50" */
export function formatPrice(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`;
}
