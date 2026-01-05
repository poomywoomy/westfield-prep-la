import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { FileText, CheckCircle2, Loader2 } from "lucide-react";
import { TranslatedText } from "@/components/TranslatedText";

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
      const { data, error } = await supabase.functions.invoke('process-lead-magnet', {
        body: { email, fullName }
      });

      if (error) throw error;

      toast.success("Success! Check your email for the download link.", {
        duration: 5000,
        icon: <CheckCircle2 className="w-5 h-5" />
      });
      
      setEmail("");
      setFullName("");
    } catch (error: any) {
      console.error("Error:", error);
      toast.error(error.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="quote-form" className="py-24 bg-gradient-to-br from-primary/10 via-background to-primary/5">
      <div className="container mx-auto px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left: Guide Info */}
            <div className="space-y-6">
              <div className="inline-block px-4 py-2 bg-primary/10 rounded-full mb-4">
                <span className="text-primary font-semibold text-sm"><TranslatedText>FREE DOWNLOAD</TranslatedText></span>
              </div>
              
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground leading-tight">
                <TranslatedText>The Complete Guide to Choosing a Fulfillment Partner</TranslatedText>
              </h2>
              
              <p className="text-lg text-muted-foreground leading-relaxed">
                <TranslatedText>Everything you need to know before outsourcing your e-commerce logistics. No fluff, just actionable insights.</TranslatedText>
              </p>

              <div className="space-y-4 pt-4">
                {[
                  "15 questions to ask before signing with a fulfillment partner",
                  "Pricing models explained (so you don't get surprised)",
                  "Red flags to watch for",
                  "How to evaluate turnaround times and accuracy",
                  "Onboarding checklist"
                ].map((item, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center mt-0.5">
                      <CheckCircle2 className="w-4 h-4 text-primary" />
                    </div>
                    <span className="text-foreground/80 leading-relaxed"><TranslatedText>{item}</TranslatedText></span>
                  </div>
                ))}
              </div>

              {/* PDF Mockup */}
              <div className="relative mt-8 p-8 bg-gradient-to-br from-card via-card to-primary/5 border border-border rounded-2xl shadow-xl">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-primary/20 rounded-xl flex items-center justify-center">
                    <FileText className="w-10 h-10 text-primary" />
                  </div>
                  <div>
                    <p className="font-bold text-foreground"><TranslatedText>50+ Pages</TranslatedText></p>
                    <p className="text-sm text-muted-foreground"><TranslatedText>Comprehensive Guide (PDF)</TranslatedText></p>
                  </div>
                </div>
                <div className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                  <TranslatedText>FREE</TranslatedText>
                </div>
              </div>
            </div>

            {/* Right: Email Capture Form */}
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-3xl blur-3xl"></div>
              <div className="relative bg-card border-2 border-border rounded-2xl p-8 md:p-10 shadow-2xl">
                <div className="mb-6 text-center">
                  <h3 className="text-2xl font-bold text-foreground mb-2">
                    <TranslatedText>Get Your Free Copy</TranslatedText>
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    <TranslatedText>Instant access. No credit card required.</TranslatedText>
                  </p>
                </div>

                <form onSubmit={handleDownload} className="space-y-5">
                  <div>
                    <Label htmlFor="fullName" className="text-sm font-medium">
                      <TranslatedText>Full Name</TranslatedText> *
                    </Label>
                    <Input
                      id="fullName"
                      type="text"
                      placeholder="John Doe"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      required
                      disabled={loading}
                      className="mt-2 h-12 text-base"
                    />
                  </div>

                  <div>
                    <Label htmlFor="email" className="text-sm font-medium">
                      <TranslatedText>Email Address</TranslatedText> *
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      disabled={loading}
                      className="mt-2 h-12 text-base"
                    />
                  </div>

                  <Button 
                    type="submit" 
                    size="lg"
                    disabled={loading}
                    className="w-full h-12 text-base font-semibold bg-secondary hover:bg-secondary/90 text-white shadow-lg hover:shadow-xl transition-all hover:scale-[1.02]"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        <TranslatedText>Sending to your email...</TranslatedText>
                      </>
                    ) : (
                      <>
                        <FileText className="w-5 h-5 mr-2" />
                        <TranslatedText>Download Free Guide</TranslatedText>
                      </>
                    )}
                  </Button>

                  <p className="text-xs text-muted-foreground text-center pt-2">
                    <TranslatedText>🔒 We respect your privacy. Your information will never be shared with third parties.</TranslatedText>
                  </p>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LeadMagnet;
