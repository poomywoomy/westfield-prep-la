import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Phone } from "lucide-react";
import logo from "@/assets/westfield-logo-original.jpg";
import { useAuth } from "@/hooks/useAuth";

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

  // Hide header on dashboard/settings routes
  const dashboardRoutes = ['/admin/dashboard', '/client/dashboard', '/admin/settings', '/client/settings'];
  const isDashboardRoute = dashboardRoutes.includes(location.pathname);
  
  if (user && role && isDashboardRoute) {
    return null;
  }

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? "bg-background shadow-md h-20" : "bg-background/95 backdrop-blur-sm h-24"
      }`}
    >
      <div className="container mx-auto px-4 h-full">
        <div className="flex items-center justify-between h-full">
          <Link 
            to="/" 
            className="flex items-center cursor-pointer p-2 rounded-md hover:bg-accent transition-colors"
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

          <nav className="hidden md:flex items-center gap-8">
            <Link to="/" className="text-foreground hover:text-primary transition-colors font-medium text-base">
              Home
            </Link>
            <Link to="/why-choose-us" className="text-foreground hover:text-primary transition-colors font-medium text-base">
              About
            </Link>
            <Link to="/pricing" className="text-foreground hover:text-primary transition-colors font-medium text-base">
              Pricing
            </Link>
            <Link to="/blog" className="text-foreground hover:text-primary transition-colors font-medium text-base">
              Blog
            </Link>
          </nav>

          <div className="hidden lg:flex items-center gap-6">
            <a 
              href="tel:+18189355478" 
              className="flex items-center gap-2 text-primary hover:text-secondary transition-colors group"
            >
              <Phone className="h-5 w-5 group-hover:scale-110 transition-transform" />
              <span className="font-bold text-base">1.818.935.5478</span>
            </a>
            <Button
              onClick={() => navigate("/contact")}
              size="lg"
              className="bg-secondary hover:bg-secondary/90 text-secondary-foreground font-semibold px-8"
            >
              Get a Free Quote
            </Button>
          </div>

          <div className="flex lg:hidden items-center gap-3">
            <a 
              href="tel:+18189355478" 
              className="flex items-center gap-1 text-primary hover:text-secondary transition-colors"
            >
              <Phone className="h-5 w-5" />
            </a>
            <Button
              onClick={() => navigate("/contact")}
              className="bg-secondary hover:bg-secondary/90 text-secondary-foreground font-semibold"
              size="sm"
            >
              Get Quote
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
