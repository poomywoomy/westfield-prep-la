import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Phone, Calendar, ChevronDown } from "lucide-react";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { SiShopify, SiAmazon, SiTiktok, SiWalmart, SiEtsy, SiWoo } from "react-icons/si";
import logo from "@/assets/westfield-logo.png";
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
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 py-3 ${
          isScrolled ? "bg-background shadow-md" : "bg-background/95 backdrop-blur-sm"
        }`}
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between gap-6">
            <Link 
              to="/" 
              className="flex items-center flex-shrink-0 cursor-pointer py-2 px-2 rounded-md hover:bg-accent/50 hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-all"
              onClick={handleLogoClick}
            >
              <img 
                src={logo} 
                alt="Los Angeles Prep Center | Westfield Fulfillment Logo" 
                className="h-8 md:h-10 w-auto object-contain block" 
              />
            </Link>

            <nav className="hidden lg:flex items-center gap-8">
              <Link to="/" className="text-foreground hover:text-primary transition-colors font-medium text-sm whitespace-nowrap">
                <TranslatedText>Home</TranslatedText>
              </Link>
              
              <Link to="/pricing" className="text-foreground hover:text-primary transition-colors font-medium text-sm flex items-center gap-1 whitespace-nowrap">
                <span className="text-secondary"><TranslatedText>See Your Savings</TranslatedText></span>
              </Link>
              
              {/* Sales Channels Dropdown - Hover-based */}
              <NavigationMenu>
                <NavigationMenuList>
                  <NavigationMenuItem>
                    <NavigationMenuTrigger className="bg-transparent hover:bg-transparent data-[state=open]:bg-transparent text-foreground hover:text-primary font-medium text-sm h-auto p-0">
                      <TranslatedText>Sales Channels</TranslatedText>
                    </NavigationMenuTrigger>
                    <NavigationMenuContent className="bg-background border border-border shadow-lg z-[60]">
                      <div className="w-64 p-2">
                        <div className="text-xs text-muted-foreground uppercase tracking-wider px-2 py-1.5">
                          Featured Platforms
                        </div>
                        
                        <Link 
                          to="/sales-channels/shopify" 
                          className="flex items-center px-2 py-2 text-sm rounded-md hover:bg-accent cursor-pointer"
                        >
                          <SiShopify className="mr-2 h-4 w-4 text-[#5E8E3E]" />
                          Shopify
                        </Link>
                        <Link 
                          to="/sales-channels/amazon" 
                          className="flex items-center px-2 py-2 text-sm rounded-md hover:bg-accent cursor-pointer"
                        >
                          <SiAmazon className="mr-2 h-4 w-4 text-[#FF9900]" />
                          Amazon
                        </Link>
                        <Link 
                          to="/sales-channels/tiktok-shop" 
                          className="flex items-center px-2 py-2 text-sm rounded-md hover:bg-accent cursor-pointer"
                        >
                          <SiTiktok className="mr-2 h-4 w-4" />
                          TikTok Shop
                        </Link>
                        
                        <div className="h-px bg-border my-2" />
                        
                        <div className="text-xs text-muted-foreground uppercase tracking-wider px-2 py-1.5">
                          More Platforms
                        </div>
                        
                        <Link 
                          to="/sales-channels/walmart" 
                          className="flex items-center px-2 py-2 text-sm rounded-md hover:bg-accent cursor-pointer"
                        >
                          <SiWalmart className="mr-2 h-4 w-4 text-[#0057A0]" />
                          Walmart
                        </Link>
                        <Link 
                          to="/sales-channels/etsy" 
                          className="flex items-center px-2 py-2 text-sm rounded-md hover:bg-accent cursor-pointer"
                        >
                          <SiEtsy className="mr-2 h-4 w-4 text-[#D5581D]" />
                          Etsy
                        </Link>
                        <Link 
                          to="/sales-channels/woocommerce" 
                          className="flex items-center px-2 py-2 text-sm rounded-md hover:bg-accent cursor-pointer"
                        >
                          <SiWoo className="mr-2 h-4 w-4 text-[#674399]" />
                          WooCommerce
                        </Link>
                        
                        <div className="h-px bg-border my-2" />
                        
                        <Link 
                          to="/sales-channels" 
                          className="flex items-center px-2 py-2 text-sm rounded-md hover:bg-accent cursor-pointer font-medium text-primary"
                        >
                          View All Channels →
                        </Link>
                      </div>
                    </NavigationMenuContent>
                  </NavigationMenuItem>
                </NavigationMenuList>
              </NavigationMenu>
              
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

            <div className="hidden xl:flex items-center gap-4 ml-6">
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

            <div className="flex lg:hidden items-center gap-3">
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