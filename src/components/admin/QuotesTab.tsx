import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const QuotesTab = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Quotes Management</CardTitle>
        <CardDescription>Create and manage client quotes</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground text-center py-8">
          Quote management coming soon...
        </p>
      </CardContent>
    </Card>
  );
};

export default QuotesTab;
