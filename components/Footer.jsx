import Link from "next/link";
import Sprig from "./Sprig";

export default function Footer() {
  return (
    <footer className="bg-teal-black text-warm-white pt-16 pb-8">
      <div className="container-cafe">
        <Sprig className="w-40 mx-auto mb-10" tone="brass" />

        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 md:gap-8 text-sm">
          <div>
            <p className="font-display text-xl mb-3">The Cafe Heaven</p>
            <p className="text-warm-white/70 leading-relaxed">
              An all-day cafe for continental plates, wood-fired pizza,
              cold brews and cake — tucked into Acharya Vihar, Bhubaneswar.
            </p>
          </div>

          <div>
            <p className="font-utility uppercase tracking-[0.2em] text-brass text-xs mb-3">
              Find Us
            </p>
            <address className="not-italic text-warm-white/80 leading-relaxed">
              Acharya Vihar, Bhubaneswar
              <br />
              Odisha — 751013
            </address>
            <a
              href="https://maps.google.com/?q=The+Cafe+Heaven+Acharya+Vihar+Bhubaneswar"
              target="_blank"
              rel="noreferrer"
              className="underline-brass inline-block mt-2 text-brass"
            >
              Get directions →
            </a>
          </div>

          <div>
            <p className="font-utility uppercase tracking-[0.2em] text-brass text-xs mb-3">
              Hours
            </p>
            <ul className="text-warm-white/80 space-y-1">
              <li className="flex justify-between gap-4">
                <span>Every day</span>
                <span className="font-utility">11:00 – 22:00</span>
              </li>
            </ul>
            <p className="text-warm-white/50 text-xs mt-2">
              Hours as listed on Justdial; do call ahead for late visits.
            </p>
          </div>

          <div>
            <p className="font-utility uppercase tracking-[0.2em] text-brass text-xs mb-3">
              Reach Us
            </p>
            <a href="tel:+917853868956" className="block underline-brass text-warm-white/90 mb-2">
              078538 68956
            </a>
            <a
              href="https://www.instagram.com/the.cafeheaven/?hl=en"
              target="_blank"
              rel="noreferrer"
              className="block underline-brass text-warm-white/90"
            >
              @the.cafeheaven
            </a>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-warm-white/10 flex flex-col md:flex-row justify-between items-center gap-3 text-xs text-warm-white/50">
          <p>© {new Date().getFullYear()} The Cafe Heaven, Bhubaneswar. Feel The Vibe.</p>
          <nav className="flex gap-5">
            <Link href="/menu" className="hover:text-brass">Menu</Link>
            <Link href="/gallery" className="hover:text-brass">Gallery</Link>
            <Link href="/contact" className="hover:text-brass">Contact</Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}
