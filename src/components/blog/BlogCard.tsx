import { Link } from "react-router-dom";
import { Calendar, Clock, ArrowRight, TrendingUp } from "lucide-react";
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
      className={`group block bg-white border-2 border-[hsl(var(--blog-navy))] rounded-lg overflow-hidden
        transition-all duration-300 hover:shadow-[var(--blog-shadow-glow)] hover:-translate-y-2
        ${isFeatured ? "col-span-1 md:col-span-2 row-span-2" : ""}
      `}
    >
      {/* Orange accent line */}
      <div className="h-1 bg-[hsl(var(--blog-orange))]" />
      
      {/* Cover Image */}
      <div className="relative aspect-video overflow-hidden">
        {coverImageUrl ? (
          <img
            src={coverImageUrl}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
          />
        ) : (
          <div className="w-full h-full bg-[hsl(var(--blog-muted-bg))] flex items-center justify-center">
            <span className="text-[hsl(var(--blog-gray-blue))]">No image</span>
          </div>
        )}
        
        {/* Diagonal gradient overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-br from-[hsl(var(--blog-navy)/0)] via-[hsl(var(--blog-orange)/0)] to-[hsl(var(--blog-orange)/0)]
          group-hover:from-[hsl(var(--blog-navy)/0.4)] group-hover:via-[hsl(var(--blog-orange)/0.2)] group-hover:to-[hsl(var(--blog-orange)/0.6)]
          transition-all duration-300"
        />
        
        {/* Category badge */}
        {category && (
          <div className="absolute top-4 left-4 bg-[hsl(var(--blog-orange))] text-white px-3 py-1 rounded-full text-sm font-semibold">
            {category}
          </div>
        )}
        
        {/* Featured badge */}
        {isFeatured && (
          <div className="absolute top-4 right-4 bg-[hsl(var(--blog-navy))] text-white px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1">
            <TrendingUp className="w-4 h-4" />
            FEATURED
          </div>
        )}
      </div>
      
      {/* Content */}
      <div className="p-6">
        <h3 className={`font-bold text-[hsl(var(--blog-navy))] mb-3 line-clamp-2 ${isFeatured ? "text-3xl" : "text-xl"}`}>
          {title}
        </h3>
        
        {/* Meta info */}
        <div className="flex items-center gap-3 text-sm text-[hsl(var(--blog-gray-blue))] mb-3">
          {authorName && (
            <>
              <span className="text-[hsl(var(--blog-orange))] font-semibold">{authorName}</span>
              <span className="w-1 h-1 rounded-full bg-[hsl(var(--blog-orange))]" />
            </>
          )}
          <span className="flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            {format(new Date(publishedAt), "MMM d, yyyy")}
          </span>
          {readTimeMinutes && (
            <>
              <span className="w-1 h-1 rounded-full bg-[hsl(var(--blog-orange))]" />
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {readTimeMinutes} min read
              </span>
            </>
          )}
        </div>
        
        {/* Excerpt */}
        <p className={`text-[hsl(var(--blog-gray-blue))] mb-4 ${isFeatured ? "text-base line-clamp-4" : "text-sm line-clamp-3"}`}>
          {excerpt}
        </p>
        
        {/* Read More button */}
        <div className="flex items-center gap-2 text-[hsl(var(--blog-orange))] font-semibold group-hover:gap-3 transition-all">
          Read More
          <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
        </div>
      </div>
    </Link>
  );
};
