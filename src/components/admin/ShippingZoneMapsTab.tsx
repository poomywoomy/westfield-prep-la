import { SavedDocsTab } from "./SavedDocsTab";
import { CreateShippingZoneMapDialog } from "./CreateShippingZoneMapDialog";

export default function ShippingZoneMapsTab() {
  return (
    <SavedDocsTab
      quoteType="shipping_zone_map"
      title="Shipping Zone Maps"
      description="USPS zone 1 to 8 rate sheets from Los Angeles, CA 91010"
      createLabel="Create Shipping Zone Map"
      Dialog={CreateShippingZoneMapDialog}
      summary={(d) => `${d.packages?.length || 0} package size(s) · ${d.carrier || "USPS"}`}
    />
  );
}
