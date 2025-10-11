import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import logo from "@/assets/westfield-logo.png";
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

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleLogoClick = (e: React.MouseEvent) => {
    e.preventDefault();
    
    // If user is logged in, refresh the current page
    if (user && role) {
      window.location.reload();
    } else if (isHomePage) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      navigate("/");
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }, 100);
    }
  };

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
            <img src={logo} alt="Westfield Prep Center Logo" className="h-12 w-auto" />
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            {isHomePage ? (
              <>
                <button
                  onClick={() => scrollToSection("services")}
                  className="text-foreground hover:text-primary transition-colors font-medium"
                >
                  Services
                </button>
                <button
                  onClick={() => scrollToSection("pricing")}
                  className="text-foreground hover:text-primary transition-colors font-medium"
                >
                  Pricing
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/"
                  className="text-foreground hover:text-primary transition-colors font-medium"
                >
                  Home
                </Link>
                <button
                  onClick={() => {
                    navigate("/");
                    setTimeout(() => {
                      const element = document.getElementById("services");
                      if (element) element.scrollIntoView({ behavior: "smooth" });
                    }, 100);
                  }}
                  className="text-foreground hover:text-primary transition-colors font-medium"
                >
                  Services
                </button>
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
              </>
            )}
            <Link
              to="/services"
              className="text-foreground hover:text-primary transition-colors font-medium"
            >
              Platforms
            </Link>
            <Link
              to="/faq"
              className="text-foreground hover:text-primary transition-colors font-medium"
            >
              FAQ
            </Link>
            <Button
              onClick={() => navigate("/contact")}
              className="bg-secondary hover:bg-secondary/90 text-secondary-foreground font-semibold"
            >
              Get a Free Quote
            </Button>
          </nav>

          <Button
            onClick={() => navigate("/contact")}
            className="md:hidden bg-secondary hover:bg-secondary/90 text-secondary-foreground"
            size="sm"
          >
            Get a Free Quote
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
