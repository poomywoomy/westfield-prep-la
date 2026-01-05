import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface SupportedLanguage {
  code: string;
  name: string;
  native_name: string;
  flag_emoji: string;
}

interface TranslationCache {
  [key: string]: string;
}

interface LanguageContextType {
  currentLanguage: string;
  setLanguage: (lang: string) => void;
  supportedLanguages: SupportedLanguage[];
  isDetecting: boolean;
  translate: (texts: string[], context?: string) => Promise<string[]>;
  translationCache: TranslationCache;
  isTranslating: boolean;
}

const LanguageContext = createContext<LanguageContextType | null>(null);

const STORAGE_KEY = 'westfield_language';

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [currentLanguage, setCurrentLanguage] = useState<string>('en');
  const [supportedLanguages, setSupportedLanguages] = useState<SupportedLanguage[]>([]);
  const [isDetecting, setIsDetecting] = useState(true);
  const [translationCache, setTranslationCache] = useState<TranslationCache>({});
  const [isTranslating, setIsTranslating] = useState(false);

  // Load supported languages
  useEffect(() => {
    async function loadLanguages() {
      const { data } = await supabase
        .from('supported_languages')
        .select('*')
        .eq('is_active', true);
      
      if (data) {
        setSupportedLanguages(data);
      }
    }
    loadLanguages();
  }, []);

  // Detect language on mount
  useEffect(() => {
    async function detectLanguage() {
      setIsDetecting(true);

      // 1. Check localStorage first (user preference)
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        setCurrentLanguage(saved);
        setIsDetecting(false);
        return;
      }

      // 2. Check browser language
      const browserLang = navigator.language?.split('-')[0];
      if (browserLang && browserLang !== 'en') {
        // Check if we support this language
        const { data: langData } = await supabase
          .from('supported_languages')
          .select('code')
          .eq('code', browserLang)
          .eq('is_active', true)
          .single();
        
        if (langData) {
          setCurrentLanguage(browserLang);
          localStorage.setItem(STORAGE_KEY, browserLang);
          setIsDetecting(false);
          return;
        }
      }

      // 3. Try IP geolocation
      try {
        const response = await supabase.functions.invoke('detect-country');
        if (response.data?.language && response.data.language !== 'en') {
          // Check if we support this language
          const { data: langData } = await supabase
            .from('supported_languages')
            .select('code')
            .eq('code', response.data.language)
            .eq('is_active', true)
            .single();
          
          if (langData) {
            setCurrentLanguage(response.data.language);
            localStorage.setItem(STORAGE_KEY, response.data.language);
          }
        }
      } catch (error) {
        console.error('Failed to detect country:', error);
      }

      setIsDetecting(false);
    }

    detectLanguage();
  }, []);

  // Update HTML lang attribute
  useEffect(() => {
    document.documentElement.lang = currentLanguage;
  }, [currentLanguage]);

  const setLanguage = useCallback((lang: string) => {
    setCurrentLanguage(lang);
    localStorage.setItem(STORAGE_KEY, lang);
  }, []);

  const translate = useCallback(async (texts: string[], context?: string): Promise<string[]> => {
    if (currentLanguage === 'en') {
      return texts;
    }

    // Check cache first
    const uncachedTexts: string[] = [];
    const uncachedIndices: number[] = [];
    const results: string[] = [...texts];

    texts.forEach((text, i) => {
      const cacheKey = `${currentLanguage}:${text}`;
      if (translationCache[cacheKey]) {
        results[i] = translationCache[cacheKey];
      } else {
        uncachedTexts.push(text);
        uncachedIndices.push(i);
      }
    });

    if (uncachedTexts.length === 0) {
      return results;
    }

    setIsTranslating(true);

    try {
      const response = await supabase.functions.invoke('translate-content', {
        body: { texts: uncachedTexts, targetLanguage: currentLanguage, context }
      });

      if (response.data?.translations) {
        const newCache: TranslationCache = {};
        
        response.data.translations.forEach((t: { source: string; translated: string }, i: number) => {
          const originalIndex = uncachedIndices[i];
          results[originalIndex] = t.translated;
          newCache[`${currentLanguage}:${t.source}`] = t.translated;
        });

        setTranslationCache(prev => ({ ...prev, ...newCache }));
      }
    } catch (error) {
      console.error('Translation failed:', error);
    }

    setIsTranslating(false);
    return results;
  }, [currentLanguage, translationCache]);

  return (
    <LanguageContext.Provider value={{
      currentLanguage,
      setLanguage,
      supportedLanguages,
      isDetecting,
      translate,
      translationCache,
      isTranslating,
    }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
