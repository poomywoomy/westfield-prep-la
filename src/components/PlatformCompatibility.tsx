import { useNavigate } from "react-router-dom";
import { ShoppingBag, ShoppingCart, Store, Music, Package, Building2, Palette, Code, Zap } from "lucide-react";
import { TranslatedText } from "@/components/TranslatedText";

const PlatformCompatibility = () => {
  const navigate = useNavigate();

  const ecommercePlatforms = [
    { name: "Shopify", icon: ShoppingBag, strength: "Primary Integration" },
    { name: "WooCommerce", icon: ShoppingCart, strength: "Full Support" },
    { name: "BigCommerce", icon: Store, strength: "Full Support" },
    { name: "TikTok Shop", icon: Music, strength: "Growing Platform" },
  ];

  const marketplaces = [
    { name: "Amazon", icon: Package, strength: "FBA Specialist" },
    { name: "Walmart", icon: Building2, strength: "Full Integration" },
    { name: "Etsy", icon: Palette, strength: "Handmade Focus" },
  ];

  return (
    <section className="py-24 bg-gradient-to-b from-background via-primary/5 to-background">
      <div className="container mx-auto px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-foreground">
              <TranslatedText>Seamlessly Integrates With Every Platform You Sell On</TranslatedText>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              <TranslatedText>Connect your store in minutes. Orders flow automatically to our warehouse for fast, accurate fulfillment.</TranslatedText>
            </p>
          </div>

          {/* E-Commerce Platforms */}
          <div className="mb-12">
            <h3 className="text-2xl font-bold mb-6 text-card-foreground text-center">
              <TranslatedText>E-Commerce Platforms</TranslatedText>
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {ecommercePlatforms.map((platform, index) => (
                <div 
                  key={index}
                  className="group relative bg-gradient-to-br from-card via-card/80 to-primary/5 border-2 border-border hover:border-primary/50 rounded-3xl p-8 flex flex-col items-center justify-center hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/0 to-primary/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  
                  <div className="mb-4 flex justify-center relative z-10">
                    <platform.icon className="w-16 h-16 text-primary group-hover:scale-110 transition-transform" />
                  </div>
                  <div className="text-center font-bold text-xl text-card-foreground mb-2 relative z-10">
                    {platform.name}
                  </div>
                  <div className="text-sm text-primary font-semibold relative z-10">
                    <TranslatedText>{platform.strength}</TranslatedText>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Marketplaces */}
          <div>
            <h3 className="text-2xl font-bold mb-6 text-card-foreground text-center">
              <TranslatedText>Marketplaces</TranslatedText>
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {marketplaces.map((platform, index) => (
                <div 
                  key={index}
                  className="group relative bg-gradient-to-br from-card via-card/80 to-secondary/5 border-2 border-border hover:border-secondary/50 rounded-3xl p-8 flex flex-col items-center justify-center hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-secondary/0 to-secondary/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  
                  <div className="mb-4 flex justify-center relative z-10">
                    <platform.icon className="w-16 h-16 text-secondary group-hover:scale-110 transition-transform" />
                  </div>
                  <div className="text-center font-bold text-xl text-card-foreground mb-2 relative z-10">
                    {platform.name}
                  </div>
                  <div className="text-sm text-secondary font-semibold relative z-10">
                    <TranslatedText>{platform.strength}</TranslatedText>
                  </div>
                </div>
              ))}
              
              {/* Many More Button */}
              <button 
                onClick={() => navigate("/integrations")}
                className="group relative bg-gradient-to-br from-card via-card/80 to-primary/5 border-2 border-dashed border-primary/50 hover:border-primary rounded-3xl p-8 flex flex-col items-center justify-center hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 overflow-hidden cursor-pointer"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary/0 to-primary/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                
                <div className="mb-4 flex justify-center relative z-10">
                  <Code className="w-16 h-16 text-primary group-hover:scale-110 transition-transform" />
                </div>
                <div className="text-center font-bold text-xl text-card-foreground mb-2 relative z-10">
                  <TranslatedText>Many More</TranslatedText>
                </div>
                <div className="text-sm text-primary font-semibold relative z-10">
                  <TranslatedText>View All</TranslatedText> →
                </div>
              </button>
            </div>
          </div>

          {/* API-First Messaging */}
          <div className="mt-12 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-4">
              <Zap className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-primary">
                <TranslatedText>API-First • Webhook-Enabled • Real-Time Sync</TranslatedText>
              </span>
            </div>
          </div>

          {/* Multi-Channel CTA */}
          <div className="mt-8 text-center bg-gradient-to-r from-primary/10 via-secondary/10 to-primary/10 rounded-3xl p-12 border border-border/50">
            <h3 className="text-3xl font-bold mb-4 text-foreground">
              <TranslatedText>Selling on Multiple Channels?</TranslatedText>
            </h3>
            <p className="text-lg text-muted-foreground mb-6 max-w-2xl mx-auto">
              <TranslatedText>We manage your inventory centrally so you never oversell and always ship fast. Connect your tech stack in minutes.</TranslatedText>
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <button 
                onClick={() => navigate("/sales-channels")}
                className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-primary-foreground rounded-full font-bold hover:bg-primary/90 transition-colors text-lg"
              >
                <TranslatedText>See All Platforms</TranslatedText> →
              </button>
              <button 
                onClick={() => navigate("/integrations")}
                className="inline-flex items-center gap-2 px-8 py-4 bg-transparent border-2 border-primary text-primary rounded-full font-bold hover:bg-primary/10 transition-colors text-lg"
              >
                <TranslatedText>View Integrations & API</TranslatedText> →
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PlatformCompatibility;
