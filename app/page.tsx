import { Heart, Search, ShoppingBag, UserRound } from "lucide-react";
import { ChatPanel } from "@/components/chat-panel";
import { products, testPrompts } from "@/lib/mock-data";

const image = (id: string) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=600&q=80`;

const quickLinks = [
  { label: "Hot Sellers", image: image("photo-1483985988355-763728e1935b") },
  { label: "New Arrivals", image: image("photo-1529139574466-a303027c1d8b") },
  { label: "Pro Accs", image: image("photo-1515562141207-7a88fb7ce338") },
];

const heroProducts = [
  { name: "Crochet Set", price: "$2.16", image: image("photo-1515886657613-9f3515b0c78f") },
  { name: "Blue Knit Co-ord", price: "$36.68", image: image("photo-1503342217505-b0a15ec3261c") },
];

const heroSideBrands = [
  { name: "ROMWE", image: image("photo-1524504388940-b1c1722653e1") },
  { name: "EMERY ROSE", image: image("photo-1496747611176-843222e1e57c") },
  { name: "MOTF", image: image("photo-1469334031218-e382a71b716b") },
];

const categories = [
  { name: "Women", image: image("photo-1529139574466-a303027c1d8b") },
  { name: "Curve", image: image("photo-1524504388940-b1c1722653e1") },
  { name: "Kids", image: image("photo-1503919545889-aef636e10ad4") },
  { name: "Men", image: image("photo-1516257984-b1b4d707412e") },
  { name: "Beachwear", image: image("photo-1515886657613-9f3515b0c78f") },
  { name: "Tops", image: image("photo-1503342217505-b0a15ec3261c") },
  { name: "Dresses", image: image("photo-1515372039744-b8f02a3ae446") },
  { name: "Cell Phones & Accessories", image: image("photo-1601784551446-20c9e07cdbdb") },
  { name: "Shoes", image: image("photo-1542291026-7eec264c27ff") },
  { name: "Jewelry & Accessories", image: image("photo-1515562141207-7a88fb7ce338") },
  { name: "Home & Living", image: image("photo-1513519245088-0e12902e5a38") },
  { name: "Beauty & Health", image: image("photo-1522335789203-aabd1fc54bc9") },
  { name: "Sports & Outdoor", image: image("photo-1518611012118-696072aa579a") },
  { name: "Baby & Maternity", image: image("photo-1503454537195-1dcabb73ffb9") },
  { name: "Underwear & Sleepwear", image: image("photo-1509631179647-0177331693ae") },
  { name: "Toys & Games", image: image("photo-1566576912321-d58ddd7a6088") },
];

const dealGroups = [
  {
    title: "Super Deals",
    badge: "Daily drops",
    items: [
      { name: "Classic White T-Shirt", image: image("photo-1521572163474-6864f9cf17ab"), price: "$13.99" },
      { name: "High Waisted Jeans", image: image("photo-1541099649105-f69ad21f3246"), price: "$48.99" },
    ],
  },
  {
    title: "Top Trends",
    badge: "Most wanted",
    items: [
      { name: "Oversized Hoodie", image: image("photo-1556821840-3a63f95609a7"), price: "$34.99" },
      { name: "Summer Dress", image: image("photo-1515372039744-b8f02a3ae446"), price: "$41.99" },
    ],
  },
  {
    title: "Brand Zone",
    badge: "Editors pick",
    items: [
      { name: "Beauty Minis", image: image("photo-1522335789203-aabd1fc54bc9"), price: "$8.99" },
      { name: "Tech Accessories", image: image("photo-1601784551446-20c9e07cdbdb"), price: "$11.99" },
    ],
  },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-[#f3f3f3] text-black">
      <div className="border-b border-[#eadfcd] bg-[#fff6e8] px-4 py-1.5 text-[11px] font-semibold text-[#5b1f11]">
        <div className="mx-auto flex max-w-[1460px] items-center justify-center gap-10">
          <span>Free Shipping <em className="font-normal not-italic">*T&Cs apply</em></span>
          <span className="hidden h-4 w-px bg-[#d7c7ae] sm:block" />
          <span>Free Returns <em className="font-normal not-italic">On all orders *T&Cs apply</em></span>
          <span className="hidden h-4 w-px bg-[#d7c7ae] sm:block" />
          <span>No Hidden Fees <em className="font-normal not-italic">Pricing & Tariff FAQ</em></span>
        </div>
      </div>

      <header className="sticky top-0 z-30 bg-black text-white shadow-sm">
        <div className="mx-auto flex max-w-[1460px] items-center gap-6 px-5 py-3">
          <a className="text-4xl font-black leading-none tracking-[0.22em]" href="#">
            SHEIN
          </a>
          <form className="mx-auto hidden w-full max-w-[470px] items-center overflow-hidden rounded-sm bg-white md:flex">
            <input className="h-9 flex-1 px-4 text-sm text-black outline-none" defaultValue="bikini" aria-label="Search" />
            <button className="grid h-9 w-12 place-items-center bg-black text-white ring-1 ring-white" type="button">
              <Search className="h-5 w-5" />
            </button>
          </form>
          <div className="ml-auto flex items-center gap-4 text-white">
            <UserRound className="h-5 w-5" />
            <ShoppingBag className="h-5 w-5" />
            <Heart className="h-5 w-5" />
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
              {quickLinks.map((link) => (
                <a
                  key={link.label}
                  className="relative flex min-h-[70px] items-center overflow-hidden rounded-md bg-zinc-800 px-5 text-sm font-black text-white shadow-sm"
                  href="#new"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={link.image} alt="" className="absolute inset-0 h-full w-full object-cover" />
                  <span className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/30 to-transparent" />
                  <span className="relative">{link.label}</span>
                </a>
              ))}
            </div>

            <div className="relative min-h-[230px] overflow-hidden rounded-md bg-[#ff9dbd] p-7 text-white shadow-sm">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={image("photo-1496747611176-843222e1e57c")}
                alt=""
                className="absolute inset-y-0 left-0 h-full w-1/2 object-cover opacity-85"
              />
              <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(255,188,204,.45),#ffc3d4_42%,#ff91b0)]" />
              <div className="relative z-10 ml-[30%] max-w-md text-center">
                <p className="text-xs font-black uppercase tracking-[0.2em] text-[#d93664]">#SHEIN MothersDay</p>
                <p className="text-lg font-black uppercase text-[#d93664]">Mom&apos;s Day Deals</p>
                <h1 className="text-7xl font-black uppercase leading-[0.75] tracking-tight text-[#ff4f75]">
                  90<span className="text-3xl">% off</span>
                </h1>
                <button className="mt-5 bg-black px-10 py-2 text-xs font-black uppercase text-white shadow-md">
                  Shop the sale
                </button>
              </div>
              <div className="absolute right-5 top-7 grid grid-cols-2 gap-3">
                {heroProducts.map((product) => (
                  <div key={product.name} className="w-32 rounded-sm bg-white/90 p-2 text-center text-black shadow">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={product.image} alt="" className="mb-2 h-24 w-full rounded-sm object-cover" />
                    <p className="text-xs font-bold text-[#f05d2f]">{product.price}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid gap-3">
              {heroSideBrands.map((brand, index) => (
                <a
                  key={brand.name}
                  className="relative grid min-h-[70px] place-items-center overflow-hidden rounded-md bg-zinc-700 text-center text-2xl font-light tracking-[0.18em] text-white shadow-sm"
                  href="#new"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={brand.image} alt="" className="absolute inset-0 h-full w-full object-cover" />
                  <span className="absolute inset-0 bg-black/35" />
                  <span className={`relative ${index === 1 ? "text-sm" : ""}`}>{brand.name}</span>
                </a>
              ))}
            </div>
          </section>

          <section id="categories" className="grid grid-cols-4 gap-x-3 gap-y-5 bg-[#f3f3f3] py-3 sm:grid-cols-6 lg:grid-cols-8">
            {categories.map((category) => (
              <a key={category.name} href="#new" className="group text-center text-xs leading-tight text-zinc-900">
                <div className="mx-auto mb-2 h-20 w-20 overflow-hidden rounded-full bg-white shadow-sm transition group-hover:scale-105">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={category.image} alt="" className="h-full w-full object-cover" />
                </div>
                {category.name}
              </a>
            ))}
          </section>

          <section id="new" className="grid gap-4 md:grid-cols-3">
            {dealGroups.map((group) => (
              <article key={group.title} className="overflow-hidden rounded-sm bg-white shadow-sm">
                <div className="flex items-center justify-between px-3 py-2">
                  <div>
                    <h2 className="text-lg font-black italic">
                      {group.title.split(" ")[0]} <span className="not-italic">{group.title.split(" ").slice(1).join(" ")}</span>
                    </h2>
                    <p className="text-[10px] font-bold uppercase tracking-wide text-zinc-500">{group.badge}</p>
                  </div>
                  <span className="text-xl">›</span>
                </div>
                <div className="grid grid-cols-2 gap-2 p-2 pt-0">
                  {group.items.map((item) => (
                    <div key={`${group.title}-${item.name}`} className="bg-zinc-100 p-2">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={item.image} alt="" className="mb-3 h-32 w-full object-cover" />
                      <p className="truncate text-xs font-semibold">{item.name}</p>
                      <p className="text-sm font-black text-[#f05d2f]">{item.price}</p>
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
