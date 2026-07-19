export default function RegisterPage() {
  return (
    <main className="min-h-screen bg-background px-6 py-10 text-text">
      <div className="mx-auto max-w-md rounded-xl2 border border-border bg-white p-6 shadow-soft">
        <h1 className="text-2xl font-semibold">Register</h1>
        <form className="mt-6 space-y-4" method="post" action="/api/auth/register">
          <input className="w-full rounded-xl border border-border px-4 py-3" name="name" type="text" placeholder="Nama" required />
          <input className="w-full rounded-xl border border-border px-4 py-3" name="email" type="email" placeholder="Email" required />
          <input className="w-full rounded-xl border border-border px-4 py-3" name="password" type="password" placeholder="Password" required />
          <button className="w-full rounded-xl bg-primary px-4 py-3 font-medium text-white">Daftar</button>
        </form>
      </div>
    </main>
  );
}
