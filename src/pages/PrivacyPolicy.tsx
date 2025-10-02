import { Link, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import logo from "@/assets/westfield-logo.png";
import Footer from "@/components/Footer";

const PrivacyPolicy = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleLogoClick = (e: React.MouseEvent) => {
    e.preventDefault();
    navigate("/");
    setTimeout(() => {
      window.scrollTo(0, 0);
    }, 0);
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-background shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" onClick={handleLogoClick}>
              <img src={logo} alt="Westfield Prep Center Logo" className="h-12 w-auto" />
            </Link>
            <Link to="/">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Home
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12 max-w-4xl">
        <h1 className="text-4xl font-bold mb-8 text-foreground">Privacy Policy</h1>
        
        <div className="space-y-6 text-muted-foreground">
          <section>
            <p className="text-sm text-muted-foreground mb-4">
              <strong>Effective Date:</strong> October 1, 2025
            </p>
            <p>
              Westfield Prep Center ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website or use our e-commerce fulfillment services.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3 text-foreground">1. Information We Collect</h2>
            <p className="mb-2">We may collect the following types of information:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Personal Information:</strong> Name, email address, phone number, business name, and other contact details you provide when requesting our services.</li>
              <li><strong>Business Information:</strong> Details about your products, inventory, shipping requirements, and marketplace accounts.</li>
              <li><strong>Payment Information:</strong> Billing details and payment information necessary to process transactions.</li>
              <li><strong>Usage Data:</strong> Information about how you access and use our website, such as IP address, browser type, and pages visited.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3 text-foreground">2. How We Use Your Information</h2>
            <p className="mb-2">We use the information we collect to:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Provide and manage our e-commerce fulfillment services</li>
              <li>Process your orders and payments</li>
              <li>Communicate with you about our services and updates</li>
              <li>Improve our website and customer experience</li>
              <li>Comply with legal obligations and marketplace regulations</li>
              <li>Send you marketing communications (with your consent)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3 text-foreground">3. How We Share Your Information</h2>
            <p className="mb-2">We may share your information with:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Service Providers:</strong> Third-party vendors who help operate our business (e.g., shipping carriers, payment processors).</li>
              <li><strong>Marketplace Platforms:</strong> Amazon, eBay, Walmart, and other platforms where we fulfill orders on your behalf.</li>
              <li><strong>Legal Authorities:</strong> When required by law or to protect our rights and safety.</li>
              <li><strong>Business Transfers:</strong> In connection with a merger, sale, or acquisition of our business.</li>
            </ul>
            <p className="mt-2">We do not sell your personal information to third parties.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3 text-foreground">4. Data Security</h2>
            <p>
              We implement reasonable security measures to protect your information from unauthorized access, alteration, disclosure, or destruction.
              However, no method of transmission over the internet or electronic storage is 100% secure, and we cannot guarantee absolute security.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3 text-foreground">5. Your Rights & Choices</h2>
            <p className="mb-2">You have the right to:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Access and review the personal information we hold about you</li>
              <li>Request corrections to inaccurate information</li>
              <li>Request deletion of your personal information (subject to legal obligations)</li>
              <li>Opt out of marketing communications</li>
              <li>Withdraw consent where processing is based on consent</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3 text-foreground">6. Cookies & Tracking Technologies</h2>
            <p>
              We use cookies and similar tracking technologies to enhance your experience.
              You can control cookies through your browser settings, but disabling them may affect site functionality.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3 text-foreground">7. Third-Party Links</h2>
            <p>
              Our website may contain links to third-party websites. We are not responsible for the privacy practices or content of those sites.
              We encourage you to review their privacy policies.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3 text-foreground">8. Children's Privacy</h2>
            <p>
              Our services are not intended for individuals under the age of 18.
              We do not knowingly collect personal information from children.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3 text-foreground">9. Changes to This Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. Changes will be posted on this page with an updated effective date.
              We encourage you to review it periodically.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3 text-foreground">10. Contact Us</h2>
            <p className="mb-4">
              If you have any questions or concerns about this Privacy Policy or our data practices, please contact us:
            </p>
            <div className="space-y-1">
              <p><strong>Westfield Prep Center (Sathatham LLC)</strong></p>
              <p><strong>Email:</strong> <a href="mailto:info@westfieldprepcenter.com" className="text-primary hover:underline">info@westfieldprepcenter.com</a></p>
              <p><strong>Phone:</strong> <a href="tel:+18189355478" className="text-primary hover:underline">+1 (818) 935-5478</a></p>
              <p>Los Angeles, CA</p>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default PrivacyPolicy;
