import { useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Breadcrumbs from "@/components/Breadcrumbs";
import { generateMetaTags } from "@/utils/seo";
import ReceivingHero from "@/components/receiving/ReceivingHero";
import ReceivingPainPoints from "@/components/receiving/ReceivingPainPoints";
import ReceivingTimeline from "@/components/receiving/ReceivingTimeline";
import ReceivingPhotoGallery from "@/components/receiving/ReceivingPhotoGallery";
import ReceivingFAQ from "@/components/receiving/ReceivingFAQ";
import ReceivingCTA from "@/components/receiving/ReceivingCTA";




const ReceivingInspection = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const meta = generateMetaTags(
    "Receiving & QC Inspection | Los Angeles 3PL Prep Center",
    "Professional receiving and inspection at our LA prep center. 3PL services with photo documentation, damage detection, and same-day inventory updates.",
    "/receiving-inspection"
  );



  return (
    <>


      <div className="min-h-screen flex flex-col">
        <Header />
        <Breadcrumbs items={[{ label: "Receiving & Inspection", path: "/receiving-inspection" }]} />
        <ReceivingHero />
        <ReceivingPainPoints />
        <ReceivingTimeline />
        <ReceivingPhotoGallery />
        <ReceivingFAQ />
        <ReceivingCTA />
        <Footer />
      </div>
    </>
  );
};

export default ReceivingInspection;
