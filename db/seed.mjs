import postgres from "postgres";
import { hashPassword } from "../lib/auth.js";

const url = process.env.DATABASE_URL;
if (!url) throw new Error("DATABASE_URL is not set");

const name = process.env.ADMIN_NAME ?? "Aeternum Admin";
const email = process.env.ADMIN_EMAIL ?? "admin@aeternum.local";
const password = process.env.ADMIN_PASSWORD ?? "ChangeMe123!";

const sql = postgres(url, { max: 1 });

const categories = [
  { name: "AI", slug: "ai" },
  { name: "Streaming", slug: "streaming" },
  { name: "Tools", slug: "tools" },
  { name: "Design", slug: "design" },
  { name: "Lisensi", slug: "lisensi" },
  { name: "Bundle", slug: "bundle" }
];

async function main() {
  const passwordHash = hashPassword(password);

  await sql.begin(async (tx) => {
    await tx`
      insert into users (name, email, password_hash, role, is_reseller, reseller_status)
      values (${name}, ${email.toLowerCase()}, ${passwordHash}, 'admin', true, 'approved')
      on conflict (email) do update
      set name = excluded.name,
          password_hash = excluded.password_hash,
          role = 'admin',
          is_reseller = true,
          reseller_status = 'approved',
          updated_at = now()
    `;

    for (const category of categories) {
      await tx`
        insert into categories (name, slug)
        values (${category.name}, ${category.slug})
        on conflict (slug) do nothing
      `;
    }
  });

  await sql.end();
  console.log(`Seeded admin ${email} and default categories.`);
}

main().catch(async (error) => {
  console.error(error);
  await sql.end().catch(() => undefined);
  process.exit(1);
});
