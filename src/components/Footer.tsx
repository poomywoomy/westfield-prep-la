import { Link } from "react-router-dom";
import { Mail, MapPin, Phone } from "lucide-react";
import { Helmet } from "react-helmet";

const Footer = () => {
  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": "https://westfieldprepcenter.com/#organization",
    "name": "Westfield Prep Center",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "1801 Flower Ave Office 2",
      "addressLocality": "Duarte",
      "addressRegion": "CA",
      "postalCode": "91010",
      "addressCountry": "US"
    },
    "telephone": "+18189355478",
    "email": "info@westfieldprepcenter.com",
    "url": "https://westfieldprepcenter.com",
    "sameAs": [
      "https://www.facebook.com/westfieldprepcenter",
      "https://www.linkedin.com/company/westfield-prep-center",
      "https://g.page/westfield-prep-center"
    ],
    "openingHoursSpecification": {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
      "opens": "09:00",
      "closes": "20:00",
      "timezone": "America/Los_Angeles"
    },
    "areaServed": [
      {
        "@type": "State",
        "name": "California"
      },
      {
        "@type": "Country",
        "name": "United States"
      }
    ],
    "priceRange": "$$"
  };

  return (
    <>
      <Helmet>
        <script type="application/ld+json">
          {JSON.stringify(localBusinessSchema)}
        </script>
      </Helmet>
      <footer className="bg-primary text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            {/* Main Footer Content */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            {/* Company Info */}
            <div className="space-y-4">
              <h3 className="text-xl font-bold mb-4">Westfield Prep Center</h3>
              <p className="text-sm text-white/80 leading-relaxed">
                Duarte prep center serving Los Angeles County, San Gabriel Valley & all 50 states
              </p>
              <div className="pt-2">
                <p className="text-sm text-secondary font-semibold">Open 7 Days a Week</p>
                <p className="text-sm text-white/90">9am - 8pm PST</p>
              </div>
            </div>

            {/* Contact Info */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold mb-4">Contact Us</h4>
              <div className="space-y-3">
                <a
                  href="tel:+18189355478"
                  className="flex items-start gap-3 hover:text-secondary transition-colors group"
                  aria-label="Call Westfield Prep Center"
                >
                  <Phone className="w-5 h-5 text-secondary mt-0.5 flex-shrink-0" />
                  <span className="text-sm">+1 (818) 935-5478</span>
                </a>
                <a
                  href="mailto:info@westfieldprepcenter.com"
                  className="flex items-start gap-3 hover:text-secondary transition-colors group"
                  aria-label="Email Westfield Prep Center"
                >
                  <Mail className="w-5 h-5 text-secondary mt-0.5 flex-shrink-0" />
                  <span className="text-sm">info@westfieldprepcenter.com</span>
                </a>
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-secondary mt-0.5 flex-shrink-0" />
                  <span className="text-sm">1801 Flower Ave Office 2<br />Duarte, CA 91010</span>
                </div>
              </div>
            </div>

            {/* Services */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold mb-4">Services</h4>
              <div className="space-y-2">
                <Link
                  to="/shopify-fulfillment"
                  className="block text-sm text-white/80 hover:text-secondary transition-colors"
                >
                  Shopify Fulfillment
                </Link>
                <Link
                  to="/amazon-fba-prep"
                  className="block text-sm text-white/80 hover:text-secondary transition-colors"
                >
                  Amazon FBA Prep
                </Link>
                <Link
                  to="/tiktok-shop-fulfillment"
                  className="block text-sm text-white/80 hover:text-secondary transition-colors"
                >
                  TikTok Shop Fulfillment
                </Link>
                <Link
                  to="/storage-warehousing"
                  className="block text-sm text-white/80 hover:text-secondary transition-colors"
                >
                  Storage & Warehousing
                </Link>
              </div>
            </div>

            {/* Quick Links */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
              <div className="space-y-2">
                <Link
                  to="/testimonials"
                  className="block text-sm text-white/80 hover:text-secondary transition-colors"
                >
                  Testimonials
                </Link>
                <Link
                  to="/why-choose-us"
                  className="block text-sm text-white/80 hover:text-secondary transition-colors"
                >
                  Why Choose Us
                </Link>
                <Link
                  to="/faq"
                  className="block text-sm text-white/80 hover:text-secondary transition-colors"
                >
                  FAQ
                </Link>
                <Link
                  to="/contact"
                  className="block text-sm text-white/80 hover:text-secondary transition-colors"
                >
                  Contact
                </Link>
                <Link
                  to="/login"
                  className="block text-sm text-white/80 hover:text-secondary transition-colors"
                >
                  Client Portal
                </Link>
              </div>
            </div>

          </div>

          {/* Bottom Bar */}
          <div className="border-t border-white/20 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-sm text-white/70">
                Westfield Prep Center — a DBA of Sathatham LLC
              </p>
              <div className="flex items-center gap-4">
                <Link
                  to="/terms"
                  className="text-sm text-white/70 hover:text-secondary transition-colors"
                >
                  Terms
                </Link>
                <span className="text-white/40">•</span>
                <Link
                  to="/privacy"
                  className="text-sm text-white/70 hover:text-secondary transition-colors"
                >
                  Privacy
                </Link>
                <span className="text-white/40">•</span>
                <p className="text-sm text-white/60">
                  © {new Date().getFullYear()} All rights reserved.
                </p>
              </div>
            </div>
          </div>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;
