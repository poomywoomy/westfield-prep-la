import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ArrowLeft } from "lucide-react";
import logo from "@/assets/westfield-logo.png";

const FAQ = () => {
  const faqs = [
    {
      question: "What services does Westfield Prep offer?",
      answer: "We offer comprehensive ecommerce fulfillment services including receiving & inspection, polybagging, bubble wrap, bundling, product labeling (including FNSKU), case pack & carton prep, LTL & SPD shipping, and photo proof of every step. We also provide storage solutions."
    },
    {
      question: "What are your turnaround times?",
      answer: "We pride ourselves on same-day turnaround for most orders. Rush services are available for urgent shipments, with an additional 30-60% fee."
    },
    {
      question: "How do you ensure marketplace compliance?",
      answer: "We stay up-to-date with all major marketplace requirements including Amazon FBA, Walmart, and other platforms. This includes polybag suffocation warnings, weight limits, and accurate case labels. We're fully insured with General Liability and Warehouse Legal Liability coverage."
    },
    {
      question: "Do you provide photo proof of your work?",
      answer: "Yes! We provide photo verification and quality control documentation for every step of the prep process. This ensures transparency and peace of mind for our clients."
    },
    {
      question: "Where is Westfield Prep located?",
      answer: "We're based in Los Angeles, CA, with easy access to major carriers for efficient shipping to fulfillment centers nationwide."
    },
    {
      question: "What is the monthly minimum?",
      answer: "We have a $150 monthly minimum to maintain our high-quality service standards and dedicated account management."
    },
    {
      question: "How do I get started?",
      answer: "Simply fill out our contact form with your business details and monthly volume. We'll respond with an onboarding packet and pricing sheet tailored to your needs."
    },
    {
      question: "Are you insured?",
      answer: "Yes, we are fully insured with both General Liability and Warehouse Legal Liability insurance to protect your inventory."
    },
    {
      question: "Can you handle large volumes?",
      answer: "Absolutely! We work with sellers of all sizes and can scale our services to meet your growing business needs. Contact us to discuss volume discounts."
    },
    {
      question: "What carriers do you work with?",
      answer: "We work with all major carriers and have established relationships to ensure competitive shipping rates and reliable delivery to fulfillment centers for all ecommerce platforms."
    },
    {
      question: "Do you offer storage services?",
      answer: "Yes, we offer secure storage at $0.80/unit/month for inventory awaiting prep or shipment to your fulfillment destination."
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-background shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-3">
              <img src={logo} alt="Westfield Prep Logo" className="h-12 w-12" />
              <span className="text-xl font-bold text-primary">Westfield Prep</span>
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
              Everything you need to know about Westfield Prep's fulfillment services
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
            <Link to="/#contact">
              <Button className="bg-secondary hover:bg-secondary/90 text-secondary-foreground font-semibold">
                Contact Us
              </Button>
            </Link>
          </div>
        </div>
      </main>

      <footer className="bg-primary text-white py-8 mt-12">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm">
            Westfield Prep — a DBA of Sathatham LLC
          </p>
          <p className="text-xs text-white/60 mt-2">
            © {new Date().getFullYear()} Westfield Prep. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default FAQ;
