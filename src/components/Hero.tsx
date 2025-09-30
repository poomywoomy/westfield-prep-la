import { Button } from "@/components/ui/button";
import heroImage from "@/assets/hero-warehouse.jpg";

const Hero = () => {
  const scrollToContact = () => {
    const element = document.getElementById("contact");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
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
            Your Reliable Ecommerce Fulfillment Partner in Los Angeles
          </h1>
          <p className="text-lg md:text-xl lg:text-2xl mb-8 text-white/90 max-w-3xl mx-auto">
            Fast, photo-verified prep & shipping for all your ecommerce needs.
          </p>
          <Button
            onClick={scrollToContact}
            size="lg"
            className="bg-secondary hover:bg-secondary/90 text-secondary-foreground text-lg px-8 py-6 font-semibold"
          >
            Get Started
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Hero;
