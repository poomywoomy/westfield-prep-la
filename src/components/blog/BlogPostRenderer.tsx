import { parseMarkdown } from "@/lib/markdownParser";
import DOMPurify from 'dompurify';

interface BlogPostRendererProps {
  content: string;
}

export const BlogPostRenderer = ({ content }: BlogPostRendererProps) => {
  // Content is already HTML, no need to parse markdown
  const htmlContent = content;
  
  // Add lazy loading to all images
  const htmlWithLazyLoad = htmlContent.replace(
    /<img /g,
    '<img loading="lazy" '
  );
  
  // Debug: Count links before sanitization
  const linksBeforeSanitize = (htmlWithLazyLoad.match(/<a\s+[^>]*href/gi) || []).length;
  console.log('🔗 Links BEFORE DOMPurify:', linksBeforeSanitize);
  
  // Sanitize HTML to prevent XSS attacks (defense-in-depth)
  const enhancedHtml = DOMPurify.sanitize(htmlWithLazyLoad, {
    ALLOWED_TAGS: [
      'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
      'p', 'a', 'ul', 'ol', 'li', 
      'code', 'pre', 'img', 'blockquote',
      'strong', 'em', 'br', 'hr',
      'table', 'thead', 'tbody', 'tr', 'th', 'td',
      'details', 'summary', 'div'
    ],
    ALLOWED_ATTR: ['href', 'src', 'alt', 'title', 'class', 'id', 'loading', 'open', 'target', 'rel'],
    ADD_ATTR: ['target', 'rel'], // Explicitly add these attributes
    KEEP_CONTENT: true, // Keep content even if tag is removed
    ALLOW_DATA_ATTR: false,
    RETURN_DOM: false, // Return string, not DOM
    RETURN_DOM_FRAGMENT: false
  });
  
  // Debug: Count links after sanitization
  const linksAfterSanitize = (enhancedHtml.match(/<a\s+[^>]*href/gi) || []).length;
  console.log('🔗 Links AFTER DOMPurify:', linksAfterSanitize);
  
  if (linksBeforeSanitize !== linksAfterSanitize) {
    console.warn('⚠️ DOMPurify removed', linksBeforeSanitize - linksAfterSanitize, 'links!');
  }
  
  // Post-process: Add blog-link class to all anchor tags
  const withStyledLinks = enhancedHtml.replace(
    /<a\s+([^>]*?)>/gi,
    (match, attributes) => {
      // Check if class attribute exists
      if (/class\s*=\s*["']([^"']*)["']/i.test(attributes)) {
        // Add blog-link to existing class
        return match.replace(
          /class\s*=\s*["']([^"']*)["']/i,
          (classMatch, existingClasses) => {
            const classes = existingClasses.trim();
            return classes.includes('blog-link') 
              ? classMatch 
              : `class="${classes} blog-link"`;
          }
        );
      } else {
        // Add new class attribute
        return `<a ${attributes} class="blog-link">`;
      }
    }
  );
  
  // Post-process: Ensure external links open in new tab with security attributes
  const finalHtml = withStyledLinks.replace(
    /<a\s+([^>]*?href\s*=\s*["'](https?:\/\/[^"']+)["'][^>]*?)>/gi,
    (match, attributes, href) => {
      // Check if it's an external link (not starting with / or #)
      const isExternal = /^https?:\/\//i.test(href);
      
      if (isExternal) {
        let updatedAttrs = attributes;
        
        // Add target="_blank" if not present
        if (!/target\s*=/i.test(updatedAttrs)) {
          updatedAttrs += ' target="_blank"';
        }
        
        // Add rel="noopener noreferrer" if not present
        if (!/rel\s*=/i.test(updatedAttrs)) {
          updatedAttrs += ' rel="noopener noreferrer"';
        } else if (!/noopener/i.test(updatedAttrs)) {
          updatedAttrs = updatedAttrs.replace(
            /rel\s*=\s*["']([^"']*)["']/i,
            (relMatch, relValue) => `rel="${relValue} noopener noreferrer"`
          );
        }
        
        return `<a ${updatedAttrs}>`;
      }
      
      return match;
    }
  );
  
  console.log('✅ Post-processed links with blog-link class');
  
  return (
    <div
      className="prose prose-lg max-w-none animate-fade-in
        [&>h1]:text-[hsl(var(--blog-navy))] [&>h1]:font-bold [&>h1]:text-4xl [&>h1]:mb-6 [&>h1]:mt-2 [&>h1]:border-l-4 [&>h1]:border-[hsl(var(--blog-orange))] [&>h1]:pl-4
        [&>h2]:text-[hsl(var(--blog-navy))] [&>h2]:font-bold [&>h2]:text-3xl [&>h2]:mb-4 [&>h2]:mt-10 [&>h2]:border-l-4 [&>h2]:border-[hsl(var(--blog-orange))] [&>h2]:pl-4
        [&>h3]:text-[hsl(var(--blog-navy))] [&>h3]:font-bold [&>h3]:text-2xl [&>h3]:mb-3 [&>h3]:mt-8 [&>h3]:border-l-4 [&>h3]:border-[hsl(var(--blog-orange))] [&>h3]:pl-4
        [&>p]:text-[hsl(var(--blog-gray-blue))] [&>p]:text-lg [&>p]:leading-relaxed [&>p]:mb-4
        [&>strong]:text-[hsl(var(--blog-navy))] [&>strong]:font-semibold
        [&>em]:text-[hsl(var(--blog-gray-blue))] [&>em]:italic
        [&_a]:text-[hsl(var(--blog-orange))] [&_a]:no-underline [&_a]:hover:underline [&_a]:transition-all
        [&>blockquote]:bg-[hsl(var(--blog-light-blue))] [&>blockquote]:border-l-4 [&>blockquote]:border-[hsl(var(--blog-orange))] [&>blockquote]:pl-6 [&>blockquote]:py-4 [&>blockquote]:my-6 [&>blockquote]:italic [&>blockquote]:text-[hsl(var(--blog-navy))] [&>blockquote]:text-xl [&>blockquote]:rounded-r-lg [&>blockquote]:shadow-sm [&>blockquote]:hover:shadow-md [&>blockquote]:transition-shadow
        [&>ul]:list-none [&>ul]:my-6 [&>ul]:space-y-3
        [&>ul>li]:relative [&>ul>li]:pl-8 [&>ul>li]:mb-3
        [&>ul>li::before]:content-[''] [&>ul>li::before]:absolute [&>ul>li::before]:left-0 [&>ul>li::before]:top-[0.65em] [&>ul>li::before]:w-2.5 [&>ul>li::before]:h-2.5 [&>ul>li::before]:rounded-full [&>ul>li::before]:bg-[hsl(var(--blog-orange))]
        [&>ol]:list-none [&>ol]:counter-reset-[list] [&>ol]:my-6 [&>ol]:space-y-3
        [&>ol>li]:relative [&>ol>li]:pl-10 [&>ol>li]:mb-3 [&>ol>li]:counter-increment-[list]
        [&>ol>li::before]:content-[counter(list)] [&>ol>li::before]:absolute [&>ol>li::before]:left-0 [&>ol>li::before]:top-0 [&>ol>li::before]:w-7 [&>ol>li::before]:h-7 [&>ol>li::before]:rounded-full [&>ol>li::before]:bg-[hsl(var(--blog-orange))] [&>ol>li::before]:text-white [&>ol>li::before]:text-sm [&>ol>li::before]:font-bold [&>ol>li::before]:flex [&>ol>li::before]:items-center [&>ol>li::before]:justify-center
        [&>img]:rounded-lg [&>img]:shadow-md [&>img]:my-6 [&>img]:hover:shadow-[0_12px_24px_hsla(28,100%,50%,0.25)] [&>img]:transition-shadow [&>img]:duration-300
        [&>pre]:bg-[hsl(var(--blog-navy))] [&>pre]:text-white [&>pre]:p-4 [&>pre]:rounded-lg [&>pre]:overflow-x-auto [&>pre]:my-6 [&>pre]:shadow-sm
        [&>pre>code]:text-white [&>pre>code]:bg-transparent
        [&>code]:bg-[hsl(var(--blog-navy))] [&>code]:text-[hsl(var(--blog-orange))] [&>code]:px-2 [&>code]:py-1 [&>code]:rounded [&>code]:text-sm
        [&>table]:w-full [&>table]:border-collapse [&>table]:my-8 [&>table]:rounded-lg [&>table]:overflow-hidden [&>table]:bg-white [&>table]:shadow-lg [&>table]:border-2 [&>table]:border-[hsl(var(--blog-navy))]
        [&>table>thead]:bg-[hsl(var(--blog-navy))] [&>table>thead]:text-white
        [&>table>thead>tr>th]:p-4 [&>table>thead>tr>th]:text-left [&>table>thead>tr>th]:font-bold [&>table>thead>tr>th]:text-white [&>table>thead>tr>th]:uppercase [&>table>thead>tr>th]:tracking-wider [&>table>thead>tr>th]:text-sm [&>table>thead>tr>th]:sticky [&>table>thead>tr>th]:top-0 [&>table>thead>tr>th]:z-10 [&>table>thead>tr>th]:bg-[hsl(var(--blog-navy))]
        [&>table>tbody>tr>td]:p-4 [&>table>tbody>tr>td]:border-t-2 [&>table>tbody>tr>td]:border-[hsl(var(--blog-navy))]/10 [&>table>tbody>tr>td]:text-[hsl(var(--blog-gray-blue))] [&>table>tbody>tr>td]:align-top
        [&>table>tbody>tr:nth-child(odd)]:bg-[hsl(var(--blog-light-blue))]
        [&>table>tbody>tr]:transition-colors [&>table>tbody>tr]:duration-200 [&>table>tbody>tr:hover]:bg-[hsl(var(--blog-light-blue))]/70
        [&>details]:my-6 [&>details]:border [&>details]:border-[hsl(var(--blog-orange))]/30 [&>details]:rounded-lg [&>details]:overflow-hidden [&>details]:bg-white [&>details]:shadow-sm [&>details]:hover:shadow-md [&>details]:transition-shadow
        [&>details>summary]:bg-[hsl(var(--blog-light-blue))] [&>details>summary]:p-4 [&>details>summary]:cursor-pointer [&>details>summary]:font-semibold [&>details>summary]:text-[hsl(var(--blog-navy))] [&>details>summary]:flex [&>details>summary]:items-center [&>details>summary]:gap-2 [&>details>summary]:hover:bg-[hsl(var(--blog-orange))]/10 [&>details>summary]:transition-colors
        [&>details>summary::marker]:content-[''] [&>details>summary::-webkit-details-marker]:hidden
        [&>details>summary::before]:content-['▶'] [&>details>summary::before]:text-[hsl(var(--blog-orange))] [&>details>summary::before]:text-sm [&>details>summary::before]:transition-transform [&>details>summary::before]:inline-block
        [&>details[open]>summary::before]:rotate-90
        [&>details>summary~*]:p-4 [&>details>summary~*]:text-[hsl(var(--blog-gray-blue))]
        [&_hr]:border-[hsl(var(--blog-orange))]/20 [&_hr]:my-8
      "
      dangerouslySetInnerHTML={{ __html: finalHtml }}
    />
  );
};
