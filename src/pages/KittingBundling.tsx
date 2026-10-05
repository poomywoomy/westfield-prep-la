import { useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Breadcrumbs from "@/components/Breadcrumbs";
import KittingHero from "@/components/kitting/KittingHero";
import KittingContent from "@/components/kitting/KittingContent";
import KittingCTA from "@/components/kitting/KittingCTA";




const KittingBundling = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);



  return (
    <>

      <div className="min-h-screen flex flex-col">
        <Header />
        <Breadcrumbs items={[{ label: "Kitting & Bundling", path: "/kitting-bundling" }]} />
        <KittingHero />
        <KittingContent />
        <KittingCTA />
        <Footer />
      </div>
    </>
  );
};

export default KittingBundling;
