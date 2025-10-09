import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const ClientQCImagesTab = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>QC Images</CardTitle>
        <CardDescription>View quality control images for your products</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground text-center py-8">
          No images available yet. Images auto-delete after 30 days.
        </p>
      </CardContent>
    </Card>
  );
};

export default ClientQCImagesTab;
