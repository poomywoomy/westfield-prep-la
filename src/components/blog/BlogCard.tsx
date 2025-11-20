import { Link } from "react-router-dom";
import { Calendar, ArrowRight, TrendingUp, MoveRight } from "lucide-react";
import { format } from "date-fns";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { useState } from "react";

interface BlogCardProps {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  publishedAt: string;
  category?: string;
  authorName?: string;
  isFeatured?: boolean;
  variant?: 'standard' | 'accent-border' | 'side-accent';
  coverImageUrl?: string;
}

const getCategoryGradient = (category?: string) => {
  const gradients = {
    '3PL-LOGISTICS': 'from-[hsl(220,80%,20%)] via-[hsl(220,70%,35%)] to-[hsl(180,60%,45%)]',
    'AMAZON FBA': 'from-[hsl(var(--blog-orange))] via-[hsl(25,90%,55%)] to-[hsl(15,85%,60%)]',
    'FULFILLMENT': 'from-[hsl(var(--blog-navy))] via-[hsl(220,75%,30%)] to-[hsl(220,70%,45%)]',
    '3PL & FULFILLMENT': 'from-[hsl(240,75%,25%)] via-[hsl(260,65%,40%)] to-[hsl(220,70%,50%)]',
    'PREP CENTER GUIDE': 'from-[hsl(280,70%,25%)] via-[hsl(280,60%,45%)] to-[hsl(320,65%,55%)]',
    'SHOPIFY': 'from-[hsl(150,70%,25%)] via-[hsl(150,60%,40%)] to-[hsl(150,55%,55%)]',
  };
  const key = category?.toUpperCase().replace(/\s+/g, '-');
  return gradients[key as keyof typeof gradients] || 'from-[hsl(215,25%,20%)] via-[hsl(215,20%,35%)] to-[hsl(215,20%,45%)]';
};

const getCategoryColor = (category?: string) => {
  const colors = {
    '3PL-LOGISTICS': 'hsl(180,60%,45%)', 'AMAZON FBA': 'hsl(var(--blog-orange))', 'FULFILLMENT': 'hsl(220,70%,45%)',
    '3PL & FULFILLMENT': 'hsl(220,70%,50%)', 'PREP CENTER GUIDE': 'hsl(320,65%,55%)', 'SHOPIFY': 'hsl(150,55%,55%)',
  };
  return colors[category?.toUpperCase().replace(/\s+/g, '-') as keyof typeof colors] || 'hsl(215,20%,45%)';
};

const getCategoryIcon = (category?: string) => {
  const icons = { '3PL-LOGISTICS': '🏢', 'AMAZON FBA': '📦', 'FULFILLMENT': '🚚', '3PL & FULFILLMENT': '🏢', 'PREP CENTER GUIDE': '📊', 'SHOPIFY': '🛍️' };
  return icons[category?.toUpperCase().replace(/\s+/g, '-') as keyof typeof icons] || '📄';
};

const extractNumber = (title: string) => title.match(/\b(\d+)\b/)?.[1] || null;
const getInitials = (name?: string) => name ? name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : 'WP';

const getPattern = (variant?: string) => {
  if (variant === 'accent-border') return 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.1) 1px, transparent 0)';
  if (variant === 'side-accent') return 'repeating-linear-gradient(-45deg, transparent, transparent 15px, rgba(255,255,255,0.05) 15px, rgba(255,255,255,0.05) 30px)';
  return 'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,0.1) 10px, rgba(255,255,255,0.1) 20px)';
};

export const BlogCard = ({ id, title, slug, excerpt, publishedAt, category, authorName, isFeatured = false, variant = 'standard', coverImageUrl }: BlogCardProps) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const gradient = getCategoryGradient(category);
  const categoryColor = getCategoryColor(category);
  const categoryIcon = getCategoryIcon(category);
  const titleNumber = extractNumber(title);
  const effectiveImageUrl = imageError || !coverImageUrl ? undefined : coverImageUrl;
  
  // Conditional routing for pillar pages
  const linkPath = slug === 'shopify-3pl-los-angeles' ? `/shopify-3pl-los-angeles` : `/blog/${slug}`;
  
  if (isFeatured) {
    return (
      <Link to={linkPath} className="group relative block bg-white rounded-3xl overflow-hidden shadow-2xl hover:shadow-[0_25px_80px_-15px_rgba(0,0,0,0.3)] transition-all duration-700 ease-out hover:-translate-y-3 border-2 border-[hsl(var(--border))]">
        {effectiveImageUrl ? (
          <div className="relative h-[480px] overflow-hidden">
            <AspectRatio ratio={16/9} className="h-full">
              <img src={effectiveImageUrl} alt={`${title} - Westfield Prep Center blog cover image`} className={`h-full w-full object-cover transition-all duration-700 group-hover:scale-105 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`} loading="eager" onLoad={() => setImageLoaded(true)} onError={() => setImageError(true)} />
              {!imageLoaded && <div className="absolute inset-0 bg-gradient-to-br from-gray-200 to-gray-300 animate-pulse" />}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
              <div className="absolute inset-0 opacity-10 mix-blend-overlay" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.15) 1px, transparent 0)', backgroundSize: '4px 4px' }} />
            </AspectRatio>
            <div className="absolute top-6 left-6 z-10"><div className="backdrop-blur-md bg-white/10 text-white px-4 py-2 rounded-full border border-white/20 font-semibold text-xs uppercase tracking-wider shadow-lg" style={{ borderColor: categoryColor }}>{categoryIcon} {category}</div></div>
            <div className="absolute top-6 right-6 z-10"><div className="backdrop-blur-md bg-[hsl(var(--blog-orange))]/90 text-white px-4 py-2 rounded-full font-bold text-xs uppercase tracking-wider shadow-lg animate-pulse">⭐ Featured</div></div>
            <div className="absolute bottom-0 left-0 right-0 p-8 z-10">
              <div className="backdrop-blur-md bg-white/10 p-8 rounded-2xl border border-white/20 shadow-2xl max-w-3xl space-y-4">
                <h2 className="text-4xl font-bold text-white leading-tight group-hover:text-[hsl(var(--blog-orange))] transition-colors duration-300">{title}</h2>
                <p className="text-lg text-white/90 line-clamp-2">{excerpt}</p>
                <div className="flex items-center gap-4 text-white/80 text-sm">
                  <div className="flex items-center gap-2"><Avatar className="h-8 w-8 border-2 border-white/30"><AvatarFallback className="bg-white/20 text-white text-xs">{getInitials(authorName)}</AvatarFallback></Avatar><span className="font-medium">{authorName || 'Westfield Team'}</span></div>
                  <div className="flex items-center gap-1.5"><Calendar className="w-4 h-4" /><time>{format(new Date(publishedAt), "MMM dd, yyyy")}</time></div>
                </div>
                <Button variant="secondary" className="bg-white text-[hsl(var(--blog-navy))] hover:bg-[hsl(var(--blog-orange))] hover:text-white font-semibold group/btn">Read Full Article<ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover/btn:translate-x-1" /></Button>
              </div>
            </div>
          </div>
        ) : (
          <div className={`relative grid md:grid-cols-2 gap-0`}>
            <div className={`relative h-64 md:h-full bg-gradient-to-br ${gradient} overflow-hidden`}>
              <div className="absolute inset-0 opacity-10" style={{ backgroundImage: getPattern('standard') }} />
              <div className="absolute top-0 right-0 w-48 h-48 opacity-20"><div className="absolute inset-0 bg-white rounded-bl-[100px]" /></div>
              <div className="absolute inset-0 flex items-center justify-center"><span className="text-9xl opacity-20 group-hover:scale-110 transition-transform duration-700">{categoryIcon}</span></div>
              <div className="absolute top-8 left-8"><div className="backdrop-blur-md bg-white/30 text-white px-6 py-3 rounded-full border-2 border-white/50 shadow-2xl"><div className="flex items-center gap-2"><TrendingUp className="w-5 h-5 animate-pulse" /><span className="text-sm font-black uppercase tracking-widest">Featured Article</span></div></div></div>
              {category && <div className="absolute bottom-8 left-8 backdrop-blur-md bg-white/20 text-white px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider border border-white/30">{category}</div>}
            </div>
            <div className="relative p-12 bg-white flex flex-col justify-between">
              <div><h2 className="text-4xl font-bold text-[hsl(210,30%,12%)] mb-6 leading-tight group-hover:text-[hsl(var(--blog-orange))] transition-colors duration-300">{title}</h2><p className="text-lg text-[hsl(210,15%,35%)] mb-8 line-clamp-3">{excerpt}</p></div>
              <div className="space-y-6">
                <div className="flex items-center gap-4 text-sm text-[hsl(210,15%,35%)]"><div className="flex items-center gap-2"><Avatar className="h-10 w-10 border-2 border-[hsl(var(--border))]"><AvatarFallback className="bg-[hsl(210,20%,96%)] text-[hsl(210,30%,12%)] font-semibold">{getInitials(authorName)}</AvatarFallback></Avatar><span className="font-medium">{authorName || 'Westfield Team'}</span></div><div className="flex items-center gap-1.5"><Calendar className="w-4 h-4" /><time>{format(new Date(publishedAt), "MMM dd, yyyy")}</time></div></div>
                <Button className="w-full group/btn">Read Full Article<ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover/btn:translate-x-1" /></Button>
              </div>
            </div>
          </div>
        )}
      </Link>
    );
  }

  return (
    <Link to={linkPath} className="group relative block bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.25)] transition-all duration-500 ease-out hover:-translate-y-2 border border-[hsl(var(--border))]">
      {variant === 'accent-border' && <div className="absolute top-0 left-0 right-0 h-1 transition-all duration-300 group-hover:h-1.5 z-20" style={{ backgroundColor: categoryColor }} />}
      {variant === 'side-accent' && <div className="absolute top-0 left-0 bottom-0 w-1.5 bg-gradient-to-b transition-all duration-300 group-hover:w-2 z-20" style={{ backgroundImage: `linear-gradient(to bottom, ${categoryColor}, transparent)` }} />}
      {effectiveImageUrl ? (
        <div className="relative overflow-hidden">
          <AspectRatio ratio={4/3}>
            <img src={effectiveImageUrl} alt={`${title} - Westfield Prep Center blog cover image`} className={`h-full w-full object-cover transition-all duration-700 group-hover:scale-[1.04] ${imageLoaded ? 'opacity-100' : 'opacity-0'}`} loading="lazy" decoding="async" onLoad={() => setImageLoaded(true)} onError={() => setImageError(true)} />
            {!imageLoaded && <div className="absolute inset-0 bg-gradient-to-br from-gray-200 to-gray-300 animate-pulse" />}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
            <div className="absolute inset-0 opacity-10 mix-blend-overlay" style={{ backgroundImage: variant === 'side-accent' ? 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.15) 1px, transparent 0)' : 'repeating-linear-gradient(45deg, transparent, transparent 8px, rgba(255,255,255,0.1) 8px, rgba(255,255,255,0.1) 16px)', backgroundSize: variant === 'side-accent' ? '4px 4px' : 'auto' }} />
          </AspectRatio>
          <div className="absolute top-4 left-4 z-10"><div className="backdrop-blur-md bg-white/90 px-3 py-1.5 rounded-full border font-semibold text-xs uppercase tracking-wider shadow-lg" style={{ borderColor: categoryColor, color: categoryColor }}>{categoryIcon} {category}</div></div>
          {variant === 'accent-border' && titleNumber && <div className="absolute top-4 right-4 z-10"><div className="backdrop-blur-md bg-white/90 w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg shadow-lg" style={{ color: categoryColor }}>{titleNumber}</div></div>}
          {variant === 'accent-border' && <div className="absolute bottom-4 right-4 text-6xl opacity-20" style={{ filter: 'blur(1px)' }}>{categoryIcon}</div>}
        </div>
      ) : (
        <div className={`relative h-32 bg-gradient-to-br ${gradient} overflow-hidden`}>
          <div className="absolute inset-0 opacity-30" style={{ backgroundImage: getPattern(variant) }} />
          <div className="absolute top-4 left-4"><div className="backdrop-blur-md bg-white/10 text-white px-3 py-1.5 rounded-full border-2 font-semibold text-xs uppercase tracking-wider" style={{ borderColor: categoryColor }}>{categoryIcon} {category}</div></div>
          {variant === 'accent-border' && titleNumber && <div className="absolute top-4 right-4"><div className="bg-white/20 text-white w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg backdrop-blur-md">{titleNumber}</div></div>}
          {variant === 'accent-border' && <div className="absolute bottom-2 right-4 text-5xl opacity-20">{categoryIcon}</div>}
        </div>
      )}
      <div className="relative p-6 bg-white">
        <h3 className="text-xl font-bold text-[hsl(210,30%,12%)] mb-3 line-clamp-2 group-hover:text-[hsl(var(--blog-orange))] transition-colors duration-300">{title}</h3>
        <p className="text-[hsl(210,15%,35%)] mb-4 line-clamp-2 text-sm">{excerpt}</p>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-[hsl(210,15%,35%)]"><Avatar className="h-7 w-7 border border-[hsl(var(--border))]"><AvatarFallback className="bg-[hsl(210,20%,96%)] text-[hsl(210,30%,12%)] text-xs font-semibold">{getInitials(authorName)}</AvatarFallback></Avatar><div className="flex flex-col"><span className="font-medium">{authorName || 'Westfield Team'}</span><time className="text-xs">{format(new Date(publishedAt), "MMM dd, yyyy")}</time></div></div>
          <div className="flex items-center gap-1 text-[hsl(var(--blog-orange))] font-semibold text-sm relative after:content-[''] after:absolute after:w-full after:scale-x-0 after:h-0.5 after:bottom-0 after:left-0 after:bg-[hsl(var(--blog-orange))] after:origin-bottom-right after:transition-transform after:duration-300 group-hover:after:scale-x-100 group-hover:after:origin-bottom-left">Read Article<MoveRight className="w-4 h-4 transition-transform group-hover:translate-x-1" /></div>
        </div>
      </div>
    </Link>
  );
};
