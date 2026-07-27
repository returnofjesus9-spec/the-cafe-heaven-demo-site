import Image from "next/image";
import Link from "next/link";
import Sprig from "@/components/Sprig";

const CATEGORIES = [
  {
    name: "Coffee & Cold Brews",
    desc: "Espresso-based classics, macchiatos, cold coffee and iced brews — the reason regulars keep a table.",
    accent: "brass",
  },
  {
    name: "Continental Plates",
    desc: "Pastas, sizzlers and all-day breakfast built for slow mornings and long conversations.",
    accent: "teal",
  },
  {
    name: "Wood-Style Pizza & Burgers",
    desc: "House-made dough, hand-stretched, with toppings customised on request.",
    accent: "cherry",
  },
  {
    name: "Cakes & Desserts",
    desc: "In-house tiramisu, blueberry cheesecake and celebration cakes for the table.",
    accent: "leaf",
  },
];

const DISHES = [
  {
    name: "Margherita Pizza",
    note: "Hand-stretched house dough, san marzano base, fresh basil.",
    price: "₹329",
  },
  {
    name: "Spicy Chicken Pizza",
    note: "House dough, char-grilled chicken, chilli oil drizzle.",
    price: "₹379",
  },
  {
    name: "Blueberry Cheesecake",
    note: "Baked in-house, blueberry compote, biscuit crumb base.",
    price: "₹199",
  },
  {
    name: "Classic Tiramisu",
    note: "Espresso-soaked ladyfingers, mascarpone, cocoa dust.",
    price: "₹219",
  },
];

export default function Home() {
  return (
    <div>
      {/* HERO */}
      <section className="relative bg-teal-black text-warm-white overflow-hidden">
        <div className="container-cafe grid md:grid-cols-2 gap-0 md:gap-12 items-stretch">
          <div className="py-16 md:py-28 flex flex-col justify-center relative z-10 order-2 md:order-1">
            <p className="font-utility uppercase tracking-[0.3em] text-brass text-xs mb-6">
              Acharya Vihar &middot; Bhubaneswar
            </p>
            <h1 className="font-display leading-[0.95] text-[3rem] sm:text-[3.6rem] md:text-[4.2rem]">
              Feel <span className="italic font-medium text-brass">the</span>
              <br />
              Vibe.
            </h1>
            <p className="mt-6 max-w-md text-warm-white/80 text-[1.05rem] leading-relaxed">
              A tiled, plant-hung room built for long coffees and slower
              plates — continental food, wood-style pizza, burgers and
              cake, made for a table full of people who are in no hurry
              to leave.
            </p>

            <div className="mt-9 flex flex-wrap items-center gap-4">
              <Link
                href="/menu"
                className="bg-brass text-teal-black px-7 py-3.5 font-body font-medium tracking-wide hover:bg-brass-light transition-colors"
              >
                View the Menu
              </Link>
              <a
                href="https://maps.google.com/?q=The+Cafe+Heaven+Acharya+Vihar+Bhubaneswar"
                target="_blank"
                rel="noreferrer"
                className="underline-brass text-warm-white px-1 py-3.5 font-body tracking-wide"
              >
                Get Directions →
              </a>
            </div>

            <div className="mt-12 flex items-center gap-4 text-sm text-warm-white/70">
              <span className="font-utility text-brass text-base">4.4★</span>
              <span>1,000+ ratings across Justdial &amp; Zomato</span>
            </div>
          </div>

          <div className="relative order-1 md:order-2 min-h-[300px] md:min-h-0">
            <Image
              src="/images/storefront.png"
              alt="The Cafe Heaven storefront sign, lit up in teal and gold, Acharya Vihar, Bhubaneswar"
              fill
              priority
              className="object-cover"
              sizes="(min-width: 768px) 50vw, 100vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-teal-black/70 via-transparent to-transparent md:bg-gradient-to-l md:from-transparent md:via-transparent md:to-teal-black/10" />
          </div>
        </div>

        {/* faint oversized ring motif, signature element echoed large */}
        <svg
          viewBox="0 0 400 60"
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-10 left-1/2 -translate-x-1/2 w-[140%] max-w-none opacity-[0.06] md:opacity-[0.08]"
        >
          <circle cx="200" cy="24" r="17" stroke="#C9A667" strokeWidth="1.4" fill="none" />
        </svg>
      </section>

      {/* CATEGORIES */}
      <section className="tile-pattern py-20 md:py-28">
        <div className="container-cafe">
          <div className="max-w-xl">
            <p className="font-utility uppercase tracking-[0.25em] text-teal-deep text-xs mb-3">
              What&rsquo;s On The Table
            </p>
            <h2 className="font-display text-3xl md:text-[2.6rem] leading-tight">
              Four things we take seriously
            </h2>
          </div>

          <div className="mt-12 grid sm:grid-cols-2 gap-px bg-teal-black/10 border border-teal-black/10">
            {CATEGORIES.map((c) => (
              <div
                key={c.name}
                className="bg-warm-white p-8 md:p-10 relative"
              >
                <span
                  className="block w-8 h-[3px] mb-5"
                  style={{
                    background:
                      c.accent === "brass"
                        ? "#C9A667"
                        : c.accent === "teal"
                        ? "#0B6E7C"
                        : c.accent === "cherry"
                        ? "#B23A2E"
                        : "#4C8C4A",
                  }}
                />
                <h3 className="font-display text-xl mb-2">{c.name}</h3>
                <p className="text-teal-black/70 leading-relaxed text-[0.97rem]">
                  {c.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SIGNATURE DISHES */}
      <section className="bg-warm-white py-20 md:py-28">
        <div className="container-cafe">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12">
            <div>
              <p className="font-utility uppercase tracking-[0.25em] text-teal-deep text-xs mb-3">
                Regulars Order These
              </p>
              <h2 className="font-display text-3xl md:text-[2.6rem] leading-tight max-w-lg">
                Dishes that keep showing up in the reviews
              </h2>
            </div>
            <Link href="/menu" className="underline-brass text-teal-deep font-medium whitespace-nowrap">
              See full menu →
            </Link>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {DISHES.map((d) => (
              <div
                key={d.name}
                className="border border-teal-black/15 p-6 flex flex-col justify-between min-h-[180px] hover:border-brass transition-colors"
              >
                <div>
                  <h3 className="font-display text-lg leading-snug">{d.name}</h3>
                  <p className="text-teal-black/65 text-sm mt-2 leading-relaxed">
                    {d.note}
                  </p>
                </div>
                <p className="font-utility text-brass mt-6 text-sm">{d.price}</p>
              </div>
            ))}
          </div>
          <p className="text-xs text-teal-black/45 mt-6">
            Prices are indicative estimates for this demo, based on the
            cafe&rsquo;s positioning — confirm current pricing on the menu
            in-store or via Zomato/Swiggy.
          </p>
        </div>
      </section>

      {/* AMBIENCE */}
      <section className="bg-teal-deep text-warm-white py-20 md:py-28 overflow-hidden">
        <div className="container-cafe grid md:grid-cols-2 gap-12 md:gap-16 items-center">
          <div className="relative order-2 md:order-1 aspect-[4/5] w-full">
            <Image
              src="/images/interior.png"
              alt="Interior of The Cafe Heaven with patterned tile floor, teal arches and hanging plants"
              fill
              className="object-cover"
              sizes="(min-width: 768px) 45vw, 90vw"
            />
          </div>
          <div className="order-1 md:order-2">
            <p className="font-utility uppercase tracking-[0.25em] text-brass text-xs mb-3">
              The Room
            </p>
            <h2 className="font-display text-3xl md:text-[2.6rem] leading-tight mb-6">
              Tile underfoot, green overhead
            </h2>
            <p className="text-warm-white/85 leading-relaxed mb-4">
              Deep teal arches, patterned flooring and plants hung low over
              every table — the room is designed to be photographed, but
              built to be lingered in. Visitors regularly mention the
              ambience as soothing and unhurried, whether it&rsquo;s a
              solo coffee or a table for eight.
            </p>
            <p className="text-warm-white/85 leading-relaxed">
              The cafe also takes birthday parties and small celebrations
              — worth a call ahead if you&rsquo;re planning one.
            </p>
            <Link
              href="/gallery"
              className="underline-brass text-brass inline-block mt-6 font-medium"
            >
              Walk through the gallery →
            </Link>
          </div>
        </div>
      </section>

      {/* REVIEWS */}
      <section className="bg-warm-white py-20 md:py-28">
        <div className="container-cafe">
          <Sprig className="w-32 mb-10" tone="brass" />
          <div className="grid md:grid-cols-3 gap-10">
            <blockquote className="border-l-2 border-brass pl-5">
              <p className="font-display text-lg leading-relaxed italic">
                &ldquo;Fresh, hand-stretched pizza and a cosy room — a
                good stop with the kids for a quick, satisfying meal.&rdquo;
              </p>
              <cite className="not-italic text-sm text-teal-black/60 mt-3 block font-utility">
                — Google reviewer
              </cite>
            </blockquote>
            <blockquote className="border-l-2 border-brass pl-5">
              <p className="font-display text-lg leading-relaxed italic">
                &ldquo;The blueberry cheesecake and tiramisu were genuinely
                impressive — the kind of desserts you go back for.&rdquo;
              </p>
              <cite className="not-italic text-sm text-teal-black/60 mt-3 block font-utility">
                — Zomato reviewer
              </cite>
            </blockquote>
            <blockquote className="border-l-2 border-brass pl-5">
              <p className="font-display text-lg leading-relaxed italic">
                &ldquo;Warm, tasteful decor and prompt service — flavours
                were well balanced and nicely presented.&rdquo;
              </p>
              <cite className="not-italic text-sm text-teal-black/60 mt-3 block font-utility">
                — Wanderlog reviewer
              </cite>
            </blockquote>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-teal-black text-warm-white py-20 md:py-24">
        <div className="container-cafe text-center max-w-2xl mx-auto">
          <Image
            src="/images/logo.png"
            alt="The Cafe Heaven logo"
            width={72}
            height={72}
            className="mx-auto mb-8 rounded-full"
          />
          <h2 className="font-display text-3xl md:text-4xl mb-5">
            Come feel it for yourself
          </h2>
          <p className="text-warm-white/75 leading-relaxed mb-9">
            Acharya Vihar, Bhubaneswar — 751013. Open daily, 11 AM to 10 PM.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a
              href="tel:+917853868956"
              className="bg-brass text-teal-black px-7 py-3.5 font-medium tracking-wide hover:bg-brass-light transition-colors"
            >
              Call 078538 68956
            </a>
            <a
              href="https://www.instagram.com/the.cafeheaven/?hl=en"
              target="_blank"
              rel="noreferrer"
              className="border border-brass text-brass px-7 py-3.5 font-medium tracking-wide hover:bg-brass hover:text-teal-black transition-colors"
            >
              @the.cafeheaven
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
