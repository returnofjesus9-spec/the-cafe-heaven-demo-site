import PageHero from "@/components/PageHero";
import ContactForm from "@/components/ContactForm";

export const metadata = {
  title: "Contact | The Cafe Heaven",
  description:
    "Visit, call or message The Cafe Heaven in Acharya Vihar, Bhubaneswar — 751013.",
};

export default function Contact() {
  return (
    <div>
      <PageHero
        eyebrow="Visit Us"
        title="Come say hello"
        blurb="In Acharya Vihar, open every day. Calls, walk-ins and party bookings all welcome."
      />

      <section className="bg-warm-white py-16 md:py-24">
        <div className="container-cafe grid md:grid-cols-2 gap-14">
          <div>
            <h2 className="font-display text-2xl mb-8 text-teal-deep">
              Details
            </h2>

            <dl className="space-y-7 text-[1.02rem]">
              <div>
                <dt className="font-utility uppercase tracking-[0.2em] text-xs text-teal-black/50 mb-1">
                  Address
                </dt>
                <dd className="leading-relaxed">
                  The Cafe Heaven
                  <br />
                  Acharya Vihar, Bhubaneswar
                  <br />
                  Odisha — 751013
                </dd>
              </div>

              <div>
                <dt className="font-utility uppercase tracking-[0.2em] text-xs text-teal-black/50 mb-1">
                  Phone
                </dt>
                <dd>
                  <a href="tel:+917853868956" className="underline-brass text-teal-deep font-medium">
                    078538 68956
                  </a>
                </dd>
              </div>

              <div>
                <dt className="font-utility uppercase tracking-[0.2em] text-xs text-teal-black/50 mb-1">
                  Instagram
                </dt>
                <dd>
                  <a
                    href="https://www.instagram.com/the.cafeheaven/?hl=en"
                    target="_blank"
                    rel="noreferrer"
                    className="underline-brass text-teal-deep font-medium"
                  >
                    @the.cafeheaven
                  </a>
                </dd>
              </div>

              <div>
                <dt className="font-utility uppercase tracking-[0.2em] text-xs text-teal-black/50 mb-1">
                  Hours
                </dt>
                <dd>Every day, 11:00 AM – 10:00 PM</dd>
              </div>

              <div>
                <dt className="font-utility uppercase tracking-[0.2em] text-xs text-teal-black/50 mb-1">
                  Good to know
                </dt>
                <dd className="text-teal-black/70 leading-relaxed">
                  The cafe hosts small birthday parties and celebrations —
                  call ahead to check availability and any advance
                  notice needed.
                </dd>
              </div>
            </dl>

            <div className="mt-10 aspect-[4/3] w-full border border-teal-black/10">
              <iframe
                title="Map to The Cafe Heaven, Acharya Vihar, Bhubaneswar"
                src="https://maps.google.com/maps?q=The%20Cafe%20Heaven%20Acharya%20Vihar%20Bhubaneswar&t=&z=15&ie=UTF8&iwloc=&output=embed"
                className="w-full h-full"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>

          <div>
            <h2 className="font-display text-2xl mb-8 text-teal-deep">
              Send an enquiry
            </h2>
            <ContactForm />
          </div>
        </div>
      </section>
    </div>
  );
}
