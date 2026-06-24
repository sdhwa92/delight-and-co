import {
  calculateItemTotal,
  calculateShipping,
  calculateSubtotal,
  formatPrice,
  type OrderItem,
} from "@/lib/pricing";

function itemRow(item: OrderItem, index: number): string {
  const extras: string[] = [];
  if (item.presentBox) extras.push("Present Box");
  if (item.extraCharacterParts) extras.push("Extra Character Parts ×2");

  return `
    <tr>
      <td style="padding:10px 12px;border-bottom:1px solid #F0EBE3;">Keyring ${index + 1}</td>
      <td style="padding:10px 12px;border-bottom:1px solid #F0EBE3;font-weight:600;">${item.letters.trim()}</td>
      <td style="padding:10px 12px;border-bottom:1px solid #F0EBE3;">${extras.length ? extras.join(", ") : "—"}</td>
      <td style="padding:10px 12px;border-bottom:1px solid #F0EBE3;text-align:right;">${formatPrice(calculateItemTotal(item))}</td>
    </tr>
  `;
}

export function buildOrderConfirmationEmail(items: OrderItem[]): string {
  const subtotal = calculateSubtotal(items);
  const shipping = calculateShipping(items.length);
  const total = subtotal + shipping;

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Your Delight & Co Order</title>
</head>
<body style="margin:0;padding:0;background:#F5F0E8;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;color:#2C1A0E;">
  <table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;">

          <!-- Header -->
          <tr>
            <td style="background:#F5C842;border-radius:16px 16px 0 0;padding:28px 32px;">
              <p style="margin:0;font-size:1.4rem;font-weight:800;color:#2C1A0E;">🎁 Delight &amp; Co</p>
              <p style="margin:6px 0 0;font-size:1rem;font-weight:600;color:#2C1A0E;">Your order is confirmed!</p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="background:#ffffff;padding:28px 32px;">
              <p style="margin:0 0 20px;font-size:0.95rem;line-height:1.6;">
                Thank you for your order! We'll handcraft your custom keyrings with care and love 🌸
              </p>

              <!-- Order table -->
              <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;font-size:0.88rem;">
                <thead>
                  <tr style="background:#F5F0E8;">
                    <th style="padding:10px 12px;text-align:left;font-weight:700;color:#6B5040;">#</th>
                    <th style="padding:10px 12px;text-align:left;font-weight:700;color:#6B5040;">Letters</th>
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

              <p style="margin:24px 0 0;font-size:0.85rem;color:#6B5040;line-height:1.6;">
                We'll send you a separate email once your order ships.<br/>
                Questions? Reach us at <a href="mailto:${process.env.GMAIL_USER}" style="color:#C4614A;">${process.env.GMAIL_USER}</a>
              </p>
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
}
