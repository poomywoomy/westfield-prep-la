import { useState, useEffect, useCallback } from "react";
import { X, ChevronLeft, ChevronRight, ZoomIn, ZoomOut } from "lucide-react";
import { Button } from "./button";
import { createPortal } from "react-dom";

interface PhotoLightboxProps {
  photos: string[];
  initialIndex?: number;
  open: boolean;
  onClose: () => void;
}

export const PhotoLightbox = ({ photos, initialIndex = 0, open, onClose }: PhotoLightboxProps) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [zoom, setZoom] = useState(1);

  useEffect(() => {
    if (open) {
      setCurrentIndex(initialIndex);
      setZoom(1);
    }
  }, [open, initialIndex]);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (!open) return;
    if (e.key === "Escape") onClose();
    if (e.key === "ArrowLeft") setCurrentIndex((prev) => (prev > 0 ? prev - 1 : photos.length - 1));
    if (e.key === "ArrowRight") setCurrentIndex((prev) => (prev < photos.length - 1 ? prev + 1 : 0));
  }, [open, photos.length, onClose]);

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  if (!open || photos.length === 0) return null;

  const goToPrev = () => setCurrentIndex((prev) => (prev > 0 ? prev - 1 : photos.length - 1));
  const goToNext = () => setCurrentIndex((prev) => (prev < photos.length - 1 ? prev + 1 : 0));
  const zoomIn = () => setZoom((prev) => Math.min(prev + 0.5, 3));
  const zoomOut = () => setZoom((prev) => Math.max(prev - 0.5, 0.5));

  const lightboxContent = (
    <div 
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70" />
      
      {/* Modal Container - smaller popup style */}
      <div 
        className="relative bg-background rounded-lg shadow-2xl max-w-4xl max-h-[85vh] w-full flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with close button */}
        <div className="flex items-center justify-between p-3 border-b">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={zoomOut}
              disabled={zoom <= 0.5}
            >
              <ZoomOut className="h-4 w-4" />
            </Button>
            <span className="text-sm text-muted-foreground min-w-[50px] text-center">{Math.round(zoom * 100)}%</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={zoomIn}
              disabled={zoom >= 3}
            >
              <ZoomIn className="h-4 w-4" />
            </Button>
          </div>
          <span className="text-sm text-muted-foreground">
            {currentIndex + 1} / {photos.length}
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="hover:bg-destructive/10"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Image Container */}
        <div className="flex-1 overflow-auto p-4 flex items-center justify-center min-h-[300px]">
          <img
            src={photos[currentIndex]}
            alt={`Photo ${currentIndex + 1}`}
            className="max-w-full max-h-[60vh] object-contain transition-transform duration-200"
            style={{ transform: `scale(${zoom})`, transformOrigin: 'center center' }}
          />
        </div>

        {/* Navigation arrows */}
        {photos.length > 1 && (
          <>
            <Button
              variant="secondary"
              size="icon"
              className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full shadow-lg"
              onClick={goToPrev}
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <Button
              variant="secondary"
              size="icon"
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full shadow-lg"
              onClick={goToNext}
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          </>
        )}

        {/* Thumbnail strip */}
        {photos.length > 1 && (
          <div className="border-t p-3 flex gap-2 justify-center overflow-x-auto">
            {photos.map((photo, idx) => (
              <button
                key={idx}
                className={`w-14 h-14 rounded overflow-hidden border-2 transition-all flex-shrink-0 ${
                  idx === currentIndex ? "border-primary ring-2 ring-primary/20" : "border-border opacity-60 hover:opacity-100"
                }`}
                onClick={() => setCurrentIndex(idx)}
              >
                <img src={photo} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  // Use portal to render at document root, escaping all stacking contexts
  return createPortal(lightboxContent, document.body);
};
