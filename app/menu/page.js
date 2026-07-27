import PageHero from "@/components/PageHero";
import Sprig from "@/components/Sprig";

export const metadata = {
  title: "Menu | The Cafe Heaven",
  description:
    "Coffee, continental plates, wood-style pizza, burgers and in-house cakes at The Cafe Heaven, Acharya Vihar, Bhubaneswar.",
};

const MENU = [
  {
    section: "Coffee & Cold Brews",
    items: [
      { name: "Cafe Americano", price: "₹129" },
      { name: "Cappuccino", price: "₹149" },
      { name: "Macchiato", price: "₹159" },
      { name: "Cold Coffee", price: "₹179" },
      { name: "Hazelnut Cold Brew", price: "₹199" },
      { name: "Iced Caramel Latte", price: "₹199" },
    ],
  },
  {
    section: "All-Day Breakfast & Continental",
    items: [
      { name: "Classic Eggs Benedict", price: "₹249" },
      { name: "French Toast, Maple Syrup", price: "₹199" },
      { name: "Peri-Peri Alfredo Pasta", price: "₹279" },
      { name: "Mushroom & Spinach Sizzler", price: "₹319" },
      { name: "Grilled Cheese Sandwich", price: "₹189" },
    ],
  },
  {
    section: "Wood-Style Pizza",
    items: [
      { name: "Margherita, House Dough", price: "₹329" },
      { name: "Spicy Chicken Pizza", price: "₹379" },
      { name: "Farmhouse Veggie", price: "₹349" },
      { name: "Peri-Peri Paneer", price: "₹359" },
    ],
  },
  {
    section: "Burgers & Fast Food",
    items: [
      { name: "Classic Crispy Chicken Burger", price: "₹219" },
      { name: "Smoky BBQ Paneer Burger", price: "₹199" },
      { name: "Loaded Nachos", price: "₹229" },
      { name: "Peri-Peri Fries", price: "₹149" },
    ],
  },
  {
    section: "Cakes & Desserts",
    items: [
      { name: "Blueberry Cheesecake", price: "₹199" },
      { name: "Classic Tiramisu", price: "₹219" },
      { name: "Belgian Chocolate Pastry", price: "₹159" },
      { name: "Celebration Cakes (whole, on order)", price: "From ₹699" },
    ],
  },
];

function MenuSection({ section, items }) {
  return (
    <div className="py-10 border-b border-teal-black/10 last:border-0">
      <h2 className="font-display text-2xl md:text-[1.7rem] text-teal-deep mb-6">
        {section}
      </h2>
      <ul className="space-y-4">
        {items.map((item) => (
          <li
            key={item.name}
            className="flex items-baseline gap-3"
          >
            <span className="font-body text-[1.02rem]">{item.name}</span>
            <span
              className="flex-1 border-b border-dotted border-teal-black/25 translate-y-[-4px]"
              aria-hidden="true"
            />
            <span className="font-utility text-brass text-sm shrink-0">
              {item.price}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function Menu() {
  return (
    <div>
      <PageHero
        eyebrow="The Menu"
        title="Coffee, comfort food & cake"
        blurb="A shorter, considered card built around what the kitchen does well — not a menu trying to be everything."
      />

      <section className="bg-warm-white py-4 md:py-8">
        <div className="container-cafe max-w-3xl mx-auto">
          {MENU.map((m) => (
            <MenuSection key={m.section} {...m} />
          ))}

          <div className="pt-10 flex flex-col items-center text-center">
            <Sprig className="w-28 mb-6" tone="teal" />
            <p className="text-sm text-teal-black/55 max-w-md leading-relaxed">
              This is a representative menu built for the demo site from
              the cafe&rsquo;s known categories and standout dishes;
              prices are indicative estimates in line with the cafe&rsquo;s
              positioning. For the current, exact menu and pricing, order
              via Zomato or Swiggy, or call{" "}
              <a href="tel:+917853868956" className="underline-brass text-teal-deep">
                078538 68956
              </a>
              .
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
