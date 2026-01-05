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
  const lastChildrenRef = useRef(children);
  const lastLanguageRef = useRef(currentLanguage);

  useEffect(() => {
    mountedRef.current = true;
    return () => { mountedRef.current = false; };
  }, []);

  useEffect(() => {
    // Skip if nothing changed
    if (lastChildrenRef.current === children && lastLanguageRef.current === currentLanguage) {
      return;
    }
    
    lastChildrenRef.current = children;
    lastLanguageRef.current = currentLanguage;

    // If English, just show original
    if (currentLanguage === 'en') {
      setTranslated(children);
      return;
    }

    const cacheKey = `${currentLanguage}:${children}`;
    
    // Check cache first (instant)
    if (translationCache[cacheKey]) {
      setTranslated(translationCache[cacheKey]);
      return;
    }

    // Show original while loading, then queue translation
    setTranslated(children);
    
    queueTranslation(children).then((result) => {
      if (mountedRef.current) {
        setTranslated(result);
      }
    });
  }, [children, currentLanguage, queueTranslation, translationCache]);

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
