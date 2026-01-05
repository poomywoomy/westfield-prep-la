import { useEffect, useState, useRef, createElement, useMemo } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

// Normalize text consistently - must match LanguageContext and backend
function normalizeText(text: string): string {
  return text.trim().replace(/\s+/g, ' ');
}

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

  // Normalize the input text
  const normalized = useMemo(() => normalizeText(children), [children]);
  
  // Get cached value directly
  const cacheKey = `${currentLanguage}:${normalized}`;
  const cached = translationCache[cacheKey];

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

    // Check cache first (instant) - this now triggers when cache updates
    if (cached) {
      setTranslated(cached);
      return;
    }

    // Queue translation (batched with debounce)
    queueTranslation(children).then((result) => {
      if (mountedRef.current) {
        setTranslated(result);
      }
    });
  }, [children, currentLanguage, cached, queueTranslation]);

  return createElement(as, { className }, translated);
}

// Hook version for more flexibility
export function useTranslation() {
  const { currentLanguage, translate, queueTranslation, translationCache, isTranslating } = useLanguage();

  const t = async (text: string): Promise<string> => {
    if (currentLanguage === 'en') return text;
    
    const normalized = normalizeText(text);
    const cacheKey = `${currentLanguage}:${normalized}`;
    if (translationCache[cacheKey]) {
      return translationCache[cacheKey];
    }

    return queueTranslation(text);
  };

  // Synchronous lookup - returns cached value or original
  const tSync = (text: string): string => {
    if (currentLanguage === 'en') return text;
    
    const normalized = normalizeText(text);
    const cacheKey = `${currentLanguage}:${normalized}`;
    return translationCache[cacheKey] || text;
  };

  const tBatch = async (texts: string[], context?: string): Promise<string[]> => {
    if (currentLanguage === 'en') return texts;
    return translate(texts, context);
  };

  return { t, tSync, tBatch, currentLanguage, isTranslating };
}
