export default async function RegisterPage({ searchParams }: { searchParams: Promise<{ ref?: string }> }) {
  const params = await searchParams;
  const ref = params.ref;

  return (
    <main className="aeternum-bg min-h-screen px-6 py-10 text-text">
      <div className="mx-auto grid max-w-5xl gap-6 md:grid-cols-[1fr_0.8fr] md:items-center">
        <section className="hero-card reveal-up rounded-xl2 border-[3px] border-border p-6 shadow-soft md:p-8">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-primary">Akun baru</p>
          <h1 className="mt-3 text-4xl font-black leading-tight md:text-6xl">Daftar sekali, semua pesanan tersimpan rapi.</h1>
          <p className="mt-4 text-sm leading-7 text-muted">Akun dipakai untuk checkout, invoice tracker, ulasan produk, dan bantuan order.</p>
        </section>

        <section className="rounded-xl2 border-[3px] border-border bg-white p-6 shadow-soft">
          <div className="flex items-center gap-3">
            <img className="h-11 w-11 rounded-lg shadow-soft" src="/icon.svg" alt="Aeternum Shop" />
            <div>
              <h2 className="text-2xl font-black">Register</h2>
              <p className="text-xs text-muted">Mulai belanja produk digital.</p>
            </div>
          </div>
          <form className="mt-6 space-y-4" method="post" action="/api/auth/register">
            {ref ? <input type="hidden" name="referralCode" value={ref} /> : null}
            <input className="w-full rounded-xl border-[2px] border-border bg-surfaceSoft px-4 py-3 text-sm font-semibold outline-none" name="name" type="text" placeholder="Nama" required />
            <input className="w-full rounded-xl border-[2px] border-border bg-surfaceSoft px-4 py-3 text-sm font-semibold outline-none" name="email" type="email" placeholder="Email" required />
            <input className="w-full rounded-xl border-[2px] border-border bg-surfaceSoft px-4 py-3 text-sm font-semibold outline-none" name="password" type="password" placeholder="Password" required />
            {ref ? <p className="text-xs font-semibold text-muted">Referral aktif: {ref}</p> : null}
            <button className="lift shine w-full rounded-xl border-[3px] border-border bg-primary px-4 py-3 font-black text-white shadow-soft">Daftar</button>
            <p className="text-center text-sm text-muted">Sudah punya akun? <a className="font-black text-primary" href="/login">Login</a></p>
          </form>
        </section>
      </div>
    </main>
  );
}
