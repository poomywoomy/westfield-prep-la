import { useEffect, useCallback, useState } from "react";
import { createPortal } from "react-dom";
import { X, ZoomIn, ZoomOut, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PhotoLightboxProps {
  photos: string[];
  initialIndex?: number;
  open: boolean;
  onClose: () => void;
}

export const PhotoLightbox = ({ photos, initialIndex = 0, open, onClose }: PhotoLightboxProps) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [zoom, setZoom] = useState(1);

  // Reset state when opening
  useEffect(() => {
    if (open) {
      setCurrentIndex(initialIndex);
      setZoom(1);
    }
  }, [open, initialIndex]);

  // Keyboard navigation with capture phase to intercept before Radix Dialog
  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Stop propagation to prevent Radix Dialog from receiving events
      e.stopPropagation();
      e.stopImmediatePropagation();

      switch (e.key) {
        case 'Escape':
          e.preventDefault();
          onClose();
          break;
        case 'ArrowLeft':
          e.preventDefault();
          setCurrentIndex(prev => Math.max(0, prev - 1));
          break;
        case 'ArrowRight':
          e.preventDefault();
          setCurrentIndex(prev => Math.min(photos.length - 1, prev + 1));
          break;
        case '+':
        case '=':
          e.preventDefault();
          setZoom(prev => Math.min(5, prev + 0.5));
          break;
        case '-':
          e.preventDefault();
          setZoom(prev => Math.max(0.5, prev - 0.5));
          break;
      }
    };

    // Use capture phase to intercept events before they reach Radix Dialog
    document.addEventListener('keydown', handleKeyDown, { capture: true });
    return () => document.removeEventListener('keydown', handleKeyDown, { capture: true });
  }, [open, photos.length, onClose]);

  // Prevent body scroll when lightbox is open
  useEffect(() => {
    if (open) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [open]);

  // Handle scroll wheel zoom
  useEffect(() => {
    if (!open) return;

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      e.stopPropagation();
      
      if (e.deltaY < 0) {
        setZoom(prev => Math.min(5, prev + 0.25));
      } else {
        setZoom(prev => Math.max(0.5, prev - 0.25));
      }
    };

    document.addEventListener('wheel', handleWheel, { passive: false, capture: true });
    return () => document.removeEventListener('wheel', handleWheel, { capture: true });
  }, [open]);

  if (!open || photos.length === 0) return null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    // Only close if clicking directly on backdrop, not on children
    if (e.target === e.currentTarget) {
      e.stopPropagation();
      e.preventDefault();
      onClose();
    }
  };

  const handleCloseClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    onClose();
  };

  const handleZoomIn = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setZoom(prev => Math.min(5, prev + 0.5));
  };

  const handleZoomOut = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setZoom(prev => Math.max(0.5, prev - 0.5));
  };

  const handlePrevious = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setCurrentIndex(prev => Math.max(0, prev - 1));
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setCurrentIndex(prev => Math.min(photos.length - 1, prev + 1));
  };

  const content = (
    <div
      className="fixed inset-0 flex items-center justify-center"
      style={{ 
        zIndex: 999999,
        backgroundColor: 'rgba(0, 0, 0, 0.95)'
      }}
      onClick={handleBackdropClick}
      onMouseDown={(e) => e.stopPropagation()}
      onPointerDown={(e) => e.stopPropagation()}
      role="dialog"
      aria-modal="true"
      aria-label="Photo viewer"
    >
      {/* Close button - top right */}
      <Button
        variant="ghost"
        size="icon"
        className="absolute top-4 right-4 text-white hover:bg-white/20 z-10 h-10 w-10"
        onClick={handleCloseClick}
        aria-label="Close photo viewer"
      >
        <X className="h-6 w-6" />
      </Button>

      {/* Photo counter - top left */}
      <div className="absolute top-4 left-4 text-white/80 text-sm font-medium bg-black/50 px-3 py-1.5 rounded-md">
        {currentIndex + 1} / {photos.length}
      </div>

      {/* Zoom controls - bottom center */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-3 bg-black/60 rounded-lg px-4 py-2.5 backdrop-blur-sm">
        <Button
          variant="ghost"
          size="icon"
          className="text-white hover:bg-white/20 h-9 w-9"
          onClick={handleZoomOut}
          disabled={zoom <= 0.5}
          aria-label="Zoom out"
        >
          <ZoomOut className="h-5 w-5" />
        </Button>
        <span className="text-white text-sm font-medium min-w-[65px] text-center">
          {Math.round(zoom * 100)}%
        </span>
        <Button
          variant="ghost"
          size="icon"
          className="text-white hover:bg-white/20 h-9 w-9"
          onClick={handleZoomIn}
          disabled={zoom >= 5}
          aria-label="Zoom in"
        >
          <ZoomIn className="h-5 w-5" />
        </Button>
      </div>

      {/* Navigation - Previous button */}
      {photos.length > 1 && currentIndex > 0 && (
        <Button
          variant="ghost"
          size="icon"
          className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/20 h-12 w-12"
          onClick={handlePrevious}
          aria-label="Previous photo"
        >
          <ChevronLeft className="h-8 w-8" />
        </Button>
      )}

      {/* Navigation - Next button */}
      {photos.length > 1 && currentIndex < photos.length - 1 && (
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/20 h-12 w-12"
          onClick={handleNext}
          aria-label="Next photo"
        >
          <ChevronRight className="h-8 w-8" />
        </Button>
      )}

      {/* Image container with zoom */}
      <div
        className="max-w-[90vw] max-h-[85vh] overflow-auto flex items-center justify-center"
        onClick={(e) => e.stopPropagation()}
        style={{ cursor: zoom > 1 ? 'grab' : 'default' }}
      >
        <img
          src={photos[currentIndex]}
          alt={`Photo ${currentIndex + 1} of ${photos.length}`}
          className="max-w-none select-none transition-transform duration-200 ease-out"
          style={{
            transform: `scale(${zoom})`,
            transformOrigin: 'center center',
            maxHeight: zoom === 1 ? '85vh' : 'none',
            maxWidth: zoom === 1 ? '90vw' : 'none'
          }}
          draggable={false}
        />
      </div>
    </div>
  );

  // Render via portal directly to document.body - completely outside Radix Dialog's DOM tree
  return createPortal(content, document.body);
};
