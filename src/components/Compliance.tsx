import { Shield, FileCheck, Award, Flame, Lock, Leaf } from "lucide-react";
import { TranslatedText } from "./TranslatedText";

const Compliance = () => {
  return (
    <section className="py-20 bg-gradient-to-b from-background via-muted/20 to-background relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,hsl(var(--primary)/0.05),transparent_50%),radial-gradient(circle_at_70%_80%,hsl(var(--secondary)/0.05),transparent_50%)]" />
      
      <div className="container mx-auto px-4 relative">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-4 py-2 mb-4">
            <Shield className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-primary"><TranslatedText>Industry-Leading Protection</TranslatedText></span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
            <TranslatedText>Compliance & Safety You Can Trust</TranslatedText>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            <TranslatedText>Your inventory deserves enterprise-grade protection. We've invested in comprehensive insurance, security systems, and sustainable practices to safeguard your business.</TranslatedText>
          </p>
        </div>

        <div className="max-w-6xl mx-auto space-y-8">
          {/* Row 1 - Insurance & Compliance */}
          <div className="grid md:grid-cols-2 gap-8">
            <div className="group p-8 rounded-2xl bg-card border-2 border-border hover:border-primary/40 transition-all hover:shadow-xl">
              <div className="flex items-start gap-6">
                <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                  <Shield className="w-8 h-8 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold mb-3 text-primary"><TranslatedText>Fully Insured Operations</TranslatedText></h3>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    <TranslatedText>General Liability and Warehouse Legal Liability coverage provides complete peace of mind for your inventory. Your products are protected from receiving through shipping.</TranslatedText>
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-3 py-1 bg-primary/10 text-primary text-sm font-medium rounded-full"><TranslatedText>General Liability</TranslatedText></span>
                    <span className="px-3 py-1 bg-primary/10 text-primary text-sm font-medium rounded-full"><TranslatedText>WLL Coverage</TranslatedText></span>
                  </div>
                </div>
              </div>
            </div>

            <div className="group p-8 rounded-2xl bg-card border-2 border-border hover:border-primary/40 transition-all hover:shadow-xl">
              <div className="flex items-start gap-6">
                <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                  <FileCheck className="w-8 h-8 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold mb-3 text-primary"><TranslatedText>Multi-Platform Compliant</TranslatedText></h3>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    <TranslatedText>All prep meets Amazon, Walmart, and Shopify requirements: polybag suffocation warnings, 50-lb box rule, accurate case labels. We stay current with all marketplace requirements.</TranslatedText>
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-3 py-1 bg-secondary/10 text-secondary text-sm font-medium rounded-full">Amazon FBA</span>
                    <span className="px-3 py-1 bg-secondary/10 text-secondary text-sm font-medium rounded-full">Walmart WFS</span>
                    <span className="px-3 py-1 bg-secondary/10 text-secondary text-sm font-medium rounded-full">Shopify</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Row 2 - Quality & Security */}
          <div className="grid md:grid-cols-2 gap-8">
            <div className="group p-8 rounded-2xl bg-card border-2 border-border hover:border-primary/40 transition-all hover:shadow-xl">
              <div className="flex items-start gap-6">
                <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                  <Award className="w-8 h-8 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold mb-3 text-primary"><TranslatedText>Quality Assurance</TranslatedText></h3>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    <TranslatedText>Rigorous inspection processes and photo documentation for every order. Each shipment is verified against ASNs with timestamped quality control photos for full transparency and accountability.</TranslatedText>
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-3 py-1 bg-primary/10 text-primary text-sm font-medium rounded-full"><TranslatedText>Photo QC</TranslatedText></span>
                    <span className="px-3 py-1 bg-primary/10 text-primary text-sm font-medium rounded-full"><TranslatedText>ASN Verification</TranslatedText></span>
                  </div>
                </div>
              </div>
            </div>

            <div className="group p-8 rounded-2xl bg-card border-2 border-border hover:border-primary/40 transition-all hover:shadow-xl">
              <div className="flex items-start gap-6">
                <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                  <Flame className="w-8 h-8 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold mb-3 text-primary"><TranslatedText>Advanced Security Systems</TranslatedText></h3>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    <TranslatedText>24/7 monitoring, fire suppression, and comprehensive theft prevention protocols. Our facility features state-of-the-art security cameras, restricted access zones, and automated fire detection systems.</TranslatedText>
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-3 py-1 bg-primary/10 text-primary text-sm font-medium rounded-full"><TranslatedText>24/7 Surveillance</TranslatedText></span>
                    <span className="px-3 py-1 bg-primary/10 text-primary text-sm font-medium rounded-full"><TranslatedText>Fire Protection</TranslatedText></span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Row 3 - Data & Sustainability */}
          <div className="grid md:grid-cols-2 gap-8">
            <div className="group p-8 rounded-2xl bg-card border-2 border-border hover:border-primary/40 transition-all hover:shadow-xl">
              <div className="flex items-start gap-6">
                <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                  <Lock className="w-8 h-8 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold mb-3 text-primary"><TranslatedText>Data Security & Confidentiality</TranslatedText></h3>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    <TranslatedText>Enterprise-grade data protection with encrypted systems and strict confidentiality agreements to safeguard your business information. Your data and intellectual property are always protected.</TranslatedText>
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-3 py-1 bg-primary/10 text-primary text-sm font-medium rounded-full"><TranslatedText>Encrypted Systems</TranslatedText></span>
                    <span className="px-3 py-1 bg-primary/10 text-primary text-sm font-medium rounded-full"><TranslatedText>NDAs Available</TranslatedText></span>
                  </div>
                </div>
              </div>
            </div>

            <div className="group p-8 rounded-2xl bg-card border-2 border-border hover:border-primary/40 transition-all hover:shadow-xl">
              <div className="flex items-start gap-6">
                <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                  <Leaf className="w-8 h-8 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold mb-3 text-primary"><TranslatedText>Sustainable Practices</TranslatedText></h3>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    <TranslatedText>Eco-friendly operations with recycling programs, energy-efficient facilities, and sustainable packaging materials. We're committed to reducing our environmental impact while maintaining excellence.</TranslatedText>
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-3 py-1 bg-primary/10 text-primary text-sm font-medium rounded-full"><TranslatedText>Recycling Program</TranslatedText></span>
                    <span className="px-3 py-1 bg-primary/10 text-primary text-sm font-medium rounded-full"><TranslatedText>Eco Packaging</TranslatedText></span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Compliance;