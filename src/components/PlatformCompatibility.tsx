import { useNavigate } from "react-router-dom";

const PlatformCompatibility = () => {
  const navigate = useNavigate();

  const platforms = [
    { name: "Shopify", logo: "🛍️" },
    { name: "Amazon", logo: "📦" },
    { name: "WooCommerce", logo: "🛒" },
    { name: "BigCommerce", logo: "🏪" },
    { name: "TikTok Shop", logo: "🎵" },
    { name: "Walmart", logo: "🏬" },
    { name: "Etsy", logo: "🎨" },
    { name: "eBay", logo: "🔨" }
  ];

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-6 text-foreground">
            Works With Your Selling Platform
          </h2>
          
          <p className="text-lg text-muted-foreground text-center mb-12 max-w-3xl mx-auto">
            We support e-commerce brands selling on all major platforms. Our fulfillment operations adapt to your specific workflow, ensuring accurate orders and fast delivery no matter where your customers find you.
          </p>

          {/* Platform Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-10">
            {platforms.map((platform, index) => (
              <div 
                key={index}
                className="bg-card border border-border rounded-xl p-6 flex flex-col items-center justify-center hover:shadow-lg transition-all hover:-translate-y-1"
              >
                <div className="text-5xl mb-3">{platform.logo}</div>
                <div className="text-center font-semibold text-card-foreground">
                  {platform.name}
                </div>
              </div>
            ))}
          </div>

          {/* Multi-Channel Message */}
          <div className="text-center">
            <p className="text-muted-foreground mb-4">
              Selling on multiple channels? We manage your inventory centrally so you never oversell and always ship fast.
            </p>
            <button 
              onClick={() => navigate("/sales-channels")}
              className="text-primary hover:underline font-medium"
            >
              See all supported platforms →
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PlatformCompatibility;
