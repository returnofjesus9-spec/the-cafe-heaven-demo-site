import Image from "next/image";
import PageHero from "@/components/PageHero";
import Sprig from "@/components/Sprig";

export const metadata = {
  title: "Our Story | The Cafe Heaven",
  description:
    "The story, room and people behind The Cafe Heaven in Acharya Vihar, Bhubaneswar.",
};

export default function About() {
  return (
    <div>
      <PageHero
        eyebrow="Our Story"
        title="A room built around the pause"
        blurb="The Cafe Heaven opened in Acharya Vihar with a simple brief: build a cafe people would actually want to sit in."
      />

      {/* narrative */}
      <section className="bg-warm-white py-20 md:py-28">
        <div className="container-cafe grid md:grid-cols-12 gap-10 md:gap-16">
          <div className="md:col-span-5 relative">
            <div className="relative aspect-[4/5] w-full">
              <Image
                src="/images/counter.png"
                alt="Barista at the counter of The Cafe Heaven, with jars of pastries and cakes on display"
                fill
                className="object-cover"
                sizes="(min-width: 768px) 40vw, 90vw"
              />
            </div>
          </div>
          <div className="md:col-span-7 flex flex-col justify-center">
            <p className="font-utility uppercase tracking-[0.25em] text-teal-deep text-xs mb-4">
              How It Started
            </p>
            <h2 className="font-display text-3xl md:text-4xl leading-tight mb-6">
              Feel The Vibe isn&rsquo;t just a tagline
            </h2>
            <p className="text-teal-black/75 leading-relaxed mb-4">
              Set on a busy stretch of Acharya Vihar, The Cafe Heaven was
              designed as an escape from it — deep teal walls, hand-laid
              patterned flooring, arched blue lattice screens and plants
              hung low over every table. The instruction to the design
              team was straightforward: make people forget they&rsquo;re
              minutes from the main road.
            </p>
            <p className="text-teal-black/75 leading-relaxed mb-4">
              The kitchen follows the same instinct. Pizza dough is made
              in-house and hand-stretched to order. Cakes and pastries —
              tiramisu, blueberry cheesecake, celebration cakes — are baked
              on-site rather than brought in. It&rsquo;s a menu built for
              a cafe, not scaled down from a restaurant: coffee first,
              continental comfort food second, and dessert always.
            </p>
            <p className="text-teal-black/75 leading-relaxed">
              Since opening, the cafe has built a loyal, Instagram-active
              following (@the.cafeheaven) and a strong local reputation —
              rated 4.4 out of 5 across more than a thousand reviews on
              Justdial and Zomato, with regulars calling out the desserts,
              the pizza and the ambience in roughly equal measure.
            </p>
          </div>
        </div>
      </section>

      {/* values / what guests notice */}
      <section className="tile-pattern py-20 md:py-28">
        <div className="container-cafe">
          <div className="max-w-xl mb-14">
            <p className="font-utility uppercase tracking-[0.25em] text-teal-deep text-xs mb-3">
              What Guests Notice
            </p>
            <h2 className="font-display text-3xl md:text-[2.6rem] leading-tight">
              Three things people keep mentioning
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-10">
            <div>
              <h3 className="font-display text-xl mb-3 text-teal-deep">The room</h3>
              <p className="text-teal-black/70 leading-relaxed text-[0.97rem]">
                Soothing, unhurried and genuinely photogenic — teal
                arches, tile floors and greenery that make it easy to
                linger over a second coffee.
              </p>
            </div>
            <div>
              <h3 className="font-display text-xl mb-3 text-teal-deep">The dough</h3>
              <p className="text-teal-black/70 leading-relaxed text-[0.97rem]">
                Pizzas made on hand-stretched, in-house dough, with
                toppings happily customised — a detail regulars call out
                specifically.
              </p>
            </div>
            <div>
              <h3 className="font-display text-xl mb-3 text-teal-deep">The desserts</h3>
              <p className="text-teal-black/70 leading-relaxed text-[0.97rem]">
                Baked in-house. The tiramisu and blueberry cheesecake are
                the two guests mention most, alongside custom celebration
                cakes.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-warm-white py-16">
        <div className="container-cafe flex flex-col items-center text-center">
          <Sprig className="w-32 mb-8" tone="teal" />
          <p className="font-display italic text-2xl max-w-xl text-teal-deep">
            &ldquo;Good food, great ambience, memorable moments.&rdquo;
          </p>
          <p className="font-utility text-xs text-teal-black/50 mt-4 uppercase tracking-[0.2em]">
            The Cafe Heaven, on Instagram
          </p>
        </div>
      </section>
    </div>
  );
}
