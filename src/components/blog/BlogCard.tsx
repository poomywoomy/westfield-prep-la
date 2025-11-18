import { Link } from "react-router-dom";
import { Calendar, ArrowRight, TrendingUp, Clock } from "lucide-react";
import { format } from "date-fns";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface BlogCardProps {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  publishedAt: string;
  category?: string;
  authorName?: string;
  readTimeMinutes?: number;
  isFeatured?: boolean;
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
  readTimeMinutes,
  isFeatured = false,
}: BlogCardProps) => {
  const gradient = getCategoryGradient(category);
  return (
    <Link
      to={`/blog/${slug}`}
      className={`group relative block bg-white rounded-2xl overflow-hidden
        shadow-xl hover:shadow-2xl
        transition-all duration-500 ease-out
        hover:-translate-y-6 hover:scale-[1.01]
        border border-[hsl(var(--border))]
        ${isFeatured ? "md:col-span-2 min-h-[500px]" : "min-h-[400px]"}
      `}
    >
      {/* Animated gradient border on hover */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[hsl(var(--blog-orange))] via-[hsl(var(--blog-navy))] to-[hsl(var(--blog-orange))] opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-500 pointer-events-none -z-10" />
      
      {/* Gradient Header with Geometric Pattern */}
      <div className={`relative h-32 bg-gradient-to-br ${gradient} overflow-hidden`}>
        {/* Geometric Pattern Overlay */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `repeating-linear-gradient(
              45deg,
              transparent,
              transparent 10px,
              rgba(255,255,255,0.1) 10px,
              rgba(255,255,255,0.1) 20px
            )`
          }} />
        </div>
        
        {/* Decorative Corner Accent */}
        <div className="absolute top-0 right-0 w-32 h-32 opacity-20">
          <div className="absolute inset-0 bg-white rounded-bl-full" />
        </div>
        
        {/* Category Badge */}
        {category && (
          <div className="absolute top-4 left-6 backdrop-blur-md bg-white/20 text-white px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider shadow-lg border border-white/30">
            {category}
          </div>
        )}
        
        {/* Featured Badge */}
        {isFeatured && (
          <div className="absolute top-4 right-6 backdrop-blur-md bg-white/20 text-white px-4 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 shadow-lg border border-white/30">
            <TrendingUp className="w-3.5 h-3.5" />
            FEATURED
          </div>
        )}
      </div>
      
      {/* Content Area with Enhanced Typography */}
      <div className="relative p-8 bg-white flex flex-col h-[calc(100%-8rem)]">
        {/* Decorative Top Border */}
        <div className="absolute top-0 left-8 right-8 h-1 bg-gradient-to-r from-transparent via-[hsl(var(--blog-orange))] to-transparent transform -translate-y-full group-hover:scale-x-110 transition-transform duration-300" />
        
        {/* Title */}
        <h3 className={`font-extrabold text-[hsl(var(--blog-navy))] mb-4 line-clamp-2 transition-colors duration-300 group-hover:text-[hsl(var(--blog-orange))] leading-tight ${isFeatured ? "text-4xl lg:text-5xl" : "text-2xl lg:text-3xl"}`}>
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
          {readTimeMinutes && (
            <>
              <span className="w-1 h-1 rounded-full bg-[hsl(var(--blog-gray-blue))]" />
              <span className="flex items-center gap-1.5 text-[hsl(var(--blog-gray-blue))] text-sm">
                <Clock className="w-3.5 h-3.5" />
                {readTimeMinutes} min read
              </span>
            </>
          )}
        </div>
        
        {/* Excerpt */}
        <p className={`text-[hsl(var(--blog-gray-blue))] leading-relaxed mb-6 flex-grow ${isFeatured ? "text-base line-clamp-4" : "text-sm line-clamp-3"}`}>
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
