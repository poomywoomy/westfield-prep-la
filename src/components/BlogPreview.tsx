import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { TranslatedText } from "@/components/TranslatedText";

const BlogPreview = () => {
  const navigate = useNavigate();

  const articles = [
    {
      category: "3PL Logistics",
      title: "How to Choose a 3PL in Los Angeles",
      excerpt: "Essential factors to consider when selecting a fulfillment partner for your growing ecommerce brand.",
      slug: "choose-best-prep-center-los-angeles",
    },
    {
      category: "Shopify",
      title: "Shopify Fulfillment Best Practices",
      excerpt: "Optimize your Shopify store with proven fulfillment strategies that scale with your business.",
      slug: "shopify-3pl-services-los-angeles",
    },
    {
      category: "Amazon FBA",
      title: "Amazon FBA vs 3PL: Which is Better?",
      excerpt: "Compare Amazon FBA and third-party logistics to determine the best fulfillment solution for your brand.",
      slug: "amazon-fba-prep-center-los-angeles",
    },
  ];

  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              <TranslatedText>E-Commerce Insights & Resources</TranslatedText>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              <TranslatedText>Expert guidance on 3PL logistics, fulfillment optimization, and scaling your online business.</TranslatedText>
            </p>
          </div>

          {/* Article Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {articles.map((article, index) => (
              <Card
                key={index}
                className="group cursor-pointer overflow-hidden bg-card hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                onClick={() => navigate(`/blog/${article.slug}`)}
              >
                {/* Placeholder Image */}
                <div className="aspect-video bg-gradient-to-br from-primary/10 via-secondary/5 to-primary/5 overflow-hidden">
                  <div className="w-full h-full flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                    <div className="text-6xl text-primary/20">📦</div>
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-6 space-y-3">
                  <Badge variant="secondary" className="bg-secondary/10 text-secondary hover:bg-secondary/20">
                    <TranslatedText>{article.category}</TranslatedText>
                  </Badge>
                  
                  <h3 className="text-xl font-bold text-foreground group-hover:text-secondary transition-colors duration-200">
                    <TranslatedText>{article.title}</TranslatedText>
                  </h3>
                  
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    <TranslatedText>{article.excerpt}</TranslatedText>
                  </p>

                  <div className="flex items-center text-secondary font-semibold text-sm pt-2">
                    <TranslatedText>Read More</TranslatedText>
                    <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default BlogPreview;
