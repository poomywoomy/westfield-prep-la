import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ExternalLink, Scan, Usb, Bluetooth } from "lucide-react";

interface ScannerHelpDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const ScannerHelpDialog = ({ open, onOpenChange }: ScannerHelpDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Barcode Scanner Help</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Quick Troubleshooting */}
          <div className="space-y-3">
            <h3 className="font-semibold flex items-center gap-2">
              <Scan className="h-5 w-5" />
              Scanner Not Working?
            </h3>
            <div className="space-y-2 text-sm">
              <div className="p-3 bg-muted rounded-lg">
                <p className="font-medium mb-1">1. Check Connection</p>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-2">
                  <li>USB: LED should be solid (not blinking)</li>
                  <li>Bluetooth: Device settings should show "Connected"</li>
                </ul>
              </div>
              
              <div className="p-3 bg-muted rounded-lg">
                <p className="font-medium mb-1">2. Test in Notepad</p>
                <p className="text-muted-foreground">Open a text editor and try scanning. Barcode should appear as typed text.</p>
              </div>

              <div className="p-3 bg-muted rounded-lg">
                <p className="font-medium mb-1">3. Check Battery (Wireless)</p>
                <p className="text-muted-foreground">Low battery reduces range. Charge for 2-4 hours.</p>
              </div>

              <div className="p-3 bg-muted rounded-lg">
                <p className="font-medium mb-1">4. Click Input Field</p>
                <p className="text-muted-foreground">Make sure cursor is blinking in the scanner input box.</p>
              </div>
            </div>
          </div>

          {/* Scanner Types */}
          <div className="space-y-3">
            <h3 className="font-semibold">Supported Scanner Types</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="p-3 border rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Usb className="h-5 w-5 text-primary" />
                  <h4 className="font-medium">USB Wired</h4>
                </div>
                <p className="text-sm text-muted-foreground">
                  Plug and play. Best for desktop receiving stations. No batteries needed.
                </p>
                <p className="text-xs text-muted-foreground mt-2">
                  <strong>Popular:</strong> Honeywell Voyager, Symbol LS2208
                </p>
              </div>

              <div className="p-3 border rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Bluetooth className="h-5 w-5 text-primary" />
                  <h4 className="font-medium">Bluetooth Wireless</h4>
                </div>
                <p className="text-sm text-muted-foreground">
                  Pair with phone/tablet. Best for mobile workflows. 30-100ft range.
                </p>
                <p className="text-xs text-muted-foreground mt-2">
                  <strong>Popular:</strong> Socket Mobile S700, Honeywell 1602g
                </p>
              </div>
            </div>
          </div>

          {/* Configuration */}
          <div className="space-y-3">
            <h3 className="font-semibold">Required Configuration</h3>
            <div className="p-4 bg-primary/10 rounded-lg space-y-2 text-sm">
              <p><strong>Mode:</strong> HID Keyboard Mode (not SPP Mode)</p>
              <p><strong>Suffix:</strong> Add "Enter" after each scan</p>
              <p><strong>Symbologies:</strong> Enable all (UPC, EAN, Code 128, QR)</p>
              <p className="text-xs text-muted-foreground mt-2">
                📖 Configuration barcodes are in your scanner's user manual (scan these to configure)
              </p>
            </div>
          </div>

          {/* Setup Steps */}
          <div className="space-y-3">
            <h3 className="font-semibold">Bluetooth Setup (iOS/Android)</h3>
            <ol className="list-decimal list-inside space-y-1 text-sm text-muted-foreground">
              <li>Turn on scanner (hold power button)</li>
              <li>Device Settings → Bluetooth</li>
              <li>Find scanner in available devices</li>
              <li>Tap to pair (PIN usually <strong>0000</strong>)</li>
              <li>Wait for "Connected" status</li>
              <li>Open Westfield app and start scanning</li>
            </ol>
          </div>

          {/* Common Issues */}
          <div className="space-y-3">
            <h3 className="font-semibold">Common Issues</h3>
            <div className="space-y-2 text-sm">
              <details className="p-3 bg-muted rounded-lg">
                <summary className="font-medium cursor-pointer">Scanner beeps but nothing happens</summary>
                <p className="text-muted-foreground mt-2">
                  Scanner is not in HID Keyboard Mode. Scan the "HID Mode" or "USB-HID Mode" barcode from your scanner's manual.
                </p>
              </details>

              <details className="p-3 bg-muted rounded-lg">
                <summary className="font-medium cursor-pointer">Barcode appears but doesn't submit</summary>
                <p className="text-muted-foreground mt-2">
                  Scanner is not adding "Enter" suffix. Scan the "Add Suffix: Enter" barcode from your manual.
                </p>
              </details>

              <details className="p-3 bg-muted rounded-lg">
                <summary className="font-medium cursor-pointer">Extra characters appear (e.g., "]E0")</summary>
                <p className="text-muted-foreground mt-2">
                  AIM Code ID prefix is enabled. Scan the "Disable AIM Prefix" barcode from your manual.
                </p>
              </details>

              <details className="p-3 bg-muted rounded-lg">
                <summary className="font-medium cursor-pointer">Bluetooth paired but not connected</summary>
                <p className="text-muted-foreground mt-2">
                  Forget device in Bluetooth settings, turn scanner off/on, and re-pair from scratch.
                </p>
              </details>
            </div>
          </div>

          {/* Full Documentation Link */}
          <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
            <p className="font-medium mb-2">Need More Help?</p>
            <p className="text-sm text-muted-foreground mb-3">
              View the complete scanner setup guide with detailed troubleshooting, configuration barcodes, and purchasing recommendations.
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.open('/docs/SCANNER_SETUP.md', '_blank')}
            >
              <ExternalLink className="mr-2 h-4 w-4" />
              View Full Scanner Guide
            </Button>
          </div>

          {/* Support Contact */}
          <div className="text-center text-sm text-muted-foreground">
            <p>Still having issues? Contact support:</p>
            <a href="mailto:support@westfield3pl.com" className="text-primary hover:underline">
              support@westfield3pl.com
            </a>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};