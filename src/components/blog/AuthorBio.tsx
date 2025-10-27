import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Building2, Mail } from "lucide-react";

interface AuthorBioProps {
  authorName?: string;
  authorBio?: string;
}

export const AuthorBio = ({ 
  authorName = "Westfield Prep Center Team",
  authorBio = "Expert team at Westfield Prep Center with years of experience in e-commerce fulfillment, Amazon FBA prep, and Shopify logistics."
}: AuthorBioProps) => {
  return (
    <Card className="mt-12 bg-gradient-to-br from-muted/50 to-muted/30 border-primary/20">
      <CardContent className="p-8">
        <div className="flex items-start gap-6">
          <div className="flex-shrink-0">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
              <Building2 className="w-10 h-10 text-white" />
            </div>
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between flex-wrap gap-4 mb-3">
              <div>
                <h3 className="text-xl font-bold text-foreground">Written by {authorName}</h3>
                <p className="text-sm text-muted-foreground">E-commerce Fulfillment Experts</p>
              </div>
              <Link to="/contact">
                <Button variant="default" size="sm" className="gap-2">
                  <Mail className="h-4 w-4" />
                  Contact Us
                </Button>
              </Link>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed mb-4">
              {authorBio}
            </p>
            <div className="flex flex-wrap gap-4 text-sm">
              <Link to="/amazon-fba-prep" className="text-primary hover:underline">
                Amazon FBA Prep
              </Link>
              <span className="text-muted-foreground">•</span>
              <Link to="/shopify-fulfillment" className="text-primary hover:underline">
                Shopify Fulfillment
              </Link>
              <span className="text-muted-foreground">•</span>
              <Link to="/why-choose-us" className="text-primary hover:underline">
                Why Choose Us
              </Link>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
