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
  const [translated, setTranslated] = useState<string>(children);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (currentLanguage === 'en') {
      setTranslated(children);
      return;
    }

    const cacheKey = `${currentLanguage}:${children}`;
    
    // Check cache first
    if (translationCache[cacheKey]) {
      setTranslated(translationCache[cacheKey]);
      return;
    }

    // Translate
    setIsLoading(true);
    translate([children], context).then(([result]) => {
      setTranslated(result);
      setIsLoading(false);
    });
  }, [children, currentLanguage, translate, translationCache, context]);

  if (isLoading && fallback) {
    return <>{fallback}</>;
  }

  return createElement(as, { className }, translated);
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
