import { SavedDocsTab } from "./SavedDocsTab";
import { CreateMaterialsPricingDialog } from "./CreateMaterialsPricingDialog";

export default function MaterialsPricingTab() {
  return (
    <SavedDocsTab
      quoteType="materials_pricing"
      title="Materials Pricing"
      description="Packaging material price sheets for clients and prospects"
      createLabel="Create Materials Pricing"
      Dialog={CreateMaterialsPricingDialog}
      summary={(d) => `${d.lines?.length || 0} material(s)`}
    />
  );
}
