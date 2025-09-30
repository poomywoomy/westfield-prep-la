import { Mail, MapPin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-primary text-white py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h3 className="text-2xl font-bold mb-6">Westfield Prep</h3>

          <div className="flex flex-col md:flex-row justify-center items-center gap-6 mb-8">
            <div className="flex items-center gap-2">
              <Mail className="w-5 h-5 text-secondary" />
              <a
                href="mailto:info@westfieldprep.com"
                className="hover:text-secondary transition-colors"
              >
                info@westfieldprep.com
              </a>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-secondary" />
              <span>Los Angeles, CA</span>
            </div>
          </div>

          <div className="border-t border-white/20 pt-6">
            <p className="text-sm text-white/80">
              Westfield Prep — a DBA of Sathatham LLC
            </p>
            <p className="text-xs text-white/60 mt-2">
              © {new Date().getFullYear()} Westfield Prep. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
