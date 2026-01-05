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
  isLanguageTransitioning: boolean;
}

const LanguageContext = createContext<LanguageContextType | null>(null);

const STORAGE_KEY = 'westfield_language';
const CACHE_STORAGE_KEY = 'westfield_translation_cache';

// Normalize text consistently - must match backend normalization
function normalizeText(text: string): string {
  return text.trim().replace(/\s+/g, ' ');
}

// Load cache from localStorage
function loadCacheFromStorage(): TranslationCache {
  try {
    const stored = localStorage.getItem(CACHE_STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (e) {
    console.error('Failed to load translation cache:', e);
  }
  return {};
}

// Save cache to localStorage (debounced)
let saveCacheTimeout: number | null = null;
function saveCacheToStorage(cache: TranslationCache) {
  if (saveCacheTimeout) {
    clearTimeout(saveCacheTimeout);
  }
  saveCacheTimeout = window.setTimeout(() => {
    try {
      localStorage.setItem(CACHE_STORAGE_KEY, JSON.stringify(cache));
    } catch (e) {
      console.error('Failed to save translation cache:', e);
    }
  }, 500);
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [currentLanguage, setCurrentLanguage] = useState<string>('en');
  const [supportedLanguages, setSupportedLanguages] = useState<SupportedLanguage[]>([]);
  const [isDetecting, setIsDetecting] = useState(true);
  const [translationCache, setTranslationCache] = useState<TranslationCache>(loadCacheFromStorage);
  const [isTranslating, setIsTranslating] = useState(false);
  const [isLanguageTransitioning, setIsLanguageTransitioning] = useState(false);

  // Use refs to avoid recreating functions on every cache update
  const translationCacheRef = useRef<TranslationCache>(loadCacheFromStorage());
  const currentLanguageRef = useRef<string>('en');
  const pendingTranslationsRef = useRef<Map<string, Array<(result: string) => void>>>(new Map());
  const batchTimeoutRef = useRef<number | null>(null);
  const pendingCountRef = useRef<number>(0);
  const transitionTimeoutRef = useRef<number | null>(null);

  // Sync refs with state
  useEffect(() => {
    translationCacheRef.current = translationCache;
    saveCacheToStorage(translationCache);
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
    // Clear any existing transition timeout
    if (transitionTimeoutRef.current) {
      clearTimeout(transitionTimeoutRef.current);
    }
    
    // Only show transition when switching TO a non-English language
    if (lang !== 'en' && lang !== currentLanguageRef.current) {
      setIsLanguageTransitioning(true);
      pendingCountRef.current = 0;
      
      // Safety timeout - force hide spinner after 5 seconds max
      setTimeout(() => {
        setIsLanguageTransitioning(prevState => {
          if (prevState) {
            console.warn('Translation transition timed out - forcing complete');
            pendingCountRef.current = 0;
            return false;
          }
          return prevState;
        });
      }, 5000);
    } else if (lang === 'en') {
      // Switching to English is instant - force reset everything
      setIsLanguageTransitioning(false);
      pendingCountRef.current = 0;
      pendingTranslationsRef.current.clear();
    }
    
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

    // Normalize texts and check cache first
    const normalizedTexts = texts.map(t => normalizeText(t));
    const uncachedTexts: string[] = [];
    const uncachedIndices: number[] = [];
    const results: string[] = [...texts];

    normalizedTexts.forEach((text, i) => {
      const cacheKey = `${lang}:${text}`;
      if (cache[cacheKey]) {
        results[i] = cache[cacheKey];
      } else if (text) {
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
          // Use normalized source for cache key consistency
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

  // Check if transition should end
  const checkTransitionComplete = useCallback(() => {
    if (pendingCountRef.current <= 0 && pendingTranslationsRef.current.size === 0) {
      // Small delay to ensure all components have updated
      transitionTimeoutRef.current = window.setTimeout(() => {
        setIsLanguageTransitioning(false);
      }, 150);
    }
  }, []);

  // Process batched translations
  const processBatch = useCallback(async () => {
    const pending = Array.from(pendingTranslationsRef.current.entries());
    pendingTranslationsRef.current.clear();
    
    if (pending.length === 0) {
      checkTransitionComplete();
      return;
    }
    
    const texts = pending.map(([text]) => text);
    
    try {
      const results = await translate(texts);
      
      // Resolve all pending promises - decrement once per resolver (not per text)
      pending.forEach(([text, resolvers], i) => {
        resolvers.forEach(resolve => {
          resolve(results[i]);
          pendingCountRef.current -= 1;
        });
      });
    } catch (error) {
      console.error('Batch translation failed:', error);
      // Still decrement and resolve with original text on error
      pending.forEach(([text, resolvers]) => {
        resolvers.forEach(resolve => {
          resolve(text);
          pendingCountRef.current -= 1;
        });
      });
    }
    
    // Check if all translations are complete
    checkTransitionComplete();
  }, [translate, checkTransitionComplete]);

  // Queue translation with batching and debouncing
  const queueTranslation = useCallback((text: string): Promise<string> => {
    return new Promise((resolve) => {
      const lang = currentLanguageRef.current;
      
      // If English, resolve immediately
      if (lang === 'en') {
        resolve(text);
        return;
      }
      
      // Normalize text for consistent cache lookup
      const normalized = normalizeText(text);
      const cacheKey = `${lang}:${normalized}`;
      
      // If already cached, resolve immediately
      if (translationCacheRef.current[cacheKey]) {
        resolve(translationCacheRef.current[cacheKey]);
        return;
      }
      
      // Track pending count
      pendingCountRef.current += 1;
      
      // Add to pending queue (use normalized text)
      const existing = pendingTranslationsRef.current.get(normalized);
      if (existing) {
        existing.push(resolve);
      } else {
        pendingTranslationsRef.current.set(normalized, [resolve]);
      }
      
      // Debounce: wait 10ms to collect all pending texts, then batch translate
      if (batchTimeoutRef.current) {
        clearTimeout(batchTimeoutRef.current);
      }
      batchTimeoutRef.current = window.setTimeout(processBatch, 10);
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
      isLanguageTransitioning,
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
