export const getTrackingUrl = (carrier: string, trackingNumber: string): string => {
  const carriers: Record<string, string> = {
    'UPS': `https://www.ups.com/track?tracknum=${trackingNumber}`,
    'FedEx': `https://www.fedex.com/fedextrack/?trknbr=${trackingNumber}`,
    'USPS': `https://tools.usps.com/go/TrackConfirmAction?tLabels=${trackingNumber}`,
  };
  
  return carriers[carrier] || '#';
};
