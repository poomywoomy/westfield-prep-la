import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import logo from "@/assets/westfield-logo.png";

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
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

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? "bg-background shadow-md" : "bg-background/95 backdrop-blur-sm"
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <img src={logo} alt="Westfield Prep Center Logo" className="h-12 w-auto" />
          </div>

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
              <Link
                to="/"
                className="text-foreground hover:text-primary transition-colors font-medium"
              >
                Home
              </Link>
            )}
            <Link
              to="/faq"
              className="text-foreground hover:text-primary transition-colors font-medium"
            >
              FAQ
            </Link>
            <Button
              onClick={() => isHomePage ? scrollToSection("contact") : window.location.href = "/#contact"}
              className="bg-secondary hover:bg-secondary/90 text-secondary-foreground font-semibold"
            >
              Get Started
            </Button>
          </nav>

          <Button
            onClick={() => scrollToSection("contact")}
            className="md:hidden bg-secondary hover:bg-secondary/90 text-secondary-foreground"
            size="sm"
          >
            Get Started
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
