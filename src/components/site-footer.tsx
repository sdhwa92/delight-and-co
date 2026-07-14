"use client";

import Image from "next/image";
import { useState } from "react";

const INSTAGRAM_URL = "https://www.instagram.com/i_delight_co/";
const CONTACT_EMAIL = "hello@delightandco.com.au";
const DEVELOPER_EMAIL = "info@elevateflow.com.au";

function InstagramIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width={22}
      height={22}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="2" y="2" width="20" height="20" rx="5" />
      <circle cx="12" cy="12" r="4.2" />
      <circle cx="17.4" cy="6.6" r="1.1" fill="currentColor" stroke="none" />
    </svg>
  );
}

function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setMessage("");
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Something went wrong.");
      setStatus("success");
      setMessage("Thanks for subscribing!");
      setEmail("");
    } catch (err) {
      setStatus("error");
      setMessage(err instanceof Error ? err.message : "Something went wrong.");
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex w-full max-w-sm flex-col gap-2"
    >
      <div className="flex w-full flex-col gap-2 sm:flex-row">
        <input
          type="email"
          required
          placeholder="Your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full rounded-full border border-black/10 bg-white px-4 py-2 text-sm"
          style={{ color: "var(--brand-brown)" }}
        />
        <button
          type="submit"
          disabled={status === "loading"}
          className="shrink-0 cursor-pointer rounded-full px-6 py-3 text-lg font-bold text-white transition-all hover:scale-105 active:scale-95 disabled:opacity-60"
          style={{ backgroundColor: "var(--brand-coral)" }}
        >
          {status === "loading" ? "Subscribing…" : "Subscribe"}
        </button>
      </div>
      {message && (
        <p
          className="text-xs"
          style={{
            color: status === "error" ? "#c0392b" : "var(--brand-brown)",
          }}
        >
          {message}
        </p>
      )}
    </form>
  );
}

export function SiteFooter() {
  return (
    <footer>
      <div
        className="py-10"
        style={{
          backgroundColor: "var(--brand-gray)",
          color: "var(--brand-brown)",
        }}
      >
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-5 px-4 text-center">
          <Image
            src="/logo.png"
            alt="Delight & Co"
            width={56}
            height={56}
            className="object-contain"
          />
          <p className="text-base font-semibold">
            Handmade Gifts for Little Smiles
          </p>

          <a
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Delight & Co on Instagram"
            className="transition-opacity hover:opacity-70"
          >
            <InstagramIcon />
          </a>

          <a href={`mailto:${CONTACT_EMAIL}`} className="text-sm underline">
            {CONTACT_EMAIL}
          </a>
        </div>
      </div>

      <div className="py-4" style={{ backgroundColor: "var(--brand-brown)" }}>
        <p className="text-center text-sm text-white/50">
          © {new Date().getFullYear() + " "} Delight &amp; Co. All rights
          reserved.{" "}
          <a
            href={`mailto:${DEVELOPER_EMAIL}`}
            className="text-white hover:underline"
          >
            Site by Elevate Flow.
          </a>
        </p>
      </div>
    </footer>
  );
}
