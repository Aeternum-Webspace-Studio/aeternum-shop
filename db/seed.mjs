import postgres from "postgres";
import { hashPassword } from "../lib/auth.js";

const url = process.env.DATABASE_URL;
if (!url) throw new Error("DATABASE_URL is not set");

const name = process.env.ADMIN_NAME ?? "Aeternum Admin";
const email = "admin@aeternum.biz.id";
const password = "Soyusa03!";

const sql = postgres(url, { max: 1 });

const categories = [
  { name: "AI", slug: "ai" },
  { name: "Streaming", slug: "streaming" },
  { name: "Tools", slug: "tools" },
  { name: "Design", slug: "design" },
  { name: "Lisensi", slug: "lisensi" },
  { name: "Bundle", slug: "bundle" }
];

const featuredProducts = [
  {
    categorySlug: "ai",
    name: "ChatGPT Plus Private 1 Bulan",
    slug: "chatgpt-plus-private-1-bulan",
    price: 35000,
    description: "Akses ChatGPT Plus private untuk kebutuhan kerja, belajar, riset, dan produktivitas harian. Cocok untuk pembeli yang ingin pengalaman lebih stabil tanpa alur pembelian ribet.",
    instructions: "Setelah pembayaran berhasil, detail akses akan tampil di halaman pesanan. Simpan invoice untuk pengecekan status order.",
    reviews: [
      ["Raka Pratama", "raka.review@aeternum.biz.id", 5, "Akses cepat masuk dan instruksinya jelas. Cocok buat kerja harian."],
      ["Dina Maharani", "dina.review@aeternum.biz.id", 5, "Harga masuk akal, proses order rapi, dan statusnya mudah dipantau."],
      ["Fajar Nugroho", "fajar.review@aeternum.biz.id", 4, "Produk sesuai deskripsi. Support juga responsif saat saya tanya invoice."]
    ]
  },
  {
    categorySlug: "ai",
    name: "Gemini Pro 18 Bulan",
    slug: "gemini-pro-18-bulan",
    price: 56000,
    description: "Paket Gemini Pro durasi panjang untuk eksplorasi AI, penulisan, analisis, dan workflow kreatif. Pilihan hemat untuk pembeli yang ingin masa aktif lebih lama.",
    instructions: "Gunakan detail akses sesuai instruksi pada halaman pesanan. Jika ada kendala, buka ticket dari akun pembeli.",
    reviews: [
      ["Nabila Putri", "nabila.review@aeternum.biz.id", 5, "Durasi panjang dan harganya worth it. Pembelian terasa aman karena ada invoice tracker."],
      ["Yoga Saputra", "yoga.review@aeternum.biz.id", 5, "Aktif sesuai keterangan. Saya suka detail pesanan tersimpan di akun."],
      ["Mira Lestari", "mira.review@aeternum.biz.id", 4, "Bagus untuk kerja konten. Prosesnya jelas dari bayar sampai akses diterima."]
    ]
  },
  {
    categorySlug: "design",
    name: "Canva Pro Team 1 Bulan",
    slug: "canva-pro-team-1-bulan",
    price: 35000,
    description: "Canva Pro Team untuk desain konten, presentasi, banner, dan kebutuhan brand harian. Cocok untuk kreator, admin sosial media, pelajar, dan tim kecil.",
    instructions: "Ikuti instruksi undangan team yang muncul setelah order diproses. Pastikan email Canva aktif dan bisa menerima undangan.",
    reviews: [
      ["Salsa Amalia", "salsa.review@aeternum.biz.id", 5, "Undangan team masuk dan Canva Pro langsung bisa dipakai."],
      ["Ardi Wijaya", "ardi.review@aeternum.biz.id", 5, "Murah untuk kebutuhan desain bulanan. Penjelasan produknya jelas."],
      ["Citra Dewi", "citra.review@aeternum.biz.id", 4, "Order diproses rapi dan saya bisa cek statusnya tanpa chat berulang." ]
    ]
  }
];

const articles = [
  {
    title: "Cara Aman Membeli Akun Premium Digital",
    slug: "cara-aman-membeli-akun-premium-digital",
    excerpt: "Panduan singkat untuk mengecek harga, status order, invoice, dan support sebelum membeli produk digital.",
    content: "Sebelum membeli akun premium digital, cek nama produk, durasi, cara akses, dan ulasan pembeli. Simpan nomor invoice setelah checkout agar status pesanan bisa dilacak. Jika akses belum diterima atau ada kendala, buka ticket dari halaman pesanan supaya riwayat bantuan tercatat rapi."
  },
  {
    title: "Kenapa Invoice Penting Saat Beli Produk Digital",
    slug: "kenapa-invoice-penting-saat-beli-produk-digital",
    excerpt: "Invoice membantu pembeli melihat status pembayaran dan proses produk tanpa perlu menebak-nebak.",
    content: "Invoice adalah bukti dan penanda pesanan. Dengan invoice, pembeli bisa cek apakah pembayaran sudah diterima, apakah pesanan sedang diproses, dan produk apa saja yang dibeli. Jangan bagikan data akses produk, cukup gunakan nomor invoice saat meminta bantuan."
  }
];

const seededAccounts = {
  extraAdmin: {
    name: "Aeternum Support",
    email: "support@aeternum.biz.id"
  },
  seller: {
    name: "Aeternum Store",
    email: "seller@aeternum.biz.id",
    storeName: "Aeternum Store",
    storeSlug: "aeternum-store",
    description: "Seller contoh untuk dashboard dan manual delivery."
  },
  buyer: {
    name: "Aeternum Buyer",
    email: "buyer@aeternum.biz.id"
  }
};

async function upsertUser(tx, { name, email, passwordHash, role, isReseller = false, resellerStatus = "none" }) {
  const [user] = await tx`
    insert into users (name, email, password_hash, role, is_reseller, reseller_status)
    values (${name}, ${email}, ${passwordHash}, ${role}, ${isReseller}, ${resellerStatus})
    on conflict (email) do update set
      name = excluded.name,
      password_hash = excluded.password_hash,
      role = excluded.role,
      is_reseller = excluded.is_reseller,
      reseller_status = excluded.reseller_status,
      updated_at = now()
    returning id
  `;
  return user.id;
}

async function upsertBuyer(tx, name, email, passwordHash) {
  const [user] = await tx`
    insert into users (name, email, password_hash, role)
    values (${name}, ${email}, ${passwordHash}, 'buyer')
    on conflict (email) do update set name = excluded.name, password_hash = excluded.password_hash, updated_at = now()
    returning id
  `;
  return user.id;
}

async function upsertSellerProfile(tx, userId, storeName, storeSlug, description) {
  const [profile] = await tx`
    insert into seller_profiles (user_id, store_name, store_slug, description, status)
    values (${userId}, ${storeName}, ${storeSlug}, ${description}, 'approved')
    on conflict (store_slug) do update set
      user_id = excluded.user_id,
      store_name = excluded.store_name,
      description = excluded.description,
      status = 'approved',
      updated_at = now()
    returning id
  `;
  return profile.id;
}

async function main() {
  const passwordHash = hashPassword(password);

  await sql.begin(async (tx) => {
    await upsertUser(tx, {
      name,
      email: email.toLowerCase(),
      passwordHash,
      role: "admin",
      isReseller: true,
      resellerStatus: "approved"
    });
    await upsertUser(tx, {
      name: seededAccounts.extraAdmin.name,
      email: seededAccounts.extraAdmin.email,
      passwordHash,
      role: "admin"
    });
    const sellerUserId = await upsertUser(tx, {
      name: seededAccounts.seller.name,
      email: seededAccounts.seller.email,
      passwordHash,
      role: "seller",
      isReseller: false
    });
    const sellerProfileId = await upsertSellerProfile(
      tx,
      sellerUserId,
      seededAccounts.seller.storeName,
      seededAccounts.seller.storeSlug,
      seededAccounts.seller.description
    );
    await upsertUser(tx, {
      name: seededAccounts.buyer.name,
      email: seededAccounts.buyer.email,
      passwordHash,
      role: "buyer"
    });

    for (const category of categories) {
      await tx`
        insert into categories (name, slug)
        values (${category.name}, ${category.slug})
        on conflict (slug) do nothing
      `;
    }

    const [admin] = await tx`select id from users where email = ${email.toLowerCase()} limit 1`;

    for (const product of featuredProducts) {
      const [category] = await tx`select id from categories where slug = ${product.categorySlug} limit 1`;
      const [savedProduct] = await tx`
        insert into products (seller_id, category_id, name, slug, description, instructions, price, fulfillment_type, status)
        values (${sellerProfileId}, ${category.id}, ${product.name}, ${product.slug}, ${product.description}, ${product.instructions}, ${product.price}, 'auto', 'active')
        on conflict (slug) do update
        set category_id = excluded.category_id,
            seller_id = excluded.seller_id,
            name = excluded.name,
            description = excluded.description,
            instructions = excluded.instructions,
            price = excluded.price,
            fulfillment_type = 'auto',
            status = 'active',
            updated_at = now()
        returning id
      `;

      for (let index = 0; index < product.reviews.length; index += 1) {
        const [buyerName, buyerEmail, rating, comment] = product.reviews[index];
        const buyerId = await upsertBuyer(tx, buyerName, buyerEmail, passwordHash);
        const orderNumber = `INV-SEED-${product.slug}-${index + 1}`.toUpperCase();
        const [order] = await tx`
          insert into orders (buyer_id, order_number, status, total_amount, paid_at, delivered_at)
          values (${buyerId}, ${orderNumber}, 'delivered', ${product.price}, now(), now())
          on conflict (order_number) do update
          set buyer_id = excluded.buyer_id,
              status = 'delivered',
              total_amount = excluded.total_amount,
              paid_at = now(),
              delivered_at = now(),
              updated_at = now()
          returning id
        `;
        await tx`
          insert into payments (order_id, provider, provider_reference, amount, status, paid_at)
          values (${order.id}, 'pakasir', ${orderNumber}, ${product.price}, 'paid', now())
          on conflict (provider_reference) do update
          set amount = excluded.amount,
              status = 'paid',
              paid_at = now(),
              updated_at = now()
        `;

        let [item] = await tx`select id from order_items where order_id = ${order.id} and product_id = ${savedProduct.id} limit 1`;
        if (!item) {
          [item] = await tx`
            insert into order_items (order_id, product_id, seller_id, quantity, unit_price, fulfillment_type, delivery_status, delivered_at)
            values (${order.id}, ${savedProduct.id}, ${sellerProfileId}, 1, ${product.price}, 'auto', 'delivered', now())
            returning id
          `;
        } else {
          await tx`update order_items set seller_id = ${sellerProfileId}, unit_price = ${product.price}, delivery_status = 'delivered', delivered_at = now() where id = ${item.id}`;
        }

        await tx`
          insert into reviews (product_id, order_item_id, buyer_id, rating, comment)
          values (${savedProduct.id}, ${item.id}, ${buyerId}, ${rating}, ${comment})
          on conflict (order_item_id) do update
          set rating = excluded.rating,
              comment = excluded.comment,
              is_hidden = false,
              updated_at = now()
        `;
      }

      const [{ count }] = await tx`select count(*)::int as count from product_stocks where product_id = ${savedProduct.id}`;
      if (count === 0) {
        for (let index = 1; index <= 5; index += 1) {
          await tx`
            insert into product_stocks (product_id, content, status)
            values (${savedProduct.id}, ${sql.json({ access: `${product.name} slot ${index}`, notes: "Data contoh seed. Ganti dengan akses asli sebelum dijual." })}, 'available')
          `;
        }
      }
    }

    for (const article of articles) {
      await tx`
        insert into blog_posts (author_id, title, slug, excerpt, content, status, published_at)
        values (${admin.id}, ${article.title}, ${article.slug}, ${article.excerpt}, ${article.content}, 'published', now())
        on conflict (slug) do update
        set title = excluded.title,
            excerpt = excluded.excerpt,
            content = excluded.content,
            status = 'published',
            published_at = coalesce(blog_posts.published_at, now()),
            updated_at = now()
      `;
    }

    await tx`delete from users where email like '%@aeternum.local'`;
  });

  await sql.end();
  console.log(`Seeded admin ${email}, extra accounts, default categories, featured products, reviews, and articles.`);
}

main().catch(async (error) => {
  console.error(error);
  await sql.end().catch(() => undefined);
  process.exit(1);
});
