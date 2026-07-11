import type { MetadataRoute } from "next";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? "https://delightandco.com.au";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/test-payment", "/api/"],
    },
    sitemap: `${BASE_URL}/sitemap.xml`,
  };
}
