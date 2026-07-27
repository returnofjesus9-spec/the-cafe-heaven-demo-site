import Image from "next/image";
import PageHero from "@/components/PageHero";

export const metadata = {
  title: "Gallery | The Cafe Heaven",
  description:
    "A look inside The Cafe Heaven — storefront, interiors and counter, Acharya Vihar, Bhubaneswar.",
};

const PHOTOS = [
  {
    src: "/images/storefront.png",
    alt: "The Cafe Heaven storefront sign lit up at dusk, Acharya Vihar",
    span: "md:col-span-2 md:row-span-2",
  },
  {
    src: "/images/interior.png",
    alt: "Dining area with patterned tile floor, teal arched screens and hanging plants",
    span: "",
  },
  {
    src: "/images/counter.png",
    alt: "Pastry counter with jars, cakes and the coffee bar in the background",
    span: "",
  },
  {
    src: "/images/logo.png",
    alt: "The Cafe Heaven logo mark",
    span: "",
  },
];

export default function Gallery() {
  return (
    <div>
      <PageHero
        eyebrow="Gallery"
        title="A look inside"
        blurb="Teal arches, patterned tile and low-hung plants — a room built to be sat in as much as photographed."
      />

      <section className="bg-warm-white py-14 md:py-20">
        <div className="container-cafe">
          <div className="grid grid-cols-2 md:grid-cols-4 auto-rows-[180px] md:auto-rows-[220px] gap-3 md:gap-4">
            {PHOTOS.map((p) => (
              <div
                key={p.src}
                className={`relative overflow-hidden ${p.span} group`}
              >
                <Image
                  src={p.src}
                  alt={p.alt}
                  fill
                  className={`transition-transform duration-500 group-hover:scale-105 ${
                    p.src.includes("logo") ? "object-contain bg-teal-black p-6" : "object-cover"
                  }`}
                  sizes="(min-width: 768px) 25vw, 50vw"
                />
              </div>
            ))}
          </div>

          <p className="text-sm text-teal-black/55 mt-10 max-w-lg">
            More photos and reels are posted regularly on{" "}
            <a
              href="https://www.instagram.com/the.cafeheaven/?hl=en"
              target="_blank"
              rel="noreferrer"
              className="underline-brass text-teal-deep"
            >
              @the.cafeheaven
            </a>{" "}
            — follow along for new dishes, offers and events.
          </p>
        </div>
      </section>
    </div>
  );
}
