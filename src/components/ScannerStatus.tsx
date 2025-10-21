import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { Scan, Usb, Bluetooth, Camera, HelpCircle } from "lucide-react";

interface ScannerStatusProps {
  isActive: boolean;
  mode: 'usb' | 'bluetooth' | 'camera' | 'keyboard';
  onHelpClick?: () => void;
  className?: string;
}

export const ScannerStatus = ({ isActive, mode, onHelpClick, className }: ScannerStatusProps) => {
  const getIcon = () => {
    switch (mode) {
      case 'usb': return <Usb className="h-3 w-3" />;
      case 'bluetooth': return <Bluetooth className="h-3 w-3" />;
      case 'camera': return <Camera className="h-3 w-3" />;
      default: return <Scan className="h-3 w-3" />;
    }
  };

  const getLabel = () => {
    const modeLabel = mode === 'keyboard' ? 'USB/BT Scanner' : mode.toUpperCase();
    return isActive ? `${modeLabel} Active` : `${modeLabel} Ready`;
  };

  const getVariant = (): "default" | "secondary" | "destructive" | "outline" => {
    if (!isActive) return "outline";
    return "default";
  };

  const getDescription = () => {
    switch (mode) {
      case 'usb':
        return 'USB scanner connected. Point and trigger to scan.';
      case 'bluetooth':
        return 'Bluetooth scanner paired. Point and trigger to scan.';
      case 'camera':
        return 'Using device camera. Point at barcode to scan.';
      case 'keyboard':
        return 'Scanner ready. Scanned barcodes will auto-populate.';
      default:
        return 'Scanner ready for use.';
    }
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <HoverCard>
        <HoverCardTrigger asChild>
          <Badge variant={getVariant()} className="cursor-help">
            {getIcon()}
            <span className="ml-1.5">{getLabel()}</span>
          </Badge>
        </HoverCardTrigger>
        <HoverCardContent className="w-80" side="bottom" align="end">
          <div className="space-y-2">
            <div className="flex items-start justify-between">
              <div>
                <h4 className="font-semibold text-sm">Scanner Status</h4>
                <p className="text-sm text-muted-foreground mt-1">{getDescription()}</p>
              </div>
            </div>
            
            {mode === 'keyboard' && (
              <div className="text-xs text-muted-foreground space-y-1 mt-3">
                <p><strong>Keyboard wedge mode:</strong></p>
                <ul className="list-disc list-inside ml-2 space-y-0.5">
                  <li>Scanner acts like a keyboard</li>
                  <li>Scanned barcodes auto-fill the input</li>
                  <li>Works with USB and Bluetooth scanners</li>
                </ul>
              </div>
            )}

            {mode === 'camera' && (
              <div className="text-xs text-muted-foreground mt-3">
                <p><strong>Tips for best results:</strong></p>
                <ul className="list-disc list-inside ml-2 space-y-0.5 mt-1">
                  <li>Hold device 4-8 inches from barcode</li>
                  <li>Ensure good lighting</li>
                  <li>Keep camera steady</li>
                </ul>
              </div>
            )}

            <div className="pt-2 border-t">
              <p className="text-xs text-muted-foreground">
                Not working? 
                {onHelpClick ? (
                  <Button
                    variant="link"
                    size="sm"
                    className="h-auto p-0 ml-1 text-primary"
                    onClick={onHelpClick}
                  >
                    View scanner help
                  </Button>
                ) : (
                  <span className="text-primary ml-1">Check your scanner configuration</span>
                )}
              </p>
            </div>
          </div>
        </HoverCardContent>
      </HoverCard>

      {onHelpClick && (
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6"
          onClick={onHelpClick}
          title="Scanner help and troubleshooting"
        >
          <HelpCircle className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
};