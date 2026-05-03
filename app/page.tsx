import { ChatPanel } from "@/components/chat-panel";
import { products, testPrompts } from "@/lib/mock-data";

export default function Home() {
  return (
    <main className="min-h-screen bg-white text-black">
      <div className="border-b border-zinc-200 bg-black px-4 py-2 text-center text-xs font-semibold uppercase tracking-[0.22em] text-white">
        Free shipping | Free returns | No hidden fees
      </div>

      <header className="sticky top-0 z-20 border-b border-zinc-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
          <a className="text-3xl font-black tracking-[0.18em]" href="#">
            SHEIN
          </a>
          <nav className="hidden items-center gap-7 text-sm font-semibold uppercase tracking-wide text-zinc-700 md:flex">
            <a href="#new">New In</a>
            <a href="#women">Women</a>
            <a href="#curve">Curve</a>
            <a href="#kids">Kids</a>
            <a href="#support">Support</a>
          </nav>
          <button className="rounded-full border border-black px-4 py-2 text-sm font-bold uppercase tracking-wide transition hover:bg-black hover:text-white">
            Shop sale
          </button>
        </div>
      </header>

      <section className="mx-auto grid max-w-7xl gap-8 px-4 py-8 lg:grid-cols-[1fr_500px] lg:items-start">
        <div className="space-y-8">
          <div className="grid min-h-[520px] overflow-hidden rounded-[2rem] border border-zinc-200 bg-zinc-950 text-white md:grid-cols-2">
            <div className="flex flex-col justify-between p-8 md:p-12">
              <div>
                <p className="mb-3 text-sm font-bold uppercase tracking-[0.3em] text-zinc-300">New season edit</p>
                <h1 className="text-5xl font-black leading-none tracking-tight md:text-7xl">
                  Trend drops for every cart.
                </h1>
                <p className="mt-5 max-w-md text-base leading-7 text-zinc-300">
                  Browse everyday basics, denim, dresses, and cozy layers with fast order support built into the
                  shopping experience.
                </p>
              </div>
              <div className="mt-8 flex flex-wrap gap-3">
                <a className="rounded-full bg-white px-6 py-3 text-sm font-black uppercase tracking-wide text-black" href="#new">
                  Shop new arrivals
                </a>
                <a className="rounded-full border border-white/50 px-6 py-3 text-sm font-black uppercase tracking-wide text-white" href="#support">
                  Get order help
                </a>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 bg-white p-3">
              {products.map((product, index) => (
                <div
                  key={product.name}
                  className="flex min-h-56 flex-col justify-end rounded-[1.5rem] bg-zinc-100 p-4 text-black"
                >
                  <div className="mb-6 grid h-24 place-items-center rounded-2xl bg-white text-center text-sm font-black uppercase tracking-widest shadow-sm">
                    {index === 0 ? "Basics" : index === 1 ? "Denim" : index === 2 ? "Street" : "Dresses"}
                  </div>
                  <p className="font-bold">{product.name}</p>
                  <p className="text-sm text-zinc-500">From ${product.price.toFixed(2)}</p>
                </div>
              ))}
            </div>
          </div>

          <section id="new" className="grid gap-4 sm:grid-cols-3">
            {["Flash Sale", "New Arrivals", "Easy Returns"].map((title, index) => (
              <div key={title} className="rounded-3xl border border-zinc-200 p-6">
                <p className="text-xs font-black uppercase tracking-[0.24em] text-zinc-500">SHEIN perks</p>
                <h2 className="mt-3 text-2xl font-black">{title}</h2>
                <p className="mt-2 text-sm leading-6 text-zinc-600">
                  {index === 0
                    ? "Limited-time pricing on everyday favorites."
                    : index === 1
                      ? "Fresh categories and trend-led edits."
                      : "Self-service support for returns, exchanges, and damaged items."}
                </p>
              </div>
            ))}
          </section>

          <section className="rounded-[2rem] bg-zinc-100 p-6">
            <div className="mb-5 flex items-end justify-between gap-4">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.24em] text-zinc-500">Training prompts</p>
                <h2 className="text-3xl font-black">Try the embedded support bot</h2>
              </div>
              <p className="hidden text-sm text-zinc-500 sm:block">Use an order ID and email from the mock data.</p>
            </div>
            <div className="grid gap-3 md:grid-cols-2">
              {testPrompts.map((prompt) => (
                <div key={prompt} className="rounded-2xl bg-white p-4 text-sm font-semibold shadow-sm">
                  {prompt}
                </div>
              ))}
            </div>
          </section>
        </div>

        <aside id="support" className="lg:sticky lg:top-24">
          <ChatPanel />
        </aside>
      </section>
    </main>
  );
}
