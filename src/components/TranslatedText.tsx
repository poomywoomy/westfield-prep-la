import { useEffect, useState, ReactNode, createElement } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

interface TranslatedTextProps {
  children: string;
  as?: keyof JSX.IntrinsicElements;
  className?: string;
  context?: string;
  fallback?: ReactNode;
}

export function TranslatedText({ 
  children, 
  as = 'span', 
  className = '',
  context,
  fallback
}: TranslatedTextProps) {
  const { currentLanguage, translate, translationCache } = useLanguage();
  // Always start with the original text (no blank flicker)
  const [translated, setTranslated] = useState<string>(children);
  const [hasTranslated, setHasTranslated] = useState(false);

  useEffect(() => {
    // Reset when children change
    setTranslated(children);
    setHasTranslated(false);
  }, [children]);

  useEffect(() => {
    if (currentLanguage === 'en') {
      setTranslated(children);
      setHasTranslated(true);
      return;
    }

    const cacheKey = `${currentLanguage}:${children}`;
    
    // Check cache first - instant swap
    if (translationCache[cacheKey]) {
      setTranslated(translationCache[cacheKey]);
      setHasTranslated(true);
      return;
    }

    // Translate in background - shows English while loading
    translate([children], context).then(([result]) => {
      setTranslated(result);
      setHasTranslated(true);
    }).catch(() => {
      // On error, keep original text
      setHasTranslated(true);
    });
  }, [children, currentLanguage, translate, translationCache, context]);

  // Smooth transition class when translation loads
  const transitionClass = hasTranslated ? 'transition-opacity duration-200' : '';

  return createElement(as, { 
    className: `${className} ${transitionClass}`.trim(),
  }, translated);
}

// Hook version for more flexibility
export function useTranslation() {
  const { currentLanguage, translate, translationCache, isTranslating } = useLanguage();

  const t = async (text: string, context?: string): Promise<string> => {
    if (currentLanguage === 'en') return text;
    
    const cacheKey = `${currentLanguage}:${text}`;
    if (translationCache[cacheKey]) {
      return translationCache[cacheKey];
    }

    const [result] = await translate([text], context);
    return result;
  };

  const tBatch = async (texts: string[], context?: string): Promise<string[]> => {
    if (currentLanguage === 'en') return texts;
    return translate(texts, context);
  };

  return { t, tBatch, currentLanguage, isTranslating };
}
