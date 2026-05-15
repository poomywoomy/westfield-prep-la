import { motion } from "framer-motion";
import { ShoppingCart, Cpu, ScanBarcode, Box, Truck, CheckCircle2 } from "lucide-react";
import { TranslatedText } from "@/components/TranslatedText";

const nodes = [
  { icon: ShoppingCart, label: "Shopify order" },
  { icon: Cpu, label: "WMS queue" },
  { icon: ScanBarcode, label: "Pick & scan" },
  { icon: Box, label: "Branded pack" },
  { icon: Truck, label: "Carrier" },
];

const IntegrationDiagram = () => {
  return (
    <section className="py-24 md:py-32 bg-white">
      <div className="container mx-auto px-4">
        <div className="rounded-3xl bg-[hsl(var(--surface-navy))] text-white p-8 md:p-14 relative overflow-hidden border border-white/10">
          <div className="absolute inset-0 bento-grid-faint opacity-50 pointer-events-none" />
          <div
            className="absolute -top-32 -right-32 w-[400px] h-[400px] rounded-full opacity-15 blur-[100px]"
            style={{ background: "hsl(var(--orange-glow))" }}
          />

          <div className="relative max-w-3xl">
            <span className="text-[11px] font-bold tracking-[0.22em] uppercase text-[hsl(var(--orange-glow))]">
              <TranslatedText>Real-time pipeline</TranslatedText>
            </span>
            <h2 className="mt-3 text-3xl md:text-5xl font-bold tracking-tight">
              <TranslatedText>An order moves through five touchpoints in under 3 hours.</TranslatedText>
            </h2>
          </div>

          <div className="relative mt-12 grid grid-cols-2 md:grid-cols-5 gap-4 md:gap-2">
            {nodes.map((n, i) => {
              const Icon = n.icon;
              return (
                <motion.div
                  key={n.label}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.5 }}
                  className="relative flex flex-col items-center text-center"
                >
                  <div className="relative w-16 h-16 rounded-2xl bg-white/5 border border-white/15 backdrop-blur-md flex items-center justify-center">
                    <Icon className="h-7 w-7 text-[hsl(var(--orange-glow))]" />
                    <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-[hsl(var(--orange-glow))] text-[hsl(var(--surface-navy))] text-[10px] font-bold flex items-center justify-center">{i + 1}</div>
                  </div>
                  <div className="mt-3 text-sm font-semibold"><TranslatedText>{n.label}</TranslatedText></div>
                  {i < nodes.length - 1 && (
                    <div className="hidden md:block absolute top-8 left-[calc(50%+40px)] right-[-50%] h-px">
                      <div className="h-px w-full bg-gradient-to-r from-white/20 via-[hsl(var(--orange-glow))]/40 to-white/20" />
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>

          <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { v: "<5s", l: "Webhook latency" },
              { v: "<3h", l: "Avg cart-to-dock" },
              { v: "99.8%", l: "Pick accuracy" },
              { v: "100%", l: "QC photo coverage" },
            ].map((s) => (
              <div key={s.l} className="rounded-2xl bg-white/[0.04] border border-white/10 p-5">
                <div className="text-3xl font-bold tracking-tight">{s.v}</div>
                <div className="mt-1 text-[11px] uppercase tracking-wider text-white/50 flex items-center gap-1">
                  <CheckCircle2 className="h-3 w-3 text-[hsl(var(--orange-glow))]" />
                  <TranslatedText>{s.l}</TranslatedText>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default IntegrationDiagram;
