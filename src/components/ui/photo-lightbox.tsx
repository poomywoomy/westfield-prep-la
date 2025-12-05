import Lightbox from "yet-another-react-lightbox";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import Counter from "yet-another-react-lightbox/plugins/counter";
import "yet-another-react-lightbox/styles.css";

interface PhotoLightboxProps {
  photos: string[];
  initialIndex?: number;
  open: boolean;
  onClose: () => void;
}

export const PhotoLightbox = ({ photos, initialIndex = 0, open, onClose }: PhotoLightboxProps) => {
  if (!open || photos.length === 0) return null;

  return (
    <Lightbox
      open={open}
      close={onClose}
      index={initialIndex}
      slides={photos.map(src => ({ src }))}
      plugins={[Zoom, Counter]}
      animation={{ fade: 300 }}
      styles={{ 
        container: { backgroundColor: "rgba(0, 0, 0, 0.9)" },
        root: { zIndex: 99999 }
      }}
      carousel={{ finite: photos.length <= 1 }}
      controller={{ closeOnBackdropClick: true }}
      zoom={{
        maxZoomPixelRatio: 3,
        scrollToZoom: true
      }}
    />
  );
};
