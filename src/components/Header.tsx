import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Phone, Calendar, ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SiShopify, SiAmazon, SiTiktok, SiWalmart, SiEtsy, SiWoo } from "react-icons/si";
import logo from "@/assets/westfield-logo-original.jpg";
import { useAuth } from "@/hooks/useAuth";
import { trackEvent } from "@/lib/analytics";
import CalendlyModal from "./CalendlyModal";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { TranslatedText } from "./TranslatedText";

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [calendlyOpen, setCalendlyOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, role } = useAuth();
  const isHomePage = location.pathname === "/";

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogoClick = (e: React.MouseEvent) => {
    e.preventDefault();
    
    if (isHomePage) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      navigate("/");
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }, 100);
    }
  };

  const handleScheduleCall = () => {
    trackEvent('schedule_call_clicked', { location: 'header' });
    setCalendlyOpen(true);
  };

  // Hide header on dashboard/settings routes
  const dashboardRoutes = ['/admin/dashboard', '/client/dashboard', '/admin/settings', '/client/settings'];
  const isDashboardRoute = dashboardRoutes.includes(location.pathname);
  
  if (user && role && isDashboardRoute) {
    return null;
  }

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled ? "bg-background shadow-md h-24" : "bg-background/95 backdrop-blur-sm h-28"
        }`}
        style={{ willChange: 'height' }}
      >
        <div className="container mx-auto px-4 h-full">
          <div className="flex items-center justify-between h-full gap-6">
            <Link 
              to="/" 
              className="flex items-center cursor-pointer p-1 rounded-md hover:bg-accent transition-colors"
              onClick={handleLogoClick}
            >
              <img 
                src={logo} 
                alt="Los Angeles Prep Center | Westfield Fulfillment Logo" 
                className="h-16 w-auto object-contain" 
                width="147" 
                height="56"
              />
            </Link>

            <nav className="hidden lg:flex items-center gap-8">
              <Link to="/" className="text-foreground hover:text-primary transition-colors font-medium text-sm whitespace-nowrap">
                <TranslatedText>Home</TranslatedText>
              </Link>
              
              <Link to="/pricing" className="text-foreground hover:text-primary transition-colors font-medium text-sm flex items-center gap-1 whitespace-nowrap">
                <span className="text-secondary"><TranslatedText>See Your Savings</TranslatedText></span>
              </Link>
              
              {/* Sales Channels Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger className="flex items-center gap-1 text-foreground hover:text-primary transition-colors font-medium text-sm focus:outline-none whitespace-nowrap">
                  <TranslatedText>Sales Channels</TranslatedText>
                  <ChevronDown className="h-4 w-4" />
                </DropdownMenuTrigger>
                <DropdownMenuContent 
                  align="start" 
                  className="w-64 bg-background border border-border shadow-lg z-[60]"
                >
                  <DropdownMenuLabel className="text-xs text-muted-foreground uppercase tracking-wider">
                    Featured Platforms
                  </DropdownMenuLabel>
                  
                  <DropdownMenuItem onClick={() => navigate("/sales-channels")} className="cursor-pointer">
                    <SiShopify className="mr-2 h-4 w-4 text-[#5E8E3E]" />
                    Shopify
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate("/sales-channels")} className="cursor-pointer">
                    <SiAmazon className="mr-2 h-4 w-4 text-[#FF9900]" />
                    Amazon
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate("/sales-channels")} className="cursor-pointer">
                    <SiTiktok className="mr-2 h-4 w-4" />
                    TikTok Shop
                  </DropdownMenuItem>
                  
                  <DropdownMenuSeparator />
                  
                  <DropdownMenuLabel className="text-xs text-muted-foreground uppercase tracking-wider">
                    More Platforms
                  </DropdownMenuLabel>
                  
                  <DropdownMenuItem onClick={() => navigate("/sales-channels")} className="cursor-pointer">
                    <SiWalmart className="mr-2 h-4 w-4 text-[#0057A0]" />
                    Walmart
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate("/sales-channels")} className="cursor-pointer">
                    <SiEtsy className="mr-2 h-4 w-4 text-[#D5581D]" />
                    Etsy
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate("/sales-channels")} className="cursor-pointer">
                    <SiWoo className="mr-2 h-4 w-4 text-[#674399]" />
                    WooCommerce
                  </DropdownMenuItem>
                  
                  <DropdownMenuSeparator />
                  
                  <DropdownMenuItem 
                    onClick={() => navigate("/sales-channels")} 
                    className="cursor-pointer font-medium text-primary"
                  >
                    View All Channels →
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              
              <Link to="/integrations" className="text-foreground hover:text-primary transition-colors font-medium text-sm whitespace-nowrap">
                <TranslatedText>Integrations</TranslatedText>
              </Link>

              <Link to="/why-choose-us" className="text-foreground hover:text-primary transition-colors font-medium text-sm whitespace-nowrap">
                <TranslatedText>Why Choose Us</TranslatedText>
              </Link>

              <Link to="/testimonials" className="text-foreground hover:text-primary transition-colors font-medium text-sm whitespace-nowrap">
                <TranslatedText>Testimonials</TranslatedText>
              </Link>

              <Link to="/blog" className="text-foreground hover:text-primary transition-colors font-medium text-sm whitespace-nowrap">
                <TranslatedText>Blog</TranslatedText>
              </Link>
            </nav>

            <div className="hidden xl:flex items-center gap-3">
              <a 
                href="tel:+18189355478" 
                className="flex items-center gap-2 text-primary hover:text-secondary transition-colors group"
              >
                <Phone className="h-4 w-4 group-hover:scale-110 transition-transform" />
                <span className="font-bold text-sm">1.818.935.5478</span>
              </a>
              <Button
                onClick={handleScheduleCall}
                variant="outline"
                size="default"
                className="border-secondary text-secondary hover:bg-secondary hover:text-secondary-foreground font-semibold"
              >
                <Calendar className="w-4 h-4 mr-2" />
                <TranslatedText>Schedule a Call</TranslatedText>
              </Button>
              <Button
                onClick={() => navigate("/contact")}
                size="default"
                className="bg-secondary hover:bg-secondary/90 text-secondary-foreground font-semibold"
              >
                <TranslatedText>Get a Quote</TranslatedText>
              </Button>
              <LanguageSwitcher variant="compact" />
            </div>

            <div className="flex lg:hidden items-center gap-2">
              <a 
                href="tel:+18189355478" 
                className="flex items-center gap-1 text-primary hover:text-secondary transition-colors"
              >
                <Phone className="h-5 w-5" />
              </a>
              <Button
                onClick={handleScheduleCall}
                variant="outline"
                size="sm"
                className="border-secondary text-secondary"
              >
                <Calendar className="w-4 h-4" />
              </Button>
              <Button
                onClick={() => navigate("/contact")}
                className="bg-secondary hover:bg-secondary/90 text-secondary-foreground font-semibold"
                size="sm"
              >
                <TranslatedText>Get Quote</TranslatedText>
              </Button>
              <LanguageSwitcher variant="compact" />
            </div>
          </div>
        </div>
      </header>

      <CalendlyModal open={calendlyOpen} onOpenChange={setCalendlyOpen} />
    </>
  );
};

export default Header;