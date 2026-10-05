// Page content data shared between the page component and its route fact sheet.

export const faqs: { q: string; a: string; cat: "Setup" | "Creative" | "Timeline" | "Logistics" }[] = [
  {
    q: "Do I need to be a fulfillment client to use Launchpad?",
    a: "No. Launchpad is open to any seller. You can use our creative and setup services without ever shipping a unit through our warehouse, but most clients pair the two so launch and logistics live under one roof.",
    cat: "Logistics",
  },
  {
    q: "How long does a typical launch project take?",
    a: "Most Shopify builds and Amazon listing packages wrap in 2 to 4 weeks. Studio shoots are scheduled inside the same window. Complex 3D imaging or large catalogs may extend the timeline, and we will tell you upfront.",
    cat: "Timeline",
  },
  {
    q: "Do I ship product to your studio for photography?",
    a: "Yes. Our Los Angeles studio receives samples directly. If you are already storing inventory with us, we just pull a unit from your shelf for the shoot, no extra shipping required.",
    cat: "Logistics",
  },
  {
    q: "What file formats do I get for imagery and assets?",
    a: "You get web-ready JPG and PNG, plus high-resolution masters. For 3D we deliver still renders and 360 spins. For listings we deliver Amazon-ready images sized to spec, plus source files on request.",
    cat: "Creative",
  },
  {
    q: "Who owns the assets after the project is done?",
    a: "You do. Final images, copy, store files, and renders are yours to keep, reuse, and license to retailers or distributors.",
    cat: "Creative",
  },
  {
    q: "Can you set up Seller Central and Brand Registry for me?",
    a: "Yes. We handle Seller Central registration, Brand Registry, ungating in restricted categories, and parent or child variation trees so you launch clean and stay compliant.",
    cat: "Setup",
  },
  {
    q: "Do you write the listing copy and keywords too?",
    a: "Yes. Titles, bullets, descriptions, and backend search terms are written by operators who actually sell on these platforms, tuned to rank and convert.",
    cat: "Setup",
  },
];
