// Barcode detection and validation utilities
// Handles tracking numbers, UPCs, EANs, and other barcode formats

/**
 * Detect if a barcode matches tracking number patterns
 */
export const isTrackingNumber = (barcode: string): boolean => {
  if (!barcode || barcode.length < 10) return false;
  
  // UPS: Starts with "1Z", 18 characters
  if (/^1Z[0-9A-Z]{16}$/i.test(barcode)) return true;
  
  // FedEx: 12, 14, 15, or 20 digits
  if (/^\d{12}$|^\d{14}$|^\d{15}$|^\d{20}$/.test(barcode)) return true;
  
  // USPS: 20-34 digits or starts with 9400/9200
  if (/^(94|92)\d{18,32}$/.test(barcode)) return true;
  if (/^\d{20,34}$/.test(barcode)) return true;
  
  // DHL: 10-11 digits
  if (/^\d{10,11}$/.test(barcode)) return true;
  
  return false;
};

/**
 * Auto-detect carrier from tracking number format
 */
export const detectCarrier = (trackingNumber: string): string => {
  if (!trackingNumber) return 'Unknown';
  
  // UPS: Starts with 1Z
  if (/^1Z/i.test(trackingNumber)) return 'UPS';
  
  // FedEx patterns
  if (/^\d{12}$/.test(trackingNumber)) return 'FedEx';
  if (/^\d{15}$/.test(trackingNumber)) return 'FedEx';
  if (/^\d{20}$/.test(trackingNumber)) return 'FedEx';
  
  // USPS patterns
  if (/^(94|92)\d{18,32}$/.test(trackingNumber)) return 'USPS';
  if (/^\d{20,34}$/.test(trackingNumber)) return 'USPS';
  
  // DHL patterns
  if (/^\d{10,11}$/.test(trackingNumber)) return 'DHL';
  
  return 'Unknown';
};

/**
 * Validate UPC/EAN check digit
 */
export const validateProductBarcode = (barcode: string): boolean => {
  if (!barcode || !/^\d+$/.test(barcode)) return false;
  
  // UPC-A: 12 digits, UPC-E: 8 digits, EAN-13: 13 digits, EAN-8: 8 digits
  if (![8, 12, 13].includes(barcode.length)) return false;
  
  const digits = barcode.split('').map(Number);
  const checkDigit = digits.pop()!;
  
  let sum = 0;
  digits.forEach((digit, index) => {
    // For EAN/UPC, alternate multiplying by 3 and 1
    const multiplier = (digits.length - index) % 2 === 0 ? 3 : 1;
    sum += digit * multiplier;
  });
  
  const calculatedCheck = (10 - (sum % 10)) % 10;
  return calculatedCheck === checkDigit;
};

/**
 * Format barcode for display (add hyphens/spaces for readability)
 */
export const formatBarcode = (barcode: string, type: string): string => {
  if (!barcode) return '';
  
  switch (type) {
    case 'tracking':
      if (barcode.startsWith('1Z')) {
        // UPS format: 1Z-XXX-XXX-XX-XXXX-XXX
        return barcode.replace(/^(1Z)(\w{3})(\w{3})(\w{2})(\w{4})(\w{3})$/i, '$1-$2-$3-$4-$5-$6');
      }
      return barcode;
    
    case 'upc':
      if (barcode.length === 12) {
        // UPC-A format: X-XXXXX-XXXXX-X
        return barcode.replace(/^(\d)(\d{5})(\d{5})(\d)$/, '$1-$2-$3-$4');
      }
      return barcode;
    
    case 'ean':
      if (barcode.length === 13) {
        // EAN-13 format: X-XXXXXX-XXXXXX-X
        return barcode.replace(/^(\d)(\d{6})(\d{5})(\d)$/, '$1-$2-$3-$4');
      }
      return barcode;
    
    default:
      return barcode;
  }
};

/**
 * Detect barcode type from format
 */
export const detectBarcodeType = (barcode: string): 'tracking' | 'upc' | 'ean' | 'code128' | 'unknown' => {
  if (!barcode) return 'unknown';
  
  // Check if tracking number
  if (isTrackingNumber(barcode)) return 'tracking';
  
  // Check UPC formats
  if (/^\d{12}$/.test(barcode) && validateProductBarcode(barcode)) return 'upc';
  if (/^\d{8}$/.test(barcode) && validateProductBarcode(barcode)) return 'upc';
  
  // Check EAN formats
  if (/^\d{13}$/.test(barcode) && validateProductBarcode(barcode)) return 'ean';
  
  // Check for Code 128 (alphanumeric)
  if (/^[A-Z0-9\-]+$/i.test(barcode) && barcode.length >= 6) return 'code128';
  
  return 'unknown';
};

/**
 * Normalize barcode (remove spaces, convert to uppercase)
 */
export const normalizeBarcode = (barcode: string): string => {
  return barcode.trim().replace(/\s+/g, '').toUpperCase();
};
