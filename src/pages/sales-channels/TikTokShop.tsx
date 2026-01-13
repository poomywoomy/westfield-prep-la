import { useEffect } from "react";
import { Helmet } from "react-helmet";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Breadcrumbs from "@/components/Breadcrumbs";
import StructuredData from "@/components/StructuredData";
import TrustStrip from "@/components/sales-channels/TrustStrip";
import StickyCTA from "@/components/sales-channels/StickyCTA";
import TikTokChannelHero from "@/components/tiktok/TikTokChannelHero";
import TikTokChannelValueGrid from "@/components/tiktok/TikTokChannelValueGrid";
import TikTokChannelServices from "@/components/tiktok/TikTokChannelServices";
import TikTokChannelMetrics from "@/components/tiktok/TikTokChannelMetrics";
import TikTokChannelIntegration from "@/components/tiktok/TikTokChannelIntegration";
import TikTokChannelCaseStudy from "@/components/tiktok/TikTokChannelCaseStudy";
import TikTokChannelFAQ from "@/components/tiktok/TikTokChannelFAQ";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Heart, Gift, Video } from "lucide-react";
import { TranslatedText } from "@/components/TranslatedText";

const faqs = [
  {
    question: "How do you connect to TikTok Shop?",
    answer: "We integrate via established middleware platforms and APIs. Setup takes 24-48 hours.",
  },
  {
    question: "Can you handle viral order spikes?",
    answer: "Absolutely. We maintain surge capacity specifically for TikTok sellers with 10x scaling ability.",
  },
  {
    question: "What's your average processing time?",
    answer: "Our average is 6 hours from order receipt to shipment. Same-day shipping is typical.",
  },
];

const TikTokShop = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <Helmet>
        <title>TikTok Shop Fulfillment Los Angeles | 3PL for Viral Brands</title>
        <meta
          name="description"
          content="TikTok Shop fulfillment built for viral demand. 6-hour processing, surge capacity, branded packaging, and real-time order sync from Los Angeles. Get started today."
        />
        <link rel="canonical" href="https://westfieldprepcenter.com/sales-channels/tiktok-shop" />
        <meta property="og:title" content="TikTok Shop Fulfillment Los Angeles | Westfield 3PL" />
        <meta property="og:description" content="Fulfill viral TikTok Shop orders with 6hr processing, surge capacity, and branded packaging." />
        <meta property="og:url" content="https://westfieldprepcenter.com/sales-channels/tiktok-shop" />
        <meta property="og:type" content="website" />
      </Helmet>

      <StructuredData
        type="service"
        data={{
          name: "TikTok Shop Fulfillment",
          description: "Professional TikTok Shop fulfillment services with real-time order sync, surge capacity, and rapid pick/pack for viral demand in Los Angeles.",
        }}
      />
      <StructuredData type="faq" data={{ faqs }} />
      <StructuredData type="software" />

      <div className="min-h-screen flex flex-col">
        <Header />
        <Breadcrumbs
          items={[
            { label: "Sales Channels", path: "/sales-channels" },
            { label: "TikTok Shop", path: "/sales-channels/tiktok-shop" },
          ]}
        />

        <main className="flex-1">
          {/* Premium Hero Section */}
          <TikTokChannelHero />

          {/* Trust Strip */}
          <TrustStrip />

          {/* The Power of TikTok Shopping */}
          <section className="py-20 bg-background">
            <div className="container mx-auto px-4">
              <div className="max-w-4xl mx-auto">
                <h2 className="text-3xl md:text-4xl font-bold mb-6 text-center">
                  <TranslatedText>The Power of</TranslatedText>{" "}
                  <span className="bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">
                    <TranslatedText>TikTok Shopping</TranslatedText>
                  </span>
                </h2>
                <p className="text-lg text-muted-foreground mb-8 text-center max-w-3xl mx-auto">
                  <TranslatedText>
                    TikTok Shop has flipped the ecommerce funnel. Unlike traditional platforms where 
                    customers search for products, TikTok's algorithm delivers products to customers 
                    through engaging content. This creates a unique dynamic where demand can explode 
                    overnight with zero warning.
                  </TranslatedText>
                </p>
                <div className="grid md:grid-cols-3 gap-6 mb-8">
                  {[
                    { icon: Video, text: "Viral content generates instant demand" },
                    { icon: Heart, text: "Live selling drives impulse purchases" },
                    { icon: Gift, text: "Limited drops sell out in minutes" },
                  ].map((item, idx) => (
                    <div key={idx} className="p-6 bg-gradient-to-br from-pink-500/10 to-purple-500/10 rounded-xl text-center border border-pink-500/20 hover:border-pink-500/40 transition-colors">
                      <item.icon className="w-8 h-8 text-pink-500 mx-auto mb-3" />
                      <span className="font-medium"><TranslatedText>{item.text}</TranslatedText></span>
                    </div>
                  ))}
                </div>
                <p className="text-muted-foreground text-center">
                  <TranslatedText>
                    But that explosive demand requires fulfillment workflows that won't break when 
                    traffic spikes. Your viral moment should be celebrated, not stressed over.
                  </TranslatedText>
                </p>
              </div>
            </div>
          </section>

          {/* Why TikTok Shop Needs a 3PL Partner */}
          <section className="py-20 bg-gradient-to-b from-pink-50/50 to-background">
            <div className="container mx-auto px-4">
              <div className="max-w-4xl mx-auto">
                <div className="flex items-center justify-center mb-6">
                  <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-pink-100 to-purple-100 flex items-center justify-center">
                    <AlertTriangle className="h-8 w-8 text-pink-600" />
                  </div>
                </div>
                <h2 className="text-3xl md:text-4xl font-bold mb-6 text-center">
                  <TranslatedText>Why TikTok Shop Needs a</TranslatedText>{" "}
                  <span className="bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">
                    <TranslatedText>3PL Partner</TranslatedText>
                  </span>
                </h2>
                <p className="text-lg text-muted-foreground mb-8 text-center">
                  <TranslatedText>
                    One viral video can lead to thousands of orders in hours. Without scalable 
                    fulfillment infrastructure, your brand risks serious consequences that can 
                    damage your reputation and TikTok Shop seller metrics.
                  </TranslatedText>
                </p>
                <div className="grid md:grid-cols-3 gap-6 mb-8">
                  {[
                    "Fulfillment delays and backlogs",
                    "Missing delivery expectations",
                    "Higher support costs and refunds",
                  ].map((item, idx) => (
                    <div key={idx} className="p-5 bg-pink-50 border border-pink-200 rounded-lg text-center">
                      <span className="font-medium text-pink-700"><TranslatedText>{item}</TranslatedText></span>
                    </div>
                  ))}
                </div>
                <p className="text-muted-foreground text-center">
                  <TranslatedText>
                    A 3PL with experience in rapid surges gives you the operational backbone to 
                    support peak moments. We've handled drops going from 100 to 10,000+ orders 
                    overnight without missing SLAs. Learn more about our
                  </TranslatedText>{" "}
                  <Link to="/order-fulfillment" className="text-pink-600 hover:underline font-medium">
                    <TranslatedText>order fulfillment capabilities</TranslatedText>
                  </Link>.
                </p>
              </div>
            </div>
          </section>

          {/* Value Grid */}
          <TikTokChannelValueGrid />

          {/* Integration Section */}
          <TikTokChannelIntegration />

          {/* Services/Capabilities */}
          <TikTokChannelServices />

          {/* Metrics Section (Dark) */}
          <TikTokChannelMetrics />

          {/* Creator-Friendly Fulfillment */}
          <section className="py-20 bg-background">
            <div className="container mx-auto px-4">
              <div className="max-w-4xl mx-auto">
                <div className="flex items-center justify-center mb-6">
                  <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-pink-100 to-purple-100 flex items-center justify-center">
                    <Heart className="h-8 w-8 text-pink-600" />
                  </div>
                </div>
                <h2 className="text-3xl md:text-4xl font-bold mb-6 text-center">
                  <TranslatedText>Creator-Friendly</TranslatedText>{" "}
                  <span className="bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">
                    <TranslatedText>Fulfillment</TranslatedText>
                  </span>
                </h2>
                <p className="text-lg text-muted-foreground mb-8 text-center">
                  <TranslatedText>
                    Unboxing content is huge on TikTok. When customers share their experience, 
                    it creates organic marketing that money can't buy. That's why we offer custom 
                    branded packaging options including branded boxes, tissue paper, thank-you cards, 
                    stickers, and promotional inserts.
                  </TranslatedText>
                </p>
                <p className="text-center text-muted-foreground mb-8">
                  <TranslatedText>
                    Many of our TikTok sellers see their customers post unboxing videos, creating 
                    a virtuous cycle of content and sales. We work with you to design a packaging 
                    experience worth sharing. Explore our
                  </TranslatedText>{" "}
                  <Link to="/kitting-bundling" className="text-pink-600 hover:underline font-medium">
                    <TranslatedText>kitting and bundling services</TranslatedText>
                  </Link>{" "}
                  <TranslatedText>for more options.</TranslatedText>
                </p>
                <div className="flex justify-center">
                  <Button
                    asChild
                    className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600"
                  >
                    <Link to="/contact"><TranslatedText>Discuss Custom Packaging</TranslatedText></Link>
                  </Button>
                </div>
              </div>
            </div>
          </section>

          {/* Surge Handling */}
          <section className="py-20 bg-gradient-to-b from-pink-50/50 to-background">
            <div className="container mx-auto px-4">
              <div className="max-w-4xl mx-auto text-center">
                <h2 className="text-3xl md:text-4xl font-bold mb-6">
                  <TranslatedText>Built for</TranslatedText>{" "}
                  <span className="bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">
                    <TranslatedText>Surge Handling</TranslatedText>
                  </span>
                </h2>
                <p className="text-lg text-muted-foreground mb-8">
                  <TranslatedText>
                    We maintain buffer inventory, flexible staffing, and prioritized pick queues 
                    specifically for TikTok sellers. When your video hits the For You page and 
                    orders explode, we activate surge protocols immediately. Extra staff are 
                    brought in, and your orders move to the front of the queue.
                  </TranslatedText>
                </p>
                <div className="grid sm:grid-cols-2 gap-4 max-w-2xl mx-auto mb-8">
                  {[
                    "10x surge capacity on demand",
                    "Flexible staffing for peak events",
                    "Priority pick queue activation",
                    "Real-time communication throughout",
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-center gap-3 p-4 bg-card rounded-lg border border-border">
                      <div className="w-2 h-2 rounded-full bg-pink-500 flex-shrink-0" />
                      <span className="text-sm font-medium text-left"><TranslatedText>{item}</TranslatedText></span>
                    </div>
                  ))}
                </div>
                <p className="text-muted-foreground">
                  <TranslatedText>
                    Don't let your viral moment become a logistics nightmare. We're your partner 
                    in turning TikTok fame into sustainable business growth.
                  </TranslatedText>
                </p>
              </div>
            </div>
          </section>

          {/* Case Study */}
          <TikTokChannelCaseStudy />

          {/* FAQ */}
          <TikTokChannelFAQ />

          {/* Final CTA */}
          <section className="py-24 bg-gradient-to-br from-pink-500 via-purple-500 to-fuchsia-600 text-white">
            <div className="container mx-auto px-4 text-center">
              <h2 className="text-3xl md:text-5xl font-bold mb-6">
                <TranslatedText>Ready for Your Viral Moment?</TranslatedText>
              </h2>
              <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
                <TranslatedText>
                  Partner with a 3PL that's built for TikTok's unpredictable, explosive demand. 
                  We'll handle the logistics so you can focus on creating content.
                </TranslatedText>
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  asChild
                  size="lg"
                  className="px-10 py-7 text-lg font-bold bg-white text-pink-600 hover:bg-white/90 shadow-lg"
                >
                  <Link to="/contact"><TranslatedText>Get Started Today</TranslatedText></Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="px-10 py-7 text-lg font-bold border-2 border-white text-white bg-transparent hover:bg-white/10"
                >
                  <Link to="/pricing"><TranslatedText>View Pricing</TranslatedText></Link>
                </Button>
              </div>
            </div>
          </section>
        </main>

        <Footer />
        <StickyCTA />
      </div>
    </>
  );
};

export default TikTokShop;