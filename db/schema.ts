import { boolean, index, integer, jsonb, pgEnum, pgTable, text, timestamp, uniqueIndex, uuid } from "drizzle-orm/pg-core";

export const userRoleEnum = pgEnum("user_role", ["buyer", "seller", "admin"]);
export const resellerStatusEnum = pgEnum("reseller_status", ["none", "pending", "approved", "rejected"]);
export const sellerStatusEnum = pgEnum("seller_status", ["pending", "approved", "suspended", "rejected"]);
export const fulfillmentTypeEnum = pgEnum("fulfillment_type", ["auto", "manual"]);
export const productStatusEnum = pgEnum("product_status", ["draft", "active", "inactive", "blocked"]);
export const stockStatusEnum = pgEnum("stock_status", ["available", "reserved", "sold", "disabled"]);
export const orderStatusEnum = pgEnum("order_status", ["pending_payment", "paid", "processing", "delivered", "cancelled", "refunded", "failed"]);
export const deliveryStatusEnum = pgEnum("delivery_status", ["pending", "processing", "delivered", "failed"]);
export const paymentStatusEnum = pgEnum("payment_status", ["pending", "paid", "failed", "expired", "refunded"]);
export const ticketStatusEnum = pgEnum("ticket_status", ["open", "pending", "closed"]);
export const blogStatusEnum = pgEnum("blog_status", ["draft", "published", "archived"]);

export const users = pgTable(
  "users",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    name: text("name").notNull(),
    email: text("email").notNull().unique(),
    passwordHash: text("password_hash").notNull(),
    role: userRoleEnum("role").notNull().default("buyer"),
    isReseller: boolean("is_reseller").notNull().default(false),
    resellerStatus: resellerStatusEnum("reseller_status").notNull().default("none"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow()
  },
  (table) => ({
    emailIdx: uniqueIndex("users_email_idx").on(table.email)
  })
);

export const sellerProfiles = pgTable(
  "seller_profiles",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }).unique(),
    storeName: text("store_name").notNull(),
    storeSlug: text("store_slug").notNull().unique(),
    description: text("description"),
    status: sellerStatusEnum("status").notNull().default("pending"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow()
  },
  (table) => ({
    userIdx: uniqueIndex("seller_profiles_user_idx").on(table.userId),
    slugIdx: uniqueIndex("seller_profiles_slug_idx").on(table.storeSlug)
  })
);

export const marketplaceSettings = pgTable("marketplace_settings", {
  id: uuid("id").defaultRandom().primaryKey(),
  appName: text("app_name").notNull().default("Aeternum Shop"),
  supportEmail: text("support_email"),
  announcement: text("announcement"),
  checkoutEnabled: boolean("checkout_enabled").notNull().default(true),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow()
});

export const categories = pgTable(
  "categories",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    name: text("name").notNull(),
    slug: text("slug").notNull().unique(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow()
  },
  (table) => ({
    slugIdx: uniqueIndex("categories_slug_idx").on(table.slug)
  })
);

export const products = pgTable(
  "products",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    sellerId: uuid("seller_id").references(() => sellerProfiles.id, { onDelete: "set null" }),
    categoryId: uuid("category_id").references(() => categories.id, { onDelete: "set null" }),
    name: text("name").notNull(),
    slug: text("slug").notNull().unique(),
    description: text("description").notNull(),
    instructions: text("instructions"),
    price: integer("price").notNull(),
    resellerPrice: integer("reseller_price"),
    fulfillmentType: fulfillmentTypeEnum("fulfillment_type").notNull(),
    status: productStatusEnum("status").notNull().default("draft"),
    isCustomPackage: boolean("is_custom_package").notNull().default(false),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow()
  },
  (table) => ({
    slugIdx: uniqueIndex("products_slug_idx").on(table.slug),
    statusIdx: index("products_status_idx").on(table.status),
    sellerIdx: index("products_seller_idx").on(table.sellerId)
  })
);

export const productStocks = pgTable(
  "product_stocks",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    productId: uuid("product_id").notNull().references(() => products.id, { onDelete: "cascade" }),
    content: jsonb("content").notNull(),
    status: stockStatusEnum("status").notNull().default("available"),
    soldOrderItemId: uuid("sold_order_item_id"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    soldAt: timestamp("sold_at", { withTimezone: true })
  },
  (table) => ({
    productIdx: index("product_stocks_product_idx").on(table.productId),
    statusIdx: index("product_stocks_status_idx").on(table.status)
  })
);

export const orders = pgTable(
  "orders",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    buyerId: uuid("buyer_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    orderNumber: text("order_number").notNull().unique(),
    status: orderStatusEnum("status").notNull().default("pending_payment"),
    totalAmount: integer("total_amount").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
    paidAt: timestamp("paid_at", { withTimezone: true }),
    deliveredAt: timestamp("delivered_at", { withTimezone: true })
  },
  (table) => ({
    numberIdx: uniqueIndex("orders_number_idx").on(table.orderNumber),
    buyerIdx: index("orders_buyer_idx").on(table.buyerId),
    statusIdx: index("orders_status_idx").on(table.status)
  })
);

export const orderItems = pgTable(
  "order_items",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    orderId: uuid("order_id").notNull().references(() => orders.id, { onDelete: "cascade" }),
    productId: uuid("product_id").notNull().references(() => products.id, { onDelete: "restrict" }),
    sellerId: uuid("seller_id").references(() => sellerProfiles.id, { onDelete: "set null" }),
    quantity: integer("quantity").notNull().default(1),
    unitPrice: integer("unit_price").notNull(),
    fulfillmentType: fulfillmentTypeEnum("fulfillment_type").notNull(),
    deliveryContent: jsonb("delivery_content"),
    deliveryStatus: deliveryStatusEnum("delivery_status").notNull().default("pending"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    deliveredAt: timestamp("delivered_at", { withTimezone: true })
  },
  (table) => ({
    orderIdx: index("order_items_order_idx").on(table.orderId),
    sellerIdx: index("order_items_seller_idx").on(table.sellerId)
  })
);

export const payments = pgTable(
  "payments",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    orderId: uuid("order_id").notNull().references(() => orders.id, { onDelete: "cascade" }),
    provider: text("provider").notNull().default("pakasir"),
    providerReference: text("provider_reference").unique(),
    paymentUrl: text("payment_url"),
    amount: integer("amount").notNull(),
    status: paymentStatusEnum("status").notNull().default("pending"),
    rawPayload: jsonb("raw_payload"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    paidAt: timestamp("paid_at", { withTimezone: true }),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow()
  },
  (table) => ({
    orderIdx: index("payments_order_idx").on(table.orderId),
    referenceIdx: uniqueIndex("payments_reference_idx").on(table.providerReference)
  })
);

export const paymentEvents = pgTable("payment_events", {
  id: uuid("id").defaultRandom().primaryKey(),
  paymentId: uuid("payment_id").references(() => payments.id, { onDelete: "cascade" }),
  provider: text("provider").notNull(),
  eventType: text("event_type"),
  payload: jsonb("payload").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow()
});

export const reviews = pgTable(
  "reviews",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    productId: uuid("product_id").notNull().references(() => products.id, { onDelete: "cascade" }),
    orderItemId: uuid("order_item_id").notNull().references(() => orderItems.id, { onDelete: "cascade" }).unique(),
    buyerId: uuid("buyer_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    rating: integer("rating").notNull(),
    comment: text("comment"),
    isHidden: boolean("is_hidden").notNull().default(false),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow()
  },
  (table) => ({
    productIdx: index("reviews_product_idx").on(table.productId)
  })
);

export const tickets = pgTable(
  "tickets",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    buyerId: uuid("buyer_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    orderId: uuid("order_id").references(() => orders.id, { onDelete: "set null" }),
    sellerId: uuid("seller_id").references(() => sellerProfiles.id, { onDelete: "set null" }),
    subject: text("subject").notNull(),
    status: ticketStatusEnum("status").notNull().default("open"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
    closedAt: timestamp("closed_at", { withTimezone: true })
  },
  (table) => ({
    buyerIdx: index("tickets_buyer_idx").on(table.buyerId),
    sellerIdx: index("tickets_seller_idx").on(table.sellerId),
    statusIdx: index("tickets_status_idx").on(table.status)
  })
);

export const ticketMessages = pgTable("ticket_messages", {
  id: uuid("id").defaultRandom().primaryKey(),
  ticketId: uuid("ticket_id").notNull().references(() => tickets.id, { onDelete: "cascade" }),
  senderId: uuid("sender_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  message: text("message").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow()
});

export const blogPosts = pgTable(
  "blog_posts",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    authorId: uuid("author_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    title: text("title").notNull(),
    slug: text("slug").notNull().unique(),
    excerpt: text("excerpt"),
    content: text("content").notNull(),
    status: blogStatusEnum("status").notNull().default("draft"),
    publishedAt: timestamp("published_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow()
  },
  (table) => ({
    slugIdx: uniqueIndex("blog_posts_slug_idx").on(table.slug),
    statusIdx: index("blog_posts_status_idx").on(table.status)
  })
);

export const activityLogs = pgTable(
  "activity_logs",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    actorId: uuid("actor_id").references(() => users.id, { onDelete: "set null" }),
    action: text("action").notNull(),
    entityType: text("entity_type"),
    entityId: text("entity_id"),
    metadata: jsonb("metadata").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow()
  },
  (table) => ({
    actorIdx: index("activity_logs_actor_idx").on(table.actorId),
    actionIdx: index("activity_logs_action_idx").on(table.action),
    createdIdx: index("activity_logs_created_idx").on(table.createdAt)
  })
);

export const faqItems = pgTable("faq_items", {
  id: uuid("id").defaultRandom().primaryKey(),
  question: text("question").notNull(),
  answer: text("answer").notNull(),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow()
});
