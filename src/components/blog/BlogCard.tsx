import { Link } from "react-router-dom";
import { Calendar, ArrowRight, TrendingUp, MoveRight } from "lucide-react";
import { format } from "date-fns";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

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
    '3PL-LOGISTICS': 'hsl(180,60%,45%)',
    'AMAZON FBA': 'hsl(var(--blog-orange))',
    'FULFILLMENT': 'hsl(220,70%,45%)',
    '3PL & FULFILLMENT': 'hsl(220,70%,50%)',
    'PREP CENTER GUIDE': 'hsl(320,65%,55%)',
    'SHOPIFY': 'hsl(150,55%,55%)',
  };
  const key = category?.toUpperCase().replace(/\s+/g, '-');
  return colors[key as keyof typeof colors] || 'hsl(215,20%,45%)';
};

const getCategoryIcon = (category?: string) => {
  const icons = {
    '3PL-LOGISTICS': '🏢',
    'AMAZON FBA': '📦',
    'FULFILLMENT': '🚚',
    '3PL & FULFILLMENT': '🏢',
    'PREP CENTER GUIDE': '📊',
    'SHOPIFY': '🛍️',
  };
  const key = category?.toUpperCase().replace(/\s+/g, '-');
  return icons[key as keyof typeof icons] || '📄';
};

const extractNumber = (title: string): string | null => {
  const match = title.match(/\b(\d+)\b/);
  return match ? match[1] : null;
};

const getPattern = (variant?: string) => {
  switch (variant) {
    case 'accent-border':
      return `radial-gradient(circle at 2px 2px, rgba(255,255,255,0.1) 1px, transparent 0)`;
    case 'side-accent':
      return `repeating-linear-gradient(
        -45deg,
        transparent,
        transparent 15px,
        rgba(255,255,255,0.05) 15px,
        rgba(255,255,255,0.05) 30px
      )`;
    default:
      return `repeating-linear-gradient(
        45deg,
        transparent,
        transparent 10px,
        rgba(255,255,255,0.1) 10px,
        rgba(255,255,255,0.1) 20px
      )`;
  }
};

const getInitials = (name?: string) => {
  if (!name) return 'WP';
  return name.split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

export const BlogCard = ({
  id,
  title,
  slug,
  excerpt,
  publishedAt,
  category,
  authorName,
  isFeatured = false,
  variant = 'standard',
}: BlogCardProps) => {
  const gradient = getCategoryGradient(category);
  const categoryColor = getCategoryColor(category);
  const categoryIcon = getCategoryIcon(category);
  const titleNumber = extractNumber(title);
  
  // Featured post gets hero treatment
  if (isFeatured) {
    return (
      <Link
        to={`/blog/${slug}`}
        className="group relative block bg-white rounded-3xl overflow-hidden
          shadow-2xl hover:shadow-[0_25px_80px_-15px_rgba(0,0,0,0.3)]
          transition-all duration-700 ease-out
          hover:-translate-y-3
          border-2 border-[hsl(var(--border))]"
      >
        {/* Background pattern overlay */}
        <div className="absolute inset-0 opacity-[0.02]" style={{
          backgroundImage: `repeating-linear-gradient(
            0deg,
            transparent,
            transparent 2px,
            rgba(0,0,0,0.03) 2px,
            rgba(0,0,0,0.03) 4px
          )`
        }} />
        
        {/* Thick left accent border */}
        <div 
          className="absolute left-0 top-0 bottom-0 w-2 transition-all duration-700 group-hover:w-3"
          style={{ background: `linear-gradient(to bottom, ${categoryColor}, transparent)` }}
        />
        
        {/* Animated gradient glow */}
        <div className="absolute inset-0 bg-gradient-to-br from-[hsl(var(--blog-orange))]/0 via-[hsl(var(--blog-navy))]/0 to-[hsl(var(--blog-orange))]/0 group-hover:from-[hsl(var(--blog-orange))]/5 group-hover:via-[hsl(var(--blog-navy))]/5 group-hover:to-[hsl(var(--blog-orange))]/5 transition-all duration-700 pointer-events-none" />
        
        <div className="relative grid md:grid-cols-2 gap-0">
          {/* Left: Gradient Header */}
          <div className={`relative h-64 md:h-full bg-gradient-to-br ${gradient} overflow-hidden`}>
            {/* Geometric Pattern */}
            <div className="absolute inset-0 opacity-10" style={{
              backgroundImage: getPattern('standard')
            }} />
            
            {/* Large decorative corner */}
            <div className="absolute top-0 right-0 w-48 h-48 opacity-20">
              <div className="absolute inset-0 bg-white rounded-bl-[100px]" />
            </div>
            
            {/* Category icon - large and centered */}
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-9xl opacity-20 group-hover:scale-110 transition-transform duration-700">
                {categoryIcon}
              </span>
            </div>
            
            {/* Prominent Featured Badge */}
            <div className="absolute top-8 left-8">
              <div className="backdrop-blur-md bg-white/30 text-white px-6 py-3 rounded-full border-2 border-white/50 shadow-2xl">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 animate-pulse" />
                  <span className="text-sm font-black uppercase tracking-widest">Featured Article</span>
                </div>
              </div>
            </div>
            
            {/* Category badge */}
            {category && (
              <div className="absolute bottom-8 left-8 backdrop-blur-md bg-white/20 text-white px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider border border-white/30">
                {category}
              </div>
            )}
          </div>
          
          {/* Right: Content */}
          <div className="relative p-12 bg-white flex flex-col justify-between">
            {/* Title and meta */}
            <div>
              <h2 className="font-black text-5xl lg:text-6xl text-[hsl(var(--blog-navy))] mb-6 leading-[1.1] transition-colors duration-300 group-hover:text-[hsl(var(--blog-orange))]">
                {title}
              </h2>
              
              {/* Meta Info */}
              <div className="flex items-center gap-3 mb-6">
                {authorName && (
                  <>
                    <Avatar className="h-10 w-10 border-2 border-[hsl(var(--blog-orange))]">
                      <AvatarFallback className="bg-gradient-to-br from-[hsl(var(--blog-orange))] to-[hsl(var(--blog-navy))] text-white text-sm font-bold">
                        {getInitials(authorName)}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-[hsl(var(--blog-navy))] font-bold text-base">{authorName}</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-[hsl(var(--blog-gray-blue))]" />
                  </>
                )}
                <span className="flex items-center gap-2 text-[hsl(var(--blog-gray-blue))] text-base">
                  <Calendar className="w-4 h-4" />
                  {format(new Date(publishedAt), "MMM d, yyyy")}
                </span>
              </div>
              
              {/* Excerpt */}
              <p className="text-[hsl(var(--blog-gray-blue))] leading-relaxed text-lg mb-8 line-clamp-3">
                {excerpt}
              </p>
            </div>
            
            {/* Large CTA Button */}
            <Button 
              asChild
              size="lg"
              className="w-full md:w-auto bg-gradient-to-r from-[hsl(var(--blog-orange))] to-[hsl(var(--blog-navy))] hover:from-[hsl(var(--blog-navy))] hover:to-[hsl(var(--blog-orange))] text-white font-bold text-base shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <span className="flex items-center justify-center gap-3">
                Read Full Article
                <MoveRight className="w-6 h-6 transition-all duration-300 group-hover:translate-x-2" />
              </span>
            </Button>
          </div>
        </div>
      </Link>
    );
  }
  
  // Regular posts with variant styles
  const variantClasses = {
    'standard': '',
    'accent-border': 'border-t-4',
    'side-accent': 'border-l-6',
  };
  
  return (
    <Link
      to={`/blog/${slug}`}
      className={`group relative block bg-white rounded-2xl overflow-hidden
        shadow-xl hover:shadow-2xl
        transition-all duration-500 ease-out
        hover:-translate-y-6 hover:scale-[1.01]
        border border-[hsl(var(--border))]
        min-h-[420px]
        ${variantClasses[variant]}
        ${variant === 'accent-border' ? 'shadow-[0_4px_0_0_' + categoryColor + ']' : ''}
        ${variant === 'side-accent' ? 'shadow-[-6px_0_0_0_' + categoryColor + ']' : ''}
      `}
      style={variant === 'accent-border' ? { borderTopColor: categoryColor } : 
             variant === 'side-accent' ? { borderLeftColor: categoryColor } : {}}
    >
      {/* Animated gradient border on hover */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[hsl(var(--blog-orange))] via-[hsl(var(--blog-navy))] to-[hsl(var(--blog-orange))] opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-500 pointer-events-none -z-10" />
      
      {/* Number badge for list-style posts */}
      {titleNumber && variant === 'accent-border' && (
        <div 
          className="absolute -top-4 -right-4 w-20 h-20 rounded-full flex items-center justify-center text-white text-3xl font-black shadow-2xl z-10 group-hover:scale-110 transition-transform duration-300"
          style={{ background: `linear-gradient(135deg, ${categoryColor}, ${categoryColor}dd)` }}
        >
          {titleNumber}
        </div>
      )}
      
      {/* Gradient Header with Geometric Pattern */}
      <div className={`relative h-32 bg-gradient-to-br ${gradient} overflow-hidden transition-all duration-700 group-hover:h-36`}>
        {/* Geometric Pattern Overlay */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: getPattern(variant),
            backgroundSize: variant === 'accent-border' ? '20px 20px' : 'auto'
          }} />
        </div>
        
        {/* Decorative Corner Accent */}
        <div className="absolute top-0 right-0 w-32 h-32 opacity-20">
          <div className="absolute inset-0 bg-white rounded-bl-full" />
        </div>
        
        {/* Category Icon - large in center */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-6xl opacity-20 group-hover:scale-110 group-hover:rotate-12 transition-all duration-500">
            {categoryIcon}
          </span>
        </div>
        
        {/* Category Badge */}
        {category && (
          <div className={`absolute ${variant === 'side-accent' ? 'top-1/2 -right-12 -rotate-90' : 'top-4 left-6'} backdrop-blur-md bg-white/20 text-white px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider shadow-lg border border-white/30`}>
            {category}
          </div>
        )}
      </div>
      
      {/* Content Area with Enhanced Typography */}
      <div className="relative p-8 bg-white flex flex-col min-h-[320px]">
        {/* Decorative Top Border */}
        <div className="absolute top-0 left-8 right-8 h-1 bg-gradient-to-r from-transparent via-[hsl(var(--blog-orange))] to-transparent transform -translate-y-full scale-x-0 group-hover:scale-x-110 transition-transform duration-500 origin-left" />
        
        {/* Title */}
        <h3 className="font-extrabold text-[hsl(var(--blog-navy))] mb-4 line-clamp-2 transition-colors duration-300 group-hover:text-[hsl(var(--blog-orange))] leading-tight text-2xl lg:text-3xl">
          {title}
        </h3>
        
        {/* Meta Info with Avatar */}
        <div className="flex items-center gap-3 mb-5">
          {authorName && (
            <>
              <Avatar className="h-8 w-8 border-2 border-[hsl(var(--blog-orange))]">
                <AvatarFallback className="bg-gradient-to-br from-[hsl(var(--blog-orange))] to-[hsl(var(--blog-navy))] text-white text-xs font-bold">
                  {getInitials(authorName)}
                </AvatarFallback>
              </Avatar>
              <span className="text-[hsl(var(--blog-navy))] font-semibold text-sm">{authorName}</span>
              <span className="w-1 h-1 rounded-full bg-[hsl(var(--blog-gray-blue))]" />
            </>
          )}
          <span className="flex items-center gap-1.5 text-[hsl(var(--blog-gray-blue))] text-sm">
            <Calendar className="w-3.5 h-3.5" />
            {format(new Date(publishedAt), "MMM d, yyyy")}
          </span>
        </div>
        
        {/* Excerpt */}
        <p className="text-[hsl(var(--blog-gray-blue))] leading-relaxed mb-6 flex-grow text-sm line-clamp-3">
          {excerpt}
        </p>
        
        {/* Read More CTA */}
        <div className="flex items-center gap-2 text-[hsl(var(--blog-orange))] font-bold text-sm uppercase tracking-wide mt-auto">
          <span className="relative">
            Read Full Article
            <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[hsl(var(--blog-orange))] scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
          </span>
          <ArrowRight className="w-5 h-5 transition-all duration-300 group-hover:translate-x-2 group-hover:scale-110" />
        </div>
      </div>
    </Link>
  );
};
