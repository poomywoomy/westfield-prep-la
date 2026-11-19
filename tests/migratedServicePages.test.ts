import { describe, expect, it } from "vitest";
import threePlSource from "../docs/blog-posts/3pl-fulfillment-services-los-angeles.md?raw";
import ecommerceFulfillmentSource from "../docs/blog-posts/ecommerce-fulfillment-services-los-angeles.md?raw";
import ecommerceWarehouseSource from "../docs/blog-posts/ecommerce-warehouse-services-los-angeles.md?raw";
import multichannelSource from "../docs/blog-posts/multichannel-fulfillment-support-los-angeles-sellers.md?raw";
import pickAndPackSource from "../docs/blog-posts/pick-and-pack-services-los-angeles.md?raw";
import shopifySource from "../docs/blog-posts/shopify-fulfillment-support-los-angeles-stores.md?raw";
import thirdPartySource from "../docs/blog-posts/third-party-logistics-los-angeles.md?raw";
import {
  createMigratedServiceHead,
  MIGRATED_SERVICE_PAGES,
  MIGRATED_SERVICE_REDIRECTS,
  type MigratedServiceSlug,
} from "../src/data/migratedServicePages";

const sources: Record<MigratedServiceSlug, string> = {
  "3pl-fulfillment-services-los-angeles": threePlSource,
  "ecommerce-fulfillment-services-los-angeles": ecommerceFulfillmentSource,
  "ecommerce-warehouse-services-los-angeles": ecommerceWarehouseSource,
  "multichannel-fulfillment-support-los-angeles-sellers": multichannelSource,
  "pick-and-pack-services-los-angeles": pickAndPackSource,
  "shopify-fulfillment-support-los-angeles-stores": shopifySource,
  "third-party-logistics-los-angeles": thirdPartySource,
};

const expectedSeo: Record<MigratedServiceSlug, [string, string]> = {
  "3pl-fulfillment-services-los-angeles": [
    "3PL Fulfillment Services in Los Angeles | Westfield Prep Center",
    "Looking for a 3PL fulfillment center in Los Angeles? We offer storage, pick-and-pack services, and nationwide shipping for Shopify, Amazon, and multichannel sellers.",
  ],
  "ecommerce-fulfillment-services-los-angeles": [
    "Ecommerce Fulfillment Services in Los Angeles | Westfield Prep Center",
    "Keep your online orders moving with us. Explore e-commerce fulfillment support for inventory handling, order preparation, packing, and carrier handoff.",
  ],
  "ecommerce-warehouse-services-los-angeles": [
    "Ecommerce Warehouse Services in Los Angeles | Westfield Prep Center",
    "Keep your online orders moving with us. Explore e-commerce warehouse services in Los Angeles for product storage, inventory handling, packing, and shipping support.",
  ],
  "multichannel-fulfillment-support-los-angeles-sellers": [
    "Multichannel Fulfillment Services in Los Angeles | Westfield Prep Center",
    "We offer multichannel fulfillment services in Los Angeles, helping online sellers prepare orders, pack products, and manage shipping across sales channels.",
  ],
  "pick-and-pack-services-los-angeles": [
    "Pick and Pack Services in Los Angeles | Westfield Prep Center",
    "We offer pick-and-pack services in Los Angeles for businesses that need help selecting products, checking quantities, and preparing customer orders for dispatch.",
  ],
  "shopify-fulfillment-support-los-angeles-stores": [
    "Shopify Fulfillment Services in Los Angeles | Westfield Prep Center",
    "Looking for Shopify 3PL fulfillment in Los Angeles? We help prepare your customer orders for shipment. Share your product details, and we'll discuss service options.",
  ],
  "third-party-logistics-los-angeles": [
    "Third-Party Logistics Services in Los Angeles | Westfield Prep Center",
    "Looking for a third-party logistics company in Los Angeles? We handle stock receiving, warehouse storage, order fulfillment, and returns. Get a custom quote.",
  ],
};

describe("seven supplied blog-to-service conversions", () => {
  it("keeps every supplied content block, heading, FAQ answer, and photo credit", () => {
    for (const [slug, source] of Object.entries(sources) as [MigratedServiceSlug, string][]) {
      const page = MIGRATED_SERVICE_PAGES[slug];
      const normalized = source.replace(/\r\n/g, "\n").trim();
      const body = normalized.slice(normalized.indexOf("\n---\n") + 5);
      const blocks = body.split(/\n\s*\n/).map((block) => block.trim()).filter(Boolean);
      const faqAnswers = page.faqs.map((faq) => faq.answer);

      let inFaqs = false;
      for (const block of blocks) {
        if (block === "## FAQs") {
          inFaqs = true;
          continue;
        }
        if (inFaqs && block.startsWith("### ")) {
          const [question, ...answerParts] = block.split("\n");
          const answer = answerParts.join("\n").trim();
          expect(page.faqs.some((faq) => faq.question === question.slice(4).trim())).toBe(true);
          if (answer) expect(faqAnswers).toContain(answer);
        } else if (block.startsWith("*Cover photo:")) {
          expect(page.photoCredit).toBe(block);
        } else if (inFaqs) {
          expect(faqAnswers.some((answer) => answer.includes(block))).toBe(true);
        } else {
          expect(page.content).toContain(block);
        }
      }
    }
  });

  it("has exactly seven service paths and ten full FAQs per page", () => {
    const pages = Object.values(MIGRATED_SERVICE_PAGES);
    expect(pages).toHaveLength(7);
    expect(pages.reduce((total, page) => total + page.faqs.length, 0)).toBe(70);
    for (const page of pages) {
      expect(page.path).toBe(`/${page.slug}`);
      expect(page.faqs).toHaveLength(10);
      expect(page.faqs.every((faq) => faq.question.length > 10 && faq.answer.length > 40)).toBe(true);
    }
  });

  it("preserves every exact supplied SEO title and description", () => {
    for (const [slug, [title, description]] of Object.entries(expectedSeo) as [MigratedServiceSlug, [string, string]][]) {
      expect(MIGRATED_SERVICE_PAGES[slug].seoTitle).toBe(title);
      expect(MIGRATED_SERVICE_PAGES[slug].metaDescription).toBe(description);
    }
  });

  it("maps every legacy blog URL to its permanent service destination", () => {
    expect(Object.keys(MIGRATED_SERVICE_REDIRECTS)).toHaveLength(7);
    for (const page of Object.values(MIGRATED_SERVICE_PAGES)) {
      expect(MIGRATED_SERVICE_REDIRECTS[`/blog/${page.slug}`]).toBe(page.path);
    }
  });

  it("emits page-specific Service, WebPage, Breadcrumb, and FAQ schemas without article metadata", () => {
    for (const page of Object.values(MIGRATED_SERVICE_PAGES)) {
      const head = createMigratedServiceHead(page);
      expect(head.links).toEqual([{ rel: "canonical", href: `https://westfieldprepcenter.com${page.path}` }]);
      expect(head.meta).toContainEqual({ title: page.seoTitle });
      expect(head.meta).toContainEqual({ name: "description", content: page.metaDescription });
      expect(head.meta).toContainEqual({ property: "og:url", content: `https://westfieldprepcenter.com${page.path}` });
      expect(head.scripts).toHaveLength(4);
      const schemas = head.scripts.map((script) => JSON.parse(script.children));
      expect(schemas.map((schema) => schema["@type"])).toEqual(["Service", "WebPage", "BreadcrumbList", "FAQPage"]);
      expect(schemas[3].mainEntity).toHaveLength(10);
      expect(JSON.stringify(schemas)).not.toContain("BlogPosting");
      expect(JSON.stringify(schemas)).not.toContain("datePublished");
    }
  });
});
