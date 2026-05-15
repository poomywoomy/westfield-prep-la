import { Link } from "react-router-dom";
import { Anchor, Gauge, MapPin, Wallet } from "lucide-react";
import { TranslatedText } from "@/components/TranslatedText";
import portImg from "@/assets/shopify-v2/port-la.jpg";

const points = [
  {
    icon: Anchor,
    title: "Port-adjacent inbound",
    body: "Direct drayage from the Port of Los Angeles and Long Beach into our dock. Containers can be receiving and going through QC the same day they clear customs — instead of sitting at a deconsolidator for a week.",
  },
  {
    icon: Gauge,
    title: "Better IPI scores",
    body: "Faster prep and faster check-in at the Amazon FC means inventory turns sooner, sell-through rises, and your IPI score climbs. Healthier IPI = higher storage limits and lower long-term storage fees.",
  },
  {
    icon: MapPin,
    title: "Smarter Amazon placement",
    body: "We routinely ship to LAX9, ONT8, ONT2, SBD1, SBD2, FAT1, MQY1, BFI4, and more. West Coast FCs are a short LTL hop, which keeps inbound placement fees and transit costs down.",
  },
  {
    icon: Wallet,
    title: "Transparent per-unit pricing",
    body: "Receiving, prep, storage, and LTL forwarding are all priced per unit or per pallet — published up front. No surprise fees, no minimums, no long-term contracts to escape from later.",
  },
];

const WhyLAForFBA = () => {
  return (
    <section className="py-24 md:py-32 bg-white">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          <div className="lg:col-span-5">
            <span className="text-[11px] font-bold tracking-[0.22em] uppercase text-[hsl(var(--orange-glow))]">
              <TranslatedText>The LA edge for FBA</TranslatedText>
            </span>
            <h2 className="mt-3 text-4xl md:text-5xl font-bold tracking-tight text-[hsl(var(--surface-navy))] leading-[1.05]">
              <TranslatedText>Why Los Angeles is the right base for your Amazon FBA program.</TranslatedText>
            </h2>
            <p className="mt-5 text-lg text-[hsl(var(--surface-navy))]/65 leading-relaxed">
              <TranslatedText>Half of FBA performance is geography. Port-adjacent inbound, fast carrier pickups, and proximity to West Coast FCs mean lower placement fees, faster check-ins, and healthier IPI scores. See exactly how we handle</TranslatedText>{" "}
              <Link
                to="/amazon-fba-prep"
                className="text-[hsl(var(--orange-glow))] underline underline-offset-4 font-semibold"
              >
                <TranslatedText>FBA prep</TranslatedText>
              </Link>
              <TranslatedText>, why brands choose our </TranslatedText>
              <Link
                to="/why-choose-us"
                className="text-[hsl(var(--orange-glow))] underline underline-offset-4 font-semibold"
              >
                <TranslatedText>operational approach</TranslatedText>
              </Link>
              <TranslatedText>, and what it costs on our </TranslatedText>
              <Link
                to="/pricing"
                className="text-[hsl(var(--orange-glow))] underline underline-offset-4 font-semibold"
              >
                <TranslatedText>transparent pricing page</TranslatedText>
              </Link>
              .
            </p>
            <div className="mt-8 flex flex-wrap gap-3 text-sm">
              <Link
                to="/labeling-compliance"
                className="px-4 py-2 rounded-full border border-[hsl(var(--surface-navy))]/15 text-[hsl(var(--surface-navy))] hover:border-[hsl(var(--orange-glow))] hover:text-[hsl(var(--orange-glow))] transition-colors font-semibold"
              >
                <TranslatedText>Labeling & compliance</TranslatedText>
              </Link>
              <Link
                to="/storage-warehousing"
                className="px-4 py-2 rounded-full border border-[hsl(var(--surface-navy))]/15 text-[hsl(var(--surface-navy))] hover:border-[hsl(var(--orange-glow))] hover:text-[hsl(var(--orange-glow))] transition-colors font-semibold"
              >
                <TranslatedText>Storage & warehousing</TranslatedText>
              </Link>
              <Link
                to="/contact"
                className="px-4 py-2 rounded-full bg-[hsl(var(--surface-navy))] text-white hover:bg-[hsl(var(--orange-glow))] transition-colors font-semibold"
              >
                <TranslatedText>Get an FBA quote</TranslatedText>
              </Link>
            </div>
          </div>

          <div className="lg:col-span-7 grid sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2 relative rounded-3xl overflow-hidden border border-black/5 aspect-[16/9]">
              <img
                src={portImg}
                alt="Container ships and cranes at the Port of Los Angeles"
                loading="lazy"
                className="absolute inset-0 h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[hsl(var(--surface-navy))]/80 via-transparent to-transparent" />
              <div className="absolute bottom-5 left-5 right-5 text-white">
                <div className="text-[10px] font-bold tracking-[0.22em] uppercase text-[hsl(var(--orange-glow))]">
                  <TranslatedText>Port + FC proximity</TranslatedText>
                </div>
                <div className="mt-1 text-xl md:text-2xl font-bold tracking-tight">
                  <TranslatedText>Los Angeles, CA — minutes from the ports, hours from the FCs.</TranslatedText>
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

export default WhyLAForFBA;
