import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Helmet } from "react-helmet";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { TranslatedText } from "@/components/TranslatedText";

const PrivacyPolicy = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Privacy Policy | Westfield Prep Center</title>
        <meta 
          name="description" 
          content="Read our privacy policy to understand how Westfield Prep Center collects, uses, and protects your data. Effective October 1, 2025." 
        />
        <link rel="canonical" href="https://westfieldprepcenter.com/privacy" />
        <meta name="robots" content="noindex, follow" />
      </Helmet>
      
      <Header />

      <main className="container mx-auto px-4 py-12 max-w-4xl">
        <h1 className="text-4xl font-bold mb-8 text-foreground">
          <TranslatedText>Privacy Policy</TranslatedText>
        </h1>
        
        <div className="space-y-6 text-muted-foreground">
          <section>
            <p className="text-sm text-muted-foreground mb-4">
              <strong><TranslatedText>Effective Date:</TranslatedText></strong> <TranslatedText>October 1, 2025</TranslatedText>
            </p>
            <p>
              <TranslatedText>Westfield Prep Center ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website or use our e-commerce fulfillment services.</TranslatedText>
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3 text-foreground">
              <TranslatedText>1. Information We Collect</TranslatedText>
            </h2>
            <p className="mb-2">
              <TranslatedText>We may collect the following types of information:</TranslatedText>
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong><TranslatedText>Personal Information:</TranslatedText></strong> <TranslatedText>Name, email address, phone number, business name, and other contact details you provide when requesting our services.</TranslatedText></li>
              <li><strong><TranslatedText>Business Information:</TranslatedText></strong> <TranslatedText>Details about your products, inventory, shipping requirements, and marketplace accounts.</TranslatedText></li>
              <li><strong><TranslatedText>Payment Information:</TranslatedText></strong> <TranslatedText>Billing details and payment information necessary to process transactions.</TranslatedText></li>
              <li><strong><TranslatedText>Usage Data:</TranslatedText></strong> <TranslatedText>Information about how you access and use our website, such as IP address, browser type, and pages visited.</TranslatedText></li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3 text-foreground">
              <TranslatedText>2. How We Use Your Information</TranslatedText>
            </h2>
            <p className="mb-2">
              <TranslatedText>We use the information we collect to:</TranslatedText>
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li><TranslatedText>Provide and manage our e-commerce fulfillment services</TranslatedText></li>
              <li><TranslatedText>Process your orders and payments</TranslatedText></li>
              <li><TranslatedText>Communicate with you about our services and updates</TranslatedText></li>
              <li><TranslatedText>Improve our website and customer experience</TranslatedText></li>
              <li><TranslatedText>Comply with legal obligations and marketplace regulations</TranslatedText></li>
              <li><TranslatedText>Send you marketing communications (with your consent)</TranslatedText></li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3 text-foreground">
              <TranslatedText>3. How We Share Your Information</TranslatedText>
            </h2>
            <p className="mb-2">
              <TranslatedText>We may share your information with:</TranslatedText>
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong><TranslatedText>Service Providers:</TranslatedText></strong> <TranslatedText>Third-party vendors who help operate our business (e.g., shipping carriers, payment processors).</TranslatedText></li>
              <li><strong><TranslatedText>Marketplace Platforms:</TranslatedText></strong> <TranslatedText>Amazon, Walmart, TikTok Shop, Shopify, and other e-commerce platforms where we fulfill orders on your behalf.</TranslatedText></li>
              <li><strong><TranslatedText>Advertising Partners:</TranslatedText></strong> <TranslatedText>Google Ads and other advertising platforms to measure campaign performance and reach potential customers.</TranslatedText></li>
              <li><strong><TranslatedText>Legal Authorities:</TranslatedText></strong> <TranslatedText>When required by law or to protect our rights and safety.</TranslatedText></li>
              <li><strong><TranslatedText>Business Transfers:</TranslatedText></strong> <TranslatedText>In connection with a merger, sale, or acquisition of our business.</TranslatedText></li>
            </ul>
            <p className="mt-2">
              <TranslatedText>We do not sell your personal information to third parties.</TranslatedText>
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3 text-foreground">
              <TranslatedText>4. Data Security</TranslatedText>
            </h2>
            <p>
              <TranslatedText>We implement reasonable security measures to protect your information from unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the internet or electronic storage is 100% secure, and we cannot guarantee absolute security.</TranslatedText>
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3 text-foreground">
              <TranslatedText>5. Your Rights & Choices</TranslatedText>
            </h2>
            <p className="mb-2">
              <TranslatedText>You have the right to:</TranslatedText>
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li><TranslatedText>Access and review the personal information we hold about you</TranslatedText></li>
              <li><TranslatedText>Request corrections to inaccurate information</TranslatedText></li>
              <li><TranslatedText>Request deletion of your personal information (subject to legal obligations)</TranslatedText></li>
              <li><TranslatedText>Opt out of marketing communications</TranslatedText></li>
              <li><TranslatedText>Withdraw consent where processing is based on consent</TranslatedText></li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3 text-foreground">
              <TranslatedText>6. Cookies & Tracking Technologies</TranslatedText>
            </h2>
            <p className="mb-2">
              <TranslatedText>We use cookies and similar tracking technologies to enhance your experience and analyze site traffic. This includes:</TranslatedText>
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong><TranslatedText>Essential Cookies:</TranslatedText></strong> <TranslatedText>Required for the website to function properly</TranslatedText></li>
              <li><strong><TranslatedText>Analytics Cookies:</TranslatedText></strong> <TranslatedText>Help us understand how visitors interact with our website</TranslatedText></li>
              <li><strong><TranslatedText>Advertising Cookies:</TranslatedText></strong> <TranslatedText>We use Google Ads tracking to measure the effectiveness of our advertising campaigns and reach potential customers</TranslatedText></li>
            </ul>
            <p className="mt-2">
              <TranslatedText>You can control cookies through your browser settings, but disabling them may affect site functionality.</TranslatedText>
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3 text-foreground">
              <TranslatedText>7. Third-Party Links</TranslatedText>
            </h2>
            <p>
              <TranslatedText>Our website may contain links to third-party websites. We are not responsible for the privacy practices or content of those sites. We encourage you to review their privacy policies.</TranslatedText>
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3 text-foreground">
              <TranslatedText>8. Children's Privacy</TranslatedText>
            </h2>
            <p>
              <TranslatedText>Our services are not intended for individuals under the age of 18. We do not knowingly collect personal information from children.</TranslatedText>
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3 text-foreground">
              <TranslatedText>9. Changes to This Policy</TranslatedText>
            </h2>
            <p>
              <TranslatedText>We may update this Privacy Policy from time to time. Changes will be posted on this page with an updated effective date. We encourage you to review it periodically.</TranslatedText>
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3 text-foreground">
              <TranslatedText>10. Contact Us</TranslatedText>
            </h2>
            <p className="mb-4">
              <TranslatedText>If you have any questions or concerns about this Privacy Policy or our data practices, please contact us:</TranslatedText>
            </p>
            <div className="space-y-1">
              <p><strong><TranslatedText>Westfield Prep Center (Sathatham LLC)</TranslatedText></strong></p>
              <p><strong><TranslatedText>Email:</TranslatedText></strong> <a href="mailto:info@westfieldprepcenter.com" className="text-primary hover:underline">info@westfieldprepcenter.com</a></p>
              <p><strong><TranslatedText>Phone:</TranslatedText></strong> <a href="tel:+18189355478" className="text-primary hover:underline">+1 (818) 935-5478</a></p>
              <p><TranslatedText>Los Angeles, CA</TranslatedText></p>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default PrivacyPolicy;