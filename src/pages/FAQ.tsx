import { Link, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Helmet } from "react-helmet";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ArrowLeft, ChevronDown } from "lucide-react";
import logo from "@/assets/westfield-logo.png";
import StructuredData from "@/components/StructuredData";
import Footer from "@/components/Footer";

const FAQ = () => {
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

  const faqs = [
    {
      question: "What makes Westfield Prep Center different?",
      answer: "We're a boutique prep center, which means our dedicated team can check in products and ship them out much faster than traditional large-scale fulfillment centers. You get personalized attention and quicker turnaround times."
    },
    {
      question: "What services does Westfield Prep Center offer?",
      answer: "We offer comprehensive ecommerce fulfillment services including Amazon FBA prep, Walmart fulfillment, TikTok Shop fulfillment, Shopify order fulfillment, DTC (Direct-to-Consumer) fulfillment, receiving & inspection, polybagging, bubble wrap, bundling, product labeling (including FNSKU), case pack & carton prep, branded packaging, custom kitting, LTL & SPD shipping, and photo proof of every step. We also provide storage solutions."
    },
    {
      question: "What are your turnaround times?",
      answer: "As a boutique operation, we pride ourselves on same-day turnaround for orders placed before 2 PM PST. Our small team allows us to process and ship significantly faster than larger prep centers. Rush services are available for urgent shipments, with an additional 30-60% fee."
    },
    {
      question: "What are the payment terms for new clients?",
      answer: "New clients are required to provide a mandatory $300 deposit at the beginning of the month for the first 2 months of service. This deposit will be charged for prep work completed during the month. Any remaining balance, if any, will be charged at the end of the month."
    },
    {
      question: "How do you ensure marketplace compliance?",
      answer: "We stay up-to-date with all major marketplace requirements including Amazon FBA, Walmart, TikTok Shop, Shopify, and other e-commerce platforms. This includes polybag suffocation warnings, weight limits, accurate case labels, fire & theft prevention, data security & confidentiality, and sustainable practices. We're fully insured with General Liability and Warehouse Legal Liability coverage."
    },
    {
      question: "Do you provide photo proof of your work?",
      answer: "Yes! We provide photo verification and quality control documentation for every step of the prep process. Every shipment is documented with timestamped photos, ensuring transparency and peace of mind for our clients."
    },
    {
      question: "Where is Westfield Prep Center located?",
      answer: "We're based in Los Angeles with easy access to major carriers for efficient shipping to fulfillment centers nationwide. Our strategic West Coast location ensures fast shipping times."
    },
    {
      question: "How do I get started?",
      answer: "Simply fill out our contact form with your business details and monthly volume. We'll respond with an onboarding packet and pricing sheet tailored to your needs within 24 hours."
    },
    {
      question: "Are you insured?",
      answer: "Yes, we are fully insured with both General Liability and Warehouse Legal Liability insurance to protect your inventory. We also maintain fire & theft prevention measures and data security protocols."
    },
    {
      question: "Can you handle large volumes?",
      answer: "Absolutely! We work with sellers of all sizes, from startups to established brands. We can scale our services to meet your growing business needs. Contact us to discuss volume discounts."
    },
    {
      question: "What carriers do you work with?",
      answer: "We work with all major carriers including UPS, FedEx, USPS, and freight carriers for LTL shipments. We have established relationships to ensure competitive shipping rates and reliable delivery to fulfillment centers for all ecommerce platforms."
    },
    {
      question: "Do you offer storage services?",
      answer: "Yes, we offer secure storage at $0.80/unit/month for inventory awaiting prep or shipment to your fulfillment destination. Our facility includes climate control and 24/7 security monitoring."
    },
    {
      question: "Do you handle DTC (Direct-to-Consumer) fulfillment?",
      answer: "Yes! We provide comprehensive DTC fulfillment services with branded packaging, custom inserts, and personalized unboxing experiences. Standard orders are $2.50 per order, and oversized items are $8.00 per order. Perfect for Shopify stores and direct customer shipping."
    },
    {
      question: "Can you handle custom packaging and branded inserts?",
      answer: "Absolutely! We specialize in custom kitting, branded tissue paper, thank-you cards, promotional inserts, and gift wrapping services. We help you create memorable unboxing experiences for your customers."
    },
    {
      question: "What is your same-day cutoff time?",
      answer: "Orders placed before 2 PM PST ship the same business day. Orders placed after 2 PM PST will ship the next business day. This applies to all our fulfillment services including Shopify, Amazon FBA, TikTok Shop, and DTC orders."
    },
    {
      question: "Do you provide inventory reports and tracking?",
      answer: "Yes, we provide real-time inventory updates, photo documentation, and tracking numbers for all shipments. You'll have complete visibility into your inventory and order status at all times."
    },
    {
      question: "What is your minimum order requirement?",
      answer: "We work with brands of all sizes and don't have strict minimum order requirements. Whether you're just starting out or scaling rapidly, we'll create a custom pricing plan that fits your volume and needs."
    },
    {
      question: "Are your practices environmentally sustainable?",
      answer: "Yes! We implement sustainable practices including eco-friendly packaging options, recycling programs, and energy-efficient warehouse operations. We're committed to reducing our environmental impact while delivering exceptional service."
    }
  ];

  return (
    <>
      <Helmet>
        <title>FAQ | Los Angeles & Southern California Amazon & E-Commerce Fulfillment</title>
        <meta name="description" content="Find answers to frequently asked questions about WestfieldPrepCenter.com's Amazon FBA prep and e-commerce fulfillment services in Los Angeles and Southern California." />
        <link rel="canonical" href="https://westfieldprepcenter.com/faq" />
      </Helmet>
      <StructuredData type="faq" data={faqs} />
      
      <div className="min-h-screen bg-background">
        <header className="bg-background shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" onClick={handleLogoClick}>
              <img src={logo} alt="Westfield Prep Center Logo" className="h-12 w-auto" />
            </Link>
            <Link to="/">
              <Button variant="outline" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-primary mb-4">
              Frequently Asked Questions
            </h1>
            <p className="text-lg text-muted-foreground">
              Everything you need to know about Westfield Prep Center's fulfillment services
            </p>
          </div>

          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="bg-card border border-border rounded-lg px-6"
              >
                <AccordionTrigger className="text-left font-semibold text-foreground hover:text-primary">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

          <div className="mt-12 text-center bg-card border border-border rounded-lg p-8">
            <h2 className="text-2xl font-bold text-primary mb-4">
              Still have questions?
            </h2>
            <p className="text-muted-foreground mb-6">
              We're here to help! Contact us for personalized assistance.
            </p>
            <Link to="/contact">
              <Button className="bg-secondary hover:bg-secondary/90 text-secondary-foreground font-semibold">
                Contact Us
              </Button>
            </Link>
          </div>
        </div>
      </main>

        <Footer />
      </div>
    </>
  );
};

export default FAQ;
