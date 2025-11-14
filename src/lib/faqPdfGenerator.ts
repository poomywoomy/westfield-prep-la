import jsPDF from 'jspdf';

// FAQ data extracted from FAQ page
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
        question: "Can you reship rejected Amazon shipments?",
        answer: "Yes! If Amazon rejects your shipment for compliance issues, we can receive it back, make the necessary corrections, and reship to Amazon. Common issues we fix include incorrect labels, packaging violations, or missing documentation."
      },
      {
        question: "What's your receiving turnaround time?",
        answer: "We process and check in most shipments within 24 hours of arrival. Complex shipments with extensive prep work may take 24-48 hours. You'll receive real-time updates as your inventory is processed."
      },
      {
        question: "Do you require advance notice for shipments?",
        answer: "Yes, please provide at least 24 hours advance notice before sending inventory. This ensures we have adequate space, staffing, and time to prepare for your shipment. Last-minute arrivals may experience slight delays in processing."
      },
      {
        question: "Can I use your warehouse address for my shipments?",
        answer: "Absolutely! We'll provide you with our complete warehouse address and specific receiving instructions. Make sure to include your company name and reference number on all shipments so we can properly identify and process your inventory."
      },
      {
        question: "What if my shipment arrives damaged?",
        answer: "We document all damage upon arrival with photos before signing for the shipment. You'll be notified immediately with photo evidence, and we'll help you file claims with the carrier if needed. We can also sort and salvage any undamaged inventory."
      }
    ]
  },
  {
    emoji: "💰",
    title: "Pricing & Billing",
    questions: [
      {
        question: "How does pricing work?",
        answer: "Our pricing is transparent and customized based on your specific needs and monthly volume. We charge per-unit fees for receiving, storage, prep services, and fulfillment. Contact us for a detailed quote tailored to your business."
      },
      {
        question: "Are there any setup fees or contracts?",
        answer: "We do not charge setup fees or require long-term contracts. We operate on a month-to-month basis, giving you flexibility to scale services up or down as your business needs change."
      },
      {
        question: "Do you offer volume discounts?",
        answer: "Yes! We provide volume-based pricing tiers. The more units you process monthly, the lower your per-unit cost. Contact us to discuss custom pricing for high-volume operations."
      },
      {
        question: "What's included in storage fees?",
        answer: "Storage fees cover secure warehousing, climate-controlled space, inventory management, and 24/7 security monitoring. Fees are typically charged monthly based on pallet space or cubic footage used."
      },
      {
        question: "How are receiving fees calculated?",
        answer: "Receiving fees are charged per unit received and cover unloading, inspection, counting, photo documentation, and system entry. More complex shipments (mixed pallets, loose items) may incur slightly higher fees due to additional handling time."
      },
      {
        question: "What's the cost for Amazon FBA prep?",
        answer: "FBA prep pricing varies based on services required (labeling, polybagging, bundling, kitting, etc.). Typical prep services range from $0.30-$1.50 per unit depending on complexity. Contact us with your specific prep needs for accurate pricing."
      },
      {
        question: "Are there any hidden fees?",
        answer: "No! We believe in transparent pricing. All fees are clearly outlined in your service agreement and monthly invoices. You'll always know exactly what you're paying for with itemized billing."
      },
      {
        question: "Do you charge for returns processing?",
        answer: "Yes, returns processing includes receiving, inspecting, photographing, and restocking returned items. Fees are typically charged per unit returned and vary based on the condition and complexity of the return."
      },
      {
        question: "What are the fees for special projects?",
        answer: "Special projects like kitting, bundling, custom packaging, or repackaging are quoted on a per-project basis. We'll provide a detailed quote before starting any custom work so you know exactly what to expect."
      },
      {
        question: "Can I get a custom quote?",
        answer: "Absolutely! Every business is unique, and we provide customized quotes based on your specific needs, product types, and volume. Fill out our contact form or call us at (818) 935-5478 to discuss your requirements."
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
    emoji: "🎯",
    title: "Amazon FBA Specific",
    questions: [
      {
        question: "Do you handle Amazon FBA prep?",
        answer: "Yes! We specialize in Amazon FBA prep services including labeling, polybagging, bundling, and ensuring all shipments meet Amazon's strict requirements. We stay updated on all Amazon compliance standards."
      },
      {
        question: "Can you prep for both Seller Central and Vendor Central?",
        answer: "Yes, we handle prep for both Amazon Seller Central (3P sellers) and Vendor Central (1P vendors). Each has different requirements, and we're experienced with both programs."
      },
      {
        question: "Do you apply FNSKU labels?",
        answer: "Absolutely! We apply FNSKU labels to all items as required by Amazon. We can print and apply Amazon-compliant labels whether you're doing stickerless inventory or require individual unit labels."
      },
      {
        question: "Can you handle Amazon case pack requirements?",
        answer: "Yes! We ensure all case packs meet Amazon's requirements including proper box dimensions, weight limits, case labels, and packing slips. We'll create compliant shipping plans and prep shipments according to Amazon's specifications."
      },
      {
        question: "Do you create Amazon shipment plans?",
        answer: "Yes! We create and manage Amazon shipment plans for you. We'll split inventory across multiple fulfillment centers as required by Amazon, optimize box configurations, and ensure all shipments are compliant before sending to FBA."
      },
      {
        question: "What happens if Amazon rejects my shipment?",
        answer: "If Amazon rejects a shipment due to compliance issues, we can receive it back, correct the issues (re-labeling, re-packaging, etc.), and reship to Amazon. We work to prevent rejections by ensuring compliance before initial shipment."
      },
      {
        question: "Can you handle oversized Amazon items?",
        answer: "Yes! We handle oversized and heavy items that require special prep for Amazon FBA. This includes proper labeling, reinforced packaging, and compliance with Amazon's oversized item requirements."
      },
      {
        question: "Do you prep for Amazon's packaging requirements?",
        answer: "Absolutely! We ensure all products meet Amazon's packaging requirements including polybag suffocation warnings (for bags over 5 mils), secure packaging to prevent damage in transit, and proper case labeling."
      },
      {
        question: "Can you prep multi-channel fulfillment orders?",
        answer: "Yes! We can prep inventory for Amazon Multi-Channel Fulfillment (MCF) or handle fulfillment directly from our warehouse for your Shopify, website, or other sales channels. You have flexibility in how you want orders fulfilled."
      },
      {
        question: "Do you handle Amazon removal orders?",
        answer: "Yes! If Amazon returns inventory to you (removal orders, long-term storage removals, etc.), we can receive it, inspect the condition, restock sellable units, and dispose of unsellable inventory as requested."
      },
      {
        question: "What's your Amazon FBA compliance rate?",
        answer: "We maintain a 99.8% Amazon compliance rate. Our team stays updated on all FBA requirements and uses checklists to ensure every shipment meets Amazon's strict standards before leaving our warehouse."
      },
      {
        question: "Can you handle hazmat items for Amazon?",
        answer: "We can handle some hazmat items depending on the classification. Contact us with your product details and SDS (Safety Data Sheet) so we can determine if we can prep and ship your specific hazmat products to Amazon."
      },
      {
        question: "Do you optimize Amazon box configurations?",
        answer: "Yes! We optimize box configurations to minimize shipping costs while meeting Amazon's requirements. This includes strategic packing to reduce dimensional weight charges and maximize efficiency."
      },
      {
        question: "Can you help with Amazon inventory repackaging?",
        answer: "Absolutely! If your products arrive with damaged packaging, incorrect packaging, or need to be repackaged to meet Amazon standards, we can repackage and prep them for FBA compliance."
      },
      {
        question: "What's your turnaround time for Amazon prep?",
        answer: "For standard Amazon FBA prep, turnaround is typically 24-48 hours from receiving your inventory. Rush services are available for urgent shipments with an additional fee."
      },
      {
        question: "Do you provide Amazon prep photos?",
        answer: "Yes! We provide photo documentation of all prep work including before and after photos, label application, polybagging, and final packaging. This protects both parties and provides proof of work completed."
      }
    ]
  },
  {
    emoji: "🛍️",
    title: "Shopify Fulfillment",
    questions: [
      {
        question: "Do you integrate with Shopify?",
        answer: "Yes! We offer seamless Shopify integration for order fulfillment. Orders placed on your Shopify store automatically sync to our system, and we'll pick, pack, and ship them with real-time tracking updates sent back to your store."
      },
      {
        question: "How does Shopify order fulfillment work?",
        answer: "Once integrated, orders from your Shopify store automatically appear in our fulfillment queue. We pick, pack, and ship orders the same day (for orders placed before 2 PM PST), and tracking numbers are automatically updated in Shopify and sent to your customers."
      },
      {
        question: "Can you use branded packaging for Shopify orders?",
        answer: "Absolutely! We offer white-label fulfillment with your custom branded packaging, inserts, thank you cards, and packing slips. Your customers will only see your brand, maintaining a consistent brand experience."
      },
      {
        question: "What's your fulfillment speed for Shopify orders?",
        answer: "Orders placed before 2 PM PST ship same-day. Orders placed after 2 PM PST ship the next business day. We maintain a 99.5% on-time ship rate for all Shopify fulfillment orders."
      },
      {
        question: "Do you handle Shopify returns?",
        answer: "Yes! We process returns for Shopify orders including receiving, inspection, photo documentation, restocking, and updating your inventory. We can also handle exchanges and process refunds per your instructions."
      },
      {
        question: "Can you fulfill orders from multiple Shopify stores?",
        answer: "Yes! If you operate multiple Shopify stores or brands, we can manage fulfillment for all of them from a single inventory pool or keep them separate as needed. Each store can have custom packaging and branding."
      },
      {
        question: "Do you support kitting and bundling for Shopify?",
        answer: "Absolutely! We can create custom kits, bundles, and gift sets for your Shopify store. Whether it's subscription boxes, seasonal bundles, or promotional sets, we'll assemble and fulfill them according to your specifications."
      },
      {
        question: "How are Shopify orders tracked?",
        answer: "We automatically update tracking information in Shopify as soon as labels are created. Your customers receive automated shipping notifications with tracking links, and you have real-time visibility into order status."
      },
      {
        question: "Can you handle peak season for Shopify stores?",
        answer: "Yes! We scale operations to handle peak seasons like BFCM (Black Friday / Cyber Monday), holiday shopping, and flash sales. We increase staffing and hours as needed to maintain fast turnaround times during high-volume periods."
      },
      {
        question: "What shipping options do you offer for Shopify orders?",
        answer: "We offer all major shipping speeds including standard ground, 2-day, overnight, and international shipping through USPS, UPS, and FedEx. You can set up multiple shipping options in your Shopify store, and we'll fulfill accordingly."
      }
    ]
  },
  {
    emoji: "📍",
    title: "Location & Logistics",
    questions: [
      {
        question: "Where is your warehouse located?",
        answer: "Our warehouse is located at 1801 Flower Ave Office 2, Duarte, CA 91010, strategically positioned in Los Angeles County for fast access to major West Coast ports and distribution networks."
      },
      {
        question: "Why is your Los Angeles location advantageous?",
        answer: "Being in Los Angeles gives us proximity to the Ports of Los Angeles and Long Beach (the largest port complex in the Western Hemisphere), enabling faster receiving of imported goods and cost-effective shipping to Amazon FBA centers and customers across the West Coast."
      },
      {
        question: "Do you have multiple warehouse locations?",
        answer: "Currently, we operate from our Duarte, CA location. This single-facility approach allows us to maintain our boutique, high-touch service model while keeping costs competitive for our clients."
      },
      {
        question: "Can you ship to Amazon fulfillment centers nationwide?",
        answer: "Yes! We ship to all Amazon fulfillment centers across the United States. Our location and carrier partnerships enable cost-effective shipping to both West Coast and nationwide FBA locations."
      },
      {
        question: "Is your warehouse climate-controlled?",
        answer: "Yes, our facility is climate-controlled to protect your inventory from extreme temperatures and humidity. This is especially important for products like cosmetics, food items, and electronics."
      },
      {
        question: "What security measures do you have?",
        answer: "We have 24/7 video surveillance, alarm systems, restricted access controls, and comprehensive insurance coverage. Only authorized personnel can access inventory, and all activities are logged and monitored."
      }
    ]
  },
  {
    emoji: "🔒",
    title: "Insurance & Security",
    questions: [
      {
        question: "Do you have insurance?",
        answer: "Yes! We carry comprehensive General Liability and Warehouse Legal Liability insurance to protect your inventory while in our care. Coverage details are available upon request."
      },
      {
        question: "What happens if my inventory is lost or damaged?",
        answer: "In the rare event of loss or damage while in our care, our Warehouse Legal Liability insurance covers the value of your inventory. We document everything with photos and handle claims promptly and professionally."
      },
      {
        question: "How is my inventory secured?",
        answer: "Your inventory is protected by 24/7 video surveillance, alarm systems, restricted access controls, and climate-controlled storage. We track every movement of inventory with photo documentation and system logs."
      },
      {
        question: "Do you require insurance from clients?",
        answer: "While we carry comprehensive insurance on our end, we recommend that clients maintain their own product liability insurance as a best practice. This protects you from potential issues after products reach end customers."
      }
    ]
  },
  {
    emoji: "🛠️",
    title: "Special Handling & Custom Services",
    questions: [
      {
        question: "Do you offer kitting and bundling services?",
        answer: "Yes! We create custom kits, bundles, and multi-packs according to your specifications. This includes promotional bundles, subscription boxes, gift sets, and seasonal packages. Pricing is based on complexity and volume."
      },
      {
        question: "Can you apply custom labels or stickers?",
        answer: "Absolutely! We apply custom labels, promotional stickers, 'Made in USA' labels, expiration date stickers, and any other labeling needs. Provide us with the labels and application instructions, and we'll handle the rest."
      },
      {
        question: "Do you handle product inspection?",
        answer: "Yes! We offer quality control inspection services to check products for defects, damage, or compliance issues before sending to Amazon or customers. Inspection reports include photos and detailed notes."
      },
      {
        question: "Can you repackage products?",
        answer: "Yes! We can repackage products into retail-ready packaging, replace damaged boxes, create custom bundles, or modify packaging to meet marketplace requirements. Perfect for products that arrive in plain packaging needing enhancement."
      },
      {
        question: "Do you offer photography services?",
        answer: "We provide basic photo documentation of all inventory and prep work as part of our standard service. For professional product photography, we can recommend trusted partners who specialize in e-commerce and Amazon listing photos."
      },
      {
        question: "Can you handle returns and refurbishment?",
        answer: "Yes! We receive customer returns, inspect them, photograph condition issues, clean and refurbish items when possible, and restock sellable units. Damaged items can be disposed of or returned to you per your instructions."
      },
      {
        question: "Do you offer project-based work?",
        answer: "Absolutely! We handle special projects like inventory audits, seasonal promotions, product recalls, and one-time fulfillment campaigns. Contact us with your project details for a custom quote."
      }
    ]
  }
];

export const generateFAQPDF = (): void => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.width;
  const pageHeight = doc.internal.pageSize.height;
  const margin = 20;
  const contentWidth = pageWidth - (margin * 2);
  
  let yPos = margin;
  let currentPage = 1;

  // Helper to add page footer
  const addFooter = () => {
    const footerY = pageHeight - 15;
    doc.setFontSize(9);
    doc.setTextColor(100, 100, 100);
    doc.text(
      `Page ${currentPage}`,
      pageWidth / 2,
      footerY,
      { align: 'center' }
    );
    doc.text(
      '(818) 935-5478 | www.westfieldprepcenter.com',
      pageWidth / 2,
      footerY + 5,
      { align: 'center' }
    );
  };

  // Helper to check page break
  const checkPageBreak = (neededSpace: number) => {
    if (yPos + neededSpace > pageHeight - 30) {
      addFooter();
      doc.addPage();
      currentPage++;
      yPos = margin;
      return true;
    }
    return false;
  };

  // === COVER PAGE ===
  doc.setFillColor(240, 240, 240);
  doc.rect(0, 0, pageWidth, pageHeight, 'F');

  // Add logo
  const logoImg = new Image();
  logoImg.src = '/westfield-logo.png';
  try {
    doc.addImage(logoImg, 'PNG', pageWidth / 2 - 30, 40, 60, 30);
  } catch (e) {
    console.log('Logo not added to PDF');
  }

  // Title
  doc.setFontSize(28);
  doc.setTextColor(0, 0, 0);
  doc.text('Comprehensive FAQ Guide', pageWidth / 2, 100, { align: 'center' });

  // Subtitle
  doc.setFontSize(14);
  doc.setTextColor(80, 80, 80);
  doc.text('Everything You Need to Know About', pageWidth / 2, 115, { align: 'center' });
  doc.text('Westfield Prep Center', pageWidth / 2, 125, { align: 'center' });

  // Date
  const today = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  doc.setFontSize(12);
  doc.text(`Generated: ${today}`, pageWidth / 2, 145, { align: 'center' });

  // Total questions count
  const totalQuestions = faqCategories.reduce((sum, cat) => sum + cat.questions.length, 0);
  doc.setFontSize(14);
  doc.setTextColor(0, 0, 0);
  doc.text(`${totalQuestions} Questions & Answers`, pageWidth / 2, 165, { align: 'center' });

  // Contact info
  doc.setFontSize(11);
  doc.setTextColor(60, 60, 60);
  doc.text('Phone: (818) 935-5478', pageWidth / 2, 190, { align: 'center' });
  doc.text('Address: 1801 Flower Ave Office 2, Duarte, CA 91010', pageWidth / 2, 200, { align: 'center' });
  doc.text('www.westfieldprepcenter.com', pageWidth / 2, 210, { align: 'center' });

  addFooter();

  // === TABLE OF CONTENTS ===
  doc.addPage();
  currentPage++;
  yPos = margin;

  doc.setFontSize(22);
  doc.setTextColor(0, 0, 0);
  doc.text('Table of Contents', margin, yPos);
  yPos += 15;

  doc.setFontSize(11);
  doc.setTextColor(40, 40, 40);
  faqCategories.forEach((category, index) => {
    const tocLine = `${category.emoji} ${category.title} (${category.questions.length} questions)`;
    doc.text(tocLine, margin + 5, yPos);
    yPos += 10;
  });

  addFooter();

  // === FAQ SECTIONS ===
  faqCategories.forEach((category) => {
    doc.addPage();
    currentPage++;
    yPos = margin;

    // Category Header with background
    doc.setFillColor(230, 230, 230);
    doc.rect(margin - 5, yPos - 8, contentWidth + 10, 15, 'F');
    
    doc.setFontSize(16);
    doc.setTextColor(0, 0, 0);
    doc.text(`${category.emoji} ${category.title}`, margin, yPos);
    yPos += 20;

    // Questions and Answers
    category.questions.forEach((qa, qIndex) => {
      // Check if we need a new page for this Q&A
      checkPageBreak(35);

      // Question
      doc.setFontSize(11);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(20, 20, 20);
      
      const questionLines = doc.splitTextToSize(`Q${qIndex + 1}: ${qa.question}`, contentWidth);
      questionLines.forEach((line: string) => {
        checkPageBreak(8);
        doc.text(line, margin, yPos);
        yPos += 7;
      });

      yPos += 3;

      // Answer
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      doc.setTextColor(60, 60, 60);
      
      const answerLines = doc.splitTextToSize(qa.answer, contentWidth - 10);
      answerLines.forEach((line: string) => {
        checkPageBreak(7);
        doc.text(line, margin + 5, yPos);
        yPos += 6;
      });

      yPos += 10; // Space between Q&As
    });

    addFooter();
  });

  // Save the PDF
  const fileName = `Westfield_FAQ_Guide_${new Date().toLocaleDateString('en-US').replace(/\//g, '-')}.pdf`;
  doc.save(fileName);
};
