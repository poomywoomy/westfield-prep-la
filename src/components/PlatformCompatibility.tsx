import { useNavigate } from "react-router-dom";

const PlatformCompatibility = () => {
  const navigate = useNavigate();

  const ecommercePlatforms = [
    { name: "Shopify", logo: "🛍️", strength: "Primary" },
    { name: "WooCommerce", logo: "🛒", strength: "Full" },
    { name: "BigCommerce", logo: "🏪", strength: "Full" },
    { name: "TikTok Shop", logo: "🎵", strength: "Growing" },
  ];

  const marketplaces = [
    { name: "Amazon", logo: "📦", strength: "FBA/FBM" },
    { name: "Walmart", logo: "🏬", strength: "Full" },
    { name: "Etsy", logo: "🎨", strength: "Full" },
    { name: "eBay", logo: "🔨", strength: "Full" }
  ];

  return (
    <section className="py-24 bg-gradient-to-b from-background via-primary/5 to-background">
      <div className="container mx-auto px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-foreground">
              Works With Every Platform
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Seamless integration with all major e-commerce platforms and marketplaces. Your orders flow automatically to our warehouse.
            </p>
          </div>

          {/* E-Commerce Platforms */}
          <div className="mb-12">
            <h3 className="text-2xl font-bold mb-6 text-card-foreground text-center">E-Commerce Platforms</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {ecommercePlatforms.map((platform, index) => (
                <div 
                  key={index}
                  className="group relative bg-gradient-to-br from-card via-card/80 to-primary/5 border-2 border-border hover:border-primary/50 rounded-3xl p-8 flex flex-col items-center justify-center hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/0 to-primary/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  
                  <div className="text-7xl mb-4 group-hover:scale-110 transition-transform relative z-10">{platform.logo}</div>
                  <div className="text-center font-bold text-xl text-card-foreground mb-2 relative z-10">
                    {platform.name}
                  </div>
                  <div className="text-sm text-primary font-semibold relative z-10">
                    {platform.strength}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Marketplaces */}
          <div>
            <h3 className="text-2xl font-bold mb-6 text-card-foreground text-center">Marketplaces</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {marketplaces.map((platform, index) => (
                <div 
                  key={index}
                  className="group relative bg-gradient-to-br from-card via-card/80 to-secondary/5 border-2 border-border hover:border-secondary/50 rounded-3xl p-8 flex flex-col items-center justify-center hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-secondary/0 to-secondary/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  
                  <div className="text-7xl mb-4 group-hover:scale-110 transition-transform relative z-10">{platform.logo}</div>
                  <div className="text-center font-bold text-xl text-card-foreground mb-2 relative z-10">
                    {platform.name}
                  </div>
                  <div className="text-sm text-secondary font-semibold relative z-10">
                    {platform.strength}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Multi-Channel CTA */}
          <div className="mt-16 text-center bg-gradient-to-r from-primary/10 via-secondary/10 to-primary/10 rounded-3xl p-12 border border-border/50">
            <h3 className="text-3xl font-bold mb-4 text-foreground">Selling on Multiple Channels?</h3>
            <p className="text-lg text-muted-foreground mb-6 max-w-2xl mx-auto">
              We manage your inventory centrally so you never oversell and always ship fast.
            </p>
            <button 
              onClick={() => navigate("/sales-channels")}
              className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-primary-foreground rounded-full font-bold hover:bg-primary/90 transition-colors text-lg"
            >
              See All Supported Platforms →
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PlatformCompatibility;
