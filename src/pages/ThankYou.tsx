import { Link } from "react-router-dom";
import { CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

const ThankYou = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="flex justify-center">
          <CheckCircle className="h-20 w-20 text-primary" />
        </div>
        
        <h1 className="text-4xl font-bold text-foreground">Thank You!</h1>
        
        <div className="space-y-4">
          <p className="text-lg text-muted-foreground">
            Your information has been submitted successfully.
          </p>
          
          <p className="text-muted-foreground">
            We'll review your details and get back to you shortly.
          </p>
          
          <p className="text-muted-foreground">
            If you have any additional questions, please email us at{" "}
            <a 
              href="mailto:info@westfieldprepcenter.com" 
              className="text-primary hover:underline font-medium"
            >
              info@westfieldprepcenter.com
            </a>
          </p>
        </div>
        
        <div className="pt-6">
          <Button asChild size="lg">
            <Link to="/">Return to Home</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ThankYou;
