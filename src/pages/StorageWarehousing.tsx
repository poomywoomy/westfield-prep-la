import { useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Breadcrumbs from "@/components/Breadcrumbs";
import StorageHero from "@/components/storage/StorageHero";
import StorageContent from "@/components/storage/StorageContent";
import StorageCTA from "@/components/storage/StorageCTA";




const StorageWarehousing = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);



  return (
    <>

      <div className="min-h-screen flex flex-col">
        <Header />
        <Breadcrumbs items={[{ label: "Storage & Warehousing", path: "/storage-warehousing" }]} />
        <StorageHero />
        <StorageContent />
        <StorageCTA />
        <Footer />
      </div>
    </>
  );
};

export default StorageWarehousing;
