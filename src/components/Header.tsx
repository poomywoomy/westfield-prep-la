import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Phone, Clock, ChevronDown } from "lucide-react";
import logo from "@/assets/westfield-logo-original.jpg";
import { useAuth } from "@/hooks/useAuth";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
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

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

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

  // Only hide header on dashboard/settings routes
  const dashboardRoutes = ['/admin/dashboard', '/client/dashboard', '/admin/settings', '/client/settings'];
  const isDashboardRoute = dashboardRoutes.includes(location.pathname);
  
  if (user && role && isDashboardRoute) {
    return null;
  }

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? "bg-background shadow-md" : "bg-background/95 backdrop-blur-sm"
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link 
            to="/" 
            className="flex items-center cursor-pointer"
            onClick={handleLogoClick}
          >
            <img src={logo} alt="Westfield Prep Center Logo" className="h-12 w-auto" width="147" height="48" />
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            <Link to="/" className="text-foreground hover:text-primary transition-colors font-medium">
              Home
            </Link>
            {isHomePage ? (
              <button
                onClick={() => scrollToSection("pricing")}
                className="text-foreground hover:text-primary transition-colors font-medium"
              >
                Pricing
              </button>
            ) : (
              <button
                onClick={() => {
                  navigate("/");
                  setTimeout(() => {
                    const element = document.getElementById("pricing");
                    if (element) element.scrollIntoView({ behavior: "smooth" });
                  }, 100);
                }}
                className="text-foreground hover:text-primary transition-colors font-medium"
              >
                Pricing
              </button>
            )}
            <HoverCard openDelay={100} closeDelay={200}>
              <HoverCardTrigger className="text-foreground hover:text-primary transition-colors font-medium cursor-pointer flex items-center gap-1">
                About Us
                <ChevronDown className="h-4 w-4" />
              </HoverCardTrigger>
              <HoverCardContent className="w-48 p-2 bg-background border shadow-lg z-[100]">
                <div className="flex flex-col gap-1">
                  <Link
                    to="/why-choose-us"
                    className="px-3 py-2 rounded-md text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-colors"
                  >
                    Why Choose Us
                  </Link>
                  <Link
                    to="/faq"
                    className="px-3 py-2 rounded-md text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-colors"
                  >
                    FAQ
                  </Link>
                </div>
              </HoverCardContent>
            </HoverCard>
            <Link to="/shopify-fulfillment" className="text-foreground hover:text-primary transition-colors font-bold">
              Shopify Fulfillment
            </Link>
            <Link to="/amazon-fba-prep" className="text-foreground hover:text-primary transition-colors font-medium">
              Amazon FBA
            </Link>
            <Link to="/tiktok-shop-fulfillment" className="text-foreground hover:text-primary transition-colors font-medium">
              TikTok Shop
            </Link>
            <Link to="/blog" className="text-foreground hover:text-primary transition-colors font-medium">
              Blog
            </Link>
          </nav>

          <div className="hidden lg:flex items-center gap-4">
            <a 
              href="tel:+18189355478" 
              className="flex items-center gap-2 text-primary hover:text-secondary transition-colors group"
            >
              <Phone className="h-4 w-4 group-hover:scale-110 transition-transform" />
              <div className="flex flex-col items-start">
                <span className="font-bold text-sm">1.818.935.5478</span>
                <span className="text-xs text-muted-foreground flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  Mon-Sun | 9am-8pm PST
                </span>
              </div>
            </a>
            {user && role ? (
              <Button
                onClick={() => navigate(role === 'admin' ? '/admin/dashboard' : '/client/dashboard')}
                className="bg-secondary hover:bg-secondary/90 text-secondary-foreground font-semibold"
              >
                Dashboard
              </Button>
            ) : (
              <Button
                onClick={() => navigate("/contact")}
                className="bg-secondary hover:bg-secondary/90 text-secondary-foreground font-semibold"
              >
                Get a Free Quote
              </Button>
            )}
          </div>

          <div className="flex lg:hidden items-center gap-2">
            <a 
              href="tel:+18189355478" 
              className="flex items-center gap-1 text-primary hover:text-secondary transition-colors"
            >
              <Phone className="h-4 w-4" />
              <span className="font-semibold text-sm hidden md:inline">1.818.935.5478</span>
            </a>
            {user && role ? (
              <Button
                onClick={() => navigate(role === 'admin' ? '/admin/dashboard' : '/client/dashboard')}
                className="bg-secondary hover:bg-secondary/90 text-secondary-foreground"
                size="sm"
              >
                Dashboard
              </Button>
            ) : (
              <Button
                onClick={() => navigate("/contact")}
                className="bg-secondary hover:bg-secondary/90 text-secondary-foreground"
                size="sm"
              >
                Get a Free Quote
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
