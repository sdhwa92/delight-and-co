-- orders: payment header + customer info
create table orders (
  id                uuid primary key,   -- = crypto.randomUUID() from /api/checkout (= Stripe client_reference_id)
  stripe_session_id text unique not null,
  status            text not null default 'pending'
                    check (status in ('pending', 'paid', 'making', 'shipped', 'fulfilled', 'refunded', 'cancelled')),
                    -- lifecycle: pending → paid → making → shipped → fulfilled

  -- customer info (collected by Stripe Checkout, saved by webhook)
  customer_name     text,
  customer_email    text,
  customer_phone    text,
  delivery_address  text,

  -- shipping
  shipping_reference text,   -- e.g. AusPost tracking number
  shipping_carrier   text,   -- e.g. "Australia Post", "Sendle"

  -- price totals
  subtotal_cents    integer not null,
  shipping_cents    integer not null default 0,
  total_cents       integer not null,

  -- timestamps
  created_at        timestamptz default now(),
  paid_at           timestamptz,
  shipped_at        timestamptz,
  fulfilled_at      timestamptz,
  confirmed_at      timestamptz   -- order confirmation email sent (idempotency guard against duplicate webhook delivery)
);

-- order_items: per-product config
-- add new product types to the check constraint as needed
create table order_items (
  id               uuid primary key default gen_random_uuid(),
  order_id         uuid not null references orders(id) on delete cascade,
  product_type     text not null check (product_type in ('keyring')),
  quantity         integer not null default 1,
  unit_price_cents integer not null,
  config           jsonb not null,   -- product-specific options validated at app layer (Zod)
  created_at       timestamptz default now()
);

create index on orders (stripe_session_id);
create index on order_items (order_id);
create index on order_items (product_type);
