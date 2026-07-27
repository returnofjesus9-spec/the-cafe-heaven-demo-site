import "@fontsource/fraunces/400.css";
import "@fontsource/fraunces/500.css";
import "@fontsource/fraunces/600.css";
import "@fontsource/fraunces/700.css";
import "@fontsource/fraunces/900.css";
import "@fontsource/fraunces/500-italic.css";
import "@fontsource/fraunces/600-italic.css";
import "@fontsource/work-sans/400.css";
import "@fontsource/work-sans/500.css";
import "@fontsource/work-sans/600.css";
import "@fontsource/work-sans/700.css";
import "@fontsource/ibm-plex-mono/400.css";
import "@fontsource/ibm-plex-mono/500.css";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata = {
  title: "The Cafe Heaven | Bhubaneswar — Feel The Vibe",
  description:
    "The Cafe Heaven is a boutique all-day cafe in Acharya Vihar, Bhubaneswar, serving continental cuisine, wood-fired pizza, burgers, coffee and cakes in a warm, tiled, plant-filled room. Feel the vibe.",
  keywords: [
    "The Cafe Heaven",
    "Bhubaneswar cafe",
    "Acharya Vihar cafe",
    "best cafe Bhubaneswar",
    "continental food Bhubaneswar",
  ],
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col bg-warm-white text-teal-black antialiased">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
