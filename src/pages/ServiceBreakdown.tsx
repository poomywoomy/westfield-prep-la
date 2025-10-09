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

  const amazonServices = [
    "FBA Prep & Labeling",
    "FNSKU Label Application",
    "Polybag & Bubble Wrap",
    "Case Pack & Bundling",
    "Box Content Labels",
    "Shipment Creation & Forwarding",
    "Inventory Storage",
    "Amazon Compliance & Inspection",
  ];

  const walmartServices = [
    "WFS Prep & Labeling",
    "Walmart Barcode Application",
    "Polybag & Protective Packaging",
    "Case Pack Requirements",
    "Shipment Creation & Routing",
    "Quality Control & Inspection",
    "Returns Processing",
    "Inventory Management",
  ];

  const shopifyServices = [
    "Direct-to-Consumer Fulfillment",
    "Pick, Pack & Ship",
    "Custom Packaging Solutions",
    "Branded Inserts & Materials",
    "Order Management Integration",
    "Real-Time Inventory Sync",
    "Returns & Exchanges",
    "Multi-Channel Integration",
  ];

  const tiktokServices = [
    "TikTok Shop Fulfillment",
    "Fast Processing for Viral Products",
    "Custom Branding & Packaging",
    "Influencer Collaboration Support",
    "Same-Day & Next-Day Shipping",
    "Order Tracking Integration",
    "Returns Management",
    "Seasonal Campaign Support",
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
                  <div className="grid md:grid-cols-2 gap-4">
                    {amazonServices.map((service, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                        <span className="text-foreground">{service}</span>
                      </div>
                    ))}
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
                  <div className="grid md:grid-cols-2 gap-4">
                    {walmartServices.map((service, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                        <span className="text-foreground">{service}</span>
                      </div>
                    ))}
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
                  <div className="grid md:grid-cols-2 gap-4">
                    {shopifyServices.map((service, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                        <span className="text-foreground">{service}</span>
                      </div>
                    ))}
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
                  <div className="grid md:grid-cols-2 gap-4">
                    {tiktokServices.map((service, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                        <span className="text-foreground">{service}</span>
                      </div>
                    ))}
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
