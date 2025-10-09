import { Link } from "react-router-dom";
import { Mail, MapPin, Phone } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-primary text-white py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h3 className="text-2xl font-bold mb-6">Westfield Prep Center</h3>

          <div className="flex flex-col md:flex-row justify-center items-center gap-6 mb-8">
            <div className="flex items-center gap-2">
              <Phone className="w-5 h-5 text-secondary" />
              <a
                href="tel:+18189355478"
                className="hover:text-secondary transition-colors"
              >
                +1 (818) 935-5478
              </a>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="w-5 h-5 text-secondary" />
              <a
                href="mailto:info@westfieldprepcenter.com"
                className="hover:text-secondary transition-colors"
              >
                info@westfieldprepcenter.com
              </a>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-secondary" />
              <span>Los Angeles, CA</span>
            </div>
          </div>

          <div className="border-t border-white/20 pt-6">
            <p className="text-sm text-white/80">
              Westfield Prep Center — a DBA of Sathatham LLC
            </p>
            <div className="flex justify-center flex-wrap gap-4 mt-3 mb-2">
              <Link
                to="/services"
                className="text-xs text-white/80 hover:text-secondary transition-colors"
              >
                Platforms
              </Link>
              <span className="text-white/40">•</span>
              <Link
                to="/faq"
                className="text-xs text-white/80 hover:text-secondary transition-colors"
              >
                FAQ
              </Link>
              <span className="text-white/40">•</span>
              <Link
                to="/contact"
                className="text-xs text-white/80 hover:text-secondary transition-colors"
              >
                Contact
              </Link>
              <span className="text-white/40">•</span>
              <Link
                to="/terms"
                className="text-xs text-white/80 hover:text-secondary transition-colors"
              >
                Terms of Service
              </Link>
              <span className="text-white/40">•</span>
              <Link
                to="/privacy"
                className="text-xs text-white/80 hover:text-secondary transition-colors"
              >
                Privacy Policy
              </Link>
              <span className="text-white/40">•</span>
              <Link
                to="/login"
                className="text-xs text-white/60 hover:text-white/80 transition-colors"
              >
                Sign In
              </Link>
            </div>
            <p className="text-xs text-white/60 mt-2">
              © {new Date().getFullYear()} Westfield Prep Center. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
