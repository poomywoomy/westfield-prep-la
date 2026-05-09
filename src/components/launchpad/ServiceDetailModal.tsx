import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import type { LaunchpadService } from "./launchpadServices";

type Props = {
  service: LaunchpadService | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

const ServiceDetailModal = ({ service, open, onOpenChange }: Props) => {
  const navigate = useNavigate();

  if (!service) return null;
  const Icon = service.icon;

  const handleGetPricing = () => {
    onOpenChange(false);
    navigate(`/contact?service=launchpad&focus=${service.slug}`);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-w-3xl p-0 overflow-hidden bg-[#f6f1ea] border-[#1a1a1a]/10 max-h-[90vh] overflow-y-auto [&>button]:text-[#f6f1ea] [&>button]:opacity-80 [&>button]:hover:opacity-100"
      >
        <VisuallyHidden>
          <DialogTitle>{service.name}</DialogTitle>
          <DialogDescription>{service.summary}</DialogDescription>
        </VisuallyHidden>

        {/* Header */}
        <div className="relative bg-[#1a1a1a] text-[#f6f1ea] px-8 pt-8 pb-10">
          <div className="flex items-start gap-5">
            <div className="w-12 h-12 rounded-xl bg-[#c97b54] flex items-center justify-center flex-shrink-0">
              <Icon className="h-6 w-6 text-[#1a1a1a]" />
            </div>
            <div>
              <div className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[#c97b54] mb-2">
                Service {service.number} · Launchpad
              </div>
              <h2 className="text-2xl md:text-3xl font-semibold tracking-[-0.02em] leading-[1.1]">
                {service.tagline.split(/(\s+)/).map((word, i, arr) => {
                  // italicize last 2 words for accent
                  if (i >= arr.length - 3) return <span key={i} className="italic font-light text-[#c97b54]">{word}</span>;
                  return <span key={i}>{word}</span>;
                })}
              </h2>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="px-8 py-8 space-y-8">
          <p className="text-[#3a3a3a] text-[15px] leading-relaxed font-light">
            {service.description}
          </p>

          {/* What's included */}
          <div>
            <div className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[#c97b54] mb-4">
              What's included
            </div>
            <ul className="grid sm:grid-cols-2 gap-x-6 gap-y-3">
              {service.includes.map((item) => (
                <li key={item} className="flex gap-3 text-[#1a1a1a] text-[14px] leading-snug">
                  <CheckCircle2 className="h-4 w-4 text-[#c97b54] flex-shrink-0 mt-0.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Deliverables */}
          <div>
            <div className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[#c97b54] mb-4">
              Deliverables
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {service.deliverables.map((d) => (
                <div
                  key={d.title}
                  className="rounded-xl bg-white border border-[#1a1a1a]/10 p-4"
                >
                  <div className="font-semibold text-[#1a1a1a] text-[14px] mb-1">{d.title}</div>
                  <div className="text-[#5a5a5a] text-[13px] font-light leading-snug">{d.desc}</div>
                </div>
              ))}
            </div>
          </div>

          {/* How it works */}
          <div>
            <div className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[#c97b54] mb-4">
              How it works
            </div>
            <ol className="space-y-3">
              {service.steps.map((step, i) => (
                <li key={step.title} className="flex gap-4 items-start">
                  <span className="w-7 h-7 rounded-full bg-[#1a1a1a] text-[#f6f1ea] text-[12px] font-semibold flex items-center justify-center flex-shrink-0">
                    {i + 1}
                  </span>
                  <div>
                    <div className="font-semibold text-[#1a1a1a] text-[14px]">{step.title}</div>
                    <div className="text-[#5a5a5a] text-[13px] font-light leading-snug">{step.desc}</div>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>

        {/* Footer CTA */}
        <div className="px-8 py-5 border-t border-[#1a1a1a]/10 bg-white/60 flex flex-col sm:flex-row justify-end gap-3">
          <button
            onClick={() => onOpenChange(false)}
            className="px-5 py-2.5 rounded-full text-[#1a1a1a] text-sm font-medium hover:bg-[#1a1a1a]/5 transition-colors"
          >
            Close
          </button>
          <button
            onClick={handleGetPricing}
            className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-full bg-[#c97b54] hover:bg-[#b86c47] text-white font-semibold text-sm transition-all"
          >
            Get Pricing <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ServiceDetailModal;
