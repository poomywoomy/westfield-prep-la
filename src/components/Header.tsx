import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Phone, ChevronDown, Menu, X, ArrowRight } from "lucide-react";
import logo from "@/assets/westfield-logo-original.jpg";
import { useAuth } from "@/hooks/useAuth";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
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
      className={`fixed top-0 left-0 right-0 z-[9999] transition-all duration-300 border-b ${
        isScrolled 
          ? "bg-black/60 backdrop-blur-xl border-white/10 py-2" 
          : "bg-transparent border-transparent py-3"
      }`}
      style={{ transform: 'translateZ(0)' }}
    >
      <div className="container mx-auto px-4 h-full">
        <div className="flex items-center justify-between h-full gap-10">
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

          <nav className="hidden lg:flex items-center gap-6">
            <Link to="/" className="text-gray-200 hover:text-white transition-colors font-medium text-base relative group">
              <span className="relative z-10">Home</span>
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-orange-500 transition-all duration-300 group-hover:w-full z-0"></span>
            </Link>
            
            <Link to="/3pl-los-angeles" className="text-gray-200 hover:text-white transition-colors font-medium text-base relative group">
              <span className="relative z-10">3PL Los Angeles</span>
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-orange-500 transition-all duration-300 group-hover:w-full z-0"></span>
            </Link>

            {/* About Dropdown */}
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="text-base font-medium text-gray-200 hover:text-white bg-transparent hover:bg-transparent data-[state=open]:bg-transparent">
                    About
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid w-[300px] gap-3 p-4 bg-zinc-950/95 backdrop-blur-xl border border-white/10">
                      <li>
                        <NavigationMenuLink asChild>
                          <Link
                            to="/why-choose-us"
                            className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-orange-500/10 text-gray-200 hover:text-white"
                          >
                            <div className="text-sm font-medium leading-none">Why Choose Us</div>
                            <p className="line-clamp-2 text-sm leading-snug text-gray-400">
                              Discover what sets us apart
                            </p>
                          </Link>
                        </NavigationMenuLink>
                      </li>
                      <li>
                        <NavigationMenuLink asChild>
                          <Link
                            to="/testimonials"
                            className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-orange-500/10 text-gray-200 hover:text-white"
                          >
                            <div className="text-sm font-medium leading-none">Testimonials</div>
                            <p className="line-clamp-2 text-sm leading-snug text-gray-400">
                              What our clients say about us
                            </p>
                          </Link>
                        </NavigationMenuLink>
                      </li>
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>

            <Link to="/pricing" className="text-gray-200 hover:text-white transition-colors font-medium text-base relative group">
              <span className="relative z-10">Pricing</span>
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-orange-500 transition-all duration-300 group-hover:w-full z-0"></span>
            </Link>
            <Link to="/blog" className="text-gray-200 hover:text-white transition-colors font-medium text-base relative group">
              <span className="relative z-10">Blog</span>
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-orange-500 transition-all duration-300 group-hover:w-full z-0"></span>
            </Link>
          </nav>

          <div className="hidden lg:flex items-center gap-6">
            <a 
              href="tel:+18189355478" 
              className="flex items-center gap-2 text-orange-500 hover:text-amber-500 transition-all group hover:drop-shadow-[0_0_8px_rgba(249,115,22,0.4)]"
            >
              <Phone className="h-5 w-5 group-hover:scale-110 transition-transform" />
              <span className="font-bold text-base">1.818.935.5478</span>
            </a>
            <button
              onClick={() => navigate("/contact")}
              className="flex items-center gap-2 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-300 shadow-[0_0_20px_rgba(249,115,22,0.3)] hover:shadow-[0_0_30px_rgba(249,115,22,0.6)] hover:-translate-y-0.5"
            >
              Get a Quote
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="flex lg:hidden items-center gap-3">
            <a 
              href="tel:+18189355478" 
              className="text-orange-500 hover:text-amber-500 transition-colors"
            >
              <Phone className="h-5 w-5" />
            </a>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-gray-300 hover:text-white transition-colors"
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="lg:hidden absolute top-full left-0 w-full bg-zinc-950/95 backdrop-blur-xl border-b border-white/10 animate-in slide-in-from-top-5">
          <div className="flex flex-col p-6 gap-4">
            <Link 
              to="/" 
              className="text-lg font-medium text-gray-200 hover:text-orange-500 transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Home
            </Link>
            <Link 
              to="/3pl-los-angeles" 
              className="text-lg font-medium text-gray-200 hover:text-orange-500 transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              3PL Los Angeles
            </Link>
            <Link 
              to="/why-choose-us" 
              className="text-lg font-medium text-gray-200 hover:text-orange-500 transition-colors pl-4"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Why Choose Us
            </Link>
            <Link 
              to="/testimonials" 
              className="text-lg font-medium text-gray-200 hover:text-orange-500 transition-colors pl-4"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Testimonials
            </Link>
            <Link 
              to="/pricing" 
              className="text-lg font-medium text-gray-200 hover:text-orange-500 transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Pricing
            </Link>
            <Link 
              to="/blog" 
              className="text-lg font-medium text-gray-200 hover:text-orange-500 transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Blog
            </Link>
            <button
              onClick={() => { 
                navigate("/contact"); 
                setIsMobileMenuOpen(false); 
              }}
              className="mt-4 w-full text-center bg-gradient-to-r from-orange-600 to-amber-600 text-white py-3 rounded-xl font-medium shadow-lg shadow-orange-500/20"
            >
              Get a Quote
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
