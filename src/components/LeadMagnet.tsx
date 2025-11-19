import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Download, CheckCircle } from "lucide-react";

const LeadMagnet = () => {
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);

  const handleDownload = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !fullName) {
      toast.error("Please fill in all fields");
      return;
    }

    setLoading(true);

    try {
      // Store lead in database
      const { error } = await supabase
        .from('lead_magnet_downloads')
        .insert({
          email,
          full_name: fullName,
          guide_type: 'fulfillment_partner_guide'
        });

      if (error) throw error;

      toast.success("Success! Check your email for the download link.");
      setEmail("");
      setFullName("");
    } catch (error: any) {
      console.error("Error:", error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const checklist = [
    "15 questions to ask before signing with a fulfillment partner",
    "Pricing models explained (so you don't get surprised)",
    "Red flags to watch for",
    "How to evaluate turnaround times and accuracy",
    "Onboarding checklist"
  ];

  return (
    <section className="py-24 bg-gradient-to-br from-primary/10 via-secondary/5 to-primary/10">
      <div className="container mx-auto px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left: Guide Info */}
            <div className="space-y-6">
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-foreground">
                Free Guide: Choosing the Right Fulfillment Partner
              </h2>
              
              <p className="text-muted-foreground mb-6 leading-relaxed">
                Not sure what to look for in a 3PL? Download our comprehensive guide covering:
              </p>

              <ul className="space-y-3 mb-8">
                {[
                  "15 questions to ask before signing with a fulfillment partner",
                  "Pricing models explained (so you don't get surprised)",
                  "Red flags to watch for",
                  "How to evaluate turnaround times and accuracy",
                  "Onboarding checklist"
                ].map((item, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <span className="text-primary mt-1">✓</span>
                    <span className="text-muted-foreground">{item}</span>
                  </li>
                ))}
              </ul>

              {/* Mock PDF Image */}
              <div className="bg-card border border-border rounded-lg p-6 flex items-center justify-center">
                <Download className="w-16 h-16 text-primary/30" />
              </div>
            </div>

            {/* Right: Email Capture Form */}
            <div className="bg-card border border-border rounded-xl p-8 shadow-lg">
              <form onSubmit={handleDownload} className="space-y-6">
                <div>
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input
                    id="fullName"
                    type="text"
                    placeholder="John Doe"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="mt-2"
                  />
                </div>

                <Button 
                  type="submit" 
                  size="lg"
                  disabled={loading}
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                >
                  {loading ? "Sending..." : "Download Free Guide"}
                </Button>

                <p className="text-xs text-muted-foreground text-center">
                  We respect your privacy. Unsubscribe anytime.
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LeadMagnet;
