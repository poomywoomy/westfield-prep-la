import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import logo from "@/assets/westfield-logo.png";

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
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
    setIsMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? "bg-primary shadow-lg" : "bg-primary"
      }`}
    >
      <div className="container mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-[88px]">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <img 
              src={logo} 
              alt="Westfield Prep Center Logo" 
              className="h-14 w-auto transition-transform hover:scale-105 duration-200" 
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-10">
            {isHomePage ? (
              <>
                <button
                  onClick={() => scrollToSection("services")}
                  className="text-white font-medium text-[15px] hover:text-secondary transition-colors duration-200"
                >
                  Services
                </button>
                <button
                  onClick={() => scrollToSection("pricing")}
                  className="text-white font-medium text-[15px] hover:text-secondary transition-colors duration-200"
                >
                  Pricing
                </button>
              </>
            ) : (
              <Link
                to="/"
                className="text-white font-medium text-[15px] hover:text-secondary transition-colors duration-200"
              >
                Home
              </Link>
            )}
            <Link
              to="/faq"
              className="text-white font-medium text-[15px] hover:text-secondary transition-colors duration-200"
            >
              FAQ
            </Link>
            <Button
              onClick={() => isHomePage ? scrollToSection("contact") : window.location.href = "/#contact"}
              className="bg-secondary hover:bg-secondary/90 text-white font-semibold px-6 py-5 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 hover:scale-105"
            >
              Get Started
            </Button>
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden text-white p-2 hover:bg-white/10 rounded-md transition-colors"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-primary border-t border-white/10 animate-fade-in">
          <nav className="container mx-auto px-6 py-6 flex flex-col gap-4">
            {isHomePage ? (
              <>
                <button
                  onClick={() => scrollToSection("services")}
                  className="text-white font-medium text-[15px] hover:text-secondary transition-colors py-2 text-left"
                >
                  Services
                </button>
                <button
                  onClick={() => scrollToSection("pricing")}
                  className="text-white font-medium text-[15px] hover:text-secondary transition-colors py-2 text-left"
                >
                  Pricing
                </button>
              </>
            ) : (
              <Link
                to="/"
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-white font-medium text-[15px] hover:text-secondary transition-colors py-2"
              >
                Home
              </Link>
            )}
            <Link
              to="/faq"
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-white font-medium text-[15px] hover:text-secondary transition-colors py-2"
            >
              FAQ
            </Link>
            <Button
              onClick={() => {
                setIsMobileMenuOpen(false);
                isHomePage ? scrollToSection("contact") : window.location.href = "/#contact";
              }}
              className="bg-secondary hover:bg-secondary/90 text-white font-semibold mt-2 rounded-lg shadow-md"
            >
              Get Started
            </Button>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
