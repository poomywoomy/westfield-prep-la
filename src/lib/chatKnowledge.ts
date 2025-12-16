/**
 * Chatbot Knowledge Base
 * Contains all approved content the AI can reference.
 * If information is NOT in this file, the bot MUST defer to human contact.
 */

export interface FAQItem {
  question: string;
  answer: string;
  category: string;
  alternateAnswers?: string[]; // For response variation
}

export const APPROVED_FAQ: FAQItem[] = [
  // Getting Started
  { 
    category: "Getting Started", 
    question: "What makes Westfield Prep Center different?", 
    answer: "We're a boutique prep center with a dedicated team that can check in products and ship them out much faster than traditional large-scale fulfillment centers. You get personalized attention and quicker turnaround times.",
    alternateAnswers: [
      "Speed and personal attention are our calling cards. Unlike big-box fulfillment centers, we're boutique-sized — which means faster processing, direct communication, and a team that actually knows your account.",
      "Think of us as the anti-mega-warehouse. We're smaller by design, which lets us move fast and give you the kind of hands-on service that's hard to find at larger 3PLs."
    ]
  },
  { 
    category: "Getting Started", 
    question: "How do I get started?", 
    answer: "Fill out our contact form with your business details and monthly volume. We'll respond with an onboarding packet and pricing sheet tailored to your needs within 24 hours.",
    alternateAnswers: [
      "Getting started is easy — just fill out our contact form and we'll send you a custom quote within 24 hours. Once approved, you can start receiving inventory right away.",
      "Drop us your details via our contact form, and we'll have a custom pricing sheet back to you within a day. From there, onboarding moves fast."
    ]
  },
  { 
    category: "Getting Started", 
    question: "How fast can we get started?", 
    answer: "Pretty quickly! We typically respond to quote requests within 24 hours. Once you approve, onboarding can begin immediately and you can start receiving inventory the same week.",
    alternateAnswers: [
      "We move fast — expect a custom quote within 24 hours, and once you're ready, we can usually start receiving your inventory within days.",
      "Speed is kind of our thing. Quote in 24 hours, immediate onboarding after approval, and most clients are shipping within a week."
    ]
  },
  { 
    category: "Getting Started", 
    question: "What does the setup process look like?", 
    answer: "Simple and fast — you fill out a quick form, we send you custom pricing within 24 hours, and once approved, we get you set up in our system. Most clients are receiving inventory within days of approval.",
    alternateAnswers: [
      "It's pretty streamlined: submit your info, get pricing in 24 hours, approve it, and we handle the rest. Most brands are up and running within a week.",
      "No complicated setup here. Quick form, fast quote, and you're in our system and ready to receive inventory before you know it."
    ]
  },
  { 
    category: "Getting Started", 
    question: "Is there a minimum order quantity?", 
    answer: "We work with brands of all sizes and don't have strict minimum order requirements. Whether you're just starting out or scaling rapidly, we'll create a custom pricing plan that fits your volume and needs." 
  },
  { 
    category: "Getting Started", 
    question: "Can you handle large volumes?", 
    answer: "Absolutely! We work with sellers of all sizes, from startups to established brands. We can scale our services to meet your growing business needs." 
  },
  
  // Services
  { 
    category: "Services", 
    question: "What services does Westfield Prep Center offer?", 
    answer: "We offer Amazon FBA prep, Walmart fulfillment, TikTok Shop fulfillment, Shopify order fulfillment, DTC fulfillment, receiving & inspection, polybagging, bubble wrap, bundling, product labeling (including FNSKU), case pack & carton prep, branded packaging, custom kitting, LTL & SPD shipping, and photo proof of every step." 
  },
  { 
    category: "Services", 
    question: "Do you offer Amazon FBA prep?", 
    answer: "Yes! We provide comprehensive Amazon FBA prep including FNSKU labeling, polybagging, bundling, case pack prep, and shipment to Amazon fulfillment centers. We stay up-to-date with all Amazon requirements.",
    alternateAnswers: [
      "Amazon FBA prep is one of our specialties. We handle FNSKU labeling, polybagging, bundling, case packs — the whole nine yards. And we stay current on Amazon's ever-changing requirements.",
      "Absolutely — FBA prep is a core service. From labeling to case packing to shipping to Amazon's FCs, we've got you covered."
    ]
  },
  { 
    category: "Services", 
    question: "Do you support Shopify fulfillment?", 
    answer: "Yes! We provide same-day Shopify order fulfillment for orders placed before 2 PM PST. We offer branded packaging, custom inserts, and 99.8% accuracy rate.",
    alternateAnswers: [
      "Shopify fulfillment? That's our bread and butter. Same-day shipping for orders before 2 PM PST, branded packaging options, and a 99.8% accuracy rate.",
      "We're big on Shopify — same-day fulfillment, custom packaging, and an accuracy rate that keeps your customers happy."
    ]
  },
  { 
    category: "Services", 
    question: "What marketplaces do you support?", 
    answer: "We support Amazon, Shopify, Walmart, TikTok Shop, and other major e-commerce platforms. We can handle multi-channel fulfillment from a single inventory pool." 
  },
  { 
    category: "Services", 
    question: "Do you handle returns and removals?", 
    answer: "Yes, we can receive and process customer returns, inspect items for restocking, handle exchanges, and provide detailed return reports." 
  },
  { 
    category: "Services", 
    question: "Do you offer kitting and bundling?", 
    answer: "Yes! We provide comprehensive kitting services including product assembly, bundling multiple items together, adding promotional inserts, gift boxing, and creating ready-to-ship product sets." 
  },
  { 
    category: "Services", 
    question: "Can you handle subscription box fulfillment?", 
    answer: "Yes, we're experienced in subscription box fulfillment with recurring monthly shipments, themed packaging, and custom inserts." 
  },
  { 
    category: "Services", 
    question: "Do you offer white label services?", 
    answer: "Yes! We can ship orders without any Westfield branding, using your company's branded packaging, inserts, and packing slips." 
  },
  
  // Speed & Turnaround
  { 
    category: "Turnaround", 
    question: "How fast is receiving and shipping?", 
    answer: "We pride ourselves on same-day turnaround for orders placed before 2 PM PST. Our boutique size allows us to process significantly faster than larger prep centers.",
    alternateAnswers: [
      "Speed is our strength — orders before 2 PM PST ship same day. Being boutique-sized means we move a lot faster than the big warehouses.",
      "Same-day shipping for orders in by 2 PM PST. Our smaller operation is built for speed, not bureaucracy."
    ]
  },
  { 
    category: "Turnaround", 
    question: "How quickly do you turn orders around?", 
    answer: "Orders placed before 2 PM PST ship the same business day. Our boutique operation is built for speed — we process much faster than big-box fulfillment centers.",
    alternateAnswers: [
      "Same-day for orders before 2 PM PST. We're intentionally smaller so we can move faster than the mega-warehouses.",
      "Fast! 2 PM PST is our cutoff for same-day shipping. Being boutique means no red tape slowing things down."
    ]
  },
  { 
    category: "Turnaround", 
    question: "What is your same-day cutoff time?", 
    answer: "Orders placed before 2 PM PST ship the same business day. Orders placed after 2 PM PST will ship the next business day." 
  },
  { 
    category: "Turnaround", 
    question: "What are your business hours?", 
    answer: "Our warehouse operates Monday through Friday, 8:00 AM to 5:00 PM Pacific Time. Same-day shipping cutoff is 2:00 PM PST." 
  },
  { 
    category: "Turnaround", 
    question: "Do you offer rush processing?", 
    answer: "Yes! Rush services are available for urgent shipments with an additional fee. This ensures priority handling and same-day or next-day completion." 
  },
  
  // Quality & Documentation
  { 
    category: "Quality", 
    question: "Do you provide photo proof of your work?", 
    answer: "Yes! We provide photo verification and quality control documentation for every step of the prep process. Every shipment is documented with timestamped photos." 
  },
  { 
    category: "Quality", 
    question: "What's your accuracy rate?", 
    answer: "We maintain a 99.8% accuracy rate for order fulfillment. Every order is double-checked during picking and packing." 
  },
  { 
    category: "Quality", 
    question: "Are you insured?", 
    answer: "Yes, we are fully insured with both General Liability and Warehouse Legal Liability insurance to protect your inventory." 
  },
  
  // Location & Shipping
  { 
    category: "Location", 
    question: "Where is Westfield Prep Center located?", 
    answer: "We're based in Los Angeles with easy access to major carriers for efficient shipping to fulfillment centers nationwide. Our strategic West Coast location ensures fast shipping times." 
  },
  { 
    category: "Location", 
    question: "Where are you based?", 
    answer: "We're based in Los Angeles with easy access to major carriers for efficient shipping nationwide. Our West Coast location gives us great connectivity to ports, carriers, and fulfillment centers.",
    alternateAnswers: [
      "Los Angeles — right in the heart of one of the country's biggest logistics hubs. Great access to carriers and fast shipping nationwide.",
      "We're LA-based, which gives us fantastic logistics infrastructure and quick access to carriers across the country."
    ]
  },
  { 
    category: "Location", 
    question: "Do you work nationwide?", 
    answer: "Yes! While we're based in Los Angeles, we service brands nationwide. Our West Coast location gives us great access to carriers and fulfillment centers across the country.",
    alternateAnswers: [
      "Absolutely — we're based in LA but ship for brands all across the country. Our location actually makes nationwide shipping super efficient.",
      "We do! LA is our home base, but we work with brands coast to coast."
    ]
  },
  { 
    category: "Location", 
    question: "Why is Los Angeles a strategic location?", 
    answer: "Los Angeles is a major logistics hub with access to the nation's largest port complex (LA/Long Beach), close proximity to international airports, and excellent carrier infrastructure." 
  },
  { 
    category: "Location", 
    question: "Do you offer international shipping?", 
    answer: "Yes! We can ship internationally to most countries worldwide. We handle customs documentation and work with international carriers." 
  },
  
  // Fit & Ideal Clients
  { 
    category: "Fit", 
    question: "Who is Westfield Prep Center a good fit for?", 
    answer: "We're ideal for e-commerce sellers on Amazon, Shopify, Walmart, and TikTok Shop who want personalized service, fast turnaround, and transparent communication. We work with brands of all sizes, from startups to established sellers." 
  },
  { 
    category: "Fit", 
    question: "What kind of brands do you work with?", 
    answer: "We work with eCommerce brands of all sizes — from startups shipping a few hundred units to established sellers moving thousands monthly. If you sell on Amazon, Shopify, Walmart, or TikTok Shop, we're a great fit.",
    alternateAnswers: [
      "All kinds! From scrappy startups to scaling brands doing thousands of units. If you're selling on Amazon, Shopify, Walmart, or TikTok Shop, we can help.",
      "Everyone from emerging brands to established sellers. Size doesn't matter to us — what matters is that you want a 3PL that moves fast and communicates well."
    ]
  },
  { 
    category: "Fit", 
    question: "Can you support high volume?", 
    answer: "Absolutely! We scale with our clients. Whether you're doing a few hundred units or ramping up to thousands, our operations are built to handle growth.",
    alternateAnswers: [
      "For sure — we grow with you. Whether you're at a few hundred units or scaling to thousands, we're built to keep up.",
      "High volume is no problem. We've designed our operations to scale, so you can grow without worrying about outgrowing your 3PL."
    ]
  },
  { 
    category: "Fit", 
    question: "What is a 3PL?", 
    answer: "A 3PL (Third-Party Logistics) provider handles warehousing, fulfillment, and shipping for e-commerce businesses. We store your inventory, pick and pack orders, and ship them to your customers or marketplace fulfillment centers." 
  },

  // Logistics (Guarded)
  { 
    category: "Logistics", 
    question: "Do you support LTL or FTL shipments?", 
    answer: "We support inbound LTL and FTL receiving and can coordinate with carriers for scheduling. The specifics depend on your volume and needs — a fulfillment audit helps us plan the best approach for your freight." 
  },
  { 
    category: "Logistics", 
    question: "Can you assist with customs clearance?", 
    answer: "We can assist and coordinate customs-related workflows, helping you navigate the process and receiving your inventory once it clears. We're not a customs broker, but we've helped many clients through this process — let's chat about your specific situation." 
  },
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
  "Thinking about switching 3PLs? I can help with that.",
  "Got questions about our services or turnaround times?",
];

// Safe fallback when bot is unsure
export const FALLBACK_RESPONSE = "That's a great question — let me point you to someone who can give you the best answer.";

// Friendly deferral variations
export const DEFERRAL_VARIATIONS = [
  "That's something our team can tailor really well — a quick fulfillment audit is the best next step.",
  "We can absolutely help with that! It's best handled with a quick audit so nothing is missed.",
  "Once we understand your volume and channels, we can move fast — the audit helps us do that.",
  "Great question! This is one where a quick call would give you the most accurate answer.",
  "Happy to help with that — let's set up a quick chat so we can get into the specifics.",
  "That's exactly the kind of thing we cover during onboarding. Want to get the ball rolling?",
];

// System prompt for the AI (kept for reference, actual prompt is in edge function)
export const SYSTEM_PROMPT = `You are a helpful, friendly assistant for Westfield Prep Center, a Los Angeles-based 3PL and Amazon FBA prep center.

## YOUR PERSONALITY & TONE:
- Be warm, confident, and conversational — like a knowledgeable friend, not a robot
- Acknowledge the user's intent before answering
- Use natural language variations — NEVER repeat the same phrasing twice
- Be helpful even when deferring to human contact

## STRICT RULES - MUST FOLLOW:
1. ONLY answer questions using information from the approved knowledge base.
2. NEVER speculate, infer, or make up information.
3. Keep responses to 3-5 sentences maximum.
4. Use bullet points when listing multiple items.
5. Include maximum 1 CTA per response.
6. If unsure, use a friendly deferral and suggest contacting the team.

## TOPICS YOU MUST DEFER (never answer directly):
- Exact pricing, costs, rates, or quotes
- Contract terms or SLAs
- Guaranteed delivery times or specific timelines
- Legal, tax, or liability questions
- Physical address or warehouse visits

## SAB COMPLIANCE:
- NEVER provide a physical address
- Say "Based in Los Angeles" or "Servicing Los Angeles & nationwide"

## APPROVED KNOWLEDGE BASE:
${APPROVED_FAQ.map(faq => `Q: ${faq.question}\nA: ${faq.answer}`).join('\n\n')}
`;
