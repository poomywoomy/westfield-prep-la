import { useState } from "react";
import { Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

export const NewsletterSignup = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      toast({
        title: "Subscribed!",
        description: "You'll receive our latest articles via email.",
      });
      setEmail("");
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="bg-white border-2 border-[hsl(var(--blog-navy))] rounded-lg p-8 relative overflow-hidden">
      <div className="absolute inset-0 opacity-5" style={{
        backgroundImage: `repeating-linear-gradient(45deg, hsl(var(--blog-navy)) 0px, hsl(var(--blog-navy)) 1px, transparent 1px, transparent 10px)`
      }} />
      
      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-full bg-[hsl(var(--blog-orange))] flex items-center justify-center">
            <Mail className="w-6 h-6 text-white" />
          </div>
          <h3 className="text-2xl font-bold text-[hsl(var(--blog-navy))]">
            Stay Updated with Westfield Insights
          </h3>
        </div>
        
        <p className="text-[hsl(var(--blog-gray-blue))] mb-6">
          Get bi-weekly emails with the latest fulfillment strategies, warehouse optimization tips, and industry insights.
        </p>
        
        <form onSubmit={handleSubscribe} className="flex gap-3">
          <Input
            type="email"
            placeholder="Enter your email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="flex-1 border-[hsl(var(--blog-navy))] focus:border-[hsl(var(--blog-orange))] focus:ring-[hsl(var(--blog-orange))]"
          />
          <Button
            type="submit"
            disabled={loading}
            className="bg-[hsl(var(--blog-orange))] hover:bg-[hsl(var(--blog-orange-hover))] text-white px-8"
          >
            {loading ? "Subscribing..." : "Subscribe"}
          </Button>
        </form>
      </div>
    </div>
  );
};
