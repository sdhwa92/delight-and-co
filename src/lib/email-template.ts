import {
  calculateItemTotal,
  calculateShipping,
  calculateSubtotal,
  formatPrice,
  type OrderItem,
} from "@/lib/pricing";

export interface EmailOrderItem {
  letters: string;
  stringColor: string;
  presentBox: boolean;
  extraCharacterParts: boolean;
  freeAccessories: string[];
}

export interface EmailContext {
  items: EmailOrderItem[];
  customerName: string;
  customerPhone?: string;
  deliveryAddress: string;
}

/** Convert an EmailOrderItem to the OrderItem shape pricing functions expect. */
function toOrderItem(item: EmailOrderItem): OrderItem {
  return {
    letters: item.letters,
    presentBox: item.presentBox,
    extraCharacterParts: item.extraCharacterParts,
  };
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;");
}

function capitalize(str: string): string {
  if (!str) return str;
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

function itemRow(item: EmailOrderItem, index: number): string {
  const orderItem = toOrderItem(item);

  const extras: string[] = [];
  if (item.presentBox) extras.push("Present Box");
  if (item.extraCharacterParts) extras.push("Extra Character Parts ×2");

  return `
    <tr>
      <td style="padding:10px 12px;border-bottom:1px solid #F0EBE3;">${index + 1}</td>
      <td style="padding:10px 12px;border-bottom:1px solid #F0EBE3;font-weight:600;">${item.letters.trim()}</td>
      <td style="padding:10px 12px;border-bottom:1px solid #F0EBE3;">${capitalize(escapeHtml(item.stringColor))}</td>
      <td style="padding:10px 12px;border-bottom:1px solid #F0EBE3;">${item.freeAccessories.length ? item.freeAccessories.join(", ") : "—"}</td>
      <td style="padding:10px 12px;border-bottom:1px solid #F0EBE3;">${extras.length ? extras.join(", ") : "—"}</td>
      <td style="padding:10px 12px;border-bottom:1px solid #F0EBE3;text-align:right;">${formatPrice(calculateItemTotal(orderItem))}</td>
    </tr>
  `;
}

function orderTable(items: EmailOrderItem[]): string {
  const orderItems = items.map(toOrderItem);
  const subtotal = calculateSubtotal(orderItems);
  const shipping = calculateShipping(orderItems.length);
  const total = subtotal + shipping;

  return `
    <!-- Order table -->
    <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;font-size:0.88rem;">
      <thead>
        <tr style="background:#F5F0E8;">
          <th style="padding:10px 12px;text-align:left;font-weight:700;color:#6B5040;">#</th>
          <th style="padding:10px 12px;text-align:left;font-weight:700;color:#6B5040;">Letters</th>
          <th style="padding:10px 12px;text-align:left;font-weight:700;color:#6B5040;">String</th>
          <th style="padding:10px 12px;text-align:left;font-weight:700;color:#6B5040;">Free Accessories</th>
          <th style="padding:10px 12px;text-align:left;font-weight:700;color:#6B5040;">Extras</th>
          <th style="padding:10px 12px;text-align:right;font-weight:700;color:#6B5040;">Price</th>
        </tr>
      </thead>
      <tbody>
        ${items.map((item, i) => itemRow(item, i)).join("")}
      </tbody>
    </table>

    <!-- Totals -->
    <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;font-size:0.88rem;margin-top:4px;">
      <tr>
        <td style="padding:8px 12px;color:#6B5040;">Subtotal</td>
        <td style="padding:8px 12px;text-align:right;">${formatPrice(subtotal)}</td>
      </tr>
      <tr>
        <td style="padding:8px 12px;color:#6B5040;">Shipping</td>
        <td style="padding:8px 12px;text-align:right;">${shipping === 0 ? "Free" : formatPrice(shipping)}</td>
      </tr>
      <tr style="background:#F5F0E8;font-weight:700;">
        <td style="padding:10px 12px;border-radius:0 0 0 8px;">Total (AUD)</td>
        <td style="padding:10px 12px;text-align:right;border-radius:0 0 8px 0;">${formatPrice(total)}</td>
      </tr>
    </table>
  `;
}

function deliveryBox(ctx: EmailContext): string {
  const safeName = escapeHtml(ctx.customerName);
  const safePhone = ctx.customerPhone ? escapeHtml(ctx.customerPhone) : null;
  const safeAddress = escapeHtml(ctx.deliveryAddress);

  const phoneRow = safePhone
    ? `<tr><td style="padding:3px 0;color:#6B5040;width:80px;">Phone</td><td style="padding:3px 0;">${safePhone}</td></tr>`
    : "";

  return `
    <!-- Delivery Details -->
    <table width="100%" cellpadding="0" cellspacing="0"
      style="border-collapse:collapse;font-size:0.88rem;margin-top:20px;background:#FAF6EF;border-radius:8px;padding:0;">
      <tr>
        <td style="padding:14px 16px;">
          <p style="margin:0 0 8px;font-weight:700;color:#2C1A0E;font-size:0.9rem;">Delivery Details</p>
          <table cellpadding="0" cellspacing="0" style="border-collapse:collapse;font-size:0.88rem;">
            <tr><td style="padding:3px 0;color:#6B5040;width:80px;">Name</td><td style="padding:3px 0;">${safeName}</td></tr>
            ${phoneRow}
            <tr><td style="padding:3px 0;color:#6B5040;width:80px;">Address</td><td style="padding:3px 0;">${safeAddress}</td></tr>
          </table>
        </td>
      </tr>
    </table>
  `;
}

const HTML_SHELL = (title: string, headerText: string, body: string) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${title}</title>
</head>
<body style="margin:0;padding:0;background:#F5F0E8;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;color:#2C1A0E;">
  <table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;">

          <!-- Header -->
          <tr>
            <td style="background:#F5C842;border-radius:16px 16px 0 0;padding:28px 32px;">
              <p style="margin:0;font-size:1.4rem;font-weight:800;color:#2C1A0E;">🎁 Delight &amp; Co</p>
              <p style="margin:6px 0 0;font-size:1rem;font-weight:600;color:#2C1A0E;">${headerText}</p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="background:#ffffff;padding:28px 32px;">
              ${body}
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#F5F0E8;border-radius:0 0 16px 16px;padding:16px 32px;text-align:center;">
              <p style="margin:0;font-size:0.78rem;color:#8A7060;">
                Delight &amp; Co · Handmade with love 🎀
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`.trim();

export function buildOrderConfirmationEmail(ctx: EmailContext): string {
  const body = `
    <p style="margin:0 0 20px;font-size:0.95rem;line-height:1.6;">
      Hi ${escapeHtml(ctx.customerName)}! Your order is confirmed 🎉<br/>
      We'll handcraft your custom keyrings with care and love 🌸
    </p>

    ${orderTable(ctx.items)}

    ${deliveryBox(ctx)}

    <p style="margin:24px 0 0;font-size:0.85rem;color:#6B5040;line-height:1.6;">
      We'll send you a separate email once your order ships.<br/>
      Questions? Reach us at <a href="mailto:hello@delightandco.com.au" style="color:#C4614A;">hello@delightandco.com.au</a>
    </p>
  `;

  return HTML_SHELL("Your Delight &amp; Co Order", "Your order is confirmed!", body);
}

export function buildOwnerNotificationEmail(order: {
  customer_name: string;
  customer_email: string;
  customer_phone?: string;
  delivery_address: string;
  items: EmailOrderItem[];
  total_cents?: number;
}): string {
  const ctx: EmailContext = {
    items: order.items,
    customerName: order.customer_name,
    customerPhone: order.customer_phone,
    deliveryAddress: order.delivery_address,
  };

  const safeName = escapeHtml(order.customer_name);
  const safeEmail = escapeHtml(order.customer_email);
  const safePhone = order.customer_phone ? escapeHtml(order.customer_phone) : null;
  const safeAddress = escapeHtml(order.delivery_address);

  const totalDisplay =
    order.total_cents != null
      ? formatPrice(order.total_cents)
      : formatPrice(
          calculateSubtotal(order.items.map(toOrderItem)) +
            calculateShipping(order.items.length),
        );

  const summaryBox = `
    <!-- New Order Summary -->
    <table width="100%" cellpadding="0" cellspacing="0"
      style="border-collapse:collapse;font-size:0.88rem;margin-bottom:24px;background:#FFF8E7;border-radius:8px;border:2px solid #F5C842;">
      <tr>
        <td style="padding:16px 20px;">
          <p style="margin:0 0 10px;font-weight:800;font-size:1rem;color:#2C1A0E;">New Order</p>
          <p style="margin:0 0 4px;color:#2C1A0E;">
            <strong>Name:</strong> ${safeName}
            &nbsp;&nbsp;|&nbsp;&nbsp;
            <strong>Email:</strong> <a href="mailto:${safeEmail}" style="color:#C4614A;">${safeEmail}</a>
            ${safePhone ? `&nbsp;&nbsp;|&nbsp;&nbsp;<strong>Phone:</strong> ${safePhone}` : ""}
          </p>
          <p style="margin:0;color:#2C1A0E;">
            <strong>Address:</strong> ${safeAddress}
            &nbsp;&nbsp;|&nbsp;&nbsp;
            <strong>Items:</strong> ${order.items.length}
            &nbsp;&nbsp;|&nbsp;&nbsp;
            <strong>Total:</strong> AUD ${totalDisplay}
          </p>
        </td>
      </tr>
    </table>
  `;

  const body = `
    ${summaryBox}

    ${orderTable(ctx.items)}

    ${deliveryBox(ctx)}
  `;

  return HTML_SHELL(
    `New Order from ${safeName}`,
    `New order from ${safeName}`,
    body,
  );
}
