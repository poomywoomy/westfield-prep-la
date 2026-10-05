import { useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Breadcrumbs from "@/components/Breadcrumbs";
import { generateMetaTags } from "@/utils/seo";
import FulfillmentHero from "@/components/fulfillment/FulfillmentHero";
import FulfillmentWhyOutsource from "@/components/fulfillment/FulfillmentWhyOutsource";
import FulfillmentProcess from "@/components/fulfillment/FulfillmentProcess";
import FulfillmentChannels from "@/components/fulfillment/FulfillmentChannels";
import FulfillmentMetrics from "@/components/fulfillment/FulfillmentMetrics";
import FulfillmentCarriers from "@/components/fulfillment/FulfillmentCarriers";
import FulfillmentReturns from "@/components/fulfillment/FulfillmentReturns";
import FulfillmentFAQ from "@/components/fulfillment/FulfillmentFAQ";
import FulfillmentCTA from "@/components/fulfillment/FulfillmentCTA";




const OrderFulfillment = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const meta = generateMetaTags(
    "Order Fulfillment Services for Businesses with a Custom",
    "Westfield Prep Center provides reliable order fulfillment services for businesses of all sizes. From storage to packing & shipping, we handle orders with care.",
    "/order-fulfillment"
  );



  return (
    <>


      <div className="min-h-screen flex flex-col">
        <Header />
        <Breadcrumbs items={[{ label: "Order Fulfillment", path: "/order-fulfillment" }]} />
        
        <FulfillmentHero />
        <FulfillmentWhyOutsource />
        <FulfillmentProcess />
        <FulfillmentChannels />
        <FulfillmentMetrics />
        <FulfillmentCarriers />
        <FulfillmentReturns />
        <FulfillmentFAQ />
        <FulfillmentCTA />

        <Footer />
      </div>
    </>
  );
};

export default OrderFulfillment;
