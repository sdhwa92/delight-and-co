// Requires the following env vars to be set in .env.local:
//
//   NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
//     — The project URL from Supabase dashboard → Settings → API
//
//   SUPABASE_SERVICE_ROLE_KEY=eyJhbGci...
//     — The service_role key from Supabase dashboard → Settings → API
//     — IMPORTANT: This is a secret key. Never expose it to the client.
//       It must only be used in server-side code (API routes, webhooks).
//
// The `orders` table must also exist in your Supabase project:
//   create table orders (
//     id               uuid primary key default gen_random_uuid(),
//     stripe_session_id text unique not null,
//     status           text not null default 'pending',
//     customer_name    text not null default '',
//     customer_email   text not null default '',
//     customer_phone   text not null default '',
//     delivery_address text not null default '',
//     items            jsonb not null default '[]',
//     subtotal_cents   integer not null default 0,
//     shipping_cents   integer not null default 0,
//     total_cents      integer not null default 0,
//     paid_at          timestamptz,
//     created_at       timestamptz not null default now()
//   );

import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);
