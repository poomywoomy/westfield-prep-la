/**
 * Chatbot Knowledge Base
 * Contains all approved content the AI can reference.
 * If information is NOT in this file, the bot MUST defer to human contact.
 */

export interface FAQItem {
  question: string;
  answer: string;
  category: string;
}

export const APPROVED_FAQ: FAQItem[] = [
  // Getting Started
  { category: "Getting Started", question: "What makes Westfield Prep Center different?", answer: "We're a boutique prep center with a dedicated team that can check in products and ship them out much faster than traditional large-scale fulfillment centers. You get personalized attention and quicker turnaround times." },
  { category: "Getting Started", question: "How do I get started?", answer: "Fill out our contact form with your business details and monthly volume. We'll respond with an onboarding packet and pricing sheet tailored to your needs within 24 hours." },
  { category: "Getting Started", question: "Is there a minimum order quantity?", answer: "We work with brands of all sizes and don't have strict minimum order requirements. Whether you're just starting out or scaling rapidly, we'll create a custom pricing plan that fits your volume and needs." },
  { category: "Getting Started", question: "Can you handle large volumes?", answer: "Absolutely! We work with sellers of all sizes, from startups to established brands. We can scale our services to meet your growing business needs." },
  
  // Services
  { category: "Services", question: "What services does Westfield Prep Center offer?", answer: "We offer Amazon FBA prep, Walmart fulfillment, TikTok Shop fulfillment, Shopify order fulfillment, DTC fulfillment, receiving & inspection, polybagging, bubble wrap, bundling, product labeling (including FNSKU), case pack & carton prep, branded packaging, custom kitting, LTL & SPD shipping, and photo proof of every step." },
  { category: "Services", question: "Do you offer Amazon FBA prep?", answer: "Yes! We provide comprehensive Amazon FBA prep including FNSKU labeling, polybagging, bundling, case pack prep, and shipment to Amazon fulfillment centers. We stay up-to-date with all Amazon requirements." },
  { category: "Services", question: "Do you support Shopify fulfillment?", answer: "Yes! We provide same-day Shopify order fulfillment for orders placed before 2 PM PST. We offer branded packaging, custom inserts, and 99.8% accuracy rate." },
  { category: "Services", question: "What marketplaces do you support?", answer: "We support Amazon, Shopify, Walmart, TikTok Shop, and other major e-commerce platforms. We can handle multi-channel fulfillment from a single inventory pool." },
  { category: "Services", question: "Do you handle returns and removals?", answer: "Yes, we can receive and process customer returns, inspect items for restocking, handle exchanges, and provide detailed return reports." },
  { category: "Services", question: "Do you offer kitting and bundling?", answer: "Yes! We provide comprehensive kitting services including product assembly, bundling multiple items together, adding promotional inserts, gift boxing, and creating ready-to-ship product sets." },
  { category: "Services", question: "Can you handle subscription box fulfillment?", answer: "Yes, we're experienced in subscription box fulfillment with recurring monthly shipments, themed packaging, and custom inserts." },
  { category: "Services", question: "Do you offer white label services?", answer: "Yes! We can ship orders without any Westfield branding, using your company's branded packaging, inserts, and packing slips." },
  
  // Speed & Turnaround
  { category: "Turnaround", question: "How fast is receiving and shipping?", answer: "We pride ourselves on same-day turnaround for orders placed before 2 PM PST. Our boutique size allows us to process significantly faster than larger prep centers." },
  { category: "Turnaround", question: "What is your same-day cutoff time?", answer: "Orders placed before 2 PM PST ship the same business day. Orders placed after 2 PM PST will ship the next business day." },
  { category: "Turnaround", question: "What are your business hours?", answer: "Our warehouse operates Monday through Friday, 8:00 AM to 5:00 PM Pacific Time. Same-day shipping cutoff is 2:00 PM PST." },
  { category: "Turnaround", question: "Do you offer rush processing?", answer: "Yes! Rush services are available for urgent shipments with an additional fee. This ensures priority handling and same-day or next-day completion." },
  
  // Quality & Documentation
  { category: "Quality", question: "Do you provide photo proof of your work?", answer: "Yes! We provide photo verification and quality control documentation for every step of the prep process. Every shipment is documented with timestamped photos." },
  { category: "Quality", question: "What's your accuracy rate?", answer: "We maintain a 99.8% accuracy rate for order fulfillment. Every order is double-checked during picking and packing." },
  { category: "Quality", question: "Are you insured?", answer: "Yes, we are fully insured with both General Liability and Warehouse Legal Liability insurance to protect your inventory." },
  
  // Location
  { category: "Location", question: "Where is Westfield Prep Center located?", answer: "We're based in Los Angeles with easy access to major carriers for efficient shipping to fulfillment centers nationwide. Our strategic West Coast location ensures fast shipping times." },
  { category: "Location", question: "Why is Los Angeles a strategic location?", answer: "Los Angeles is a major logistics hub with access to the nation's largest port complex (LA/Long Beach), close proximity to international airports, and excellent carrier infrastructure." },
  { category: "Location", question: "Do you offer international shipping?", answer: "Yes! We can ship internationally to most countries worldwide. We handle customs documentation and work with international carriers." },
  
  // Fit & Ideal Clients
  { category: "Fit", question: "Who is Westfield Prep Center a good fit for?", answer: "We're ideal for e-commerce sellers on Amazon, Shopify, Walmart, and TikTok Shop who want personalized service, fast turnaround, and transparent communication. We work with brands of all sizes, from startups to established sellers." },
  { category: "Fit", question: "What is a 3PL?", answer: "A 3PL (Third-Party Logistics) provider handles warehousing, fulfillment, and shipping for e-commerce businesses. We store your inventory, pick and pack orders, and ship them to your customers or marketplace fulfillment centers." },
];

// Topics that MUST be deferred to human contact
export const DEFER_TOPICS = [
  "pricing",
  "cost",
  "price",
  "rate",
  "quote",
  "how much",
  "fee",
  "charge",
  "payment terms",
  "contract",
  "agreement",
  "sla",
  "guarantee",
  "promise",
  "legal",
  "tax",
  "liability",
  "insurance claim",
  "specific timeline",
  "exact date",
  "address",
  "visit",
  "tour",
  "warehouse location",
  "street address",
];

// CTA options the bot can suggest
export const CTA_OPTIONS = {
  audit: {
    label: "Get Free Fulfillment Audit",
    url: "/contact",
    trigger: ["pricing", "quote", "cost", "volume", "switching", "growth", "ready to start"]
  },
  contact: {
    label: "Contact Our Team",
    url: "/contact", 
    trigger: ["question", "help", "support", "more info"]
  },
  call: {
    label: "Call (818) 935-5478",
    url: "tel:+18189355478",
    trigger: ["call", "phone", "speak", "talk"]
  }
};

// Greeting messages (rotate randomly)
export const GREETING_MESSAGES = [
  "Have questions about Amazon FBA prep or fulfillment?",
  "Need help choosing the right 3PL?",
  "I can help you see if Westfield Prep Center is a good fit.",
];

// Safe fallback when bot is unsure
export const FALLBACK_RESPONSE = "That's a great question. For the most accurate answer, I'd recommend speaking with our team directly.";

// System prompt for the AI
export const SYSTEM_PROMPT = `You are a helpful assistant for Westfield Prep Center, a Los Angeles-based 3PL and Amazon FBA prep center.

## STRICT RULES - MUST FOLLOW:
1. ONLY answer questions using information from the approved knowledge base provided below.
2. NEVER speculate, infer, or make up information not explicitly in the knowledge base.
3. Keep responses to 3-5 sentences maximum.
4. Use bullet points when listing multiple items.
5. Include maximum 1 CTA per response.
6. If you don't have approved information to answer a question, say: "${FALLBACK_RESPONSE}" and suggest contacting the team.

## TOPICS YOU MUST DEFER (never answer directly):
- Exact pricing, costs, rates, or quotes
- Contract terms or SLAs
- Guaranteed delivery times or specific timelines
- Legal, tax, or liability questions
- Physical address or warehouse visits

## SOFT QUALIFICATION (ask ONLY when naturally relevant, max 1-2 per conversation):
- "Roughly how many orders do you ship per month?"
- "Which platform are you selling on?"

## CTA GUIDELINES:
- Only suggest a CTA after the user asks about pricing, volume, growth, or switching 3PLs
- Never push CTAs on the first message
- Available CTAs:
  • "Get Free Fulfillment Audit" → /contact
  • "Contact Our Team" → /contact
  • "Call (818) 935-5478"

## TONE:
- Professional, friendly, knowledgeable
- Clear and confident, never salesy or robotic
- Based in Los Angeles, servicing nationwide

## SAB COMPLIANCE (Service Area Business):
- NEVER provide a physical address
- NEVER mention warehouse visits
- Say "Based in Los Angeles" or "Servicing Los Angeles & nationwide"

## APPROVED KNOWLEDGE BASE:
${APPROVED_FAQ.map(faq => `Q: ${faq.question}\nA: ${faq.answer}`).join('\n\n')}
`;
