import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { ArrowRight, CheckCircle2, X, Box, Camera, FileText } from "lucide-react";
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
            {service.deliverables.map((d, i) => (
              <div
                key={d.title}
                className="rounded-xl bg-white/70 backdrop-blur border border-[#6B2E8C]/20 p-5 shadow-sm"
              >
                <div className="aspect-[16/9] rounded-md mb-4 bg-gradient-to-br from-[#6B2E8C]/20 to-[#6B2E8C]/5 flex items-center justify-center">
                  <FileText className="h-8 w-8 text-[#6B2E8C]/60" />
                </div>
                <div className="text-[10px] font-mono text-[#6B2E8C] mb-1">
                  MODULE 0{i + 1}
                </div>
                <div className="font-serif italic text-lg text-[#2A0F3A]">{d.title}</div>
                <div className="text-[13px] text-[#4A2A5C] mt-1">{d.desc}</div>
              </div>
            ))}
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
            <div className="grid grid-cols-2 gap-3 mb-6">
              {service.deliverables.map((d) => (
                <div
                  key={d.title}
                  className="border border-[#1C1C1C] p-3 bg-[#F4ECDD]"
                >
                  <div className="aspect-square bg-[#1C1C1C]/10 mb-2 flex items-center justify-center">
                    <span className="text-[#1C1C1C]/40 text-[11px] font-mono">IMG</span>
                  </div>
                  <div className="text-[12px] font-semibold text-[#1C1C1C]">{d.title}</div>
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
          <div className="text-[9px] font-mono uppercase tracking-[0.3em] text-[#C2654A] mb-3">
            Contact sheet · {service.deliverables.length} frames
          </div>
          <div className="flex gap-2 overflow-x-auto pb-1">
            {[...service.deliverables, ...service.deliverables.slice(0, 2)].map((d, i) => (
              <div
                key={i}
                className="flex-shrink-0 w-44 bg-[#3a1f15] p-1.5 rounded-sm"
              >
                <div className="aspect-[3/4] bg-gradient-to-br from-[#C2654A]/40 to-[#2A140C] rounded-sm flex items-center justify-center mb-2">
                  <Camera className="h-7 w-7 text-[#F1DDD2]/40" />
                </div>
                <div className="text-[10px] font-mono text-[#C2654A] px-1">
                  {String(i + 1).padStart(2, "0")} · {d.title}
                </div>
              </div>
            ))}
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
