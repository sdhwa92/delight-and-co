/** Short, human-friendly reference derived from the order's UUID (e.g. "#A1B2C3D4"). */
export function formatOrderReference(orderId: string): string {
  return `#${orderId.slice(0, 8).toUpperCase()}`;
}
