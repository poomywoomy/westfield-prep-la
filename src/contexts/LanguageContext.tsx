import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode, useRef } from 'react';
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
  queueTranslation: (text: string) => Promise<string>;
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

  // Use refs to avoid recreating functions on every cache update
  const translationCacheRef = useRef<TranslationCache>({});
  const currentLanguageRef = useRef<string>('en');
  const pendingTranslationsRef = useRef<Map<string, Array<(result: string) => void>>>(new Map());
  const batchTimeoutRef = useRef<number | null>(null);

  // Sync refs with state
  useEffect(() => {
    translationCacheRef.current = translationCache;
  }, [translationCache]);

  useEffect(() => {
    currentLanguageRef.current = currentLanguage;
  }, [currentLanguage]);

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

  // Core translate function - uses refs to avoid dependency issues
  const translate = useCallback(async (texts: string[], context?: string): Promise<string[]> => {
    const lang = currentLanguageRef.current;
    if (lang === 'en') {
      return texts;
    }

    const cache = translationCacheRef.current;

    // Check cache first
    const uncachedTexts: string[] = [];
    const uncachedIndices: number[] = [];
    const results: string[] = [...texts];

    texts.forEach((text, i) => {
      const cacheKey = `${lang}:${text}`;
      if (cache[cacheKey]) {
        results[i] = cache[cacheKey];
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
        body: { texts: uncachedTexts, targetLanguage: lang, context }
      });

      if (response.data?.translations) {
        const newCache: TranslationCache = {};
        
        response.data.translations.forEach((t: { source: string; translated: string }, i: number) => {
          const originalIndex = uncachedIndices[i];
          results[originalIndex] = t.translated;
          newCache[`${lang}:${t.source}`] = t.translated;
        });

        // Update both ref and state
        translationCacheRef.current = { ...translationCacheRef.current, ...newCache };
        setTranslationCache(prev => ({ ...prev, ...newCache }));
      }
    } catch (error) {
      console.error('Translation failed:', error);
    }

    setIsTranslating(false);
    return results;
  }, []); // No dependencies - uses refs

  // Process batched translations
  const processBatch = useCallback(async () => {
    const pending = Array.from(pendingTranslationsRef.current.entries());
    pendingTranslationsRef.current.clear();
    
    if (pending.length === 0) return;
    
    const texts = pending.map(([text]) => text);
    const results = await translate(texts);
    
    // Resolve all pending promises
    pending.forEach(([text, resolvers], i) => {
      resolvers.forEach(resolve => resolve(results[i]));
    });
  }, [translate]);

  // Queue translation with batching and debouncing
  const queueTranslation = useCallback((text: string): Promise<string> => {
    return new Promise((resolve) => {
      const lang = currentLanguageRef.current;
      
      // If English, resolve immediately
      if (lang === 'en') {
        resolve(text);
        return;
      }
      
      const cacheKey = `${lang}:${text}`;
      
      // If already cached, resolve immediately
      if (translationCacheRef.current[cacheKey]) {
        resolve(translationCacheRef.current[cacheKey]);
        return;
      }
      
      // Add to pending queue
      const existing = pendingTranslationsRef.current.get(text);
      if (existing) {
        existing.push(resolve);
      } else {
        pendingTranslationsRef.current.set(text, [resolve]);
      }
      
      // Debounce: wait 50ms to collect all pending texts, then batch translate
      if (batchTimeoutRef.current) {
        clearTimeout(batchTimeoutRef.current);
      }
      batchTimeoutRef.current = window.setTimeout(processBatch, 50);
    });
  }, [processBatch]);

  return (
    <LanguageContext.Provider value={{
      currentLanguage,
      setLanguage,
      supportedLanguages,
      isDetecting,
      translate,
      queueTranslation,
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
