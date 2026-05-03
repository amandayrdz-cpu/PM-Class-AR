import { Search, ShoppingBag, UserRound } from "lucide-react";
import { ChatPanel } from "@/components/chat-panel";
import { products, testPrompts } from "@/lib/mock-data";

const quickLinks = ["Hot Sellers", "New Arrivals", "Pro Accs"];
const heroSideBrands = ["ROMWE", "EMERY ROSE", "MOTF"];
const categories = [
  "Women",
  "Curve",
  "Kids",
  "Men",
  "Beachwear",
  "Tops",
  "Dresses",
  "Cell Phones & Accessories",
  "Shoes",
  "Jewelry & Accessories",
  "Home & Living",
  "Beauty & Health",
  "Sports & Outdoor",
  "Baby & Maternity",
  "Underwear & Sleepwear",
  "Toys & Games",
];

export default function Home() {
  return (
    <main className="min-h-screen bg-[#f3f3f3] text-black">
      <div className="border-b border-[#eadfcd] bg-[#fff6e8] px-4 py-1.5 text-[11px] font-semibold text-[#5b1f11]">
        <div className="mx-auto flex max-w-[1460px] items-center justify-center gap-10">
          <span>🚚 Free Shipping <em className="font-normal not-italic">*T&Cs apply</em></span>
          <span className="hidden h-4 w-px bg-[#d7c7ae] sm:block" />
          <span>🎁 Free Returns <em className="font-normal not-italic">On all orders *T&Cs apply</em></span>
          <span className="hidden h-4 w-px bg-[#d7c7ae] sm:block" />
          <span>💳 No Hidden Fees <em className="font-normal not-italic">Pricing & Tariff FAQ</em></span>
        </div>
      </div>

      <header className="sticky top-0 z-30 bg-black text-white shadow-sm">
        <div className="mx-auto flex max-w-[1460px] items-center gap-6 px-5 py-3">
          <a className="text-4xl font-black leading-none tracking-[0.22em]" href="#">
            SHEIN
          </a>
          <form className="mx-auto hidden w-full max-w-[470px] items-center overflow-hidden rounded-sm bg-white md:flex">
            <input className="h-9 flex-1 px-4 text-sm text-black outline-none" defaultValue="tops" aria-label="Search" />
            <button className="grid h-9 w-12 place-items-center bg-black text-white ring-1 ring-white" type="button">
              <Search className="h-5 w-5" />
            </button>
          </form>
          <div className="ml-auto flex items-center gap-4 text-white">
            <UserRound className="h-5 w-5" />
            <ShoppingBag className="h-5 w-5" />
            <span className="grid h-5 w-5 place-items-center rounded-full border border-white text-[10px]">?</span>
          </div>
        </div>
        <nav className="mx-auto flex max-w-[1460px] gap-5 overflow-x-auto whitespace-nowrap px-5 pb-2 text-[11px] text-zinc-100">
          {[
            "Categories",
            "New In",
            "Sale",
            "Women Clothing",
            "Beachwear",
            "Kids",
            "Curve",
            "Men Clothing",
            "Shoes",
            "Underwear & Sleepwear",
            "Home & Living",
            "Jewelry & Accessories",
            "Beauty & Health",
            "Baby & Maternity",
            "Bags & Luggage",
            "Sports & Outdoors",
            "Home Textiles",
            "Cell Phones",
          ].map((item) => (
            <a key={item} href={item === "Categories" ? "#categories" : "#new"} className="hover:text-[#ffdbe6]">
              {item}
            </a>
          ))}
        </nav>
      </header>

      <section className="mx-auto grid max-w-[1460px] gap-5 px-4 py-4 xl:grid-cols-[1fr_430px]">
        <div className="space-y-5">
          <section className="grid gap-3 lg:grid-cols-[250px_1fr_250px]">
            <div className="grid gap-3">
              {quickLinks.map((link, index) => (
                <a
                  key={link}
                  className="relative flex min-h-[70px] items-center overflow-hidden rounded-md bg-zinc-800 px-5 text-sm font-black text-white shadow-sm"
                  href="#new"
                >
                  <span className="absolute inset-0 bg-gradient-to-r from-black/70 to-transparent" />
                  <span
                    className={`absolute inset-y-0 right-0 w-32 ${
                      index === 0 ? "bg-sky-100" : index === 1 ? "bg-amber-100" : "bg-pink-300"
                    }`}
                  />
                  <span className="relative">{link}</span>
                </a>
              ))}
            </div>

            <div className="relative min-h-[230px] overflow-hidden rounded-md bg-[#ff9dbd] p-7 text-white shadow-sm">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_20%,rgba(255,255,255,.75),transparent_22rem),linear-gradient(120deg,#ff6fa4,#ffc1d5_58%,#ff8fab)]" />
              <div className="relative z-10 max-w-md">
                <p className="text-lg font-black uppercase tracking-[0.18em]">Mother&apos;s Day</p>
                <h1 className="text-5xl font-black uppercase leading-[0.9] tracking-tight">Gift Guide</h1>
                <button className="mt-16 bg-[#f05d89] px-10 py-2 text-xs font-black uppercase shadow-md">
                  Spoil mom now
                </button>
              </div>
              <div className="absolute right-8 top-8 grid grid-cols-2 gap-3">
                {products.slice(0, 2).map((product, index) => (
                  <div key={product.name} className="w-32 rounded-sm bg-white/80 p-2 text-center text-black shadow">
                    <div className="mb-2 h-24 rounded-sm bg-gradient-to-b from-zinc-100 to-pink-100" />
                    <p className="text-xs font-bold text-[#f05d2f]">${(product.price - index * 4.84).toFixed(2)}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid gap-3">
              {heroSideBrands.map((brand, index) => (
                <a
                  key={brand}
                  className="grid min-h-[70px] place-items-center rounded-md bg-zinc-700 text-center text-2xl font-light tracking-[0.18em] text-white shadow-sm"
                  href="#new"
                >
                  <span className={index === 1 ? "text-sm" : ""}>{brand}</span>
                </a>
              ))}
            </div>
          </section>

          <section id="categories" className="grid grid-cols-4 gap-x-3 gap-y-5 bg-[#f3f3f3] py-3 sm:grid-cols-6 lg:grid-cols-8">
            {categories.map((category, index) => (
              <a key={category} href="#new" className="group text-center text-xs leading-tight text-zinc-900">
                <div className="mx-auto mb-2 grid h-20 w-20 place-items-center overflow-hidden rounded-full bg-white shadow-sm transition group-hover:scale-105">
                  <div
                    className={`h-16 w-12 rounded-t-full ${
                      index % 5 === 0
                        ? "bg-zinc-200"
                        : index % 5 === 1
                          ? "bg-blue-100"
                          : index % 5 === 2
                            ? "bg-amber-100"
                            : index % 5 === 3
                              ? "bg-pink-100"
                              : "bg-emerald-100"
                    }`}
                  />
                </div>
                {category}
              </a>
            ))}
          </section>

          <section id="new" className="grid gap-4 md:grid-cols-3">
            {["Super Deals", "Top Trends", "Brand Zone"].map((title, index) => (
              <article key={title} className="overflow-hidden rounded-sm bg-white shadow-sm">
                <div className="flex items-center justify-between px-3 py-2">
                  <h2 className="text-lg font-black italic">
                    {title.split(" ")[0]} <span className="not-italic">{title.split(" ").slice(1).join(" ")}</span>
                  </h2>
                  <span className="text-xl">›</span>
                </div>
                <div className="grid grid-cols-2 gap-2 p-2 pt-0">
                  {products.slice(0, 2).map((product, productIndex) => (
                    <div key={`${title}-${product.name}`} className="bg-zinc-100 p-3">
                      <div className="mb-3 h-28 bg-gradient-to-br from-zinc-200 to-white" />
                      <p className="truncate text-xs font-semibold">{product.name}</p>
                      <p className="text-sm font-black text-[#f05d2f]">
                        ${(product.price * (index === 0 ? 0.7 : 1) - productIndex).toFixed(2)}
                      </p>
                    </div>
                  ))}
                </div>
              </article>
            ))}
          </section>

          <section className="rounded-sm bg-white p-4 shadow-sm">
            <div className="mb-3 flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.22em] text-zinc-500">Training prompts</p>
                <h2 className="text-2xl font-black">Try the embedded support bot</h2>
              </div>
              <p className="hidden text-sm text-zinc-500 sm:block">Use an order ID and email from the mock data.</p>
            </div>
            <div className="grid gap-2 md:grid-cols-2">
              {testPrompts.map((prompt) => (
                <div key={prompt} className="rounded-sm border border-zinc-200 bg-zinc-50 p-3 text-sm font-semibold">
                  {prompt}
                </div>
              ))}
            </div>
          </section>
        </div>

        <aside id="support" className="xl:sticky xl:top-28">
          <ChatPanel />
        </aside>
      </section>
    </main>
  );
}
