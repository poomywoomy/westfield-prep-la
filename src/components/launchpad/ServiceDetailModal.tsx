import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { ArrowRight, CheckCircle2, Box, Camera, FileText } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import type { LaunchpadService } from "./launchpadServices";

type Props = {
  service: LaunchpadService;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

const useGoToPricing = (slug: string, onOpenChange: (o: boolean) => void) => {
  const navigate = useNavigate();
  return () => {
    onOpenChange(false);
    navigate(`/contact?service=launchpad&focus=${slug}`);
  };
};

const Hidden = ({ s }: { s: LaunchpadService }) => (
  <VisuallyHidden>
    <DialogTitle>{s.name}</DialogTitle>
    <DialogDescription>{s.summary}</DialogDescription>
  </VisuallyHidden>
);

// 01 — Side sheet (Shopify green, slides from right)
const SideSheetModal = ({ service, open, onOpenChange }: Props) => {
  const Icon = service.icon;
  const goToPricing = useGoToPricing(service.slug, onOpenChange);
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="!max-w-[560px] !w-full !h-screen !max-h-screen !top-0 !right-0 !left-auto !translate-x-0 !translate-y-0 !rounded-none p-0 overflow-y-auto bg-[#F4F8EC] border-l border-[#5E8E3E]/30 [&>button]:text-[#0E2A12] data-[state=open]:!slide-in-from-right data-[state=closed]:!slide-out-to-right"
      >
        <Hidden s={service} />
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#5E8E3E]" />
        <div className="px-8 pt-10 pb-6">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-xl bg-[#5E8E3E] flex items-center justify-center">
              <Icon className="h-6 w-6 text-white" />
            </div>
            <div className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[#5E8E3E]">
              Build sprint · Service {service.number}
            </div>
          </div>
          <h2 className="text-3xl font-semibold tracking-[-0.02em] text-[#0E2A12] mb-4 leading-[1.05]">
            {service.tagline}
          </h2>
          <p className="text-[#3a5a3e] text-[15px] leading-relaxed font-light">
            {service.description}
          </p>
        </div>
        <div className="px-8 py-6 border-t border-[#5E8E3E]/15">
          <div className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[#5E8E3E] mb-4">
            What's in the sprint
          </div>
          <ul className="space-y-2.5">
            {service.includes.map((i) => (
              <li key={i} className="flex gap-3 text-[#0E2A12] text-[14px]">
                <CheckCircle2 className="h-4 w-4 text-[#5E8E3E] mt-0.5 flex-shrink-0" />
                <span>{i}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="px-8 py-6 border-t border-[#5E8E3E]/15">
          <div className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[#5E8E3E] mb-4">
            Sprint timeline
          </div>
          <div className="relative pl-6">
            <div className="absolute left-2 top-2 bottom-2 w-px bg-[#5E8E3E]/40" />
            {service.steps.map((s, i) => (
              <div key={s.title} className="relative mb-5 last:mb-0">
                <div className="absolute -left-[18px] top-1 w-3 h-3 rounded-full bg-[#5E8E3E] border-2 border-[#F4F8EC]" />
                <div className="text-[10px] font-mono text-[#5E8E3E] uppercase mb-1">
                  Week {i + 1}
                </div>
                <div className="text-[14px] font-semibold text-[#0E2A12]">{s.title}</div>
                <div className="text-[13px] text-[#3a5a3e] font-light">{s.desc}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="px-8 py-6 border-t border-[#5E8E3E]/15 sticky bottom-0 bg-[#F4F8EC]">
          <button
            onClick={goToPricing}
            className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-[#5E8E3E] hover:bg-[#4d7732] text-white font-semibold text-sm transition-all"
          >
            Get pricing for this sprint <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

// 02 — Amazon: dark navy header band + checklist
const DarkChecklistModal = ({ service, open, onOpenChange }: Props) => {
  const Icon = service.icon;
  const goToPricing = useGoToPricing(service.slug, onOpenChange);
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl p-0 overflow-hidden bg-white border-[#131A22]/20 max-h-[90vh] overflow-y-auto [&>button]:text-white">
        <Hidden s={service} />
        <div className="bg-[#131A22] text-white px-8 py-7">
          <div className="flex items-center gap-4 mb-5">
            <div className="w-11 h-11 rounded-lg bg-[#FF9900] flex items-center justify-center">
              <Icon className="h-5 w-5 text-[#131A22]" />
            </div>
            <div className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[#FF9900]">
              Service {service.number} · Seller Central
            </div>
          </div>
          <h2 className="text-2xl md:text-3xl font-semibold tracking-[-0.02em] leading-[1.1]">
            {service.tagline}
          </h2>
          <div className="flex flex-wrap gap-2 mt-5">
            {service.deliverables.map((d) => (
              <span
                key={d.title}
                className="px-3 py-1 rounded-full bg-[#FF9900]/15 text-[#FF9900] text-[11px] font-semibold border border-[#FF9900]/40"
              >
                {d.title}
              </span>
            ))}
          </div>
        </div>
        <div className="px-8 py-7">
          <p className="text-[#1a1a1a] text-[14px] leading-relaxed mb-6">
            {service.description}
          </p>
          <div className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[#131A22] mb-3">
            Setup checklist
          </div>
          <ul className="space-y-2 mb-7">
            {service.includes.map((i, idx) => (
              <li
                key={i}
                className="flex items-start gap-3 px-3 py-2.5 rounded-md bg-[#F7F8FA] border border-[#131A22]/8"
              >
                <span className="font-mono text-[11px] text-[#FF9900] font-bold mt-0.5 w-5">
                  {String(idx + 1).padStart(2, "0")}
                </span>
                <span className="text-[14px] text-[#131A22]">{i}</span>
              </li>
            ))}
          </ul>
          <button
            onClick={goToPricing}
            className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 rounded-md bg-[#FF9900] hover:bg-[#e88a00] text-[#131A22] font-bold text-sm transition-all"
          >
            Get pricing → <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

// 03 — A+ gallery: wide module preview
const GalleryModal = ({ service, open, onOpenChange }: Props) => {
  const Icon = service.icon;
  const goToPricing = useGoToPricing(service.slug, onOpenChange);
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-w-4xl p-0 overflow-hidden border-[#6B2E8C]/30 max-h-[90vh] overflow-y-auto [&>button]:text-[#2A0F3A]"
        style={{
          background:
            "linear-gradient(160deg, #F5ECF8 0%, #EFE3F5 60%, #E5D2EE 100%)",
        }}
      >
        <Hidden s={service} />
        <div className="px-10 pt-10 pb-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-11 h-11 rounded-full bg-[#6B2E8C] flex items-center justify-center">
              <Icon className="h-5 w-5 text-white" />
            </div>
            <div className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[#6B2E8C]">
              Module {service.number} · A+ & Storefront
            </div>
          </div>
          <h2 className="text-4xl font-serif italic text-[#2A0F3A] leading-[1.05] mb-4">
            {service.tagline}
          </h2>
          <p className="text-[#4A2A5C] text-[15px] leading-relaxed max-w-2xl">
            {service.description}
          </p>
        </div>
        <div className="px-10 py-8 border-t border-[#6B2E8C]/15">
          <div className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[#6B2E8C] mb-4">
            Module gallery
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            {service.deliverables.map((d, i) => {
              const meta = [
                { dim: "970 × 600 · DESKTOP", stat: "+18% PDP conversion lift" },
                { dim: "970 × 600 · COMPARISON", stat: "Drives shoppers up the catalog" },
                { dim: "1464 × 600 · LIFESTYLE", stat: "Builds brand trust above the fold" },
                { dim: "MULTI-PAGE · STOREFRONT", stat: "Repeat-visit shopping experience" },
              ][i] || { dim: "AMAZON-READY", stat: "" };
              return (
                <div
                  key={d.title}
                  className="rounded-xl bg-white/70 backdrop-blur border border-[#6B2E8C]/20 p-5 shadow-sm"
                >
                  <div className="aspect-[16/9] rounded-md mb-4 bg-gradient-to-br from-[#F5ECF8] to-[#E5D2EE] border border-[#6B2E8C]/15 p-3 flex items-center justify-center overflow-hidden">
                    {i === 0 && (
                      <svg viewBox="0 0 200 110" className="w-full h-full" role="img" aria-label="Hero module wireframe">
                        <rect x="6" y="6" width="188" height="56" rx="3" fill="#6B2E8C" opacity="0.85" />
                        <rect x="14" y="20" width="90" height="6" rx="1" fill="#fff" opacity="0.9" />
                        <rect x="14" y="32" width="60" height="4" rx="1" fill="#fff" opacity="0.7" />
                        <rect x="14" y="44" width="40" height="10" rx="5" fill="#FFD86B" />
                        <rect x="6" y="70" width="92" height="34" rx="2" fill="#6B2E8C" opacity="0.18" />
                        <rect x="102" y="70" width="92" height="34" rx="2" fill="#6B2E8C" opacity="0.12" />
                      </svg>
                    )}
                    {i === 1 && (
                      <svg viewBox="0 0 200 110" className="w-full h-full" role="img" aria-label="Comparison chart wireframe">
                        {[0,1,2,3].map((c) => (
                          <g key={c}>
                            <rect x={8 + c*47} y="6" width="42" height="14" rx="2" fill="#6B2E8C" opacity={c===0?0.85:0.4} />
                            {[0,1,2,3].map((r) => (
                              <circle key={r} cx={29 + c*47} cy={32 + r*18} r="3.5" fill={r%2===c%2 ? "#6B2E8C" : "none"} stroke="#6B2E8C" strokeWidth="1" opacity="0.7" />
                            ))}
                          </g>
                        ))}
                      </svg>
                    )}
                    {i === 2 && (
                      <svg viewBox="0 0 200 110" className="w-full h-full" role="img" aria-label="Lifestyle band wireframe">
                        {[0,1,2].map((c) => (
                          <g key={c}>
                            <rect x={6 + c*64} y="10" width="60" height="60" rx="3" fill="#6B2E8C" opacity={0.25 + c*0.12} />
                            <circle cx={36 + c*64} cy="34" r="6" fill="#fff" opacity="0.9" />
                            <rect x={10 + c*64} y="76" width="40" height="3" fill="#6B2E8C" opacity="0.7" />
                            <rect x={10 + c*64} y="84" width="52" height="2" fill="#6B2E8C" opacity="0.4" />
                            <rect x={10 + c*64} y="90" width="32" height="2" fill="#6B2E8C" opacity="0.4" />
                          </g>
                        ))}
                      </svg>
                    )}
                    {i === 3 && (
                      <svg viewBox="0 0 200 110" className="w-full h-full" role="img" aria-label="Storefront pages wireframe">
                        <rect x="6" y="6" width="188" height="14" rx="2" fill="#6B2E8C" opacity="0.85" />
                        {[0,1,2,3,4].map((n) => (
                          <rect key={n} x={14 + n*32} y="11" width="22" height="4" rx="1" fill="#fff" opacity="0.85" />
                        ))}
                        <rect x="6" y="26" width="120" height="44" rx="2" fill="#6B2E8C" opacity="0.3" />
                        <rect x="130" y="26" width="64" height="20" rx="2" fill="#6B2E8C" opacity="0.18" />
                        <rect x="130" y="50" width="64" height="20" rx="2" fill="#6B2E8C" opacity="0.18" />
                        {[0,1,2,3].map((n) => (
                          <rect key={n} x={6 + n*48} y="76" width="44" height="28" rx="2" fill="#6B2E8C" opacity="0.15" />
                        ))}
                      </svg>
                    )}
                  </div>
                  <div className="text-[10px] font-mono text-[#6B2E8C] mb-1 flex items-center justify-between">
                    <span>MODULE 0{i + 1}</span>
                    <span className="opacity-70">{meta.dim}</span>
                  </div>
                  <div className="font-serif italic text-lg text-[#2A0F3A]">{d.title}</div>
                  <div className="text-[13px] text-[#4A2A5C] mt-1">{d.desc}</div>
                  {meta.stat && (
                    <div className="text-[11px] text-[#6B2E8C] mt-2 font-semibold">↗ {meta.stat}</div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
        <div className="px-10 py-6 border-t border-[#6B2E8C]/15 grid sm:grid-cols-2 gap-4 bg-white/40">
          <ul className="space-y-1.5">
            {service.includes.slice(0, 3).map((i) => (
              <li
                key={i}
                className="text-[13px] text-[#2A0F3A] flex gap-2 items-start"
              >
                <span className="text-[#6B2E8C]">◆</span>
                <span>{i}</span>
              </li>
            ))}
          </ul>
          <button
            onClick={goToPricing}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-[#6B2E8C] hover:bg-[#5A2575] text-white font-semibold text-sm transition-all"
          >
            Get pricing for A+ <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

// 04 — Magazine spread
const MagazineModal = ({ service, open, onOpenChange }: Props) => {
  const Icon = service.icon;
  const goToPricing = useGoToPricing(service.slug, onOpenChange);
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl p-0 overflow-hidden bg-[#F4ECDD] border-2 border-[#1C1C1C] max-h-[90vh] overflow-y-auto [&>button]:text-[#1C1C1C]">
        <Hidden s={service} />
        <div className="grid md:grid-cols-[1fr_1.2fr]">
          {/* Left: editorial title page */}
          <div className="p-10 border-r border-[#1C1C1C]/30 bg-[#1C1C1C] text-[#F4ECDD]">
            <div className="text-[10px] font-mono uppercase tracking-[0.3em] mb-8">
              ED. {service.number} · Design
            </div>
            <h2 className="text-5xl font-semibold tracking-[-0.04em] leading-[0.92] mb-8">
              {service.name}.
            </h2>
            <Icon className="h-10 w-10 mb-6 opacity-50" />
            <p className="text-[#F4ECDD]/70 text-[14px] leading-relaxed">
              {service.tagline}
            </p>
          </div>
          {/* Right: spread content */}
          <div className="p-10">
            <p className="text-[#1C1C1C] text-[14px] leading-relaxed mb-7 first-letter:text-5xl first-letter:font-semibold first-letter:float-left first-letter:mr-2 first-letter:leading-[0.9]">
              {service.description}
            </p>
            <div className="text-[10px] font-mono uppercase tracking-[0.3em] text-[#1C1C1C] mb-3">
              Inside this issue
            </div>
            <div className="grid grid-cols-3 gap-3 mb-6">
              {service.deliverables.map((d, i) => (
                <div
                  key={d.title}
                  className="border border-[#1C1C1C] p-3 bg-[#F4ECDD]"
                >
                  <div className="aspect-square bg-white mb-2 p-2 flex items-center justify-center border border-[#1C1C1C]/20">
                    {i === 0 && (
                      <svg viewBox="0 0 100 100" className="w-full h-full" role="img" aria-label="Design system specimen">
                        <rect x="6" y="6" width="14" height="14" fill="#1C1C1C" />
                        <rect x="22" y="6" width="14" height="14" fill="#C2654A" />
                        <rect x="38" y="6" width="14" height="14" fill="#5E8E3E" />
                        <rect x="54" y="6" width="14" height="14" fill="#F4ECDD" stroke="#1C1C1C" />
                        <rect x="70" y="6" width="14" height="14" fill="#FFD86B" />
                        <text x="6" y="38" fontSize="14" fontWeight="700" fill="#1C1C1C" fontFamily="serif">H1</text>
                        <text x="32" y="38" fontSize="10" fontWeight="600" fill="#1C1C1C">H2</text>
                        <text x="50" y="38" fontSize="7" fill="#1C1C1C">Body</text>
                        <text x="6" y="56" fontSize="6" fill="#1C1C1C" opacity="0.5" fontFamily="monospace">— Type scale —</text>
                        {[0,1,2,3,4,5,6,7].map((n) => (
                          <g key={n}>
                            {[0,1,2,3,4,5,6,7].map((m) => (
                              <circle key={m} cx={8 + n*11} cy={68 + m*4} r="0.7" fill="#1C1C1C" opacity="0.4" />
                            ))}
                          </g>
                        ))}
                      </svg>
                    )}
                    {i === 1 && (
                      <svg viewBox="0 0 100 100" className="w-full h-full" role="img" aria-label="Page layout stack">
                        <rect x="6" y="6" width="88" height="22" fill="#1C1C1C" opacity="0.85" />
                        <rect x="10" y="12" width="30" height="3" fill="#F4ECDD" />
                        <rect x="10" y="18" width="20" height="2" fill="#F4ECDD" opacity="0.7" />
                        <rect x="60" y="14" width="28" height="8" rx="4" fill="#C2654A" />
                        <text x="6" y="38" fontSize="5" fontFamily="monospace" fill="#1C1C1C" opacity="0.6">HERO · 1440</text>
                        <rect x="6" y="42" width="40" height="26" fill="#1C1C1C" opacity="0.15" />
                        <rect x="50" y="42" width="44" height="26" fill="none" stroke="#1C1C1C" />
                        <rect x="50" y="46" width="22" height="3" fill="#1C1C1C" />
                        <rect x="50" y="52" width="34" height="2" fill="#1C1C1C" opacity="0.5" />
                        <rect x="50" y="56" width="28" height="2" fill="#1C1C1C" opacity="0.5" />
                        <rect x="50" y="62" width="14" height="4" fill="#C2654A" />
                        <text x="6" y="78" fontSize="5" fontFamily="monospace" fill="#1C1C1C" opacity="0.6">PDP · COLLECTION</text>
                        {[0,1,2,3].map((n) => (
                          <rect key={n} x={6 + n*22} y="82" width="20" height="12" fill="#1C1C1C" opacity="0.18" />
                        ))}
                      </svg>
                    )}
                    {i === 2 && (
                      <svg viewBox="0 0 100 100" className="w-full h-full" role="img" aria-label="Responsive device frames">
                        <rect x="2" y="14" width="94" height="72" rx="3" fill="none" stroke="#1C1C1C" strokeWidth="1.5" />
                        <text x="4" y="11" fontSize="5" fontFamily="monospace" fill="#1C1C1C">XL · 1440</text>
                        <rect x="14" y="22" width="70" height="56" rx="2" fill="none" stroke="#1C1C1C" strokeWidth="1.2" />
                        <text x="16" y="20" fontSize="4.5" fontFamily="monospace" fill="#1C1C1C" opacity="0.8">MD · 768</text>
                        <rect x="36" y="34" width="26" height="40" rx="2" fill="#1C1C1C" opacity="0.85" />
                        <rect x="38" y="38" width="22" height="28" rx="1" fill="#F4ECDD" />
                        <circle cx="49" cy="71" r="1.5" fill="#F4ECDD" />
                        <text x="36" y="32" fontSize="4" fontFamily="monospace" fill="#1C1C1C">XS · 375</text>
                        <text x="6" y="94" fontSize="4.5" fontFamily="monospace" fill="#1C1C1C" opacity="0.6">— breakpoints 375 · 768 · 1440 —</text>
                      </svg>
                    )}
                  </div>
                  <div className="text-[12px] font-semibold text-[#1C1C1C]">{d.title}</div>
                  <div className="text-[10px] font-mono text-[#1C1C1C]/60 mt-0.5">{d.desc}</div>
                </div>
              ))}
            </div>
            <ul className="text-[12px] text-[#1C1C1C]/80 space-y-1 mb-6 columns-2">
              {service.includes.slice(0, 6).map((i) => (
                <li key={i} className="flex gap-1.5">
                  <span>—</span>
                  <span>{i}</span>
                </li>
              ))}
            </ul>
            <button
              onClick={goToPricing}
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#1C1C1C] text-[#F4ECDD] font-semibold text-sm hover:bg-black transition-colors border-2 border-[#1C1C1C]"
            >
              Get pricing → <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

// 05 — Render queue terminal
const RenderQueueModal = ({ service, open, onOpenChange }: Props) => {
  const Icon = service.icon;
  const goToPricing = useGoToPricing(service.slug, onOpenChange);
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-w-3xl p-0 overflow-hidden bg-[#08111F] border-[#2B6CFF]/40 max-h-[90vh] overflow-y-auto [&>button]:text-[#2B6CFF]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(43,108,255,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(43,108,255,0.06) 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      >
        <Hidden s={service} />
        <div className="px-8 pt-8 pb-6 border-b border-[#2B6CFF]/20">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-11 h-11 rounded-md bg-[#2B6CFF] flex items-center justify-center shadow-[0_0_30px_rgba(43,108,255,0.5)]">
              <Icon className="h-5 w-5 text-white" />
            </div>
            <div className="text-[10px] font-mono uppercase tracking-[0.25em] text-[#2B6CFF]">
              ▸ R-{service.number} · Render Pipeline
            </div>
          </div>
          <h2 className="text-3xl font-semibold tracking-[-0.02em] text-white leading-[1.1] mb-3">
            {service.tagline}
          </h2>
          <p className="text-white/60 text-[14px] leading-relaxed font-light">
            {service.description}
          </p>
        </div>
        <div className="px-8 py-6">
          <div className="text-[10px] font-mono uppercase tracking-[0.25em] text-[#2B6CFF] mb-4">
            // render queue
          </div>
          <div className="space-y-2 mb-7 font-mono">
            {service.steps.map((s, i) => (
              <div
                key={s.title}
                className="flex items-center gap-4 px-4 py-3 rounded-md bg-[#0E1A2E] border border-[#2B6CFF]/20"
              >
                <span className="text-[11px] text-[#2B6CFF]">[{String(i + 1).padStart(2, "0")}]</span>
                <span className="text-white text-[13px] flex-1">{s.title}</span>
                <span className="text-white/40 text-[11px]">{s.desc}</span>
                <span className="text-[10px] text-[#2B6CFF]">●</span>
              </div>
            ))}
          </div>
          <div className="text-[10px] font-mono uppercase tracking-[0.25em] text-[#2B6CFF] mb-3">
            // outputs
          </div>
          <div className="grid grid-cols-3 gap-3 mb-7">
            {service.deliverables.map((d) => (
              <div
                key={d.title}
                className="rounded-md bg-[#0E1A2E] border border-[#2B6CFF]/20 p-3"
              >
                <Box className="h-5 w-5 text-[#2B6CFF] mb-2" />
                <div className="text-[12px] font-semibold text-white">{d.title}</div>
                <div className="text-[11px] text-white/50 mt-0.5">{d.desc}</div>
              </div>
            ))}
          </div>
          <button
            onClick={goToPricing}
            className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 rounded-md bg-[#2B6CFF] hover:bg-[#1a5cf0] text-white font-mono font-semibold text-sm transition-all shadow-[0_0_30px_rgba(43,108,255,0.4)]"
          >
            ▸ Get pricing — render quote
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

// 06 — Contact sheet (horizontal scroll of frames)
const ContactSheetModal = ({ service, open, onOpenChange }: Props) => {
  const Icon = service.icon;
  const goToPricing = useGoToPricing(service.slug, onOpenChange);
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl p-0 overflow-hidden bg-[#F1DDD2] border-[#2A140C]/30 max-h-[90vh] overflow-y-auto [&>button]:text-[#2A140C]">
        <Hidden s={service} />
        <div className="px-10 pt-10 pb-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-11 h-11 rounded-full bg-[#2A140C] flex items-center justify-center">
              <Icon className="h-5 w-5 text-[#C2654A]" />
            </div>
            <div className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[#2A140C]">
              Roll {service.number} · LA Studio
            </div>
          </div>
          <h2 className="text-3xl font-semibold tracking-[-0.02em] text-[#2A140C] leading-[1.05] mb-3">
            {service.tagline}
          </h2>
          <p className="text-[#2A140C]/70 text-[15px] leading-relaxed">
            {service.description}
          </p>
        </div>
        {/* Contact sheet strip */}
        <div className="bg-[#2A140C] py-5 px-6">
          <div className="text-[9px] font-mono uppercase tracking-[0.3em] text-[#C2654A] mb-3 flex items-center justify-between">
            <span>Contact sheet · production card</span>
            <span className="opacity-60">35MM · ROLL {service.number}</span>
          </div>
          {/* sprocket strip top */}
          <div className="flex gap-1 mb-1">
            {Array.from({ length: 24 }).map((_, n) => (
              <div key={n} className="flex-1 h-2 bg-[#C2654A]/20 rounded-[1px]" />
            ))}
          </div>
          <div className="flex gap-2 overflow-x-auto pb-1">
            {[
              { label: "Hero Shots", count: "12 frames", aspect: "1:1 · AMZN", glyph: "hero" },
              { label: "Lifestyle Set", count: "24 frames", aspect: "4:5 · IG", glyph: "model" },
              { label: "Variant Coverage", count: "36 frames", aspect: "1:1 · SKU", glyph: "swatch" },
              { label: "Flat Lay", count: "8 frames", aspect: "1:1 · PDP", glyph: "flat" },
              { label: "Ghost Mannequin", count: "6 frames", aspect: "4:5 · APP", glyph: "ghost" },
            ].map((f, i) => (
              <div
                key={i}
                className="flex-shrink-0 w-44 bg-[#3a1f15] p-2 rounded-sm border border-[#C2654A]/20"
              >
                <div className="aspect-[3/4] bg-gradient-to-br from-[#5a2e1d] to-[#2A140C] rounded-sm flex items-center justify-center mb-2 relative overflow-hidden">
                  <div className="absolute top-1 left-1 text-[8px] font-mono text-[#C2654A]/70">F-{String(i + 1).padStart(2, "0")}</div>
                  <svg viewBox="0 0 60 80" className="w-3/4 h-3/4 text-[#F1DDD2]/55" role="img" aria-label={f.label}>
                    {f.glyph === "hero" && (
                      <g fill="currentColor">
                        <rect x="8" y="14" width="44" height="44" rx="3" opacity="0.25" />
                        <circle cx="30" cy="34" r="9" opacity="0.7" />
                        <rect x="14" y="50" width="32" height="4" opacity="0.5" />
                        <rect x="18" y="58" width="24" height="3" opacity="0.4" />
                      </g>
                    )}
                    {f.glyph === "model" && (
                      <g fill="currentColor">
                        <circle cx="30" cy="22" r="7" opacity="0.8" />
                        <path d="M18 36 Q30 32 42 36 L44 60 Q30 64 16 60 Z" opacity="0.6" />
                        <rect x="24" y="60" width="4" height="14" opacity="0.5" />
                        <rect x="32" y="60" width="4" height="14" opacity="0.5" />
                      </g>
                    )}
                    {f.glyph === "swatch" && (
                      <g fill="currentColor">
                        {[0,1,2].map((r) => [0,1,2].map((c) => (
                          <rect key={`${r}-${c}`} x={10 + c*15} y={14 + r*18} width="12" height="14" opacity={0.3 + ((r+c)%5)*0.13} />
                        )))}
                      </g>
                    )}
                    {f.glyph === "flat" && (
                      <g fill="currentColor">
                        <rect x="8" y="14" width="44" height="50" rx="2" opacity="0.18" />
                        <rect x="14" y="20" width="14" height="14" opacity="0.6" />
                        <circle cx="42" cy="27" r="7" opacity="0.55" />
                        <rect x="14" y="38" width="32" height="3" opacity="0.4" />
                        <rect x="14" y="44" width="20" height="3" opacity="0.4" />
                        <rect x="14" y="52" width="32" height="8" rx="1" opacity="0.5" />
                      </g>
                    )}
                    {f.glyph === "ghost" && (
                      <g fill="none" stroke="currentColor" strokeWidth="1.5" opacity="0.7">
                        <path d="M22 18 L18 26 L16 50 L24 56 L36 56 L44 50 L42 26 L38 18 Z" />
                        <path d="M22 18 Q30 14 38 18" />
                        <line x1="22" y1="32" x2="38" y2="32" strokeDasharray="2 2" opacity="0.4" />
                      </g>
                    )}
                  </svg>
                </div>
                <div className="text-[10px] font-semibold text-[#F1DDD2] px-1">{f.label}</div>
                <div className="text-[9px] font-mono text-[#C2654A] px-1 flex items-center justify-between mt-0.5">
                  <span>{f.count}</span>
                  <span className="opacity-70">{f.aspect}</span>
                </div>
              </div>
            ))}
          </div>
          {/* sprocket strip bottom */}
          <div className="flex gap-1 mt-1">
            {Array.from({ length: 24 }).map((_, n) => (
              <div key={n} className="flex-1 h-2 bg-[#C2654A]/20 rounded-[1px]" />
            ))}
          </div>
          {/* mini gantt */}
          <div className="mt-4 grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 text-[9px] font-mono text-[#C2654A] items-center">
            <span>PRE-PRO</span>
            <div className="h-2 rounded-sm bg-[#C2654A]/30 relative"><div className="absolute left-0 top-0 bottom-0 w-1/4 bg-[#C2654A] rounded-sm" /></div>
            <span>SHOOT</span>
            <div className="h-2 rounded-sm bg-[#C2654A]/30 relative"><div className="absolute left-1/4 top-0 bottom-0 w-2/4 bg-[#C2654A] rounded-sm" /></div>
            <span>DELIVERY</span>
            <div className="h-2 rounded-sm bg-[#C2654A]/30 relative"><div className="absolute left-3/4 top-0 bottom-0 w-1/4 bg-[#C2654A] rounded-sm" /></div>
          </div>
        </div>
        <div className="px-10 py-7 grid sm:grid-cols-2 gap-6">
          <div>
            <div className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[#C2654A] mb-3">
              On set
            </div>
            <ul className="space-y-2">
              {service.includes.map((i) => (
                <li key={i} className="flex gap-2 text-[13px] text-[#2A140C]">
                  <span className="text-[#C2654A]">●</span>
                  <span>{i}</span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <div className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[#C2654A] mb-3">
              Production days
            </div>
            <div className="space-y-3 mb-6">
              {service.steps.map((s, i) => (
                <div key={s.title}>
                  <div className="text-[11px] font-mono text-[#C2654A]">DAY 0{i + 1}</div>
                  <div className="text-[14px] font-semibold text-[#2A140C]">{s.title}</div>
                  <div className="text-[12px] text-[#2A140C]/70">{s.desc}</div>
                </div>
              ))}
            </div>
            <button
              onClick={goToPricing}
              className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-[#C2654A] hover:bg-[#a8543c] text-white font-semibold text-sm transition-all"
            >
              Get pricing for shoot day <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

// 07 — Notebook (lined paper, highlighter)
const NotebookModal = ({ service, open, onOpenChange }: Props) => {
  const Icon = service.icon;
  const goToPricing = useGoToPricing(service.slug, onOpenChange);
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-w-3xl p-0 overflow-hidden bg-white border-[#0E0E0E]/20 max-h-[90vh] overflow-y-auto [&>button]:text-[#0E0E0E]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(transparent, transparent 31px, rgba(14,14,14,0.07) 31px, rgba(14,14,14,0.07) 32px)",
          backgroundColor: "#FFFEF7",
        }}
      >
        <Hidden s={service} />
        <div className="absolute left-14 top-0 bottom-0 w-px bg-[#FFB1B1]/60" />
        <div className="pl-20 pr-10 pt-10 pb-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-11 h-11 rounded-md bg-[#0E0E0E] flex items-center justify-center">
              <Icon className="h-5 w-5 text-[#FFF59A]" />
            </div>
            <div className="text-[10px] font-mono uppercase tracking-[0.25em] text-[#0E0E0E]/60">
              DRAFT v{service.number} · Listing Copy
            </div>
          </div>
          <h2 className="text-3xl font-semibold text-[#0E0E0E] mb-4 leading-[1.1]">
            <span className="bg-[#FFF59A] px-2 box-decoration-clone">
              {service.tagline}
            </span>
          </h2>
          <p className="text-[#0E0E0E]/75 text-[15px] leading-[2rem] font-mono">
            {service.description}
          </p>
        </div>
        <div className="pl-20 pr-10 py-6">
          <div className="text-[10px] font-mono uppercase tracking-[0.25em] text-[#0E0E0E]/60 mb-3">
            // Scope
          </div>
          <ol className="space-y-2 mb-7">
            {service.includes.map((i, idx) => (
              <li
                key={i}
                className="flex gap-3 text-[14px] text-[#0E0E0E] font-mono leading-[2rem]"
              >
                <span className="text-[#0E0E0E]/40 w-6">{idx + 1}.</span>
                <span>{i}</span>
              </li>
            ))}
          </ol>
          <div className="text-[10px] font-mono uppercase tracking-[0.25em] text-[#0E0E0E]/60 mb-3">
            // Deliverables
          </div>
          <div className="grid sm:grid-cols-3 gap-3 mb-7">
            {service.deliverables.map((d) => (
              <div
                key={d.title}
                className="border-2 border-[#0E0E0E] bg-white p-3"
              >
                <div className="text-[13px] font-semibold text-[#0E0E0E]">
                  <span className="bg-[#FFF59A] px-1">{d.title}</span>
                </div>
                <div className="text-[12px] text-[#0E0E0E]/70 mt-1 font-mono">
                  {d.desc}
                </div>
              </div>
            ))}
          </div>
          <button
            onClick={goToPricing}
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#0E0E0E] text-[#FFF59A] font-mono font-bold text-sm hover:bg-black transition-colors"
          >
            ✎ Get pricing for copy
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

const ServiceDetailModal = ({
  service,
  open,
  onOpenChange,
}: {
  service: LaunchpadService | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) => {
  if (!service) return null;
  const props = { service, open, onOpenChange };
  switch (service.theme.modalVariant) {
    case "side-sheet":
      return <SideSheetModal {...props} />;
    case "dark-checklist":
      return <DarkChecklistModal {...props} />;
    case "gallery":
      return <GalleryModal {...props} />;
    case "magazine":
      return <MagazineModal {...props} />;
    case "render-queue":
      return <RenderQueueModal {...props} />;
    case "contact-sheet":
      return <ContactSheetModal {...props} />;
    case "notebook":
      return <NotebookModal {...props} />;
  }
};

export default ServiceDetailModal;
