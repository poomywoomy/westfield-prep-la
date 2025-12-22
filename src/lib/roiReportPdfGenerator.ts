import jsPDF from 'jspdf';

interface ROIResult {
  monthlyUnits: number;
  currentErrorCost: number;
  returnCost: number;
  timeSavedHours: number;
  timeSavedValue: number;
  costSavings?: number;
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

// Brand colors (RGB)
const BRAND_ORANGE: [number, number, number] = [249, 115, 22];
const BRAND_BLUE: [number, number, number] = [10, 102, 194];
const TEXT_DARK: [number, number, number] = [30, 30, 30];
const TEXT_GRAY: [number, number, number] = [100, 116, 139];
const GREEN_SUCCESS: [number, number, number] = [34, 197, 94];
const LIGHT_BG: [number, number, number] = [248, 250, 252];
const ORANGE_LIGHT: [number, number, number] = [254, 243, 234];

// Logo as base64 - using a simple text-based logo for reliability
const drawLogo = (pdf: jsPDF, x: number, y: number, isWhite: boolean = false) => {
  const textColor = isWhite ? [255, 255, 255] : BRAND_ORANGE;
  pdf.setTextColor(textColor[0], textColor[1], textColor[2]);
  pdf.setFontSize(18);
  pdf.setFont('helvetica', 'bold');
  pdf.text('WESTFIELD', x, y);
  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'normal');
  pdf.text('PREP CENTER', x, y + 6);
};

export const generateROIReportPDF = (roi: ROIResult, formData: FormData): jsPDF => {
  const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const pageWidth = 210;
  const pageHeight = 297;
  const margin = 20;
  const contentWidth = pageWidth - (margin * 2);
  let yPosition = 0;

  const checkPageBreak = (neededSpace: number): boolean => {
    if (yPosition + neededSpace > pageHeight - 40) {
      addPageFooter();
      pdf.addPage();
      yPosition = 30;
      return true;
    }
    return false;
  };

  const addPageFooter = () => {
    pdf.setFillColor(...BRAND_BLUE);
    pdf.rect(0, pageHeight - 20, pageWidth, 20, 'F');
    pdf.setFontSize(8);
    pdf.setTextColor(255, 255, 255);
    pdf.text('Prepared by Westfield Prep Center  •  (818) 935-5478  •  info@westfieldprepcenter.com  •  westfieldprepcenter.com', pageWidth / 2, pageHeight - 10, { align: 'center' });
  };

  const drawSectionHeader = (title: string, icon: string = '') => {
    checkPageBreak(20);
    pdf.setFillColor(...BRAND_ORANGE);
    pdf.roundedRect(margin, yPosition, contentWidth, 10, 2, 2, 'F');
    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(11);
    pdf.setFont('helvetica', 'bold');
    pdf.text(`${icon} ${title}`.trim(), margin + 5, yPosition + 7);
    yPosition += 15;
  };

  // ============ PAGE 1: COVER ============
  // Full orange header
  pdf.setFillColor(...BRAND_ORANGE);
  pdf.rect(0, 0, pageWidth, 80, 'F');

  // Logo (white text on orange)
  drawLogo(pdf, margin, 25, true);

  // Date (right side)
  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'normal');
  pdf.text(new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }), pageWidth - margin, 20, { align: 'right' });

  // Main title
  yPosition = 50;
  pdf.setFontSize(28);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Your Personalized', margin, yPosition);
  pdf.text('Savings Report', margin, yPosition + 12);

  // Recipient info
  yPosition = 100;
  pdf.setTextColor(...TEXT_GRAY);
  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'normal');
  pdf.text('Prepared exclusively for:', margin, yPosition);
  
  pdf.setTextColor(...TEXT_DARK);
  pdf.setFontSize(22);
  pdf.setFont('helvetica', 'bold');
  pdf.text(formData.fullName || 'Valued Customer', margin, yPosition + 10);
  
  if (formData.companyName) {
    pdf.setFontSize(14);
    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(...BRAND_BLUE);
    pdf.text(formData.companyName, margin, yPosition + 20);
    yPosition += 8;
  }

  // Main savings highlight box
  yPosition = 140;
  pdf.setFillColor(...LIGHT_BG);
  pdf.roundedRect(margin, yPosition, contentWidth, 90, 5, 5, 'F');
  
  // Left side - Monthly savings
  pdf.setTextColor(...TEXT_GRAY);
  pdf.setFontSize(11);
  pdf.setFont('helvetica', 'normal');
  pdf.text('Estimated Monthly Savings', margin + 15, yPosition + 15);
  
  pdf.setFontSize(48);
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(...GREEN_SUCCESS);
  pdf.text(`$${roi.totalSavings.toLocaleString()}`, margin + 15, yPosition + 45);

  // Annual savings badge
  pdf.setFillColor(...BRAND_ORANGE);
  pdf.roundedRect(margin + 15, yPosition + 55, 70, 25, 3, 3, 'F');
  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(9);
  pdf.setFont('helvetica', 'normal');
  pdf.text('Annual Savings', margin + 50, yPosition + 65, { align: 'center' });
  pdf.setFontSize(14);
  pdf.setFont('helvetica', 'bold');
  pdf.text(`$${roi.annualSavings.toLocaleString()}`, margin + 50, yPosition + 75, { align: 'center' });

  // Right side metrics
  const rightCol = pageWidth - margin - 50;
  
  pdf.setFontSize(10);
  pdf.setTextColor(...TEXT_GRAY);
  pdf.setFont('helvetica', 'normal');
  pdf.text('Time Saved/Month', rightCol, yPosition + 15);
  pdf.setFontSize(20);
  pdf.setTextColor(...BRAND_BLUE);
  pdf.setFont('helvetica', 'bold');
  pdf.text(`${roi.timeSavedHours} hrs`, rightCol, yPosition + 27);

  pdf.setFontSize(10);
  pdf.setTextColor(...TEXT_GRAY);
  pdf.setFont('helvetica', 'normal');
  pdf.text('Projected ROI', rightCol, yPosition + 45);
  pdf.setFontSize(20);
  pdf.setTextColor(...BRAND_ORANGE);
  pdf.setFont('helvetica', 'bold');
  pdf.text(`${roi.roi}%`, rightCol, yPosition + 57);

  pdf.setFontSize(10);
  pdf.setTextColor(...TEXT_GRAY);
  pdf.setFont('helvetica', 'normal');
  pdf.text('Cost per Unit', rightCol, yPosition + 75);
  pdf.setFontSize(16);
  pdf.setTextColor(...TEXT_DARK);
  pdf.setFont('helvetica', 'bold');
  pdf.text(`$${roi.costPerUnit}`, rightCol, yPosition + 85);

  addPageFooter();

  // ============ PAGE 2: BUSINESS PROFILE & VOLUME ============
  pdf.addPage();
  yPosition = 25;

  // Header bar
  pdf.setFillColor(...BRAND_BLUE);
  pdf.rect(0, 0, pageWidth, 12, 'F');
  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(9);
  pdf.setFont('helvetica', 'bold');
  pdf.text('YOUR BUSINESS PROFILE', margin, 8);

  // Business Profile Section
  yPosition = 30;
  drawSectionHeader('Business Profile', '💼');

  const businessData = [
    ['Use Case', getUseCaseLabel(formData.useCase)],
    ['Business Stage', getBusinessStageLabel(formData.businessStage)],
    ['Current Fulfillment', getFulfillmentLabel(formData.currentFulfillment)],
  ];

  pdf.setFontSize(10);
  businessData.forEach(([label, value]) => {
    pdf.setTextColor(...TEXT_GRAY);
    pdf.setFont('helvetica', 'normal');
    pdf.text(`${label}:`, margin + 5, yPosition);
    pdf.setTextColor(...TEXT_DARK);
    pdf.setFont('helvetica', 'bold');
    pdf.text(value || 'N/A', margin + 55, yPosition);
    yPosition += 8;
  });

  yPosition += 10;

  // Volume Metrics Section
  drawSectionHeader('Volume Metrics', '📦');

  // Two-column layout for metrics
  const colWidth = (contentWidth - 10) / 2;
  const leftMetrics = [
    ['Monthly Orders', formData.monthlyOrders.toLocaleString()],
    ['Units per Order', formData.avgUnitsPerOrder.toString()],
    ['SKU Count', formData.skuCount.toString()],
  ];
  const rightMetrics = [
    ['Total Monthly Units', roi.monthlyUnits.toLocaleString()],
    ['Avg Cost/Order', formData.currentCostPerOrder || 'Not specified'],
    ['Your Price Tier', `$${roi.costPerUnit}/unit`],
  ];

  const startY = yPosition;
  pdf.setFontSize(10);
  
  leftMetrics.forEach(([label, value], i) => {
    pdf.setFillColor(...LIGHT_BG);
    pdf.roundedRect(margin, yPosition + (i * 15), colWidth, 12, 2, 2, 'F');
    pdf.setTextColor(...TEXT_GRAY);
    pdf.setFont('helvetica', 'normal');
    pdf.text(label, margin + 3, yPosition + (i * 15) + 8);
    pdf.setTextColor(...TEXT_DARK);
    pdf.setFont('helvetica', 'bold');
    pdf.text(value, margin + colWidth - 3, yPosition + (i * 15) + 8, { align: 'right' });
  });

  rightMetrics.forEach(([label, value], i) => {
    pdf.setFillColor(...LIGHT_BG);
    pdf.roundedRect(margin + colWidth + 10, startY + (i * 15), colWidth, 12, 2, 2, 'F');
    pdf.setTextColor(...TEXT_GRAY);
    pdf.setFont('helvetica', 'normal');
    pdf.text(label, margin + colWidth + 13, startY + (i * 15) + 8);
    pdf.setTextColor(...TEXT_DARK);
    pdf.setFont('helvetica', 'bold');
    pdf.text(value, margin + contentWidth - 3, startY + (i * 15) + 8, { align: 'right' });
  });

  yPosition += 55;

  // Current Costs Section
  drawSectionHeader('Current Costs & Challenges', '⚠️');

  const costData = [
    ['Error Rate', `${formData.currentErrorRate}%`, `~$${roi.currentErrorCost}/mo in losses`],
    ['Return Rate', `${formData.returnRate}%`, `~$${roi.returnCost}/mo processing`],
    ['Weekly Hours', `${formData.hoursSpentWeekly}h`, `~$${roi.timeSavedValue}/mo opportunity cost`],
  ];

  pdf.setFontSize(10);
  costData.forEach(([label, value, impact]) => {
    checkPageBreak(15);
    pdf.setTextColor(...TEXT_DARK);
    pdf.setFont('helvetica', 'bold');
    pdf.text(`${label}: ${value}`, margin + 5, yPosition);
    pdf.setTextColor(...TEXT_GRAY);
    pdf.setFont('helvetica', 'italic');
    pdf.text(impact, margin + 70, yPosition);
    yPosition += 10;
  });

  // Pain Points
  if (formData.painPoints.length > 0) {
    yPosition += 5;
    pdf.setTextColor(...TEXT_GRAY);
    pdf.setFont('helvetica', 'normal');
    pdf.text('Key Pain Points:', margin + 5, yPosition);
    yPosition += 8;
    pdf.setTextColor(...TEXT_DARK);
    formData.painPoints.forEach(point => {
      checkPageBreak(8);
      pdf.text(`• ${getPainPointLabel(point)}`, margin + 10, yPosition);
      yPosition += 6;
    });
  }

  yPosition += 10;

  // Services Section
  checkPageBreak(50);
  drawSectionHeader('Services Selected', '✅');

  // Services in 2 columns
  const servicesPerCol = Math.ceil(formData.services.length / 2);
  pdf.setFontSize(10);
  pdf.setTextColor(...TEXT_DARK);
  
  formData.services.forEach((service, i) => {
    const col = i < servicesPerCol ? 0 : 1;
    const row = i < servicesPerCol ? i : i - servicesPerCol;
    const xPos = margin + 5 + (col * (contentWidth / 2));
    pdf.text(`✓ ${getServiceLabel(service)}`, xPos, yPosition + (row * 8));
  });
  
  yPosition += (servicesPerCol * 8) + 5;

  // Special Requirements
  if (formData.specialRequirements.length > 0) {
    yPosition += 5;
    pdf.setTextColor(...TEXT_GRAY);
    pdf.setFont('helvetica', 'italic');
    pdf.text('Special Requirements: ' + formData.specialRequirements.map(r => getSpecialReqLabel(r)).join(', '), margin + 5, yPosition);
    yPosition += 10;
  }

  addPageFooter();

  // ============ PAGE 3: SAVINGS BREAKDOWN ============
  pdf.addPage();
  yPosition = 25;

  // Header bar
  pdf.setFillColor(...BRAND_BLUE);
  pdf.rect(0, 0, pageWidth, 12, 'F');
  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(9);
  pdf.setFont('helvetica', 'bold');
  pdf.text('YOUR SAVINGS BREAKDOWN', margin, 8);

  yPosition = 30;
  drawSectionHeader('How We Calculate Your Savings', '💰');

  const savingsItems = [
    { label: 'Error Cost Reduction', value: roi.currentErrorCost, desc: 'Based on your error rate × $18/error industry average', color: GREEN_SUCCESS },
    { label: 'Return Processing Savings', value: roi.returnCost, desc: 'Based on your return rate × $12/return processing cost', color: GREEN_SUCCESS },
    { label: 'Time Value Recovered', value: roi.timeSavedValue, desc: `${roi.timeSavedHours} hours/month × $25/hour opportunity cost`, color: BRAND_BLUE },
  ];

  // Add cost savings if available
  if (roi.costSavings && roi.costSavings > 0) {
    savingsItems.push({ 
      label: 'Per-Order Cost Savings', 
      value: roi.costSavings, 
      desc: `Your cost vs our rate × ${formData.monthlyOrders.toLocaleString()} monthly orders`, 
      color: BRAND_ORANGE 
    });
  }

  savingsItems.forEach(item => {
    checkPageBreak(30);
    pdf.setFillColor(...LIGHT_BG);
    pdf.roundedRect(margin, yPosition, contentWidth, 25, 3, 3, 'F');
    
    // Left border accent
    pdf.setFillColor(...item.color);
    pdf.rect(margin, yPosition, 3, 25, 'F');
    
    pdf.setFontSize(12);
    pdf.setTextColor(...TEXT_DARK);
    pdf.setFont('helvetica', 'bold');
    pdf.text(item.label, margin + 8, yPosition + 10);
    
    pdf.setFontSize(18);
    pdf.setTextColor(...item.color);
    pdf.text(`$${item.value.toLocaleString()}`, pageWidth - margin - 5, yPosition + 12, { align: 'right' });
    
    pdf.setFontSize(8);
    pdf.setTextColor(...TEXT_GRAY);
    pdf.setFont('helvetica', 'normal');
    pdf.text(item.desc, margin + 8, yPosition + 20);
    
    yPosition += 30;
  });

  // Divider
  pdf.setDrawColor(...BRAND_ORANGE);
  pdf.setLineWidth(1.5);
  pdf.line(margin, yPosition, pageWidth - margin, yPosition);
  yPosition += 15;

  // Total savings highlight
  pdf.setFillColor(...ORANGE_LIGHT);
  pdf.roundedRect(margin, yPosition, contentWidth, 35, 5, 5, 'F');
  
  pdf.setFontSize(14);
  pdf.setTextColor(...TEXT_DARK);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Total Monthly Savings', margin + 10, yPosition + 15);
  
  pdf.setFontSize(32);
  pdf.setTextColor(...GREEN_SUCCESS);
  pdf.text(`$${roi.totalSavings.toLocaleString()}`, pageWidth - margin - 10, yPosition + 22, { align: 'right' });
  
  yPosition += 45;

  // Investment estimate
  pdf.setFillColor(...LIGHT_BG);
  pdf.roundedRect(margin, yPosition, contentWidth, 30, 5, 5, 'F');
  
  pdf.setFontSize(11);
  pdf.setTextColor(...BRAND_BLUE);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Your Estimated Investment with Westfield', margin + 10, yPosition + 12);
  
  pdf.setFontSize(9);
  pdf.setTextColor(...TEXT_GRAY);
  pdf.setFont('helvetica', 'normal');
  pdf.text(`Based on ${roi.monthlyUnits.toLocaleString()} units/month at $${roi.costPerUnit}/unit`, margin + 10, yPosition + 20);
  
  pdf.setFontSize(14);
  pdf.setTextColor(...TEXT_DARK);
  pdf.setFont('helvetica', 'bold');
  pdf.text(`$${roi.estimatedMonthlyCost.toLocaleString()}/month`, pageWidth - margin - 10, yPosition + 18, { align: 'right' });
  
  yPosition += 45;

  // Next Steps Section
  checkPageBreak(80);
  drawSectionHeader('Next Steps', '🚀');

  const nextSteps = [
    { step: '1', text: 'A fulfillment specialist will contact you within 24 hours' },
    { step: '2', text: 'We\'ll review your specific requirements in detail' },
    { step: '3', text: 'You\'ll receive a detailed quote with no obligation' },
    { step: '4', text: 'Optional: Schedule a facility tour in Los Angeles' },
  ];

  pdf.setFontSize(11);
  nextSteps.forEach(({ step, text }) => {
    checkPageBreak(15);
    pdf.setFillColor(...BRAND_ORANGE);
    pdf.circle(margin + 8, yPosition - 2, 4, 'F');
    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(9);
    pdf.setFont('helvetica', 'bold');
    pdf.text(step, margin + 6, yPosition);
    
    pdf.setTextColor(...TEXT_DARK);
    pdf.setFontSize(11);
    pdf.setFont('helvetica', 'normal');
    pdf.text(text, margin + 18, yPosition);
    yPosition += 12;
  });

  yPosition += 10;

  // CTA Box
  checkPageBreak(40);
  pdf.setFillColor(...BRAND_BLUE);
  pdf.roundedRect(margin, yPosition, contentWidth, 40, 5, 5, 'F');
  
  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(16);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Ready to Get Started?', margin + 10, yPosition + 15);
  
  pdf.setFontSize(11);
  pdf.setFont('helvetica', 'normal');
  pdf.text('📞 (818) 935-5478', margin + 10, yPosition + 28);
  pdf.text('✉️ info@westfieldprepcenter.com', margin + 80, yPosition + 28);

  addPageFooter();

  // Add page numbers to all pages
  const totalPages = pdf.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    pdf.setPage(i);
    pdf.setFontSize(8);
    pdf.setTextColor(...TEXT_GRAY);
    pdf.text(`Page ${i} of ${totalPages}`, pageWidth - margin, pageHeight - 25, { align: 'right' });
  }

  return pdf;
};

// Label mapping functions
function getUseCaseLabel(id: string): string {
  const map: Record<string, string> = { 
    'shopify': 'Shopify / DTC', 
    'amazon': 'Amazon FBA / Walmart WFS', 
    'multi-channel': 'Multi-Channel', 
    'b2b': 'B2B / Wholesale' 
  };
  return map[id] || id;
}

function getBusinessStageLabel(id: string): string {
  const map: Record<string, string> = { 
    'startup': 'Initial Stage (<$50K/year)', 
    'growing': 'Growing ($50K-$500K/year)', 
    'scaling': 'Scaling Fast ($500K-$2M/year)', 
    'established': 'Established ($2M+/year)' 
  };
  return map[id] || id;
}

function getFulfillmentLabel(id: string): string {
  const map: Record<string, string> = { 
    'self': 'Self-Fulfilled', 
    'other-3pl': 'Another 3PL', 
    'hybrid': 'Hybrid' 
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
    'support': 'Poor Support' 
  };
  return map[id] || id;
}

function getServiceLabel(id: string): string {
  const map: Record<string, string> = { 
    'fba-prep': 'FBA / WFS Prep', 
    'receiving': 'Receiving & Inspection', 
    'storage': 'Storage & Warehousing', 
    'pick-pack': 'Pick & Pack', 
    'labeling': 'Labeling & Compliance', 
    'kitting': 'Kitting & Bundling', 
    'returns': 'Returns Processing' 
  };
  return map[id] || id;
}

function getSpecialReqLabel(id: string): string {
  const map: Record<string, string> = { 
    'fragile': 'Fragile Items', 
    'hazmat': 'Hazmat/ORM-D', 
    'kitting': 'Custom Kitting', 
    'branding': 'Custom Packaging', 
    'lotTracking': 'Lot/Expiry Tracking' 
  };
  return map[id] || id;
}

export const downloadROIReport = (roi: ROIResult, formData: FormData) => {
  const pdf = generateROIReportPDF(roi, formData);
  const fileName = `Westfield-Savings-Report-${formData.fullName?.replace(/\s+/g, '-') || 'Report'}-${new Date().toISOString().split('T')[0]}.pdf`;
  pdf.save(fileName);
};
