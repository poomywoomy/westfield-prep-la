import { Tag, Package, Shield, Boxes, Truck, Camera } from "lucide-react";
import BentoTile from "@/components/shared/BentoTile";
import { TranslatedText } from "@/components/TranslatedText";
import labelImg from "@/assets/amazon-v2/labeling.jpg";
import polyImg from "@/assets/amazon-v2/polybagging.jpg";
import cartonImg from "@/assets/amazon-v2/carton-pallet.jpg";
import qcImg from "@/assets/amazon-v2/qc-documentation.jpg";

const ServicesBento = () => {
  return (
    <section className="py-24 md:py-32 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mb-14">
          <span className="text-[11px] font-bold tracking-[0.22em] uppercase text-[hsl(var(--orange-glow))]">
            <TranslatedText>Services</TranslatedText>
          </span>
          <h2 className="mt-3 text-4xl md:text-5xl font-bold tracking-tight text-[hsl(var(--surface-navy))]">
            <TranslatedText>Every prep service Amazon requires, under one roof.</TranslatedText>
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-5 auto-rows-[minmax(220px,auto)]">
          <BentoTile variant="image" imageSrc={labelImg} imageAlt="Thermal printer producing FNSKU label" eyebrow="01" className="md:col-span-2 md:row-span-2 min-h-[460px]" delay={0}>
            <Tag className="h-7 w-7 text-[hsl(var(--orange-glow))]" />
            <h3 className="mt-auto text-3xl md:text-4xl font-bold tracking-tight"><TranslatedText>FNSKU labeling</TranslatedText></h3>
            <p className="mt-2 text-white/85 max-w-md"><TranslatedText>Compliant FNSKU labels printed and applied to every unit. Scan-verified before pack-out.</TranslatedText></p>
          </BentoTile>

          <BentoTile variant="image" imageSrc={polyImg} imageAlt="Polybagged products on stainless steel prep table" eyebrow="02" className="lg:col-span-2 min-h-[220px]" delay={0.05}>
            <Package className="h-7 w-7 text-[hsl(var(--orange-glow))]" />
            <h3 className="mt-auto text-2xl font-bold"><TranslatedText>Polybagging & suffocation labels</TranslatedText></h3>
          </BentoTile>

          <BentoTile variant="navy" eyebrow="03" delay={0.1}>
            <Shield className="h-7 w-7 text-[hsl(var(--orange-glow))]" />
            <h3 className="mt-auto text-xl font-bold"><TranslatedText>Bubble wrap & fragile prep</TranslatedText></h3>
            <p className="mt-2 text-sm text-white/65"><TranslatedText>Reinforced for transit; zero damage claims target.</TranslatedText></p>
          </BentoTile>

          <BentoTile variant="image" imageSrc={cartonImg} imageAlt="Banded cartons on a wooden pallet" eyebrow="04" delay={0.15}>
            <Boxes className="h-7 w-7 text-[hsl(var(--orange-glow))]" />
            <h3 className="mt-auto text-xl font-bold"><TranslatedText>Carton prep</TranslatedText></h3>
          </BentoTile>

          <BentoTile variant="navy" className="lg:col-span-2" eyebrow="05" delay={0.2}>
            <Truck className="h-7 w-7 text-[hsl(var(--orange-glow))]" />
            <h3 className="mt-auto text-2xl md:text-3xl font-bold tracking-tight"><TranslatedText>LTL pallet forwarding</TranslatedText></h3>
            <p className="mt-2 text-white/70 max-w-md"><TranslatedText>Palletized, banded, BOL-generated, and shipped direct to Amazon FCs.</TranslatedText></p>
          </BentoTile>

          <BentoTile variant="image" imageSrc={qcImg} imageAlt="QC documentation station for shipment box" eyebrow="06" delay={0.25}>
            <Camera className="h-7 w-7 text-[hsl(var(--orange-glow))]" />
            <h3 className="mt-auto text-xl font-bold"><TranslatedText>Photo-proof QC</TranslatedText></h3>
          </BentoTile>
        </div>
      </div>
    </section>
  );
};

export default ServicesBento;
