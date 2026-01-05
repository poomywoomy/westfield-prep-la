import { useLanguage } from '@/contexts/LanguageContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Globe, Check } from 'lucide-react';

interface LanguageSwitcherProps {
  variant?: 'default' | 'compact';
  className?: string;
}

export function LanguageSwitcher({ variant = 'default', className = '' }: LanguageSwitcherProps) {
  const { currentLanguage, setLanguage, supportedLanguages, isDetecting } = useLanguage();

  const currentLang = supportedLanguages.find(l => l.code === currentLanguage);

  if (supportedLanguages.length <= 1) {
    return null; // Don't show if only one language
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          size={variant === 'compact' ? 'sm' : 'default'}
          className={`gap-2 ${className}`}
          disabled={isDetecting}
        >
          {currentLang ? (
            <>
              <span className="text-base">{currentLang.flag_emoji}</span>
              {variant !== 'compact' && (
                <span className="hidden sm:inline">{currentLang.native_name}</span>
              )}
            </>
          ) : (
            <>
              <Globe className="h-4 w-4" />
              {variant !== 'compact' && <span>Language</span>}
            </>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-[160px]">
        {supportedLanguages.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => setLanguage(lang.code)}
            className="flex items-center gap-2 cursor-pointer"
          >
            <span className="text-base">{lang.flag_emoji}</span>
            <span className="flex-1">{lang.native_name}</span>
            {currentLanguage === lang.code && (
              <Check className="h-4 w-4 text-primary" />
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
