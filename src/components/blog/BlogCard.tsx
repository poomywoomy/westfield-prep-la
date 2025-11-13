import { Link } from "react-router-dom";
import { Calendar, ArrowRight, TrendingUp } from "lucide-react";
import { format } from "date-fns";

interface BlogCardProps {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  coverImageUrl?: string;
  publishedAt: string;
  category?: string;
  authorName?: string;
  readTimeMinutes?: number;
  isFeatured?: boolean;
}

export const BlogCard = ({
  id,
  title,
  slug,
  excerpt,
  coverImageUrl,
  publishedAt,
  category,
  authorName,
  readTimeMinutes,
  isFeatured = false,
}: BlogCardProps) => {
  return (
    <Link
      to={`/blog/${slug}`}
      className={`group relative block bg-white rounded-2xl overflow-hidden
        shadow-lg hover:shadow-2xl
        transition-all duration-500 ease-out
        hover:-translate-y-3 hover:scale-[1.02]
        before:absolute before:inset-0 before:rounded-2xl before:border-2 before:border-[hsl(var(--blog-orange))]
        before:opacity-0 before:transition-opacity before:duration-300 hover:before:opacity-100
        before:animate-pulse before:pointer-events-none
        ${isFeatured ? "col-span-1 md:col-span-2 row-span-2" : ""}
      `}
    >
      {/* Animated gradient border on hover */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[hsl(var(--blog-orange))] via-[hsl(var(--blog-navy))] to-[hsl(var(--blog-orange))] opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-500 pointer-events-none" />
      
      {/* Cover Image */}
      <div className="relative aspect-video overflow-hidden">
        {coverImageUrl ? (
          <img
            src={coverImageUrl}
            alt={title}
            className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110 group-hover:rotate-1"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-[hsl(var(--blog-muted-bg))] to-[hsl(var(--blog-light-blue))] flex items-center justify-center">
            <span className="text-[hsl(var(--blog-gray-blue))]">No image</span>
          </div>
        )}
        
        {/* Sophisticated gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500" />
        
        {/* Category badge with glassmorphism */}
        {category && (
          <div className="absolute top-4 left-4 backdrop-blur-md bg-[hsl(var(--blog-orange))]/90 text-white px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider shadow-lg border border-white/20">
            {category}
          </div>
        )}
        
        {/* Featured badge with animation */}
        {isFeatured && (
          <div className="absolute top-4 right-4 backdrop-blur-md bg-[hsl(var(--blog-navy))]/90 text-white px-4 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 shadow-lg border border-white/20 animate-pulse">
            <TrendingUp className="w-3.5 h-3.5" />
            FEATURED
          </div>
        )}

        {/* Bottom gradient for text readability */}
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white via-white/50 to-transparent" />
      </div>
      
      {/* Content with enhanced spacing */}
      <div className="relative p-6 bg-white">
        {/* Orange accent bar */}
        <div className="absolute top-0 left-6 right-6 h-1 bg-gradient-to-r from-transparent via-[hsl(var(--blog-orange))] to-transparent transform -translate-y-full group-hover:scale-x-110 transition-transform duration-300" />
        
        <h3 className={`font-extrabold text-[hsl(var(--blog-navy))] mb-4 line-clamp-2 transition-colors duration-300 group-hover:text-[hsl(var(--blog-orange))] ${isFeatured ? "text-3xl" : "text-xl"}`}>
          {title}
        </h3>
        
        {/* Meta info with better visual hierarchy */}
        <div className="flex items-center gap-2.5 text-xs text-[hsl(var(--blog-gray-blue))] mb-4 flex-wrap">
          {authorName && (
            <>
              <span className="text-[hsl(var(--blog-orange))] font-bold uppercase tracking-wide">{authorName}</span>
              <span className="w-1.5 h-1.5 rounded-full bg-[hsl(var(--blog-orange))]" />
            </>
          )}
          <span className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5" />
            {format(new Date(publishedAt), "MMM d, yyyy")}
          </span>
        </div>
        
        {/* Excerpt with better typography */}
        <p className={`text-[hsl(var(--blog-gray-blue))] leading-relaxed mb-5 ${isFeatured ? "text-base line-clamp-4" : "text-sm line-clamp-3"}`}>
          {excerpt}
        </p>
        
        {/* Enhanced Read More with animated arrow */}
        <div className="flex items-center gap-2 text-[hsl(var(--blog-orange))] font-bold text-sm uppercase tracking-wide">
          <span className="relative">
            Read More
            <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[hsl(var(--blog-orange))] scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
          </span>
          <ArrowRight className="w-5 h-5 transition-all duration-300 group-hover:translate-x-2 group-hover:scale-110" />
        </div>
      </div>
    </Link>
  );
};
