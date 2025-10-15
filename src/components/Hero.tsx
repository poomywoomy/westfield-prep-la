import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import heroImage from "@/assets/hero-warehouse-optimized.webp";

const Hero = () => {
  const navigate = useNavigate();

  const goToContact = () => {
    navigate("/contact");
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `url(${heroImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-primary/80" />
      </div>

      <div className="container mx-auto px-4 relative z-10 pt-16">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
            Shopify, Amazon, & E-commerce Fulfillment in Los Angeles
          </h1>
          <p className="text-lg md:text-xl lg:text-2xl mb-8 text-white/90 max-w-3xl mx-auto">
            Shopify-first fulfillment with photo-proof QC, branded packaging, and same-day cutoffs. Also supporting Amazon FBA and TikTok Shop.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={goToContact}
              size="lg"
              className="bg-secondary hover:bg-secondary/90 text-secondary-foreground text-lg px-8 py-6 font-semibold"
            >
              Get a Quote
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
