import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2 } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import logo from "@/assets/westfield-logo.png";

const ServiceBreakdown = () => {
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleLogoClick = () => {
    navigate("/");
    setTimeout(() => window.scrollTo(0, 0), 100);
  };

  const amazonProcess = [
    "Receiving & Inspection",
    "Quality Control Check",
    "FNSKU Label Application",
    "Prep Services (Polybag, Bubble Wrap, Bundling)",
    "Shipment Creation & Forwarding to Amazon FBA",
  ];

  const amazonPrepServices = [
    "FNSKU Labeling - $0.70/unit",
    "Polybag + Label - $1.40/unit",
    "Bubble Wrap - +$0.50/unit",
    "Bundling - +$0.50/unit",
    "Box Content Labels",
    "Case Packing",
  ];

  const walmartProcess = [
    "Receiving & Inspection",
    "Quality Control Check",
    "Walmart Barcode Application",
    "Prep Services (Polybag, Protective Packaging)",
    "Shipment Creation & Routing to WFS",
  ];

  const walmartPrepServices = [
    "Walmart Barcode Application",
    "Polybag + Label - $1.40/unit",
    "Bubble Wrap - +$0.50/unit",
    "Case Pack Requirements",
    "Box Content Labels",
    "Returns Processing",
  ];

  const shopifyProcess = [
    "Receiving & Inventory Sync",
    "Storage & Organization",
    "Order Receipt from Shopify Store",
    "Pick, Pack & Custom Packaging",
    "Ship Direct to Customer",
  ];

  const shopifyPrepServices = [
    "Custom Packaging Solutions",
    "Branded Inserts & Materials",
    "Gift Wrapping",
    "Kitting & Assembly",
    "Returns & Exchanges Processing",
    "Multi-Channel Integration",
  ];

  const tiktokProcess = [
    "Receiving & Fast Processing",
    "Quality Check",
    "Custom Branding & Packaging",
    "Same-Day/Next-Day Prep",
    "Ship to Customer or TikTok Warehouse",
  ];

  const tiktokPrepServices = [
    "Custom Branding & Packaging",
    "Influencer Kit Assembly",
    "Fast-Track Processing",
    "Polybag + Label - $1.40/unit",
    "Seasonal Campaign Prep",
    "Order Tracking Integration",
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 pt-20">
        <div className="container mx-auto px-4 py-12">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-primary mb-4">
              Service Breakdown by Platform
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Comprehensive fulfillment solutions tailored for each marketplace
            </p>
          </div>

          <Tabs defaultValue="amazon" className="max-w-5xl mx-auto">
            <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 mb-8">
              <TabsTrigger value="amazon">Amazon</TabsTrigger>
              <TabsTrigger value="walmart">Walmart</TabsTrigger>
              <TabsTrigger value="shopify">Shopify</TabsTrigger>
              <TabsTrigger value="tiktok">TikTok Shop</TabsTrigger>
            </TabsList>

            <TabsContent value="amazon">
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl">Amazon FBA Services</CardTitle>
                  <CardDescription>
                    Complete prep and fulfillment for Amazon sellers
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="mb-8">
                    <h3 className="text-lg font-semibold text-primary mb-4">Order of Operations</h3>
                    <div className="space-y-3">
                      {amazonProcess.map((step, index) => (
                        <div key={index} className="flex items-start gap-3">
                          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold">
                            {index + 1}
                          </div>
                          <span className="text-foreground pt-1">{step}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mb-8">
                    <h3 className="text-lg font-semibold text-primary mb-4">Prep Services Available</h3>
                    <div className="grid md:grid-cols-2 gap-3">
                      {amazonPrepServices.map((service, index) => (
                        <div key={index} className="flex items-start gap-2">
                          <CheckCircle2 className="h-5 w-5 text-secondary mt-0.5 flex-shrink-0" />
                          <span className="text-foreground text-sm">{service}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-8">
                    <Button onClick={() => navigate("/contact")} size="lg">
                      Get Started with Amazon FBA
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="walmart">
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl">Walmart WFS Services</CardTitle>
                  <CardDescription>
                    Specialized fulfillment for Walmart sellers
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="mb-8">
                    <h3 className="text-lg font-semibold text-primary mb-4">Order of Operations</h3>
                    <div className="space-y-3">
                      {walmartProcess.map((step, index) => (
                        <div key={index} className="flex items-start gap-3">
                          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold">
                            {index + 1}
                          </div>
                          <span className="text-foreground pt-1">{step}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mb-8">
                    <h3 className="text-lg font-semibold text-primary mb-4">Prep Services Available</h3>
                    <div className="grid md:grid-cols-2 gap-3">
                      {walmartPrepServices.map((service, index) => (
                        <div key={index} className="flex items-start gap-2">
                          <CheckCircle2 className="h-5 w-5 text-secondary mt-0.5 flex-shrink-0" />
                          <span className="text-foreground text-sm">{service}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-8">
                    <Button onClick={() => navigate("/contact")} size="lg">
                      Get Started with Walmart WFS
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="shopify">
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl">Shopify Fulfillment Services</CardTitle>
                  <CardDescription>
                    Direct-to-consumer fulfillment for your Shopify store
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="mb-8">
                    <h3 className="text-lg font-semibold text-primary mb-4">Order of Operations</h3>
                    <div className="space-y-3">
                      {shopifyProcess.map((step, index) => (
                        <div key={index} className="flex items-start gap-3">
                          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold">
                            {index + 1}
                          </div>
                          <span className="text-foreground pt-1">{step}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mb-8">
                    <h3 className="text-lg font-semibold text-primary mb-4">Prep Services Available</h3>
                    <div className="grid md:grid-cols-2 gap-3">
                      {shopifyPrepServices.map((service, index) => (
                        <div key={index} className="flex items-start gap-2">
                          <CheckCircle2 className="h-5 w-5 text-secondary mt-0.5 flex-shrink-0" />
                          <span className="text-foreground text-sm">{service}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-8">
                    <Button onClick={() => navigate("/contact")} size="lg">
                      Get Started with Shopify
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="tiktok">
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl">TikTok Shop Services</CardTitle>
                  <CardDescription>
                    Fast fulfillment for trending TikTok Shop products
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="mb-8">
                    <h3 className="text-lg font-semibold text-primary mb-4">Order of Operations</h3>
                    <div className="space-y-3">
                      {tiktokProcess.map((step, index) => (
                        <div key={index} className="flex items-start gap-3">
                          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold">
                            {index + 1}
                          </div>
                          <span className="text-foreground pt-1">{step}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mb-8">
                    <h3 className="text-lg font-semibold text-primary mb-4">Prep Services Available</h3>
                    <div className="grid md:grid-cols-2 gap-3">
                      {tiktokPrepServices.map((service, index) => (
                        <div key={index} className="flex items-start gap-2">
                          <CheckCircle2 className="h-5 w-5 text-secondary mt-0.5 flex-shrink-0" />
                          <span className="text-foreground text-sm">{service}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-8">
                    <Button onClick={() => navigate("/contact")} size="lg">
                      Get Started with TikTok Shop
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ServiceBreakdown;
