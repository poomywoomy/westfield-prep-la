import { useEffect, useState, useRef, createElement } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

interface TranslatedTextProps {
  children: string;
  as?: keyof JSX.IntrinsicElements;
  className?: string;
}

export function TranslatedText({ 
  children, 
  as = 'span', 
  className = ''
}: TranslatedTextProps) {
  const { currentLanguage, queueTranslation, translationCache } = useLanguage();
  const [translated, setTranslated] = useState<string>(children);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    return () => { mountedRef.current = false; };
  }, []);

  useEffect(() => {
    // If English, just show original
    if (currentLanguage === 'en') {
      setTranslated(children);
      return;
    }

    const cacheKey = `${currentLanguage}:${children}`;
    
    // Check cache first (instant) - triggers on cache updates too
    if (translationCache[cacheKey]) {
      setTranslated(translationCache[cacheKey]);
      return;
    }

    // Queue translation (batched with debounce)
    queueTranslation(children).then((result) => {
      if (mountedRef.current) {
        setTranslated(result);
      }
    });
  }, [children, currentLanguage, translationCache]);

  return createElement(as, { className }, translated);
}

// Hook version for more flexibility
export function useTranslation() {
  const { currentLanguage, translate, queueTranslation, translationCache, isTranslating } = useLanguage();

  const t = async (text: string): Promise<string> => {
    if (currentLanguage === 'en') return text;
    
    const cacheKey = `${currentLanguage}:${text}`;
    if (translationCache[cacheKey]) {
      return translationCache[cacheKey];
    }

    return queueTranslation(text);
  };

  const tBatch = async (texts: string[], context?: string): Promise<string[]> => {
    if (currentLanguage === 'en') return texts;
    return translate(texts, context);
  };

  return { t, tBatch, currentLanguage, isTranslating };
}
