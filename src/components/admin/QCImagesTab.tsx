import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const QCImagesTab = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>QC Images Management</CardTitle>
        <CardDescription>Upload and manage QC images for clients</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground text-center py-8">
          QC image upload coming soon...
        </p>
      </CardContent>
    </Card>
  );
};

export default QCImagesTab;
