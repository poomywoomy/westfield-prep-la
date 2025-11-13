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

  const faqCategories = [
    {
      emoji: "🚀",
      title: "Getting Started",
      questions: [
        {
          question: "What makes Westfield Prep Center different?",
          answer: "We're a boutique prep center, which means our dedicated team can check in products and ship them out much faster than traditional large-scale fulfillment centers. You get personalized attention and quicker turnaround times."
        },
        {
          question: "How do I get started?",
          answer: "Simply fill out our contact form with your business details and monthly volume. We'll respond with an onboarding packet and pricing sheet tailored to your needs within 24 hours."
        },
        {
          question: "What's the onboarding process like?",
          answer: "Our onboarding process is designed to be quick and seamless. After your initial inquiry, we'll send you an onboarding packet with service agreements and instructions. Once paperwork is complete, you can start sending inventory within 48 hours. We'll provide receiving instructions, warehouse address, and your dedicated account manager contact."
        },
        {
          question: "What information do you need from me?",
          answer: "We'll need your business name, contact information, types of products you sell, estimated monthly volume, and the marketplaces you sell on (Shopify, Amazon, TikTok Shop, etc.). This helps us create a customized service plan and pricing structure for your needs."
        },
        {
          question: "What are the payment terms for new clients?",
          answer: "New clients are required to provide a mandatory $300 deposit at the beginning of the month for the first 2 months of service. This deposit will be charged for prep work completed during the month. Any remaining balance, if any, will be charged at the end of the month."
        },
        {
          question: "Is there a minimum order quantity or monthly volume requirement?",
          answer: "We work with brands of all sizes and don't have strict minimum order requirements. Whether you're just starting out or scaling rapidly, we'll create a custom pricing plan that fits your volume and needs."
        },
        {
          question: "Can you handle large volumes?",
          answer: "Absolutely! We work with sellers of all sizes, from startups to established brands. We can scale our services to meet your growing business needs. Contact us to discuss volume discounts."
        }
      ]
    },
    {
      emoji: "🏢",
      title: "General Operations",
      questions: [
        {
          question: "What are your business hours?",
          answer: "Our warehouse operates Monday through Friday, 8:00 AM to 5:00 PM Pacific Time. We process orders during business hours and offer after-hours emergency support for urgent situations. Same-day shipping cutoff is 2:00 PM PST."
        },
        {
          question: "How can I contact customer support?",
          answer: "You can reach us by phone at (818) 935-5478 during business hours, or submit inquiries through our contact form anytime. Each client is assigned a dedicated account manager who will be your primary point of contact for all questions and updates."
        },
        {
          question: "Can I visit your warehouse?",
          answer: "Yes! We welcome scheduled warehouse tours for current and prospective clients. Contact us at least 48 hours in advance to schedule a visit. Tours are available Monday through Friday during business hours and give you a firsthand look at our operations and security measures."
        },
        {
          question: "How do I track my inventory in real-time?",
          answer: "We provide real-time inventory updates through our client portal. You'll have 24/7 access to view current stock levels, incoming shipments, outbound orders, and historical transaction data. We also send regular inventory reports via email."
        },
        {
          question: "What happens if something gets damaged?",
          answer: "We take photos of all inventory during receiving and prep. If damage occurs while in our care, we document it immediately and notify you with photo evidence. We're fully insured with Warehouse Legal Liability coverage to protect your inventory. Claims are handled promptly and professionally."
        },
        {
          question: "Do you offer white label services?",
          answer: "Yes! We can ship orders without any Westfield branding, using your company's branded packaging, inserts, and packing slips. Perfect for maintaining your brand identity in direct-to-consumer fulfillment."
        },
        {
          question: "What technology/warehouse management system do you use?",
          answer: "We use an advanced warehouse management system (WMS) that integrates with major e-commerce platforms like Shopify, Amazon, and TikTok Shop. Our system provides real-time inventory tracking, automated order routing, and detailed reporting to keep you informed at every step."
        },
        {
          question: "Do you provide customer support after hours?",
          answer: "While our standard business hours are Monday-Friday 8 AM to 5 PM PST, we offer emergency support for urgent situations. Your dedicated account manager can be reached for critical issues, and we monitor systems 24/7 to ensure your orders are processed smoothly."
        }
      ]
    },
    {
      emoji: "📦",
      title: "Shipping & Receiving",
      questions: [
        {
          question: "How do I send inventory to you?",
          answer: "Simply create an Advanced Ship Notice (ASN) through our client portal or email us your shipment details at least 24 hours before arrival. Include your SKU list, quantities, and expected arrival date. We'll provide you with our warehouse address and specific receiving instructions."
        },
        {
          question: "What information needs to be on shipping labels?",
          answer: "All inbound shipments should be clearly labeled with your company name, reference number or PO number, and 'ATTN: Receiving Department.' Each box should be numbered (Box 1 of 10, Box 2 of 10, etc.) and include a packing list inside one box."
        },
        {
          question: "Can you accept mixed pallets?",
          answer: "Yes, we accept mixed pallets containing different SKUs. However, clearly labeled boxes and an accurate packing list are essential. Mixed pallets may require additional receiving time and could incur slightly higher receiving fees due to the extra sorting required."
        },
        {
          question: "Do you accept LTL (Less Than Truckload) shipments?",
          answer: "Absolutely! We accept LTL freight shipments daily. We have a loading dock and equipment to handle pallet deliveries. Make sure to schedule your LTL delivery in advance and provide us with the carrier name, tracking number, and expected delivery date."
        },
        {
          question: "Do you accept FTL (Full Truckload) shipments?",
          answer: "Yes, we can accommodate FTL shipments for high-volume clients. Due to the size and complexity of full truckload deliveries, please contact us at least 48-72 hours in advance to schedule dock time and ensure adequate space and staffing for unloading."
        },
        {
          question: "What carriers do you work with for outbound shipping?",
          answer: "We work with all major carriers including UPS, FedEx, USPS, and freight carriers for LTL shipments. We have established relationships to ensure competitive shipping rates and reliable delivery to fulfillment centers for all e-commerce platforms."
        },
        {
          question: "Do you offer international shipping?",
          answer: "Yes! We can ship internationally to most countries worldwide. We handle customs documentation and work with international carriers to ensure smooth cross-border delivery. International shipping rates and transit times vary by destination."
        },
        {
          question: "Can you ship to Hawaii and Alaska?",
          answer: "Yes, we ship to all 50 states including Hawaii and Alaska. Shipping times and costs for these locations may differ from continental US deliveries due to the additional transit required."
        },
        {
          question: "Do you provide tracking information?",
          answer: "Yes, we provide tracking numbers for all outbound shipments. You'll receive tracking information via email or through our client portal as soon as orders ship. Real-time tracking updates keep you and your customers informed of delivery status."
        },
        {
          question: "What's your receiving process when inventory arrives?",
          answer: "Upon arrival, we check in your inventory, verify quantities against your ASN, inspect for damage, and take photos for documentation. Items are then labeled and stored in your designated warehouse location. You'll receive a receiving report with photos typically within 24 hours of delivery."
        }
      ]
    },
    {
      emoji: "🛍️",
      title: "Shopify & DTC Fulfillment",
      questions: [
        {
          question: "What are your same-day cutoff times?",
          answer: "Orders placed before 2 PM PST ship the same business day. Orders placed after 2 PM PST will ship the next business day. This applies to all our fulfillment services including Shopify, Amazon FBA, TikTok Shop, and DTC orders."
        },
        {
          question: "Can you handle custom packaging and branded inserts?",
          answer: "Absolutely! We specialize in custom kitting, branded tissue paper, thank-you cards, promotional inserts, and gift wrapping services. We help you create memorable unboxing experiences for your customers."
        },
        {
          question: "Do you offer same-day Shopify order processing?",
          answer: "Yes! Orders received before 2 PM PST are picked, packed, and shipped the same day. This fast turnaround is one of our key advantages as a boutique fulfillment center."
        },
        {
          question: "What's your accuracy rate for Shopify order fulfillment?",
          answer: "We maintain a 99.8% accuracy rate for order fulfillment. Every order is double-checked during picking and packing, and we provide photo documentation of each shipment for quality assurance."
        },
        {
          question: "Can you handle subscription box fulfillment for Shopify?",
          answer: "Yes! We're experienced in subscription box fulfillment with recurring monthly shipments, custom kitting, and themed packaging. Perfect for subscription-based Shopify businesses."
        },
        {
          question: "What shipping carriers do you use for Shopify orders?",
          answer: "We use USPS, UPS, FedEx, and regional carriers depending on your preference and shipping zones. We'll recommend the most cost-effective carrier for your specific needs and can integrate your own carrier accounts if preferred."
        },
        {
          question: "Do you offer international Shopify fulfillment?",
          answer: "Yes, we ship internationally to most countries worldwide. We handle customs forms and work with international carriers to ensure smooth delivery. International rates vary by destination and package weight."
        },
        {
          question: "Can you handle pre-orders and backorders?",
          answer: "Yes! We can manage pre-order campaigns and hold orders until inventory arrives. Once stock is received, we'll immediately process and ship backorders in the order they were placed."
        },
        {
          question: "Do you support split shipments and partial fulfillment?",
          answer: "Yes, if a customer orders multiple items and some are out of stock, we can ship available items immediately and send remaining items when they're back in stock, minimizing customer wait times."
        },
        {
          question: "Can you handle gift messages and gift wrapping?",
          answer: "Absolutely! We offer gift wrapping services, custom gift messages, and special occasion packaging. Perfect for customers sending gifts directly to recipients."
        },
        {
          question: "How do you manage inventory across multiple Shopify stores?",
          answer: "Our WMS can sync inventory across multiple Shopify stores in real-time, ensuring accurate stock levels across all your sales channels and preventing overselling."
        },
        {
          question: "Can you handle fragile or oversized Shopify products?",
          answer: "Yes! We have experience handling delicate items (glassware, electronics, cosmetics) and oversized products (furniture, large home goods). We use appropriate packaging materials and methods to ensure safe delivery."
        },
        {
          question: "Do you handle DTC (Direct-to-Consumer) fulfillment?",
          answer: "Yes! We provide comprehensive DTC fulfillment services with branded packaging, custom inserts, and personalized unboxing experiences. Standard orders are $2.50 per order, and oversized items are $8.00 per order. Perfect for Shopify stores and direct customer shipping."
        }
      ]
    },
    {
      emoji: "🔷",
      title: "Amazon FBA Specific",
      questions: [
        {
          question: "What Amazon compliance standards do you follow?",
          answer: "We stay up-to-date with all Amazon FBA requirements including polybag suffocation warnings, proper labeling (FNSKU), weight limits, accurate case labels, box size requirements, and shipment plan compliance. We ensure your inventory meets all FBA standards."
        },
        {
          question: "Can you handle hazmat and lithium battery products?",
          answer: "Yes, we're equipped to handle hazmat and lithium battery products that require special packaging and labeling for Amazon FBA compliance. We follow all regulations for shipping dangerous goods and restricted items."
        },
        {
          question: "Do you support Amazon Vendor Central shipments?",
          answer: "Yes! We handle both Seller Central (FBA) and Vendor Central shipments, including routing requests, carton labeling, and compliance with vendor-specific requirements like GS1 barcodes and advanced ship notices (ASNs)."
        },
        {
          question: "What's your experience with FBA shipment plans?",
          answer: "We're highly experienced with Amazon's shipment plan requirements. We can split your inventory across multiple FBA warehouses as directed by Amazon, create compliant box labels, and provide all necessary documentation (BOLs, commercial invoices)."
        },
        {
          question: "Can you handle Amazon Seller Fulfilled Prime (SFP)?",
          answer: "While we primarily focus on FBA prep and shipments to Amazon warehouses, we can discuss Seller Fulfilled Prime (SFP) requirements for high-volume sellers. Contact us to explore this option."
        },
        {
          question: "Do you offer expiration date labeling for consumables?",
          answer: "Yes! For products with expiration dates (food, supplements, cosmetics), we apply clear expiration date labels that meet Amazon's requirements. We can also track and manage inventory based on expiration dates (FEFO - First Expired, First Out)."
        },
        {
          question: "How do you handle Amazon inventory discrepancies?",
          answer: "We document every step with photos during receiving and prep. If Amazon reports a discrepancy, we have complete photo evidence of what was sent, quantities, condition, and labels applied. This documentation helps resolve disputes quickly."
        },
        {
          question: "Can you create multi-unit bundles for Amazon?",
          answer: "Absolutely! We can create bundled sets, multi-packs, and kitted products that comply with Amazon's bundling policies. Each bundle receives a unique FNSKU and is packaged to Amazon's specifications."
        },
        {
          question: "Do you support Amazon FBA Small and Light program?",
          answer: "Yes, we can prep items for Amazon's Small and Light program, which has specific size and weight requirements. We ensure your products meet the strict packaging and labeling standards for this program."
        },
        {
          question: "How do you handle Amazon returns and refurbishments?",
          answer: "We can receive Amazon returns, inspect them, repackage sellable items, and prep them for return to FBA. We document damage, discard unsellable items, and provide detailed reports on return condition and disposition."
        },
        {
          question: "Can you manage multiple Amazon seller accounts?",
          answer: "Yes! We can handle inventory for multiple Amazon seller accounts under the same client, keeping each account's inventory separate and properly labeled with the correct FNSKU for each account."
        },
        {
          question: "Do you provide BOL and freight documentation?",
          answer: "Yes, we provide complete freight documentation including Bills of Lading (BOL), pallet labels, and commercial invoices for LTL shipments to Amazon fulfillment centers. All documentation meets Amazon's carrier requirements."
        },
        {
          question: "Can you handle oversize/heavy bulky items?",
          answer: "Yes, we have the equipment and expertise to handle oversize and heavy/bulky items for Amazon FBA. We'll ensure proper labeling, packaging reinforcement, and compliance with Amazon's special handling requirements."
        }
      ]
    },
    {
      emoji: "📱",
      title: "TikTok Shop & Social Commerce",
      questions: [
        {
          question: "Can you handle viral spikes in orders?",
          answer: "Yes! Our team is experienced in handling sudden order volume spikes common with TikTok viral products. We can scale quickly to meet demand and maintain our same-day shipping commitment even during high-volume periods."
        },
        {
          question: "What about creator-friendly unboxing?",
          answer: "We specialize in creating Instagram and TikTok-worthy unboxing experiences with branded tissue paper, thank-you cards, stickers, and custom inserts that encourage customers to share their unboxing on social media."
        },
        {
          question: "How fast can you fulfill trending products?",
          answer: "With our 2 PM PST same-day cutoff, trending products ordered in the morning ship the same day. We understand the importance of speed in social commerce and prioritize rapid fulfillment for viral items."
        },
        {
          question: "Can you handle influencer collaboration orders?",
          answer: "Absolutely! We can fulfill special influencer orders with custom packaging, personalized notes, and rush processing. Perfect for influencer gifting campaigns and collaboration launches."
        },
        {
          question: "How fast can you scale for viral products?",
          answer: "As a boutique operation, we can adapt quickly to volume changes. If your product goes viral, contact us immediately and we'll adjust staffing and resources to handle the surge. We've successfully managed multiple viral product campaigns."
        },
        {
          question: "Do you offer rush processing for trending items?",
          answer: "Yes! Rush services are available for urgent shipments, with an additional 30-60% fee. This ensures your trending products get priority picking, packing, and same-day shipping even during busy periods."
        },
        {
          question: "Can you create custom bundles for TikTok promotions?",
          answer: "Yes, we can quickly assemble promotional bundles, limited edition sets, and special offers popular on TikTok Shop. We're experienced in fast-turnaround kitting for social media campaigns."
        },
        {
          question: "Do you support TikTok Shop returns and exchanges?",
          answer: "Yes, we handle returns and exchanges for TikTok Shop orders. We'll inspect returned items, process refunds or exchanges, and restock sellable inventory according to your return policy."
        },
        {
          question: "How do you handle flash sale fulfillment?",
          answer: "We're well-equipped for flash sale events common on TikTok Shop. With advance notice, we can pre-pick popular items and have them ready for immediate packing and shipping when the sale goes live."
        },
        {
          question: "Can you ship internationally for TikTok Shop?",
          answer: "Yes, we offer international shipping to expand your TikTok Shop reach globally. We handle customs documentation and work with international carriers for smooth cross-border delivery."
        },
        {
          question: "Do you offer branded packaging for TikTok creators?",
          answer: "Yes! Custom branded packaging is one of our specialties. We can include your logo, brand colors, custom tissue paper, stickers, thank-you cards, and promotional inserts to create memorable unboxing moments."
        }
      ]
    },
    {
      emoji: "💰",
      title: "Pricing & Payment",
      questions: [
        {
          question: "How does your pricing model work?",
          answer: "Contact us for a custom quote tailored to your specific volume and service needs. Fill out our contact form or call (818) 935-5478 for detailed pricing information based on your requirements."
        },
        {
          question: "Are there any hidden fees?",
          answer: "No hidden fees! We provide transparent, detailed pricing for all services upfront. Contact us for a comprehensive pricing breakdown customized to your business needs."
        },
        {
          question: "Do you offer volume discounts?",
          answer: "Yes, we offer competitive volume discounts for high-volume clients. Contact us with your monthly order volume to receive a custom pricing proposal."
        },
        {
          question: "What are your rates for prep services?",
          answer: "Prep service rates vary based on the specific services required (labeling, polybagging, bundling, etc.). Contact us with details about your products and prep needs for accurate pricing."
        },
        {
          question: "When do I get invoiced and what payment methods do you accept?",
          answer: "We invoice at the end of each month for services provided during that billing period. We accept ACH transfers, wire transfers, and credit cards. New clients require a $300 deposit for the first 2 months. Contact us to discuss payment terms."
        }
      ]
    },
    {
      emoji: "⏱️",
      title: "Turnaround Times & Speed",
      questions: [
        {
          question: "What are your turnaround times?",
          answer: "As a boutique operation, we pride ourselves on same-day turnaround for orders placed before 2 PM PST. Our small team allows us to process and ship significantly faster than larger prep centers. Rush services are available for urgent shipments, with an additional 30-60% fee."
        },
        {
          question: "What is your same-day cutoff time?",
          answer: "Orders placed before 2 PM PST ship the same business day. Orders placed after 2 PM PST will ship the next business day. This applies to all our fulfillment services including Shopify, Amazon FBA, TikTok Shop, and DTC orders."
        },
        {
          question: "What's your turnaround time for urgent Amazon prep?",
          answer: "For rush Amazon FBA prep, we can typically complete receiving, prepping, and shipping to Amazon within 24-48 hours depending on the volume and complexity of prep work required. Contact us for expedited service."
        },
        {
          question: "Do you offer rush processing?",
          answer: "Yes! Rush services are available for urgent shipments with an additional 30-60% fee depending on the urgency and volume. This ensures priority handling and same-day or next-day completion."
        },
        {
          question: "What's your on-time ship rate?",
          answer: "We maintain a 99.5% on-time ship rate for orders placed before our 2 PM PST cutoff. Our boutique size allows us to maintain exceptional speed and reliability."
        },
        {
          question: "Can you handle weekend or holiday orders?",
          answer: "Our standard hours are Monday-Friday, but we can arrange weekend or holiday processing for urgent situations with advance notice. Additional fees may apply for after-hours service."
        }
      ]
    },
    {
      emoji: "✅",
      title: "Quality Control & Documentation",
      questions: [
        {
          question: "Do you provide photo proof of your work?",
          answer: "Yes! We provide photo verification and quality control documentation for every step of the prep process. Every shipment is documented with timestamped photos, ensuring transparency and peace of mind for our clients."
        },
        {
          question: "Do you offer photo documentation for QC?",
          answer: "Absolutely! We photograph all inventory during receiving, prep work, and final packaging. These photos are available in your client portal and serve as proof of work and protection against disputes."
        },
        {
          question: "Do you provide inventory reports and tracking?",
          answer: "Yes, we provide real-time inventory updates, photo documentation, and tracking numbers for all shipments. You'll have complete visibility into your inventory and order status at all times."
        },
        {
          question: "How do you ensure marketplace compliance?",
          answer: "We stay up-to-date with all major marketplace requirements including Amazon FBA, Walmart, TikTok Shop, Shopify, and other e-commerce platforms. This includes polybag suffocation warnings, weight limits, accurate case labels, fire & theft prevention, data security & confidentiality, and sustainable practices. We're fully insured with General Liability and Warehouse Legal Liability coverage."
        },
        {
          question: "What's your accuracy rate for order fulfillment?",
          answer: "We maintain a 99.8% accuracy rate across all order fulfillment. Every order goes through our double-check quality control process during picking and packing to ensure the right products are shipped to the right customers."
        },
        {
          question: "How do you handle discrepancies?",
          answer: "We document everything with photos during receiving. If there's a discrepancy between what you sent and what we received, we notify you immediately with photo evidence and a detailed report. We work with you to resolve any issues quickly and fairly."
        },
        {
          question: "Do you perform quality inspections on incoming inventory?",
          answer: "Yes, we inspect all incoming inventory for damage, verify quantities, check product condition, and document everything with photos. This protects both you and us by establishing a clear record of inventory condition upon arrival."
        }
      ]
    },
    {
      emoji: "📍",
      title: "Location & Logistics",
      questions: [
        {
          question: "Where is Westfield Prep Center located?",
          answer: "We're based in Los Angeles with easy access to major carriers for efficient shipping to fulfillment centers nationwide. Our strategic West Coast location ensures fast shipping times."
        },
        {
          question: "Why is Los Angeles a strategic location?",
          answer: "Los Angeles is a major logistics hub with access to the nation's largest port complex (LA/Long Beach), close proximity to international airports, and excellent carrier infrastructure. This means lower shipping costs, faster transit times, and easy import/export for international sellers."
        },
        {
          question: "Do you offer international shipping?",
          answer: "Yes! We can ship internationally to most countries worldwide. We handle customs documentation and work with international carriers to ensure smooth cross-border delivery. International shipping rates and transit times vary by destination."
        },
        {
          question: "What carriers do you work with?",
          answer: "We work with all major carriers including UPS, FedEx, USPS, and freight carriers for LTL shipments. We have established relationships to ensure competitive shipping rates and reliable delivery to fulfillment centers for all ecommerce platforms."
        },
        {
          question: "Can you ship to Hawaii and Alaska?",
          answer: "Yes, we ship to all 50 states including Hawaii and Alaska. Shipping times and costs for these locations may differ from continental US deliveries due to the additional transit required."
        },
        {
          question: "Do you handle customs documentation?",
          answer: "Yes, for international shipments we prepare all necessary customs documentation including commercial invoices, certificates of origin, and harmonized tariff codes to ensure smooth customs clearance."
        }
      ]
    },
    {
      emoji: "🔒",
      title: "Insurance & Security",
      questions: [
        {
          question: "Are you insured?",
          answer: "Yes, we are fully insured with both General Liability and Warehouse Legal Liability insurance to protect your inventory. We also maintain fire & theft prevention measures and data security protocols."
        },
        {
          question: "What insurance coverage do you have?",
          answer: "We carry comprehensive General Liability insurance and Warehouse Legal Liability coverage. This protects your inventory while in our care against damage, theft, fire, and other covered losses."
        },
        {
          question: "How do you protect my inventory?",
          answer: "We protect your inventory through multiple layers: 24/7 video surveillance, controlled access entry systems, fire suppression systems, climate-controlled storage for sensitive items, and full insurance coverage. All inventory is tracked in our WMS from receiving to shipping."
        },
        {
          question: "What security measures are in place at your warehouse?",
          answer: "Our facility features 24/7 video surveillance, controlled access entry, alarm systems, fire detection and suppression, secure inventory storage areas, and regular security audits. We take inventory protection seriously."
        }
      ]
    },
    {
      emoji: "🛠️",
      title: "Special Handling & Custom Services",
      questions: [
        {
          question: "Can you create custom bundles?",
          answer: "Yes! We can create product bundles, gift sets, promotional packages, and multi-item kits. Perfect for holiday promotions, subscription boxes, and special campaigns. We handle all aspects of kitting from assembly to custom packaging."
        },
        {
          question: "Do you handle subscription box fulfillment?",
          answer: "Yes, we're experienced in subscription box fulfillment with recurring monthly shipments, themed packaging, and custom inserts. We can manage variable subscription tiers and handle monthly kitting for subscription-based businesses."
        },
        {
          question: "Can you handle influencer collaboration orders?",
          answer: "Absolutely! We can fulfill special influencer orders with custom packaging, personalized notes, and rush processing. Perfect for influencer gifting campaigns and collaboration launches."
        },
        {
          question: "Do you support returns and exchanges?",
          answer: "Yes, we can receive and process customer returns, inspect items for restocking, handle exchanges, and provide detailed return reports. We'll work with you to establish a returns process that fits your business."
        },
        {
          question: "Can you handle pre-orders and backorders?",
          answer: "Yes! We can manage pre-order campaigns and hold orders until inventory arrives. Once stock is received, we'll immediately process and ship backorders in the order they were placed."
        },
        {
          question: "Do you offer kitting and assembly services?",
          answer: "Yes! We provide comprehensive kitting services including product assembly, bundling multiple items together, adding promotional inserts, gift boxing, and creating ready-to-ship product sets. Perfect for subscription boxes and promotional campaigns."
        },
        {
          question: "What services does Westfield Prep Center offer?",
          answer: "We offer comprehensive ecommerce fulfillment services including Amazon FBA prep, Walmart fulfillment, TikTok Shop fulfillment, Shopify order fulfillment, DTC (Direct-to-Consumer) fulfillment, receiving & inspection, polybagging, bubble wrap, bundling, product labeling (including FNSKU), case pack & carton prep, branded packaging, custom kitting, LTL & SPD shipping, and photo proof of every step. We also provide storage solutions."
        }
      ]
    }
  ];

  return (
    <>
      <Helmet>
        <title>Comprehensive FAQ - Westfield Prep Center | Shopify, Amazon FBA & TikTok Shop</title>
        <meta name="description" content="Get answers to 90+ questions about Shopify fulfillment, Amazon FBA prep, TikTok Shop logistics, pricing, shipping, and e-commerce operations in Los Angeles." />
        <link rel="canonical" href="https://westfieldprepcenter.com/faq" />
        <meta property="og:title" content="Comprehensive FAQ - Westfield Prep Center" />
        <meta property="og:description" content="Get answers to 90+ questions about Shopify fulfillment, Amazon FBA prep, TikTok Shop logistics, pricing, shipping, and e-commerce operations." />
        <meta property="og:url" content="https://westfieldprepcenter.com/faq" />
      </Helmet>
      <StructuredData 
        type="faq" 
        data={faqCategories.flatMap(category => category.questions)}
      />
      
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
              Comprehensive FAQ
            </h1>
            <p className="text-lg text-muted-foreground mb-8">
              Everything you need to know about Shopify fulfillment, Amazon FBA prep, TikTok Shop logistics, and more
            </p>
          </div>

          {/* Quick Navigation */}
          <div className="mb-8 p-6 bg-muted/30 rounded-lg">
            <h3 className="text-lg font-semibold mb-4 text-foreground">Quick Navigation</h3>
            <div className="flex flex-wrap gap-2">
              {faqCategories.map((category, idx) => (
                <Button
                  key={idx}
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const element = document.getElementById(`category-${idx}`);
                    element?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }}
                  className="text-sm"
                >
                  {category.emoji} {category.title}
                </Button>
              ))}
            </div>
          </div>

          {/* FAQ Categories */}
          <div className="space-y-4">
            {faqCategories.map((category, catIndex) => (
              <div key={catIndex} id={`category-${catIndex}`}>
                <Collapsible defaultOpen={catIndex === 0 || catIndex === 3 || catIndex === 4}>
                  <CollapsibleTrigger className="flex w-full items-center justify-between rounded-lg border border-border bg-card p-4 hover:bg-muted/50 transition-colors">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{category.emoji}</span>
                      <div className="text-left">
                        <span className="text-xl font-bold text-foreground">{category.title}</span>
                        <span className="ml-2 text-sm text-muted-foreground">
                          ({category.questions.length} questions)
                        </span>
                      </div>
                    </div>
                    <ChevronDown className="h-5 w-5 shrink-0 transition-transform duration-200 data-[state=open]:rotate-180" />
                  </CollapsibleTrigger>
                  <CollapsibleContent className="pt-4">
                    <Accordion type="single" collapsible className="w-full space-y-2">
                      {category.questions.map((faq, qIndex) => (
                        <AccordionItem
                          key={qIndex}
                          value={`${catIndex}-${qIndex}`}
                          className="bg-card border border-border rounded-lg px-4"
                        >
                          <AccordionTrigger className="text-left font-semibold text-foreground hover:text-primary py-4">
                            {faq.question}
                          </AccordionTrigger>
                          <AccordionContent className="text-muted-foreground pb-4">
                            {faq.answer}
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  </CollapsibleContent>
                </Collapsible>
              </div>
            ))}
          </div>

          {/* Still Have Questions CTA */}
          <section className="mt-12 text-center py-12 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-lg border border-border">
            <h2 className="text-3xl font-bold text-primary mb-4">
              Still Have Questions?
            </h2>
            <p className="text-lg text-muted-foreground mb-6 max-w-2xl mx-auto">
              Our team is here to help. Contact us for personalized answers and custom pricing quotes tailored to your business needs.
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <Link to="/contact">
                <Button size="lg" className="bg-secondary hover:bg-secondary/90 text-secondary-foreground font-semibold">
                  Contact Us
                </Button>
              </Link>
              <Button size="lg" variant="outline" asChild>
                <a href="tel:+18189355478" className="font-semibold">
                  📞 Call (818) 935-5478
                </a>
              </Button>
            </div>
          </section>
        </div>
      </main>

        <Footer />
      </div>
    </>
  );
};

export default FAQ;
