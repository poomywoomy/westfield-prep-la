import { Link } from "react-router-dom";
import { MapPin, Phone, Mail, Linkedin, Instagram, Twitter } from "lucide-react";
const Footer = () => {
  return <footer className="bg-primary text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            {/* Main Footer Content */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-20 mb-12">
            {/* Company Info */}
            <div className="space-y-4">
              <h3 className="text-xl font-bold mb-4">Westfield Prep Center</h3>
              <h1 className="text-sm text-white/80 leading-relaxed font-normal">
                Los Angeles's Premier E-Commerce Fulfillment & 3PL Partner
              </h1>
              <div className="pt-2">
                <p className="text-sm text-secondary font-semibold">Open 7 Days a Week</p>
                <p className="text-sm text-white/90">8am - 5pm PT</p>
              </div>
              
              {/* Social Media Links */}
              <div className="flex items-center gap-4 pt-4">
                <a href="https://www.linkedin.com/company/westfield-prep-center/?viewAsMember=true" target="_blank" rel="noopener noreferrer" className="text-white/80 hover:text-secondary transition-colors" aria-label="Follow us on LinkedIn">
                  <Linkedin className="w-5 h-5" />
                </a>
                <a href="https://www.instagram.com/westfieldprepcenter/" target="_blank" rel="noopener noreferrer" className="text-white/80 hover:text-secondary transition-colors" aria-label="Follow us on Instagram">
                  <Instagram className="w-5 h-5" />
                </a>
                <a href="https://x.com/Westfield3PL" target="_blank" rel="noopener noreferrer" className="text-white/80 hover:text-secondary transition-colors" aria-label="Follow us on X">
                  <Twitter className="w-5 h-5" />
                </a>
              </div>
            </div>

            {/* Contact Info */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold mb-6">Contact Us</h4>
              <div className="space-y-4">
                <a href="tel:+18189355478" className="flex items-start gap-3 hover:text-secondary transition-colors group" aria-label="Call Westfield Prep Center">
                  <Phone className="w-5 h-5 text-secondary mt-0.5 flex-shrink-0" />
                  <span className="text-sm break-words">+1 (818) 935-5478</span>
                </a>
                <a href="mailto:info@westfieldprepcenter.com" className="flex items-start gap-3 hover:text-secondary transition-colors group" aria-label="Email Westfield Prep Center">
                  <Mail className="w-5 h-5 text-secondary mt-0.5 flex-shrink-0" />
                  <span className="text-sm break-words">info@westfieldprepcenter.com</span>
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
                <Link to="/order-fulfillment" className="block text-sm text-white/80 hover:text-secondary transition-colors relative group">
                  <span className="relative">
                    Order Fulfillment
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-secondary group-hover:w-full transition-all duration-300" />
                  </span>
                </Link>
                <Link to="/inventory-management" className="block text-sm text-white/80 hover:text-secondary transition-colors relative group">
                  <span className="relative">
                    Inventory Management
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-secondary group-hover:w-full transition-all duration-300" />
                  </span>
                </Link>
                <Link to="/receiving-inspection" className="block text-sm text-white/80 hover:text-secondary transition-colors relative group">
                  <span className="relative">
                    Receiving & Inspection
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-secondary group-hover:w-full transition-all duration-300" />
                  </span>
                </Link>
                <Link to="/returns-processing" className="block text-sm text-white/80 hover:text-secondary transition-colors relative group">
                  <span className="relative">
                    Returns Processing
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-secondary group-hover:w-full transition-all duration-300" />
                  </span>
                </Link>
                <Link to="/kitting-bundling" className="block text-sm text-white/80 hover:text-secondary transition-colors relative group">
                  <span className="relative">
                    Kitting & Bundling
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-secondary group-hover:w-full transition-all duration-300" />
                  </span>
                </Link>
                <Link to="/storage-warehousing" className="block text-sm text-white/80 hover:text-secondary transition-colors relative group">
                  <span className="relative">
                    Storage & Warehousing
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-secondary group-hover:w-full transition-all duration-300" />
                  </span>
                </Link>
              </div>
            </div>

            {/* Sales Channels */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold mb-4">Sales Channels</h4>
              <div className="space-y-2">
                <Link to="/shopify-fulfillment" className="block text-sm text-white/80 hover:text-secondary transition-colors relative group">
                  <span className="relative">
                    Shopify
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-secondary group-hover:w-full transition-all duration-300" />
                  </span>
                </Link>
                <Link to="/amazon-fba-prep" className="block text-sm text-white/80 hover:text-secondary transition-colors relative group">
                  <span className="relative">
                    Amazon FBA
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-secondary group-hover:w-full transition-all duration-300" />
                  </span>
                </Link>
                <Link to="/tiktok-shop-fulfillment" className="block text-sm text-white/80 hover:text-secondary transition-colors relative group">
                  <span className="relative">
                    TikTok Shop
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-secondary group-hover:w-full transition-all duration-300" />
                  </span>
                </Link>
                <Link to="/sales-channels" className="block text-sm text-white/80 hover:text-secondary transition-colors relative group">
                  <span className="relative">
                    All Channels
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-secondary group-hover:w-full transition-all duration-300" />
                  </span>
                </Link>
              </div>
            </div>

            {/* Quick Links */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
              <div className="space-y-2">
                <Link to="/testimonials" className="block text-sm text-white/80 hover:text-secondary transition-colors">
                  Testimonials
                </Link>
                <Link to="/why-choose-us" className="block text-sm text-white/80 hover:text-secondary transition-colors">
                  Why Choose Us
                </Link>
                <Link to="/faq" className="block text-sm text-white/80 hover:text-secondary transition-colors">
                  FAQ
                </Link>
                <Link to="/contact" className="block text-sm text-white/80 hover:text-secondary transition-colors">
                  Contact
                </Link>
                <Link to="/login" className="block text-sm text-white/80 hover:text-secondary transition-colors">
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
                <Link to="/terms" className="text-sm text-white/70 hover:text-secondary transition-colors">
                  Terms
                </Link>
                <span className="text-white/40">•</span>
                <Link to="/privacy" className="text-sm text-white/70 hover:text-secondary transition-colors">
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
      </footer>;
};
export default Footer;