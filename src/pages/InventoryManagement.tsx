import { useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Breadcrumbs from "@/components/Breadcrumbs";
import { generateMetaTags } from "@/utils/seo";
import InventoryHero from "@/components/inventory/InventoryHero";
import InventoryChallenge from "@/components/inventory/InventoryChallenge";
import InventoryTechnology from "@/components/inventory/InventoryTechnology";
import InventoryFeatures from "@/components/inventory/InventoryFeatures";
import InventorySync from "@/components/inventory/InventorySync";
import InventoryCycleCounts from "@/components/inventory/InventoryCycleCounts";
import InventoryStorage from "@/components/inventory/InventoryStorage";
import InventoryFAQ from "@/components/inventory/InventoryFAQ";
import InventoryCTA from "@/components/inventory/InventoryCTA";




const InventoryManagement = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const meta = generateMetaTags(
    "Inventory Management | Los Angeles 3PL Prep Center Services",
    "Real-time inventory management at our Los Angeles 3PL. Prep center with SKU tracking, low-stock alerts, cycle counts, and multi-channel sync for e-commerce brands.",
    "/inventory-management"
  );



  return (
    <>


      <div className="min-h-screen flex flex-col">
        <Header />
        <Breadcrumbs items={[{ label: "Inventory Management", path: "/inventory-management" }]} />
        
        <InventoryHero />
        <InventoryChallenge />
        <InventoryTechnology />
        <InventoryFeatures />
        <InventorySync />
        <InventoryCycleCounts />
        <InventoryStorage />
        <InventoryFAQ />
        <InventoryCTA />

        <Footer />
      </div>
    </>
  );
};

export default InventoryManagement;
