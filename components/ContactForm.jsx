"use client";

import { useState } from "react";

const fieldClasses =
  "w-full bg-transparent border-b border-teal-black/25 focus:border-brass outline-none py-2.5 placeholder:text-teal-black/40 transition-colors";

export default function ContactForm() {
  const [status, setStatus] = useState("idle"); // idle | sent

  function handleSubmit(e) {
    e.preventDefault();
    setStatus("sent");
  }

  if (status === "sent") {
    return (
      <div className="border border-brass/40 bg-cream/40 p-8">
        <p className="font-display text-xl text-teal-deep mb-2">
          Thanks — got it.
        </p>
        <p className="text-teal-black/70 leading-relaxed">
          This is a demo form, so nothing was actually sent. For a real
          reply, please call{" "}
          <a href="tel:+917853868956" className="underline-brass text-teal-deep">
            078538 68956
          </a>{" "}
          or message on{" "}
          <a
            href="https://www.instagram.com/the.cafeheaven/?hl=en"
            target="_blank"
            rel="noreferrer"
            className="underline-brass text-teal-deep"
          >
            Instagram
          </a>
          .
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6" noValidate>
      <div>
        <label htmlFor="name" className="block text-xs font-utility uppercase tracking-[0.2em] text-teal-black/50 mb-2">
          Name
        </label>
        <input id="name" name="name" type="text" required placeholder="Your name" className={fieldClasses} />
      </div>

      <div>
        <label htmlFor="phone" className="block text-xs font-utility uppercase tracking-[0.2em] text-teal-black/50 mb-2">
          Phone
        </label>
        <input id="phone" name="phone" type="tel" required placeholder="10-digit number" className={fieldClasses} />
      </div>

      <div>
        <label htmlFor="message" className="block text-xs font-utility uppercase tracking-[0.2em] text-teal-black/50 mb-2">
          Message
        </label>
        <textarea
          id="message"
          name="message"
          rows={4}
          placeholder="Table for four, this Saturday evening — or a birthday booking enquiry"
          className={fieldClasses + " resize-none"}
        />
      </div>

      <button
        type="submit"
        className="bg-teal-deep text-warm-white px-7 py-3.5 font-medium tracking-wide hover:bg-teal-black transition-colors"
      >
        Send Enquiry
      </button>
    </form>
  );
}
