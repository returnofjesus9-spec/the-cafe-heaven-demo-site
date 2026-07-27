import Sprig from "./Sprig";

export default function PageHero({ eyebrow, title, blurb }) {
  return (
    <section className="bg-teal-black text-warm-white pt-16 pb-14 md:pt-24 md:pb-20">
      <div className="container-cafe text-center max-w-2xl mx-auto">
        {eyebrow && (
          <p className="font-utility uppercase tracking-[0.3em] text-brass text-xs mb-5">
            {eyebrow}
          </p>
        )}
        <h1 className="font-display text-4xl md:text-5xl leading-tight">{title}</h1>
        {blurb && (
          <p className="mt-5 text-warm-white/75 leading-relaxed">{blurb}</p>
        )}
        <Sprig className="w-28 mx-auto mt-9" tone="brass" />
      </div>
    </section>
  );
}
