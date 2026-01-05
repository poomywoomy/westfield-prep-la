import { useLanguage } from '@/contexts/LanguageContext';
import { Loader2 } from 'lucide-react';

export function TranslationLoadingOverlay() {
  const { isLanguageTransitioning, currentLanguage } = useLanguage();
  
  // Only show when transitioning to non-English
  if (!isLanguageTransitioning || currentLanguage === 'en') {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[9999] bg-background/80 backdrop-blur-sm flex items-center justify-center animate-in fade-in duration-200">
      <div className="flex flex-col items-center gap-3 p-6 bg-card rounded-lg shadow-lg border">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="text-sm text-muted-foreground">Translating...</span>
      </div>
    </div>
  );
}
