import { Link } from "react-router-dom";
import { Anchor, Clock4, DollarSign, Users } from "lucide-react";
import { TranslatedText } from "@/components/TranslatedText";
import portImg from "@/assets/shopify-v2/port-la.jpg";

const points = [
  {
    icon: Anchor,
    title: "Port of Los Angeles & Long Beach proximity",
    body: "Our facility sits minutes from the two busiest container ports in the United States. That cuts drayage cost and shaves days off your inbound timeline — especially valuable for brands importing from Asia.",
  },
  {
    icon: Clock4,
    title: "1- to 2-day ground to most of the West Coast",
    body: "Los Angeles is the right geographic launchpad for fast-and-cheap DTC delivery. We hit the entire western US in 1–2 days via ground rates, and most of the rest of the country in 3.",
  },
  {
    icon: DollarSign,
    title: "Transparent per-unit pricing, no surprises",
    body: "Receiving, storage, pick & pack, and prep are all priced per unit and published up front. No long-term contracts, no surprise fees at month end.",
  },
  {
    icon: Users,
    title: "A real account team, not a ticket queue",
    body: "Every brand gets a dedicated point of contact who knows your SKUs, your packaging, and your peak season — so escalations get a human, not an autoresponder.",
  },
];

const WhyLAEdge = () => {
  return (
    <section className="py-24 md:py-32 bg-white">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          <div className="lg:col-span-5">
            <span className="text-[11px] font-bold tracking-[0.22em] uppercase text-[hsl(var(--orange-glow))]">
              <TranslatedText>The LA edge</TranslatedText>
            </span>
            <h2 className="mt-3 text-4xl md:text-5xl font-bold tracking-tight text-[hsl(var(--surface-navy))] leading-[1.05]">
              <TranslatedText>Why a Los Angeles 3PL is the right home for your Shopify brand.</TranslatedText>
            </h2>
            <p className="mt-5 text-lg text-[hsl(var(--surface-navy))]/65 leading-relaxed">
              <TranslatedText>
                Location is half the equation in DTC fulfillment. We pair port-adjacent inbound with same-day pick &
                pack and a dedicated team that actually knows your brand. Compare our{" "}
              </TranslatedText>
              <Link
                to="/why-choose-us"
                className="text-[hsl(var(--orange-glow))] underline underline-offset-4 font-semibold"
              >
                <TranslatedText>dedicated approach</TranslatedText>
              </Link>{" "}
              <TranslatedText>against our</TranslatedText>{" "}
              <Link
                to="/pricing"
                className="text-[hsl(var(--orange-glow))] underline underline-offset-4 font-semibold"
              >
                <TranslatedText>transparent pricing</TranslatedText>
              </Link>
              <TranslatedText> and you'll see why brands switch.</TranslatedText>
            </p>
            <div className="mt-8 flex flex-wrap gap-3 text-sm">
              <Link
                to="/storage-warehousing"
                className="px-4 py-2 rounded-full border border-[hsl(var(--surface-navy))]/15 text-[hsl(var(--surface-navy))] hover:border-[hsl(var(--orange-glow))] hover:text-[hsl(var(--orange-glow))] transition-colors font-semibold"
              >
                <TranslatedText>Storage & warehousing</TranslatedText>
              </Link>
              <Link
                to="/kitting-bundling"
                className="px-4 py-2 rounded-full border border-[hsl(var(--surface-navy))]/15 text-[hsl(var(--surface-navy))] hover:border-[hsl(var(--orange-glow))] hover:text-[hsl(var(--orange-glow))] transition-colors font-semibold"
              >
                <TranslatedText>Kitting & bundling</TranslatedText>
              </Link>
              <Link
                to="/contact"
                className="px-4 py-2 rounded-full bg-[hsl(var(--surface-navy))] text-white hover:bg-[hsl(var(--orange-glow))] transition-colors font-semibold"
              >
                <TranslatedText>Talk to our team</TranslatedText>
              </Link>
            </div>
          </div>

          <div className="lg:col-span-7 grid sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2 relative rounded-3xl overflow-hidden border border-black/5 aspect-[16/9]">
              <img
                src={portImg}
                alt="Port of Los Angeles cranes at dusk with stacked containers"
                loading="lazy"
                className="absolute inset-0 h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[hsl(var(--surface-navy))]/80 via-transparent to-transparent" />
              <div className="absolute bottom-5 left-5 right-5 text-white">
                <div className="text-[10px] font-bold tracking-[0.22em] uppercase text-[hsl(var(--orange-glow))]">
                  <TranslatedText>Strategic geography</TranslatedText>
                </div>
                <div className="mt-1 text-xl md:text-2xl font-bold tracking-tight">
                  <TranslatedText>Los Angeles, CA — minutes from the docks.</TranslatedText>
                </div>
              </div>
            </div>
            {points.map((p) => (
              <div
                key={p.title}
                className="rounded-3xl border border-black/5 bg-white p-6 shadow-[0_20px_60px_-30px_hsl(var(--surface-navy)/0.25)]"
              >
                <p.icon className="h-6 w-6 text-[hsl(var(--orange-glow))]" />
                <h3 className="mt-3 text-lg font-bold tracking-tight text-[hsl(var(--surface-navy))]">
                  <TranslatedText>{p.title}</TranslatedText>
                </h3>
                <p className="mt-2 text-sm text-[hsl(var(--surface-navy))]/65 leading-relaxed">
                  <TranslatedText>{p.body}</TranslatedText>
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyLAEdge;
