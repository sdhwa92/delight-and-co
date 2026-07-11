const TOKENS: {
  name: string;
  cssVar: string;
  role: string;
  textOn: "dark" | "white";
}[] = [
  { name: "Background", cssVar: "--background", role: "Page background (blush pink)", textOn: "dark" },
  { name: "Foreground", cssVar: "--foreground", role: "Body text (near-black charcoal)", textOn: "white" },
  { name: "Brand Coral", cssVar: "--brand-coral", role: "CTA section background / accent", textOn: "dark" },
  { name: "Brand Pink", cssVar: "--brand-pink", role: "Light card panels inside coral section", textOn: "dark" },
  { name: "Brand Cream", cssVar: "--brand-cream", role: "White — alternating section background", textOn: "dark" },
  { name: "Brand Gray", cssVar: "--brand-gray", role: "Light neutral section background (contact-style)", textOn: "dark" },
  { name: "Brand Brown", cssVar: "--brand-brown", role: "Near-black text on coral/pink (var name kept for compat)", textOn: "white" },
];

export function ColorPalette() {
  return (
    <div style={{ padding: 24, fontFamily: "var(--font-sans, sans-serif)" }}>
      <h1 style={{ fontSize: 24, fontWeight: 800, marginBottom: 4 }}>Delight & Co — Color Tokens</h1>
      <p style={{ marginBottom: 24, color: "#666" }}>
        Palette restricted to colors present in the reference screenshot: blush pink, coral/salmon,
        light pink, white, light gray, and near-black text. No brown or green or yellow hues
        remain — <code>--brand-green</code> is aliased to coral and <code>--brand-brown</code>{" "}
        is now near-black, kept only for backward-compatible variable names.
      </p>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
          gap: 16,
        }}
      >
        {TOKENS.map((t) => (
          <div
            key={t.cssVar}
            style={{
              borderRadius: 12,
              overflow: "hidden",
              border: "1px solid #e5e5e5",
            }}
          >
            <div
              style={{
                height: 96,
                backgroundColor: `var(${t.cssVar})`,
                display: "flex",
                alignItems: "flex-end",
                padding: 12,
                color: t.textOn === "white" ? "#fff" : "var(--brand-brown)",
                fontWeight: 700,
              }}
            >
              Aa Sample Text
            </div>
            <div style={{ padding: 12, background: "#fff" }}>
              <p style={{ fontWeight: 700, margin: 0 }}>{t.name}</p>
              <p style={{ margin: "2px 0", fontSize: 12, color: "#888" }}>
                <code>{t.cssVar}</code>
              </p>
              <p style={{ margin: 0, fontSize: 13 }}>{t.role}</p>
            </div>
          </div>
        ))}
      </div>
      <div
        style={{
          marginTop: 24,
          padding: 16,
          borderRadius: 12,
          background: "#FFF8E7",
          border: "2px solid #F5C842",
          fontSize: 13,
          lineHeight: 1.6,
        }}
      >
        <strong>Contrast notes:</strong>
        <ul style={{ margin: "8px 0 0", paddingLeft: 20 }}>
          <li>White text on Brand Coral or Brand Pink fails WCAG AA for body text — use Brand Brown (near-black) instead.</li>
          <li>Brand Brown text is safe on Coral, Pink, Cream, Gray, and Background.</li>
          <li>Brand Green is aliased to Coral — no separate green or yellow accent remains in this palette.</li>
        </ul>
      </div>
    </div>
  );
}
