"use client";

import { useState } from "react";

// TEMPORARY — hidden production smoke-test page. Remove after verifying live payments work.
export default function TestPaymentPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleClick() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/test-payment/checkout", { method: "POST" });
      const data = await res.json();
      if (!res.ok || !data.url) throw new Error(data.error ?? "Checkout failed.");
      window.location.href = data.url;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
      setLoading(false);
    }
  }

  return (
    <main style={{ padding: 40, maxWidth: 480, margin: "0 auto" }}>
      <h1>Production Payment Smoke Test</h1>
      <p>Charges a real $0.50 AUD via Stripe Checkout. For internal verification only.</p>
      <button onClick={handleClick} disabled={loading}>
        {loading ? "Redirecting…" : "Pay $0.50"}
      </button>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </main>
  );
}
