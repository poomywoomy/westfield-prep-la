import jsPDF from 'jspdf';

export const generateFulfillmentGuidePDF = (): jsPDF => {
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const primaryColor: [number, number, number] = [10, 102, 194];
  const textColor: [number, number, number] = [30, 30, 30];
  const lightGray: [number, number, number] = [100, 116, 139];

  let yPosition = 20;
  const pageWidth = 210;
  const margin = 20;
  const contentWidth = pageWidth - (margin * 2);

  const addText = (text: string, fontSize: number, color: [number, number, number], isBold = false) => {
    pdf.setFontSize(fontSize);
    pdf.setTextColor(...color);
    pdf.setFont('helvetica', isBold ? 'bold' : 'normal');
    pdf.text(text, margin, yPosition);
  };

  const addCenteredText = (text: string, fontSize: number, color: [number, number, number], isBold = false) => {
    pdf.setFontSize(fontSize);
    pdf.setTextColor(...color);
    pdf.setFont('helvetica', isBold ? 'bold' : 'normal');
    const textWidth = pdf.getTextWidth(text);
    pdf.text(text, (pageWidth - textWidth) / 2, yPosition);
  };

  const addSpace = (space: number) => {
    yPosition += space;
  };

  const checkPageBreak = (neededSpace: number) => {
    if (yPosition + neededSpace > 280) {
      pdf.addPage();
      yPosition = 20;
      return true;
    }
    return false;
  };

  const addHeader = (text: string, level: 1 | 2 = 1) => {
    checkPageBreak(15);
    const sizes = { 1: 18, 2: 14 };
    addText(text, sizes[level], level === 1 ? primaryColor : textColor, true);
    addSpace(level === 1 ? 8 : 6);
  };

  const addParagraph = (text: string) => {
    checkPageBreak(10);
    pdf.setFontSize(10);
    pdf.setTextColor(...textColor);
    pdf.setFont('helvetica', 'normal');
    const lines = pdf.splitTextToSize(text, contentWidth);
    pdf.text(lines, margin, yPosition);
    addSpace(lines.length * 5 + 5);
  };

  const addBullet = (text: string) => {
    checkPageBreak(8);
    pdf.setFontSize(10);
    pdf.setTextColor(...textColor);
    pdf.text('✓', margin + 2, yPosition);
    const lines = pdf.splitTextToSize(text, contentWidth - 8);
    pdf.text(lines, margin + 8, yPosition);
    addSpace(lines.length * 5 + 3);
  };

  pdf.setFillColor(...primaryColor);
  pdf.rect(0, 0, pageWidth, 80, 'F');
  
  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(22);
  pdf.setFont('helvetica', 'bold');
  yPosition = 30;
  addCenteredText('THE COMPLETE GUIDE TO', 22, [255, 255, 255], true);
  yPosition += 10;
  addCenteredText('CHOOSING A FULFILLMENT PARTNER', 22, [255, 255, 255], true);
  
  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'normal');
  yPosition += 15;
  addCenteredText('Everything You Need to Know Before', 12, [255, 255, 255]);
  yPosition += 7;
  addCenteredText('Outsourcing Your E-Commerce Logistics', 12, [255, 255, 255]);

  yPosition = 100;
  pdf.setTextColor(...textColor);
  pdf.setFontSize(14);
  pdf.setFont('helvetica', 'bold');
  addCenteredText('By Westfield Prep Center', 14, textColor, true);
  
  pdf.setFontSize(11);
  pdf.setFont('helvetica', 'normal');
  yPosition += 8;
  addCenteredText('Los Angeles Premier E-Commerce Fulfillment & 3PL Partner', 11, textColor);

  pdf.addPage();
  yPosition = 20;
  addHeader('TABLE OF CONTENTS');
  
  const chapters = [
    'Introduction: Why Fulfillment Matters',
    'Signs You Are Ready for a Fulfillment Partner',
    'Types of Fulfillment Services Explained',
    'The 15 Questions You Must Ask Before Signing',
    'Understanding 3PL Pricing Models',
    'Red Flags to Watch For',
    'The Onboarding Process: What to Expect',
    'How to Evaluate Performance After Launch',
    'Common Mistakes to Avoid',
    'Your Fulfillment Partner Checklist',
    'Next Steps: Getting Started'
  ];

  chapters.forEach((chapter, index) => {
    pdf.setFontSize(11);
    pdf.setTextColor(...textColor);
    pdf.text(`${index + 1}. ${chapter}`, margin + 5, yPosition);
    addSpace(7);
  });

  pdf.addPage();
  yPosition = 20;
  addHeader('CHAPTER 1: WHY FULFILLMENT MATTERS');
  addHeader('The Hidden Growth Killer', 2);
  addParagraph('You have built a great product. Your marketing is driving traffic. Orders are coming in. But somewhere between Order Placed and Delivered, things break down.');
  addParagraph('Packages ship late. Inventory counts are wrong. Customers complain. You spend your evenings packing boxes instead of growing your business.');
  addHeader('The Real Cost of Poor Fulfillment', 2);
  addParagraph('Poor fulfillment does not just frustrate you - it costs you money and customers:');
  addBullet('84% of consumers will not return to a brand after a poor delivery experience');
  addBullet('98.6% of consumers say shipping impacts brand loyalty');
  addBullet('The average cost of a fulfillment error is $22');
  addHeader('The Fulfillment Partner Solution', 2);
  addParagraph('A fulfillment partner (also called a 3PL) handles the physical side of your e-commerce operations: receiving, storing, picking, packing, shipping, and processing returns.');

  pdf.addPage();
  yPosition = 20;
  addHeader('CHAPTER 2: SIGNS YOU ARE READY');
  addParagraph('Not every business needs a fulfillment partner. But there is a tipping point where outsourcing becomes the smarter choice.');
  addHeader('The 10 Signs You Have Outgrown DIY Fulfillment', 2);
  addBullet('You are spending more than 10-15 hours per week on fulfillment tasks');
  addBullet('Order volume consistently exceeds 50-100 orders per week');
  addBullet('Inventory is taking over your space');
  addBullet('Shipping errors are increasing');
  addBullet('You cannot offer fast 2-3 day shipping');
  addBullet('You are avoiding growth opportunities');
  addBullet('Inventory management is chaotic');
  addBullet('Returns are piling up');
  addBullet('You want to sell on multiple channels');
  addBullet('You are burned out');

  pdf.addPage();
  yPosition = 20;
  addHeader('CHAPTER 3: FULFILLMENT SERVICES');
  addHeader('Core Services', 2);
  addParagraph('RECEIVING - Accepting and inspecting your inventory shipments');
  addParagraph('STORAGE - Warehousing your inventory until ordered');
  addParagraph('INVENTORY MANAGEMENT - Real-time tracking and reporting');
  addParagraph('PICK AND PACK - Selecting and packing products for orders');
  addParagraph('SHIPPING - Getting orders to customers via carriers');
  addParagraph('RETURNS PROCESSING - Handling returned products');
  addHeader('Value-Added Services', 2);
  addParagraph('KITTING & BUNDLING - Assembling product sets');
  addParagraph('CUSTOM PACKAGING - Branded boxes and inserts');
  addParagraph('LABELING - Barcodes and FBA labels');
  addParagraph('FBA PREP - Amazon fulfillment preparation');

  pdf.addPage();
  yPosition = 20;
  addHeader('CHAPTER 4: 15 QUESTIONS TO ASK');
  
  const questions = [
    'What is your order turnaround time?',
    'What is your accuracy rate?',
    'Where are your warehouse locations?',
    'What e-commerce platforms do you support?',
    'How do you handle inventory management?',
    'Can you provide a complete pricing breakdown?',
    'Are there minimum order requirements?',
    'What is the contract length and termination policy?',
    'How are shipping costs calculated?',
    'Who will be my main point of contact?',
    'What are your support hours and response times?',
    'How do you communicate about problems?',
    'What visibility will I have?',
    'What reporting do you provide?',
    'How do you handle peak seasons?'
  ];

  questions.forEach((q, i) => {
    checkPageBreak(10);
    pdf.setFontSize(10);
    pdf.setTextColor(...primaryColor);
    pdf.setFont('helvetica', 'bold');
    pdf.text(`${i + 1}. ${q}`, margin, yPosition);
    addSpace(7);
  });

  pdf.addPage();
  yPosition = 20;
  addHeader('CHAPTER 5: PRICING MODELS');
  addParagraph('Understanding 3PL pricing can be confusing. Here are the common fee types:');
  addParagraph('SETUP FEES: $0-500 one-time');
  addParagraph('RECEIVING: $0.20-0.50 per unit or $25-75 per shipment');
  addParagraph('STORAGE: $0.50-2.00 per cubic foot per month');
  addParagraph('PICK & PACK: $2.50-5.00 per order');
  addParagraph('RETURNS: $2.50-6.00 per return');
  addParagraph('SHIPPING: Actual cost (often discounted 20-40%)');

  pdf.addPage();
  yPosition = 20;
  addHeader('CHAPTER 6: RED FLAGS TO WATCH FOR');
  addParagraph('Watch for these warning signs during evaluation:');
  addBullet('Slow response times during sales process');
  addBullet('Vague or evasive answers');
  addBullet('Cannot provide references');
  addBullet('High-pressure sales tactics');
  addBullet('No facility tour offered');
  addBullet('Cannot explain their process clearly');
  addBullet('No technology platform or client portal');
  addBullet('Cannot provide accuracy metrics');
  addBullet('Long-term contract required upfront');
  addBullet('Hidden fees in the contract');

  pdf.addPage();
  yPosition = 20;
  addHeader('CHAPTER 7: THE ONBOARDING PROCESS');
  addParagraph('Typical onboarding takes 7-14 days:');
  addParagraph('DAYS 1-3: Account setup and configuration');
  addParagraph('DAYS 3-5: Platform connection and product mapping');
  addParagraph('DAYS 5-7: First inventory shipment and receiving');
  addParagraph('DAYS 7-10: Testing and go-live');
  addHeader('Preparation Tips', 2);
  addBullet('Clean up your product data (SKUs, weights, dimensions)');
  addBullet('Document your packing requirements');
  addBullet('Organize inventory by SKU before shipping');
  addBullet('Provide detailed packing lists');

  pdf.addPage();
  yPosition = 20;
  addHeader('CHAPTER 8: EVALUATE PERFORMANCE');
  addParagraph('Track these key metrics after launch:');
  addParagraph('ORDER ACCURACY RATE - Target: 99%+');
  addParagraph('ON-TIME SHIPMENT RATE - Target: 98%+');
  addParagraph('ORDER TURNAROUND TIME - Target: Under 48 hours');
  addParagraph('INVENTORY ACCURACY - Target: 99%+');
  addParagraph('RETURN PROCESSING TIME - Target: Under 5 days');
  addParagraph('CUSTOMER COMPLAINTS - Target: Under 1%');

  pdf.addPage();
  yPosition = 20;
  addHeader('CHAPTER 9: MISTAKES TO AVOID');
  addBullet('Choosing based on price alone');
  addBullet('Not checking references');
  addBullet('Ignoring contract details');
  addBullet('Poor inventory preparation');
  addBullet('Expecting perfection immediately');
  addBullet('Not communicating your needs');
  addBullet('Set-it-and-forget-it mentality');
  addBullet('Waiting too long to address issues');
  addBullet('Not planning for growth');
  addBullet('Underestimating onboarding importance');

  pdf.addPage();
  yPosition = 20;
  addHeader('CHAPTER 10: YOUR CHECKLIST');
  addParagraph('Use this checklist when evaluating providers:');
  addHeader('Operations', 2);
  addBullet('24-48 hour order turnaround');
  addBullet('99%+ accuracy rate');
  addBullet('Real-time inventory tracking');
  addBullet('Platform support verified');
  addBullet('Clear returns workflow');
  addHeader('Pricing', 2);
  addBullet('Complete pricing breakdown received');
  addBullet('No hidden fees confirmed');
  addBullet('Shipping rates are competitive');
  addBullet('No unreasonable minimums');
  addHeader('Contract', 2);
  addBullet('Month-to-month or short term');
  addBullet('Reasonable termination terms');
  addBullet('Clear SLAs in writing');

  pdf.addPage();
  yPosition = 20;
  addHeader('CHAPTER 11: NEXT STEPS');
  addHeader('Your 30-Day Action Plan', 2);
  addParagraph('WEEK 1: Assess your readiness and calculate current costs');
  addParagraph('WEEK 2: Research providers and request quotes');
  addParagraph('WEEK 3: Evaluate options and contact references');
  addParagraph('WEEK 4: Make decision and begin onboarding');
  addHeader('What to Look For', 2);
  addBullet('Fast turnaround (24-48 hours)');
  addBullet('High accuracy (99%+)');
  addBullet('Transparent pricing');
  addBullet('Strong communication');
  addBullet('Real-time visibility');
  addBullet('Strategic location');

  pdf.addPage();
  yPosition = 20;
  pdf.setFillColor(...primaryColor);
  pdf.rect(0, 0, pageWidth, 30, 'F');
  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(18);
  pdf.setFont('helvetica', 'bold');
  yPosition = 20;
  addCenteredText('ABOUT WESTFIELD PREP CENTER', 18, [255, 255, 255], true);
  yPosition = 45;
  pdf.setTextColor(...textColor);
  addParagraph('Westfield Prep Center is a Los Angeles-based 3PL and fulfillment center serving e-commerce brands throughout California and nationwide.');
  addHeader('What We Offer', 2);
  addBullet('Same-day receiving - Inventory processed the day it arrives');
  addBullet('24-48 hour turnaround - Fast order processing');
  addBullet('Transparent pricing - No hidden fees, no surprises');
  addBullet('No minimums - We grow with you from startup to scale');
  addBullet('Multi-platform support - Shopify, Amazon, WooCommerce, and more');
  addBullet('Strategic LA location - Near Port of LA for import advantages');
  addSpace(10);
  addHeader('Ready to Take the Next Step?', 2);
  addParagraph('Get your free fulfillment audit. We will analyze your current operations and show you where you are spending too much, how to improve shipping speed, and what a partnership with Westfield would look like.');
  addSpace(10);
  pdf.setFontSize(12);
  pdf.setTextColor(...primaryColor);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Contact Us:', margin, yPosition);
  addSpace(8);
  pdf.setFontSize(10);
  pdf.setTextColor(...textColor);
  pdf.setFont('helvetica', 'normal');
  pdf.text('Website: westfieldprepcenter.com', margin, yPosition);
  addSpace(6);
  pdf.text('Email: hello@westfieldprepcenter.com', margin, yPosition);
  addSpace(6);
  pdf.text('Phone: (626) 123-4567', margin, yPosition);

  const totalPages = pdf.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    pdf.setPage(i);
    pdf.setFontSize(8);
    pdf.setTextColor(...lightGray);
    pdf.text('© 2025 Westfield Prep Center', margin, 285);
    pdf.text(`Page ${i} of ${totalPages}`, pageWidth - margin - 20, 285);
  }

  return pdf;
};
