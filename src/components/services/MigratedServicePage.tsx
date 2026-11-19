import { useEffect } from "react";
import { ArrowRight, CheckCircle, MapPin, Phone } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Breadcrumbs from "@/components/Breadcrumbs";
import { BlogPostRenderer } from "@/components/blog/BlogPostRenderer";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Link } from "@/lib/router-compat";
import type { MigratedServicePage as MigratedServicePageData } from "@/data/migratedServicePages";

interface MigratedServicePageProps {
  page: MigratedServicePageData;
}

export default function MigratedServicePage({ page }: MigratedServicePageProps) {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [page.path]);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <div className="pt-20">
        <Breadcrumbs
          items={[
            { label: "Services", path: "/service-breakdown" },
            { label: page.title, path: page.path },
          ]}
        />
      </div>

      <main className="flex-1">
        <section className="relative overflow-hidden bg-primary">
          <div className="container mx-auto px-4 py-16 md:py-20 lg:py-24">
            <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-14">
              <div>
                <p className="mb-5 text-xs font-bold uppercase tracking-[0.22em] text-secondary">
                  Los Angeles fulfillment services
                </p>
                <h1 className="text-4xl font-bold leading-tight tracking-tight text-primary-foreground md:text-5xl lg:text-6xl">
                  {page.title}
                </h1>
                <p className="mt-6 max-w-2xl text-lg leading-relaxed text-primary-foreground/80 md:text-xl">
                  {page.metaDescription}
                </p>
                <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                  <Link to="/contact">
                    <Button size="lg" className="w-full bg-secondary px-7 text-secondary-foreground hover:bg-secondary/90 sm:w-auto">
                      Get a Quote
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </Link>
                  <a href="tel:+18189355478">
                    <Button
                      size="lg"
                      variant="outline"
                      className="w-full border-primary-foreground/30 bg-primary-foreground/10 px-7 text-primary-foreground hover:bg-primary-foreground/20 sm:w-auto"
                    >
                      <Phone className="mr-2 h-5 w-5 text-secondary" />
                      1.818.935.5478
                    </Button>
                  </a>
                </div>
              </div>

              <div className="relative">
                <div className="overflow-hidden rounded-2xl border border-primary-foreground/20 bg-primary-foreground/10 shadow-2xl">
                  <img
                    src={page.image}
                    alt={page.imageAlt}
                    width={1600}
                    height={900}
                    className="aspect-video h-full w-full object-cover"
                    loading="eager"
                    decoding="async"
                    fetchPriority="high"
                  />
                </div>
                <p className="mt-3 text-xs text-primary-foreground/60">Stock photography. Credit appears below the FAQs.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-background py-16 md:py-20">
          <div className="container mx-auto px-4">
            <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-12 lg:gap-12">
              <div className="min-w-0 lg:col-span-8">
                <BlogPostRenderer content={page.content} />
              </div>
              <aside className="lg:col-span-4" aria-label="Service enquiry">
                <div className="rounded-2xl border border-border bg-muted/30 p-6 lg:sticky lg:top-28 lg:p-8">
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-secondary">Plan your service</p>
                  <h2 className="mt-3 text-2xl font-bold tracking-tight text-primary">Discuss your operating requirements</h2>
                  <p className="mt-4 leading-relaxed text-muted-foreground">
                    Share the details our team needs to understand your fulfillment workflow.
                  </p>
                  <ul className="mt-6 space-y-4">
                    {["Product and SKU details", "Order volume and sales channels", "Packing and shipping instructions"].map((item) => (
                      <li key={item} className="flex items-start gap-3 text-sm text-foreground">
                        <CheckCircle className="mt-0.5 h-5 w-5 shrink-0 text-secondary" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-6 flex items-start gap-3 border-t border-border pt-6 text-sm text-muted-foreground">
                    <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-secondary" />
                    <span>Los Angeles, CA</span>
                  </div>
                  <Link to="/contact" className="mt-7 block">
                    <Button className="w-full bg-secondary text-secondary-foreground hover:bg-secondary/90">
                      Contact Westfield
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </aside>
            </div>
          </div>
        </section>

        <section className="bg-muted/40 py-16 md:py-20" aria-labelledby="service-faqs">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-3xl">
              <h2 id="service-faqs" className="mb-10 text-center text-3xl font-bold tracking-tight text-primary md:text-4xl">
                FAQs
              </h2>
              <Accordion type="single" collapsible className="space-y-4">
                {page.faqs.map((faq, index) => (
                  <AccordionItem
                    key={faq.question}
                    value={`faq-${index + 1}`}
                    className="rounded-xl border border-border bg-background px-5 data-[state=open]:border-secondary/60 md:px-6"
                  >
                    <AccordionTrigger className="py-5 text-left font-semibold text-primary hover:no-underline">
                      <span className="pr-4">{faq.question}</span>
                    </AccordionTrigger>
                    <AccordionContent className="pb-5">
                      <div className="space-y-4 leading-relaxed text-muted-foreground">
                        {faq.answer.split(/\n\s*\n/).map((paragraph, paragraphIndex) => (
                          <p key={paragraphIndex}>{paragraph}</p>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
              <div className="mt-10 border-t border-border pt-6 text-sm">
                <BlogPostRenderer content={page.photoCredit} />
              </div>
            </div>
          </div>
        </section>

        <section className="bg-primary py-16 md:py-20">
          <div className="container mx-auto px-4 text-center">
            <div className="mx-auto max-w-3xl">
              <h2 className="text-3xl font-bold tracking-tight text-primary-foreground md:text-4xl">Discuss your fulfillment requirements</h2>
              <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-primary-foreground/80">
                Tell Westfield Prep Center about your products, order volume, sales channels, and handling needs.
              </p>
              <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
                <Link to="/contact">
                  <Button size="lg" className="w-full bg-secondary px-8 text-secondary-foreground hover:bg-secondary/90 sm:w-auto">
                    Get a Quote
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link to="/service-breakdown">
                  <Button
                    size="lg"
                    variant="outline"
                    className="w-full border-primary-foreground/30 bg-primary-foreground/10 px-8 text-primary-foreground hover:bg-primary-foreground/20 sm:w-auto"
                  >
                    View Service Breakdown
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
