import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Package, Clock, AlertCircle } from "lucide-react";
import { BarcodeScanner } from "@/components/BarcodeScanner";
import { ASNFormDialog } from "./ASNFormDialog";
import { SKUFormDialog } from "./SKUFormDialog";
import type { Database } from "@/integrations/supabase/types";

type Client = Database["public"]["Tables"]["clients"]["Row"];

interface QuickScanModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface ScanHistoryItem {
  barcode: string;
  type: string;
  timestamp: Date;
  result: 'found' | 'not_found' | 'created';
  details?: string;
}

export const QuickScanModal = ({ open, onOpenChange }: QuickScanModalProps) => {
  const [selectedClient, setSelectedClient] = useState<string>("");
  const [clients, setClients] = useState<Client[]>([]);
  const [scanning, setScanning] = useState(false);
  const [scanHistory, setScanHistory] = useState<ScanHistoryItem[]>([]);
  const [showASNForm, setShowASNForm] = useState(false);
  const [asnPrefillData, setASNPrefillData] = useState<any>(null);
  const [showSKUEdit, setShowSKUEdit] = useState(false);
  const [selectedSKU, setSelectedSKU] = useState<any>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (open) {
      fetchClients();
    }
  }, [open]);

  const fetchClients = async () => {
    const { data } = await supabase
      .from("clients")
      .select("*")
      .eq("status", "active")
      .order("company_name");
    if (data) setClients(data);
  };

  const handleScan = async (barcode: string, format: string) => {
    if (!selectedClient) {
      toast({ 
        title: "Please select a client first", 
        variant: "destructive" 
      });
      return;
    }

    setScanning(true);

    try {
      // Call barcode-lookup edge function
      const { data, error } = await supabase.functions.invoke('barcode-lookup', {
        body: { 
          barcode, 
          client_id: selectedClient,
          context: 'quick_scan'
        }
      });

      if (error) throw error;

      if (data?.found) {
        if (data.matched_table === 'asn_headers') {
          // Found existing ASN - Auto-open it
          const asnData = data.data;
          
          toast({ 
            title: "ASN Found",
            description: `#${asnData.asn_number}`,
          });
          
          // Auto-open ASN form in view/edit mode
          setASNPrefillData({
            client_id: asnData.client_id,
            asn_number: asnData.asn_number,
            tracking_number: asnData.tracking_number,
            carrier: asnData.carrier,
            eta: asnData.eta,
            ship_from: asnData.ship_from,
            notes: asnData.notes,
            lines: asnData.asn_lines?.map((line: any) => ({
              sku_id: line.sku_id,
              expected_units: line.expected_units
            })) || []
          });
          setShowASNForm(true);
          onOpenChange(false);
          
          setScanHistory([{
            barcode,
            type: format,
            timestamp: new Date(),
            result: 'found',
            details: `ASN: ${asnData.asn_number} (Opened)`
          }, ...scanHistory.slice(0, 9)]);
        } else if (data.matched_table === 'skus') {
          // Found SKU - Auto-open edit dialog
          toast({ 
            title: "SKU Found",
            description: data.data.client_sku,
          });
          
          setSelectedSKU(data.data);
          setShowSKUEdit(true);
          onOpenChange(false);
          
          setScanHistory([{
            barcode,
            type: format,
            timestamp: new Date(),
            result: 'found',
            details: `SKU: ${data.data.client_sku} (Opened)`
          }, ...scanHistory.slice(0, 9)]);
        }
      } else {
        // Not found - check if tracking number
        if (data?.type === 'tracking') {
          // Auto-create new ASN with detected tracking
          const detectedCarrier = data.carrier || 'Unknown';
          
          toast({ 
            title: "New Tracking",
            description: `${detectedCarrier}`,
          });
          
          // Auto-open ASN creation form with tracking pre-filled
          setASNPrefillData({
            client_id: selectedClient,
            tracking_number: barcode,
            carrier: detectedCarrier,
            asn_number: `ASN-${Date.now()}` // Temporary, will be generated on save
          });
          setShowASNForm(true);
          onOpenChange(false);
          
          setScanHistory([{
            barcode,
            type: format,
            timestamp: new Date(),
            result: 'created',
            details: `New ASN (${detectedCarrier})`
          }, ...scanHistory.slice(0, 9)]);
        } else {
          toast({ 
            title: "Not Found", 
            description: "No matching ASN or SKU",
            variant: "destructive" 
          });
          
          setScanHistory([{
            barcode,
            type: format,
            timestamp: new Date(),
            result: 'not_found'
          }, ...scanHistory.slice(0, 9)]);
        }
      }
    } catch (error: any) {
      toast({
        title: "Scan Error",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setScanning(false);
    }
  };


  const getResultIcon = (result: string) => {
    switch (result) {
      case 'found':
        return <Package className="h-4 w-4 text-green-500" />;
      case 'created':
        return <Clock className="h-4 w-4 text-blue-500" />;
      default:
        return <AlertCircle className="h-4 w-4 text-destructive" />;
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Quick Scan</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Select Client *</label>
              <Select 
                value={selectedClient} 
                onValueChange={setSelectedClient}
                disabled={scanning}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Choose a client to start scanning" />
                </SelectTrigger>
                <SelectContent>
                  {clients.map(client => (
                    <SelectItem key={client.id} value={client.id}>
                      {client.company_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {selectedClient && (
              <div className="border-2 border-dashed rounded-lg p-6">
                <BarcodeScanner
                  mode="keyboard"
                  onScan={handleScan}
                  onError={(error) => {
                    toast({ 
                      title: "Scan error", 
                      description: error, 
                      variant: "destructive" 
                    });
                  }}
                  placeholder="Ready to scan..."
                  continuous={true}
                  disabled={scanning}
                />
              </div>
            )}

            {!selectedClient && (
              <div className="border-2 border-dashed rounded-lg p-12 text-center">
                <Package className="mx-auto h-12 w-12 text-muted-foreground mb-3" />
                <p className="text-sm text-muted-foreground">
                  Select a client above to begin scanning
                </p>
              </div>
            )}

            {scanHistory.length > 0 && (
              <div className="space-y-2">
                <h3 className="text-sm font-medium">Recent Scans</h3>
                <div className="space-y-1 max-h-48 overflow-y-auto">
                  {scanHistory.map((item, index) => (
                    <div 
                      key={index} 
                      className="flex items-center gap-3 p-2 rounded-md bg-muted/50 text-sm"
                    >
                      {getResultIcon(item.result)}
                      <div className="flex-1 min-w-0">
                        <p className="font-mono truncate">{item.barcode}</p>
                        {item.details && (
                          <p className="text-xs text-muted-foreground">{item.details}</p>
                        )}
                      </div>
                      <span className="text-xs text-muted-foreground whitespace-nowrap">
                        {item.timestamp.toLocaleTimeString()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex gap-2">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => {
                  if (!selectedClient) {
                    toast({ title: "Please select a client", variant: "destructive" });
                    return;
                  }
                  setASNPrefillData({ client_id: selectedClient });
                  setShowASNForm(true);
                  onOpenChange(false);
                }}
              >
                Create ASN
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <ASNFormDialog
        open={showASNForm}
        onOpenChange={setShowASNForm}
        prefillData={asnPrefillData}
        onSuccess={() => {
          toast({ title: "ASN created successfully" });
          setShowASNForm(false);
          setScanHistory([{
            barcode: asnPrefillData?.tracking_number || '',
            type: 'asn',
            timestamp: new Date(),
            result: 'created',
            details: `ASN: ${asnPrefillData?.asn_number || 'New'}`
          }, ...scanHistory.slice(0, 9)]);
        }}
      />

      <SKUFormDialog
        open={showSKUEdit}
        onClose={() => {
          setShowSKUEdit(false);
          setSelectedSKU(null);
        }}
        sku={selectedSKU}
        clients={clients}
        isClientView={false}
      />
    </>
  );
};
