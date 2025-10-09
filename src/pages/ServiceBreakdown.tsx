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

  const amazonFBAProcess = [
    {
      title: "Receiving & Quality Inspection",
      description: "All inbound shipments are carefully received, counted, and inspected for accuracy and condition."
    },
    {
      title: "Photo Proofs & Quality Control",
      description: "High-resolution photos and detailed QC checks provided for transparency and assurance."
    },
    {
      title: "Secure Storage Until Shipment",
      description: "Units are safely stored in our facility until you're ready to ship to Amazon or another destination."
    },
    {
      title: "Professional Prep Services",
      description: "Comprehensive prep including FNSKU labeling, polybagging, bubble wrapping, and bundling — done to Amazon's exact standards."
    },
    {
      title: "Shipment Planning & Creation",
      description: "We handle Amazon shipment creation, box content uploads, and all required documentation."
    },
    {
      title: "Ship Directly to Amazon FBA",
      description: "We finalize and dispatch shipments directly to Amazon fulfillment centers for fast, seamless delivery."
    }
  ];

  const amazonFBMProcess = [
    {
      title: "Receiving & Quality Inspection",
      description: "Inbound inventory is received, counted, and inspected for quality and accuracy."
    },
    {
      title: "Secure Storage & Inventory Management",
      description: "Products are stored securely with real-time inventory tracking and management."
    },
    {
      title: "Order Receipt & Processing",
      description: "Orders are received from your sales channels and immediately processed for fulfillment."
    },
    {
      title: "Pick, Pack & Quality Check",
      description: "Items are picked, carefully packed with protective materials, and quality checked before shipping."
    },
    {
      title: "Shipping Label Creation",
      description: "Shipping labels are generated with the most cost-effective carrier for your customer's location."
    },
    {
      title: "Ship Direct to Customer",
      description: "Packages are dispatched directly to your customers with tracking information provided."
    }
  ];

  const amazonPrepServices = [
    "FNSKU Labeling",
    "Polybag + Label",
    "Bubble Wrap",
    "Bundling",
    "Box Content Labels",
    "Case Packing",
  ];

  const walmartProcess = [
    {
      title: "Receiving & Quality Inspection",
      description: "All inbound shipments are carefully received, counted, and inspected for accuracy and condition."
    },
    {
      title: "Photo Proofs & Quality Control",
      description: "High-resolution photos and detailed QC checks provided for transparency and assurance."
    },
    {
      title: "Secure Storage Until Shipment",
      description: "Units are safely stored in our facility until you're ready to ship to Walmart or another destination."
    },
    {
      title: "Professional Prep Services",
      description: "Comprehensive prep including Walmart barcode labeling, polybagging, bubble wrapping, and bundling — done to Walmart's exact standards."
    },
    {
      title: "Shipment Planning & Creation",
      description: "We handle Walmart WFS shipment creation, box content uploads, and all required documentation."
    },
    {
      title: "Ship Directly to Walmart WFS",
      description: "We finalize and dispatch shipments directly to Walmart fulfillment centers for fast, seamless delivery."
    }
  ];

  const walmartPrepServices = [
    "Walmart Barcode Application",
    "Polybag + Label",
    "Bubble Wrap",
    "Case Pack Requirements",
    "Box Content Labels",
    "Returns Processing",
  ];

  const shopifyProcess = [
    {
      title: "Receiving & Quality Inspection",
      description: "We receive and verify all incoming inventory with accuracy checks to ensure every SKU and variant arrives in perfect condition."
    },
    {
      title: "Product Photos & Quality Control",
      description: "High-quality product photos and QC verification provided to confirm condition, packaging, and readiness for fulfillment."
    },
    {
      title: "Organized Storage & Inventory Management",
      description: "Your products are stored securely in our warehouse with clear labeling and real-time organization for fast, accurate pick-and-pack fulfillment."
    },
    {
      title: "Order Fulfillment & Packaging",
      description: "We handle all order prep — picking, packing, custom packaging, inserts, or marketing materials — for a seamless customer unboxing experience."
    },
    {
      title: "Shopify Integration & Shipment Creation",
      description: "Your Shopify store integrates directly with our system for automated order syncing, real-time tracking, and shipment creation."
    },
    {
      title: "Direct-to-Customer Shipping",
      description: "We ship directly to your customers using your preferred carriers, ensuring fast delivery and an exceptional post-purchase experience."
    }
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
    {
      title: "Receiving & Quality Check",
      description: "We receive, verify, and inspect all incoming TikTok inventory to ensure each SKU is ready for fast, high-volume fulfillment."
    },
    {
      title: "Product Photos & Content-Ready QC",
      description: "Detailed photo proofs and quality checks provided for transparency — perfect for content creators, live sellers, and brand partners."
    },
    {
      title: "Organized Storage for Fast Turnaround",
      description: "Products are stored safely and efficiently for quick pick-and-pack, supporting daily order spikes and influencer campaigns."
    },
    {
      title: "Kitting & Custom Packaging",
      description: "We assemble kits, apply branding materials, and handle promotional inserts or influencer packaging exactly as you specify."
    },
    {
      title: "Order Syncing & Fulfillment",
      description: "We process orders through TikTok Shop, handling packing, labeling, and shipment creation directly within the platform."
    },
    {
      title: "Direct Shipping to Customers or Creators",
      description: "We ship orders directly to customers or influencers with fast turnaround — maintaining the unboxing experience your brand promises."
    }
  ];

  const tiktokPrepServices = [
    "Custom Branding & Packaging",
    "Influencer Kit Assembly",
    "Fast-Track Processing",
    "Polybag + Label",
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
                  <CardTitle className="text-2xl">Amazon FBA & FBM Services</CardTitle>
                  <CardDescription>
                    Complete prep and fulfillment for Amazon sellers
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-8 mb-8">
                    {/* FBA Process */}
                    <div>
                      <h3 className="text-lg font-semibold text-primary mb-4">Order of Operations for FBA Shipment</h3>
                      <div className="space-y-4">
                        {amazonFBAProcess.map((step, index) => (
                          <div key={index} className="flex gap-3">
                            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold text-sm">
                              {index + 1}
                            </div>
                            <div>
                              <p className="font-semibold text-foreground">{step.title}</p>
                              <p className="text-sm text-muted-foreground mt-1">{step.description}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* FBM Process */}
                    <div>
                      <h3 className="text-lg font-semibold text-primary mb-4">Order of Operations for FBM Shipments</h3>
                      <div className="space-y-4">
                        {amazonFBMProcess.map((step, index) => (
                          <div key={index} className="flex gap-3">
                            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold text-sm">
                              {index + 1}
                            </div>
                            <div>
                              <p className="font-semibold text-foreground">{step.title}</p>
                              <p className="text-sm text-muted-foreground mt-1">{step.description}</p>
                            </div>
                          </div>
                        ))}
                      </div>
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
                    <h3 className="text-lg font-semibold text-primary mb-4">Order of Operations for WFS Integrated</h3>
                    <div className="space-y-4">
                      {walmartProcess.map((step, index) => (
                        <div key={index} className="flex gap-3">
                          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold text-sm">
                            {index + 1}
                          </div>
                          <div>
                            <p className="font-semibold text-foreground">{step.title}</p>
                            <p className="text-sm text-muted-foreground mt-1">{step.description}</p>
                          </div>
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
                    <div className="space-y-4">
                      {shopifyProcess.map((step, index) => (
                        <div key={index} className="flex gap-3">
                          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold text-sm">
                            {index + 1}
                          </div>
                          <div>
                            <p className="font-semibold text-foreground">{step.title}</p>
                            <p className="text-sm text-muted-foreground mt-1">{step.description}</p>
                          </div>
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
                    <div className="space-y-4">
                      {tiktokProcess.map((step, index) => (
                        <div key={index} className="flex gap-3">
                          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold text-sm">
                            {index + 1}
                          </div>
                          <div>
                            <p className="font-semibold text-foreground">{step.title}</p>
                            <p className="text-sm text-muted-foreground mt-1">{step.description}</p>
                          </div>
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
