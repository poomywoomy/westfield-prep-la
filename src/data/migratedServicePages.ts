import { ldScripts, SITE, type FaqItem } from "@/data/pageSchemas";

import threePlSource from "../../docs/blog-posts/3pl-fulfillment-services-los-angeles.md?raw";
import ecommerceFulfillmentSource from "../../docs/blog-posts/ecommerce-fulfillment-services-los-angeles.md?raw";
import ecommerceWarehouseSource from "../../docs/blog-posts/ecommerce-warehouse-services-los-angeles.md?raw";
import multichannelSource from "../../docs/blog-posts/multichannel-fulfillment-support-los-angeles-sellers.md?raw";
import pickAndPackSource from "../../docs/blog-posts/pick-and-pack-services-los-angeles.md?raw";
import shopifySource from "../../docs/blog-posts/shopify-fulfillment-support-los-angeles-stores.md?raw";
import thirdPartySource from "../../docs/blog-posts/third-party-logistics-los-angeles.md?raw";

const STORAGE = "https://gqnvkecmxjijrxhggcro.supabase.co/storage/v1";

export interface MigratedServicePage {
  slug: string;
  path: string;
  title: string;
  seoTitle: string;
  metaDescription: string;
  content: string;
  photoCredit: string;
  image: string;
  shareImage: string;
  imageAlt: string;
  faqs: FaqItem[];
}

interface ServiceSource {
  source: string;
  image: string;
  imageAlt: string;
}

function parseSuppliedService({ source, image, imageAlt }: ServiceSource): MigratedServicePage {
  const normalized = source.replace(/\r\n/g, "\n").trim();
  const title = normalized.match(/^#\s+(.+)$/m)?.[1]?.trim();
  const seoTitle = normalized.match(/^\*\*Meta Title:\*\*\s*(.+)$/m)?.[1]?.trim();
  const metaDescription = normalized.match(/^\*\*Meta Description:\*\*\s*(.+)$/m)?.[1]?.trim();
  const separator = normalized.match(/^---$/m);
  const faqHeading = normalized.match(/^## FAQs$/m);
  const photoCredit = normalized.match(/^\*Cover photo:.+\*$/m)?.[0]?.trim() || "";

  if (!title || !seoTitle || !metaDescription || !separator || !faqHeading || !photoCredit) {
    throw new Error(`Incomplete supplied service source for ${image}`);
  }

  const bodyStart = (separator.index ?? 0) + separator[0].length;
  const faqStart = faqHeading.index ?? 0;
  const content = normalized.slice(bodyStart, faqStart).trim();
  const faqSection = normalized
    .slice(faqStart + faqHeading[0].length)
    .replace(photoCredit, "")
    .trim();
  const questionMatches = [...faqSection.matchAll(/^###\s+(.+)$/gm)];
  const faqs = questionMatches.map((match, index) => {
    const answerStart = (match.index ?? 0) + match[0].length;
    const answerEnd = questionMatches[index + 1]?.index ?? faqSection.length;
    return {
      question: match[1].trim(),
      answer: faqSection.slice(answerStart, answerEnd).trim(),
    };
  });

  if (faqs.length !== 10 || faqs.some((faq) => !faq.question || !faq.answer)) {
    throw new Error(`Expected 10 complete FAQs for ${title}; received ${faqs.length}`);
  }

  const slug = image.split("/").pop()?.replace("-stock.jpg", "") || "";
  return {
    slug,
    path: `/${slug}`,
    title,
    seoTitle,
    metaDescription,
    content,
    photoCredit,
    image,
    shareImage: `${image.replace("/object/public/", "/render/image/public/")}?width=1200&height=630&resize=cover`,
    imageAlt,
    faqs,
  };
}

export const MIGRATED_SERVICE_PAGES = {
  "3pl-fulfillment-services-los-angeles": parseSuppliedService({
    source: threePlSource,
    image: `${STORAGE}/object/public/blog-images/3pl-fulfillment-services-los-angeles-stock.jpg`,
    imageAlt: "Warehouse racks holding fulfillment inventory",
  }),
  "ecommerce-fulfillment-services-los-angeles": parseSuppliedService({
    source: ecommerceFulfillmentSource,
    image: `${STORAGE}/object/public/blog-images/ecommerce-fulfillment-services-los-angeles-stock.jpg`,
    imageAlt: "Warehouse inventory and ecommerce fulfillment operations",
  }),
  "ecommerce-warehouse-services-los-angeles": parseSuppliedService({
    source: ecommerceWarehouseSource,
    image: `${STORAGE}/object/public/blog-images/ecommerce-warehouse-services-los-angeles-stock.jpg`,
    imageAlt: "Warehouse stocked with cartons for ecommerce orders",
  }),
  "multichannel-fulfillment-support-los-angeles-sellers": parseSuppliedService({
    source: multichannelSource,
    image: `${STORAGE}/object/public/blog-images/multichannel-fulfillment-support-los-angeles-sellers-stock.jpg`,
    imageAlt: "Packed customer parcels ready for delivery",
  }),
  "pick-and-pack-services-los-angeles": parseSuppliedService({
    source: pickAndPackSource,
    image: `${STORAGE}/object/public/blog-images/pick-and-pack-services-los-angeles-stock.jpg`,
    imageAlt: "Open cardboard cartons prepared for packing orders",
  }),
  "shopify-fulfillment-support-los-angeles-stores": parseSuppliedService({
    source: shopifySource,
    image: `${STORAGE}/object/public/blog-images/shopify-fulfillment-support-los-angeles-stores-stock.jpg`,
    imageAlt: "Small business workspace preparing customer shipments",
  }),
  "third-party-logistics-los-angeles": parseSuppliedService({
    source: thirdPartySource,
    image: `${STORAGE}/object/public/blog-images/third-party-logistics-los-angeles-stock.jpg`,
    imageAlt: "Stacked shipping containers representing third-party logistics",
  }),
} satisfies Record<string, MigratedServicePage>;

export type MigratedServiceSlug = keyof typeof MIGRATED_SERVICE_PAGES;

export const MIGRATED_SERVICE_REDIRECTS: Record<string, string> = Object.fromEntries(
  Object.values(MIGRATED_SERVICE_PAGES).map((page) => [`/blog/${page.slug}`, page.path]),
);

export function createMigratedServiceHead(page: MigratedServicePage) {
  const canonical = `${SITE}${page.path}`;
  const serviceId = `${canonical}#service`;
  const breadcrumbId = `${canonical}#breadcrumb`;
  const scripts = ldScripts([
    {
      "@context": "https://schema.org",
      "@type": "Service",
      "@id": serviceId,
      name: page.title,
      serviceType: page.title,
      description: page.metaDescription,
      url: canonical,
      image: page.shareImage,
      provider: {
        "@type": "LocalBusiness",
        "@id": `${SITE}/#organization`,
        name: "Westfield Prep Center",
        telephone: "+18189355478",
      },
      areaServed: [
        { "@type": "City", name: "Los Angeles", containedInPlace: { "@type": "State", name: "California" } },
        { "@type": "Country", name: "United States" },
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "@id": canonical,
      url: canonical,
      name: page.seoTitle,
      description: page.metaDescription,
      primaryImageOfPage: { "@type": "ImageObject", contentUrl: page.shareImage, width: 1200, height: 630 },
      about: { "@id": serviceId },
      breadcrumb: { "@id": breadcrumbId },
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "@id": breadcrumbId,
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: SITE },
        { "@type": "ListItem", position: 2, name: "Services", item: `${SITE}/service-breakdown` },
        { "@type": "ListItem", position: 3, name: page.title, item: canonical },
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: page.faqs.map((faq) => ({
        "@type": "Question",
        name: faq.question,
        acceptedAnswer: { "@type": "Answer", text: faq.answer },
      })),
    },
  ]);

  return {
    meta: [
      { title: page.seoTitle },
      { name: "description", content: page.metaDescription },
      { name: "robots", content: "index, follow" },
      { property: "og:type", content: "website" },
      { property: "og:title", content: page.seoTitle },
      { property: "og:description", content: page.metaDescription },
      { property: "og:url", content: canonical },
      { property: "og:image", content: page.shareImage },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: page.seoTitle },
      { name: "twitter:description", content: page.metaDescription },
      { name: "twitter:image", content: page.shareImage },
    ],
    links: [{ rel: "canonical", href: canonical }],
    scripts,
  };
}
