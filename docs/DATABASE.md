# Database Awal

Target database: Neon Postgres.

ORM disarankan: Drizzle ORM.

## 01. users

Menyimpan semua buyer, seller, admin.

Kolom:

```txt
id uuid pk
name text
email text unique not null
password_hash text
role text not null default 'buyer'
is_reseller boolean not null default false
reseller_status text not null default 'none'
created_at timestamp not null
updated_at timestamp not null
```

Role:

```txt
buyer
seller
admin
```

Reseller status:

```txt
none
pending
approved
rejected
```

## 02. seller_profiles

Kolom:

```txt
id uuid pk
user_id uuid fk users.id unique
store_name text not null
store_slug text unique not null
description text
status text not null default 'pending'
created_at timestamp not null
updated_at timestamp not null
```

Status:

```txt
pending
approved
suspended
rejected
```

## 03. categories

Kolom:

```txt
id uuid pk
name text not null
slug text unique not null
created_at timestamp not null
```

## 04. products

Kolom:

```txt
id uuid pk
seller_id uuid fk seller_profiles.id
category_id uuid fk categories.id
name text not null
slug text unique not null
description text not null
instructions text
price integer not null
reseller_price integer
fulfillment_type text not null
status text not null default 'draft'
is_custom_package boolean not null default false
created_at timestamp not null
updated_at timestamp not null
```

Fulfillment type:

```txt
auto
manual
```

Status:

```txt
draft
active
inactive
blocked
```

## 05. product_stocks

Stok digital untuk produk auto delivery.

Kolom:

```txt
id uuid pk
product_id uuid fk products.id
content jsonb not null
status text not null default 'available'
sold_order_item_id uuid
created_at timestamp not null
sold_at timestamp
```

Status:

```txt
available
reserved
sold
disabled
```

Contoh `content`:

```json
{
  "email": "buyer@example.com",
  "password": "secret",
  "notes": "Login via website resmi"
}
```

## 06. orders

Kolom:

```txt
id uuid pk
buyer_id uuid fk users.id
order_number text unique not null
status text not null default 'pending_payment'
total_amount integer not null
created_at timestamp not null
updated_at timestamp not null
paid_at timestamp
delivered_at timestamp
```

Status:

```txt
pending_payment
paid
processing
delivered
cancelled
refunded
failed
```

## 07. order_items

Kolom:

```txt
id uuid pk
order_id uuid fk orders.id
product_id uuid fk products.id
seller_id uuid fk seller_profiles.id
quantity integer not null default 1
unit_price integer not null
fulfillment_type text not null
delivery_content jsonb
delivery_status text not null default 'pending'
created_at timestamp not null
delivered_at timestamp
```

Delivery status:

```txt
pending
processing
delivered
failed
```

## 08. payments

Kolom:

```txt
id uuid pk
order_id uuid fk orders.id
provider text not null default 'pakasir'
provider_reference text unique
payment_url text
amount integer not null
status text not null default 'pending'
raw_payload jsonb
created_at timestamp not null
paid_at timestamp
updated_at timestamp not null
```

Status:

```txt
pending
paid
failed
expired
refunded
```

## 09. payment_events

Menyimpan semua callback agar debugging mudah.

Kolom:

```txt
id uuid pk
payment_id uuid fk payments.id
provider text not null
event_type text
payload jsonb not null
created_at timestamp not null
```

## 10. reviews

Kolom:

```txt
id uuid pk
product_id uuid fk products.id
order_item_id uuid fk order_items.id unique
buyer_id uuid fk users.id
rating integer not null
comment text
is_hidden boolean not null default false
created_at timestamp not null
updated_at timestamp not null
```

Constraint:

```txt
rating between 1 and 5
```

## 11. tickets

Kolom:

```txt
id uuid pk
buyer_id uuid fk users.id
order_id uuid fk orders.id
seller_id uuid fk seller_profiles.id
subject text not null
status text not null default 'open'
created_at timestamp not null
updated_at timestamp not null
closed_at timestamp
```

Status:

```txt
open
pending
closed
```

## 12. ticket_messages

Kolom:

```txt
id uuid pk
ticket_id uuid fk tickets.id
sender_id uuid fk users.id
message text not null
created_at timestamp not null
```

## 13. blog_posts

Kolom:

```txt
id uuid pk
author_id uuid fk users.id
title text not null
slug text unique not null
excerpt text
content text not null
status text not null default 'draft'
published_at timestamp
created_at timestamp not null
updated_at timestamp not null
```

Status:

```txt
draft
published
archived
```

## 14. faq_items

Untuk chatbot FAQ sederhana.

Kolom:

```txt
id uuid pk
question text not null
answer text not null
is_active boolean not null default true
created_at timestamp not null
updated_at timestamp not null
```

## 15. Indeks Minimal

```txt
users.email
seller_profiles.store_slug
products.slug
products.status
products.seller_id
product_stocks.product_id + status
orders.buyer_id
orders.order_number
orders.status
order_items.order_id
order_items.seller_id
payments.order_id
payments.provider_reference
tickets.buyer_id
tickets.seller_id
tickets.status
blog_posts.slug
blog_posts.status
```

## 16. Catatan Keamanan

- `product_stocks.content` dan `order_items.delivery_content` berisi data sensitif.
- Jangan kirim field sensitif ke client kecuali buyer pemilik order, seller pemilik produk, atau admin.
- Validasi role di server, bukan hanya di UI.
- Payment webhook harus idempotent.
