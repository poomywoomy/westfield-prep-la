import jsPDF from 'jspdf';

interface ROIResult {
  monthlyUnits: number;
  currentErrorCost: number;
  returnCost: number;
  timeSavedHours: number;
  timeSavedValue: number;
  estimatedMonthlyCost: number;
  totalSavings: number;
  netBenefit: number;
  roi: number;
  annualSavings: number;
  costPerUnit: string;
}

interface FormData {
  useCase: string;
  businessStage: string;
  currentFulfillment: string;
  revenueRange: string;
  monthlyOrders: number;
  avgUnitsPerOrder: number;
  skuCount: number;
  productType: string;
  currentErrorRate: number;
  returnRate: number;
  hoursSpentWeekly: number;
  currentCostPerOrder: string;
  painPoints: string[];
  services: string[];
  fbaDtcSplit: number;
  specialRequirements: string[];
  fullName: string;
  email: string;
  phone: string;
  companyName: string;
}

// Brand colors
const BRAND_ORANGE: [number, number, number] = [249, 115, 22]; // #F97316
const BRAND_BLUE: [number, number, number] = [10, 102, 194]; // #0A66C2
const TEXT_DARK: [number, number, number] = [30, 30, 30];
const TEXT_GRAY: [number, number, number] = [100, 116, 139];
const GREEN_SUCCESS: [number, number, number] = [34, 197, 94];

export const generateROIReportPDF = (roi: ROIResult, formData: FormData): jsPDF => {
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const pageWidth = 210;
  const pageHeight = 297;
  const margin = 20;
  const contentWidth = pageWidth - (margin * 2);
  let yPosition = 0;

  // Helper functions
  const addSpace = (space: number) => {
    yPosition += space;
  };

  const checkPageBreak = (neededSpace: number) => {
    if (yPosition + neededSpace > pageHeight - 30) {
      pdf.addPage();
      yPosition = 30;
      return true;
    }
    return false;
  };

  // ============ PAGE 1: COVER ============
  // Orange header bar
  pdf.setFillColor(...BRAND_ORANGE);
  pdf.rect(0, 0, pageWidth, 70, 'F');

  // Logo placeholder - white text
  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(22);
  pdf.setFont('helvetica', 'bold');
  yPosition = 25;
  pdf.text('WESTFIELD', margin, yPosition);
  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'normal');
  yPosition += 8;
  pdf.text('PREP CENTER', margin, yPosition);

  // Report date on right
  pdf.setFontSize(10);
  pdf.text(new Date().toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  }), pageWidth - margin, 25, { align: 'right' });

  // Title
  yPosition = 50;
  pdf.setFontSize(28);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Your Personalized', margin, yPosition);
  yPosition += 12;
  pdf.text('Savings Report', margin, yPosition);

  // Customer name
  yPosition = 90;
  pdf.setTextColor(...TEXT_DARK);
  pdf.setFontSize(14);
  pdf.setFont('helvetica', 'normal');
  pdf.text('Prepared for:', margin, yPosition);
  yPosition += 8;
  pdf.setFontSize(20);
  pdf.setFont('helvetica', 'bold');
  pdf.text(formData.fullName || 'Valued Customer', margin, yPosition);
  
  if (formData.companyName) {
    yPosition += 8;
    pdf.setFontSize(14);
    pdf.setFont('helvetica', 'normal');
    pdf.text(formData.companyName, margin, yPosition);
  }

  // Main metrics box
  yPosition = 130;
  pdf.setFillColor(248, 250, 252);
  pdf.roundedRect(margin, yPosition, contentWidth, 80, 5, 5, 'F');

  // Monthly Savings highlight
  yPosition += 15;
  pdf.setFontSize(12);
  pdf.setTextColor(...TEXT_GRAY);
  pdf.setFont('helvetica', 'normal');
  pdf.text('Estimated Monthly Savings', margin + 15, yPosition);
  
  yPosition += 15;
  pdf.setFontSize(42);
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(...GREEN_SUCCESS);
  pdf.text(`$${roi.totalSavings.toLocaleString()}`, margin + 15, yPosition);

  // Side metrics
  pdf.setFontSize(10);
  pdf.setTextColor(...TEXT_GRAY);
  pdf.setFont('helvetica', 'normal');
  pdf.text('Annual Savings', pageWidth - margin - 60, yPosition - 25);
  pdf.setFontSize(18);
  pdf.setTextColor(...BRAND_ORANGE);
  pdf.setFont('helvetica', 'bold');
  pdf.text(`$${roi.annualSavings.toLocaleString()}`, pageWidth - margin - 60, yPosition - 15);

  pdf.setFontSize(10);
  pdf.setTextColor(...TEXT_GRAY);
  pdf.setFont('helvetica', 'normal');
  pdf.text('Time Saved/Month', pageWidth - margin - 60, yPosition - 2);
  pdf.setFontSize(18);
  pdf.setTextColor(...BRAND_BLUE);
  pdf.setFont('helvetica', 'bold');
  pdf.text(`${roi.timeSavedHours}h`, pageWidth - margin - 60, yPosition + 8);

  // ROI badge
  yPosition += 35;
  pdf.setFillColor(...BRAND_ORANGE);
  pdf.roundedRect(margin + 15, yPosition - 5, 60, 20, 3, 3, 'F');
  pdf.setFontSize(14);
  pdf.setTextColor(255, 255, 255);
  pdf.setFont('helvetica', 'bold');
  pdf.text(`ROI: ${roi.roi}%`, margin + 45, yPosition + 7, { align: 'center' });

  // ============ PAGE 2: BREAKDOWN ============
  pdf.addPage();
  yPosition = 25;

  // Header
  pdf.setFillColor(...BRAND_ORANGE);
  pdf.rect(0, 0, pageWidth, 15, 'F');
  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'bold');
  pdf.text('YOUR SAVINGS BREAKDOWN', margin, 10);

  // Section: Your Business Profile
  yPosition = 35;
  pdf.setTextColor(...BRAND_BLUE);
  pdf.setFontSize(16);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Your Business Profile', margin, yPosition);
  
  yPosition += 10;
  pdf.setDrawColor(...BRAND_ORANGE);
  pdf.setLineWidth(0.5);
  pdf.line(margin, yPosition, margin + 40, yPosition);

  const businessProfile = [
    ['Use Case', getUseCaseLabel(formData.useCase)],
    ['Business Stage', getBusinessStageLabel(formData.businessStage)],
    ['Current Fulfillment', getFulfillmentLabel(formData.currentFulfillment)],
    ['Product Category', getProductTypeLabel(formData.productType)],
  ];

  yPosition += 10;
  pdf.setFontSize(10);
  businessProfile.forEach(([label, value]) => {
    pdf.setTextColor(...TEXT_GRAY);
    pdf.setFont('helvetica', 'normal');
    pdf.text(`${label}:`, margin, yPosition);
    pdf.setTextColor(...TEXT_DARK);
    pdf.setFont('helvetica', 'bold');
    pdf.text(value || 'N/A', margin + 50, yPosition);
    yPosition += 7;
  });

  // Section: Volume Metrics
  yPosition += 10;
  pdf.setTextColor(...BRAND_BLUE);
  pdf.setFontSize(16);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Volume Metrics', margin, yPosition);
  
  yPosition += 10;
  pdf.setDrawColor(...BRAND_ORANGE);
  pdf.line(margin, yPosition, margin + 40, yPosition);

  const volumeMetrics = [
    ['Monthly Orders', formData.monthlyOrders.toLocaleString()],
    ['Units per Order', formData.avgUnitsPerOrder.toString()],
    ['Total Monthly Units', roi.monthlyUnits.toLocaleString()],
    ['SKU Count', formData.skuCount.toString()],
  ];

  yPosition += 10;
  pdf.setFontSize(10);
  volumeMetrics.forEach(([label, value]) => {
    pdf.setTextColor(...TEXT_GRAY);
    pdf.setFont('helvetica', 'normal');
    pdf.text(`${label}:`, margin, yPosition);
    pdf.setTextColor(...TEXT_DARK);
    pdf.setFont('helvetica', 'bold');
    pdf.text(value, margin + 50, yPosition);
    yPosition += 7;
  });

  // Section: Current Costs & Challenges
  yPosition += 10;
  pdf.setTextColor(...BRAND_BLUE);
  pdf.setFontSize(16);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Current Costs & Challenges', margin, yPosition);
  
  yPosition += 10;
  pdf.setDrawColor(...BRAND_ORANGE);
  pdf.line(margin, yPosition, margin + 40, yPosition);

  const costMetrics = [
    ['Error Rate', `${formData.currentErrorRate}%`],
    ['Return Rate', `${formData.returnRate}%`],
    ['Weekly Hours on Fulfillment', `${formData.hoursSpentWeekly} hours`],
    ['Error-Related Costs', `$${roi.currentErrorCost.toLocaleString()}/mo`],
    ['Return Processing Costs', `$${roi.returnCost.toLocaleString()}/mo`],
  ];

  yPosition += 10;
  pdf.setFontSize(10);
  costMetrics.forEach(([label, value]) => {
    pdf.setTextColor(...TEXT_GRAY);
    pdf.setFont('helvetica', 'normal');
    pdf.text(`${label}:`, margin, yPosition);
    pdf.setTextColor(...TEXT_DARK);
    pdf.setFont('helvetica', 'bold');
    pdf.text(value, margin + 60, yPosition);
    yPosition += 7;
  });

  // Pain Points
  if (formData.painPoints.length > 0) {
    yPosition += 5;
    pdf.setTextColor(...TEXT_GRAY);
    pdf.setFont('helvetica', 'normal');
    pdf.text('Key Pain Points:', margin, yPosition);
    yPosition += 6;
    pdf.setTextColor(...TEXT_DARK);
    formData.painPoints.forEach(point => {
      pdf.text(`• ${getPainPointLabel(point)}`, margin + 5, yPosition);
      yPosition += 5;
    });
  }

  // Section: Services Selected
  yPosition += 10;
  pdf.setTextColor(...BRAND_BLUE);
  pdf.setFontSize(16);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Services Selected', margin, yPosition);
  
  yPosition += 10;
  pdf.setDrawColor(...BRAND_ORANGE);
  pdf.line(margin, yPosition, margin + 40, yPosition);

  yPosition += 10;
  pdf.setFontSize(10);
  pdf.setTextColor(...TEXT_DARK);
  formData.services.forEach(service => {
    pdf.text(`✓ ${getServiceLabel(service)}`, margin, yPosition);
    yPosition += 6;
  });

  // Special Requirements
  if (formData.specialRequirements.length > 0) {
    yPosition += 5;
    pdf.setTextColor(...TEXT_GRAY);
    pdf.setFont('helvetica', 'normal');
    pdf.text('Special Requirements:', margin, yPosition);
    yPosition += 6;
    pdf.setTextColor(...TEXT_DARK);
    formData.specialRequirements.forEach(req => {
      pdf.text(`• ${getSpecialReqLabel(req)}`, margin + 5, yPosition);
      yPosition += 5;
    });
  }

  // ============ PAGE 3: SAVINGS SUMMARY ============
  pdf.addPage();
  yPosition = 25;

  // Header
  pdf.setFillColor(...BRAND_ORANGE);
  pdf.rect(0, 0, pageWidth, 15, 'F');
  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'bold');
  pdf.text('YOUR SAVINGS SUMMARY', margin, 10);

  // Savings breakdown box
  yPosition = 35;
  pdf.setTextColor(...BRAND_BLUE);
  pdf.setFontSize(18);
  pdf.setFont('helvetica', 'bold');
  pdf.text('How We Calculate Your Savings', margin, yPosition);

  yPosition += 15;
  
  // Savings items
  const savingsItems = [
    { label: 'Error Cost Reduction', value: roi.currentErrorCost, desc: 'Based on your error rate and industry avg $18/error' },
    { label: 'Return Processing Savings', value: roi.returnCost, desc: 'Based on your return rate and avg $12/return' },
    { label: 'Time Value Recovered', value: roi.timeSavedValue, desc: `${roi.timeSavedHours} hours/mo × $30/hr opportunity cost` },
  ];

  savingsItems.forEach(item => {
    checkPageBreak(25);
    pdf.setFillColor(248, 250, 252);
    pdf.roundedRect(margin, yPosition, contentWidth, 22, 3, 3, 'F');
    
    pdf.setFontSize(12);
    pdf.setTextColor(...TEXT_DARK);
    pdf.setFont('helvetica', 'bold');
    pdf.text(item.label, margin + 5, yPosition + 8);
    
    pdf.setFontSize(16);
    pdf.setTextColor(...GREEN_SUCCESS);
    pdf.text(`$${item.value.toLocaleString()}`, pageWidth - margin - 5, yPosition + 10, { align: 'right' });
    
    pdf.setFontSize(8);
    pdf.setTextColor(...TEXT_GRAY);
    pdf.setFont('helvetica', 'normal');
    pdf.text(item.desc, margin + 5, yPosition + 17);
    
    yPosition += 28;
  });

  // Total line
  yPosition += 5;
  pdf.setDrawColor(...BRAND_ORANGE);
  pdf.setLineWidth(1);
  pdf.line(margin, yPosition, pageWidth - margin, yPosition);
  
  yPosition += 15;
  pdf.setFontSize(14);
  pdf.setTextColor(...TEXT_DARK);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Total Monthly Savings', margin, yPosition);
  pdf.setFontSize(24);
  pdf.setTextColor(...GREEN_SUCCESS);
  pdf.text(`$${roi.totalSavings.toLocaleString()}`, pageWidth - margin, yPosition, { align: 'right' });

  // Pricing info
  yPosition += 25;
  pdf.setFillColor(254, 243, 234); // Light orange background
  pdf.roundedRect(margin, yPosition, contentWidth, 40, 5, 5, 'F');
  
  yPosition += 12;
  pdf.setFontSize(12);
  pdf.setTextColor(...BRAND_ORANGE);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Your Estimated Cost with Westfield', margin + 10, yPosition);
  
  yPosition += 10;
  pdf.setFontSize(10);
  pdf.setTextColor(...TEXT_DARK);
  pdf.setFont('helvetica', 'normal');
  pdf.text(`Based on ${roi.monthlyUnits.toLocaleString()} units/month at $${roi.costPerUnit}/unit`, margin + 10, yPosition);
  
  yPosition += 8;
  pdf.setFontSize(16);
  pdf.setFont('helvetica', 'bold');
  pdf.text(`Est. Monthly Investment: $${roi.estimatedMonthlyCost.toLocaleString()}`, margin + 10, yPosition);

  // Next steps
  yPosition += 30;
  pdf.setTextColor(...BRAND_BLUE);
  pdf.setFontSize(18);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Next Steps', margin, yPosition);

  yPosition += 12;
  const nextSteps = [
    'A fulfillment specialist will contact you within 24 hours',
    'We\'ll review your specific requirements in detail',
    'You\'ll receive a detailed quote with no obligation',
    'Optional facility tour available',
  ];

  pdf.setFontSize(11);
  pdf.setTextColor(...TEXT_DARK);
  pdf.setFont('helvetica', 'normal');
  nextSteps.forEach((step, i) => {
    pdf.text(`${i + 1}. ${step}`, margin, yPosition);
    yPosition += 8;
  });

  // Footer with contact info
  yPosition = pageHeight - 40;
  pdf.setFillColor(...BRAND_BLUE);
  pdf.rect(0, yPosition, pageWidth, 40, 'F');
  
  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Ready to Get Started?', margin, yPosition + 12);
  
  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'normal');
  pdf.text('Phone: (818) 935-5478', margin, yPosition + 22);
  pdf.text('Email: info@westfieldprepcenter.com', margin, yPosition + 30);
  pdf.text('westfieldprepcenter.com', pageWidth - margin, yPosition + 26, { align: 'right' });

  // Add page numbers
  const totalPages = pdf.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    pdf.setPage(i);
    pdf.setFontSize(8);
    pdf.setTextColor(...TEXT_GRAY);
    if (i > 1) {
      pdf.text(`Page ${i - 1} of ${totalPages - 1}`, pageWidth - margin, pageHeight - 10, { align: 'right' });
    }
  }

  return pdf;
};

// Helper functions for labels
function getUseCaseLabel(id: string): string {
  const map: Record<string, string> = {
    'shopify': 'Shopify / DTC',
    'amazon': 'Amazon FBA',
    'multi-channel': 'Multi-Channel',
    'b2b': 'B2B / Wholesale',
  };
  return map[id] || id;
}

function getBusinessStageLabel(id: string): string {
  const map: Record<string, string> = {
    'startup': 'Just Starting (<$50K/year)',
    'growing': 'Growing ($50K-$500K/year)',
    'established': 'Established ($500K-$2M/year)',
    'scaling': 'Scaling Fast ($2M+/year)',
  };
  return map[id] || id;
}

function getFulfillmentLabel(id: string): string {
  const map: Record<string, string> = {
    'self': 'Self-Fulfilled',
    'other-3pl': 'Another 3PL',
    'hybrid': 'Hybrid',
  };
  return map[id] || id;
}

function getProductTypeLabel(id: string): string {
  const map: Record<string, string> = {
    'apparel': 'Apparel & Fashion',
    'electronics': 'Electronics',
    'beauty': 'Beauty & Cosmetics',
    'supplements': 'Supplements & Health',
    'home': 'Home & Garden',
    'general': 'General Merchandise',
  };
  return map[id] || id;
}

function getPainPointLabel(id: string): string {
  const map: Record<string, string> = {
    'errors': 'High Error Rates',
    'slow': 'Slow Processing',
    'expensive': 'High Costs',
    'scaling': 'Can\'t Scale',
    'visibility': 'No Visibility',
    'support': 'Poor Support',
  };
  return map[id] || id;
}

function getServiceLabel(id: string): string {
  const map: Record<string, string> = {
    'receiving': 'Receiving & Inspection',
    'storage': 'Storage & Warehousing',
    'fba-prep': 'Amazon FBA Prep',
    'pick-pack': 'Pick & Pack',
    'labeling': 'Labeling & Compliance',
    'kitting': 'Kitting & Bundling',
    'returns': 'Returns Processing',
  };
  return map[id] || id;
}

function getSpecialReqLabel(id: string): string {
  const map: Record<string, string> = {
    'fragile': 'Fragile Items',
    'hazmat': 'Hazmat/ORM-D',
    'kitting': 'Custom Kitting',
    'branding': 'Custom Packaging',
    'lotTracking': 'Lot/Expiry Tracking',
  };
  return map[id] || id;
}

export const downloadROIReport = (roi: ROIResult, formData: FormData) => {
  const pdf = generateROIReportPDF(roi, formData);
  const fileName = `Westfield-Savings-Report-${formData.fullName?.replace(/\s+/g, '-') || 'Report'}-${new Date().toISOString().split('T')[0]}.pdf`;
  pdf.save(fileName);
};
