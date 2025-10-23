import { useEffect, useState, useRef } from "react";
import { Html5Qrcode } from "html5-qrcode";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Camera, CameraOff, Keyboard, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { detectBarcodeType, normalizeBarcode } from "@/lib/barcodeDetection";
import { playSuccessSound, playErrorSound } from "@/lib/soundEffects";

interface BarcodeScannerProps {
  onScan: (value: string, format: string) => void;
  onError?: (error: string) => void;
  mode?: 'camera' | 'keyboard' | 'both';
  continuous?: boolean;
  autoStart?: boolean;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

export const BarcodeScanner = ({
  onScan,
  onError,
  mode = 'both',
  continuous = false,
  autoStart = false,
  placeholder = "Scan or type barcode...",
  className,
  disabled = false
}: BarcodeScannerProps) => {
  const [cameraActive, setCameraActive] = useState(false);
  const [keyboardMode, setKeyboardMode] = useState(mode === 'keyboard' || mode === 'both');
  const [manualInput, setManualInput] = useState('');
  const [scanning, setScanning] = useState(false);
  const [lastScan, setLastScan] = useState<string | null>(null);
  
  const html5QrCodeRef = useRef<Html5Qrcode | null>(null);
  const keyboardBufferRef = useRef('');
  const lastKeyTimeRef = useRef(Date.now());
  const inputRef = useRef<HTMLInputElement>(null);

  // Keyboard wedge listener (for USB/Bluetooth scanners)
  useEffect(() => {
    if (!keyboardMode) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if user is typing in an input field (except our scanner input)
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' && target !== inputRef.current) return;
      if (target.tagName === 'TEXTAREA') return;
      if (target.isContentEditable) return;

      const currentTime = Date.now();
      const timeDiff = currentTime - lastKeyTimeRef.current;
      
      // Scanners type FAST (< 50ms between characters)
      // Humans type slower (> 100ms typically)
      if (timeDiff > 100) {
        keyboardBufferRef.current = ''; // Reset if too slow (human typing)
      }
      
      if (e.key === 'Enter' && keyboardBufferRef.current.length > 5) {
        // Barcode scanned!
        e.preventDefault();
        const barcode = normalizeBarcode(keyboardBufferRef.current);
        const format = detectBarcodeType(barcode);
        
        handleSuccessfulScan(barcode, format);
        keyboardBufferRef.current = '';
      } else if (e.key.length === 1 && e.key !== 'Enter') {
        // Regular character
        keyboardBufferRef.current += e.key;
      }
      
      lastKeyTimeRef.current = currentTime;
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [keyboardMode, continuous]);

  // Camera scanner
  useEffect(() => {
    if (autoStart && (mode === 'camera' || mode === 'both')) {
      startCamera();
    }
    
    return () => {
      stopCamera();
    };
  }, []);

  const startCamera = async () => {
    if (cameraActive || html5QrCodeRef.current) return;
    
    try {
      const html5QrCode = new Html5Qrcode("barcode-scanner-preview");
      html5QrCodeRef.current = html5QrCode;
      
      await html5QrCode.start(
        { facingMode: "environment" },
        {
          fps: 10,
          qrbox: { width: 250, height: 150 },
          aspectRatio: 1.777778
        },
        (decodedText) => {
          const barcode = normalizeBarcode(decodedText);
          const format = detectBarcodeType(barcode);
          handleSuccessfulScan(barcode, format);
          
          if (!continuous) {
            stopCamera();
          }
        },
        (errorMessage) => {
          // Ignore frequent scanning errors
          if (!errorMessage.includes("NotFoundException")) {
            console.warn("Camera scan error:", errorMessage);
          }
        }
      );
      
      setCameraActive(true);
    } catch (error) {
      console.error("Failed to start camera:", error);
      const errorMsg = "Failed to access camera. Please check permissions.";
      onError?.(errorMsg);
      playErrorSound();
    }
  };

  const stopCamera = async () => {
    if (html5QrCodeRef.current) {
      try {
        await html5QrCodeRef.current.stop();
        html5QrCodeRef.current = null;
      } catch (error) {
        console.error("Error stopping camera:", error);
      }
      setCameraActive(false);
    }
  };

  const handleSuccessfulScan = (barcode: string, format: string) => {
    if (barcode === lastScan && !continuous) {
      return; // Prevent duplicate scans
    }
    
    setLastScan(barcode);
    setScanning(true);
    playSuccessSound();
    
    // Visual feedback
    setTimeout(() => setScanning(false), 300);
    
    onScan(barcode, format);
    
    // Clear duplicate detection after 2 seconds
    setTimeout(() => setLastScan(null), 2000);
  };

  const handleManualSubmit = () => {
    if (!manualInput.trim()) return;
    
    const barcode = normalizeBarcode(manualInput);
    const format = detectBarcodeType(barcode);
    
    if (format === 'unknown') {
      playErrorSound();
      onError?.("Invalid barcode format");
      return;
    }
    
    handleSuccessfulScan(barcode, format);
    setManualInput('');
  };

  const showCamera = mode === 'camera' || mode === 'both';
  const showKeyboard = mode === 'keyboard' || mode === 'both';

  return (
    <div className={cn("space-y-4", className)}>
      {/* Camera preview */}
      {showCamera && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label>Camera Scanner</Label>
            <Button
              type="button"
              size="sm"
              variant={cameraActive ? "destructive" : "outline"}
              onClick={() => cameraActive ? stopCamera() : startCamera()}
            >
              {cameraActive ? (
                <>
                  <CameraOff className="h-4 w-4 mr-2" />
                  Stop Camera
                </>
              ) : (
                <>
                  <Camera className="h-4 w-4 mr-2" />
                  Start Camera
                </>
              )}
            </Button>
          </div>
          
          <div 
            id="barcode-scanner-preview" 
            className={cn(
              "rounded-lg overflow-hidden border-2 transition-colors",
              scanning ? "border-green-500" : "border-border",
              !cameraActive && "min-h-[200px] bg-muted flex items-center justify-center"
            )}
          >
            {!cameraActive && (
              <p className="text-muted-foreground text-sm">
                Click "Start Camera" to begin scanning
              </p>
            )}
          </div>
        </div>
      )}

      {/* Keyboard wedge indicator */}
      {showKeyboard && (
        <div className={cn(
          "rounded-lg border-2 p-4 transition-colors",
          scanning ? "border-green-500 bg-green-50 dark:bg-green-950" : "border-border bg-muted"
        )}>
          <div className="flex items-center gap-2 mb-2">
            <Keyboard className="h-5 w-5" />
            <Label>Scanner Ready</Label>
            {scanning && (
              <span className="text-xs text-green-600 dark:text-green-400 font-semibold">
                Scan Detected!
              </span>
            )}
          </div>
          <p className="text-xs text-muted-foreground">
            {keyboardMode 
              ? "USB/Bluetooth scanner active. Scan any barcode to capture."
              : "Enable keyboard mode to use USB/Bluetooth scanners"}
          </p>
        </div>
      )}

      {/* Manual input fallback */}
      <div className="space-y-2">
        <Label>Manual Entry (Fallback)</Label>
        <div className="flex gap-2">
          <Input
            ref={inputRef}
            value={manualInput}
            onChange={(e) => setManualInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleManualSubmit()}
            placeholder={placeholder}
            className="flex-1"
            disabled={disabled}
            autoFocus
          />
          <Button 
            type="button"
            onClick={handleManualSubmit}
            disabled={!manualInput.trim() || disabled}
          >
            Submit
          </Button>
          {manualInput && (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => setManualInput('')}
              disabled={disabled}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      {/* Scan feedback */}
      {lastScan && (
        <div className="text-xs text-center p-2 rounded bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200">
          Last scan: <span className="font-mono font-semibold">{lastScan}</span>
        </div>
      )}
    </div>
  );
};
