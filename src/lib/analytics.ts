// Centralized Analytics Helper
// Tracks CRO events for GA4, can be extended for Mixpanel/PostHog

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  }
}

export type AnalyticsEvent = 
  | 'roi_calculator_started'
  | 'roi_calculator_completed'
  | 'quote_form_submitted'
  | 'calendly_modal_opened'
  | 'calendly_booking_completed'
  | 'lead_magnet_downloaded'
  | 'pricing_page_viewed'
  | 'exit_intent_shown'
  | 'exit_intent_converted'
  | 'schedule_call_clicked'
  | 'use_case_selected'
  | 'integration_cta_clicked';

export const trackEvent = (
  eventName: AnalyticsEvent,
  params?: Record<string, string | number | boolean>
) => {
  // Console log for development
  console.log(`[Analytics] ${eventName}`, { timestamp: new Date().toISOString(), ...params });
  
  // GA4 tracking
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', eventName, {
      ...params,
      timestamp: new Date().toISOString(),
    });
  }
};

export const trackPageView = (pagePath: string, pageTitle?: string) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'page_view', {
      page_path: pagePath,
      page_title: pageTitle,
    });
  }
};

// Conversion tracking helpers
export const trackConversion = (conversionType: string, value?: number) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'conversion', {
      conversion_type: conversionType,
      value: value || 0,
    });
  }
};
