// Requires the following env vars in .env.local:
//
//   NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
//     — Dashboard → Settings → API → Project URL
//
//   SUPABASE_SECRET_KEY=sb_secret_...
//     — Dashboard → Settings → API → Project API keys → Secret key (sb_secret_...)
//     — Replaces the legacy service_role JWT key. Supabase rejects browser requests
//       automatically, adding a safety layer if the key is accidentally exposed.
//     — Server-side only (API routes, webhooks). Never use in client components.

import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SECRET_KEY!,
);
