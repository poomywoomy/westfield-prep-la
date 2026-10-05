import { useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Breadcrumbs from "@/components/Breadcrumbs";
import { generateMetaTags } from "@/utils/seo";
import ReturnsHero from "@/components/returns/ReturnsHero";
import ReturnsWorkflow from "@/components/returns/ReturnsWorkflow";
import ReturnsPathways from "@/components/returns/ReturnsPathways";
import ReturnsMetrics from "@/components/returns/ReturnsMetrics";
import ReturnsIntegrations from "@/components/returns/ReturnsIntegrations";
import ReturnsFAQ from "@/components/returns/ReturnsFAQ";
import ReturnsCTA from "@/components/returns/ReturnsCTA";




const ReturnsProcessing = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const meta = generateMetaTags(
    "Returns Processing | Los Angeles 3PL & Prep Center Services",
    "Fast returns processing at our LA prep center. 5-hour inspection, restocking, and value recovery. Expert 3PL reverse logistics for Amazon FBA and e-commerce returns.",
    "/returns-processing"
  );



  return (
    <>


      <div className="min-h-screen flex flex-col">
        <Header />
        <Breadcrumbs items={[{ label: "Returns Processing", path: "/returns-processing" }]} />
        <ReturnsHero />
        <ReturnsWorkflow />
        <ReturnsPathways />
        <ReturnsMetrics />
        <ReturnsIntegrations />
        <ReturnsFAQ />
        <ReturnsCTA />
        <Footer />
      </div>
    </>
  );
};

export default ReturnsProcessing;
