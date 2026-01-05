import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { TranslatedText } from "@/components/TranslatedText";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(2);

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
    
    // Show error toast
    toast.error("Page not found. Redirecting to homepage...");
    
    // Countdown timer
    const countdownInterval = setInterval(() => {
      setCountdown(prev => prev - 1);
    }, 1000);
    
    // Redirect after 2 seconds
    const redirectTimer = setTimeout(() => {
      navigate('/');
    }, 2000);
    
    return () => {
      clearInterval(countdownInterval);
      clearTimeout(redirectTimer);
    };
  }, [location.pathname, navigate]);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex-1 flex items-center justify-center bg-background">
        <div className="text-center">
          <h1 className="mb-4 text-4xl font-bold text-foreground">404</h1>
          <p className="mb-4 text-xl text-muted-foreground">
            <TranslatedText>Oops! Page not found</TranslatedText>
          </p>
          <p className="mb-6 text-sm text-muted-foreground">
            <TranslatedText>Redirecting to homepage in</TranslatedText> {countdown}...
          </p>
          <Button onClick={() => navigate('/')}>
            <TranslatedText>Return to Home Now</TranslatedText>
          </Button>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default NotFound;
