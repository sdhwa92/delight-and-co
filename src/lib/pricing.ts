export const BASE_PRICE = 18_00; // cents: $18.00
export const FREE_LETTERS = 7;
export const EXTRA_LETTER_PRICE = 50; // cents: $0.50

export interface OrderItem {
  letters: string; // e.g. "EMMA"
}

/** Returns total price in cents for a list of order items. */
export function calculateOrderTotal(items: OrderItem[]): number {
  return items.reduce((sum, item) => {
    const letterCount = item.letters.replace(/\s/g, "").length;
    const extraLetters = Math.max(0, letterCount - FREE_LETTERS);
    return sum + BASE_PRICE + extraLetters * EXTRA_LETTER_PRICE;
  }, 0);
}

/** Format cents to a human-readable USD string, e.g. 1850 → "$18.50" */
export function formatPrice(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`;
}
