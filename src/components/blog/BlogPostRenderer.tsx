import { parseMarkdown } from "@/lib/markdownParser";

interface BlogPostRendererProps {
  content: string;
}

export const BlogPostRenderer = ({ content }: BlogPostRendererProps) => {
  // Convert markdown to HTML before rendering
  const htmlContent = parseMarkdown(content);
  
  // Add lazy loading to all images
  const enhancedHtml = htmlContent.replace(
    /<img /g,
    '<img loading="lazy" '
  );
  
  return (
    <div
      className="prose prose-lg max-w-none
        [&>h1]:text-[hsl(var(--blog-navy))] [&>h1]:font-bold [&>h1]:text-4xl [&>h1]:mb-6 [&>h1]:border-l-4 [&>h1]:border-[hsl(var(--blog-orange))] [&>h1]:pl-4
        [&>h2]:text-[hsl(var(--blog-navy))] [&>h2]:font-bold [&>h2]:text-3xl [&>h2]:mb-4 [&>h2]:mt-8 [&>h2]:border-l-4 [&>h2]:border-[hsl(var(--blog-orange))] [&>h2]:pl-4
        [&>h3]:text-[hsl(var(--blog-navy))] [&>h3]:font-bold [&>h3]:text-2xl [&>h3]:mb-3 [&>h3]:mt-6 [&>h3]:border-l-4 [&>h3]:border-[hsl(var(--blog-orange))] [&>h3]:pl-4
        [&>p]:text-[hsl(var(--blog-gray-blue))] [&>p]:text-lg [&>p]:leading-relaxed [&>p]:mb-4
        [&>strong]:text-[hsl(var(--blog-navy))] [&>strong]:font-semibold
        [&>em]:text-[hsl(var(--blog-gray-blue))] [&>em]:italic
        [&>a]:text-[hsl(var(--blog-orange))] [&>a]:no-underline [&>a]:hover:underline [&>a]:transition-all
        [&>blockquote]:bg-[hsl(var(--blog-light-blue))] [&>blockquote]:border-l-4 [&>blockquote]:border-[hsl(var(--blog-orange))] [&>blockquote]:pl-6 [&>blockquote]:py-4 [&>blockquote]:my-6 [&>blockquote]:italic [&>blockquote]:text-[hsl(var(--blog-navy))] [&>blockquote]:text-xl [&>blockquote]:rounded-r-lg
        [&>ul]:list-none [&>ul]:my-4
        [&>ul>li]:relative [&>ul>li]:pl-8 [&>ul>li]:mb-2
        [&>ul>li::before]:content-[''] [&>ul>li::before]:absolute [&>ul>li::before]:left-0 [&>ul>li::before]:top-[0.6em] [&>ul>li::before]:w-2 [&>ul>li::before]:h-2 [&>ul>li::before]:rounded-full [&>ul>li::before]:bg-[hsl(var(--blog-orange))]
        [&>ol]:list-none [&>ol]:counter-reset-[list] [&>ol]:my-4
        [&>ol>li]:relative [&>ol>li]:pl-8 [&>ol>li]:mb-2 [&>ol>li]:counter-increment-[list]
        [&>ol>li::before]:content-[counter(list)] [&>ol>li::before]:absolute [&>ol>li::before]:left-0 [&>ol>li::before]:top-0 [&>ol>li::before]:w-6 [&>ol>li::before]:h-6 [&>ol>li::before]:rounded-full [&>ol>li::before]:bg-[hsl(var(--blog-orange))] [&>ol>li::before]:text-white [&>ol>li::before]:text-sm [&>ol>li::before]:flex [&>ol>li::before]:items-center [&>ol>li::before]:justify-center
        [&>img]:rounded-lg [&>img]:shadow-md [&>img]:my-6 [&>img]:hover:shadow-[var(--blog-shadow-glow)] [&>img]:transition-shadow
        [&>pre]:bg-[hsl(var(--blog-navy))] [&>pre]:text-white [&>pre]:p-4 [&>pre]:rounded-lg [&>pre]:overflow-x-auto [&>pre]:my-6
        [&>pre>code]:text-white [&>pre>code]:bg-transparent
        [&>code]:bg-[hsl(var(--blog-navy))] [&>code]:text-[hsl(var(--blog-orange))] [&>code]:px-2 [&>code]:py-1 [&>code]:rounded
        [&>table]:w-full [&>table]:border-collapse [&>table]:my-6 [&>table]:rounded-lg [&>table]:overflow-hidden [&>table]:border-2 [&>table]:border-[hsl(var(--blog-navy))]
        [&>table>thead]:bg-[hsl(var(--blog-navy))] [&>table>thead]:text-white [&>table>thead]:border-b-4 [&>table>thead]:border-[hsl(var(--blog-orange))]
        [&>table>thead>tr>th]:p-4 [&>table>thead>tr>th]:text-left [&>table>thead>tr>th]:font-bold [&>table>thead>tr>th]:text-white [&>table>thead>tr>th]:uppercase [&>table>thead>tr>th]:tracking-wide
        [&>table>tbody>tr>td]:p-4 [&>table>tbody>tr>td]:border-t [&>table>tbody>tr>td]:border-gray-200 [&>table>tbody>tr>td]:text-[hsl(var(--blog-gray-blue))]
        [&>table>tbody>tr:nth-child(even)]:bg-[hsl(var(--blog-light-blue))]
        [&>table>tbody>tr]:transition-colors [&>table>tbody>tr:hover]:bg-[hsl(var(--blog-light-blue))]/80
        [&>details]:my-6 [&>details]:border [&>details]:border-[hsl(var(--blog-orange))]/30 [&>details]:rounded-lg [&>details]:overflow-hidden [&>details]:bg-white [&>details]:shadow-sm [&>details]:hover:shadow-md [&>details]:transition-shadow
        [&>details>summary]:bg-[hsl(var(--blog-light-blue))] [&>details>summary]:p-4 [&>details>summary]:cursor-pointer [&>details>summary]:font-semibold [&>details>summary]:text-[hsl(var(--blog-navy))] [&>details>summary]:flex [&>details>summary]:items-center [&>details>summary]:gap-2 [&>details>summary]:hover:bg-[hsl(var(--blog-orange))]/10 [&>details>summary]:transition-colors
        [&>details>summary::marker]:content-[''] [&>details>summary::-webkit-details-marker]:hidden
        [&>details>summary::before]:content-['▶'] [&>details>summary::before]:text-[hsl(var(--blog-orange))] [&>details>summary::before]:text-sm [&>details>summary::before]:transition-transform [&>details>summary::before]:inline-block
        [&>details[open]>summary::before]:rotate-90
        [&>details>summary~*]:p-4 [&>details>summary~*]:text-[hsl(var(--blog-gray-blue))]
        [&_hr]:border-[hsl(var(--blog-orange))]/20 [&_hr]:my-8
      "
      dangerouslySetInnerHTML={{ __html: enhancedHtml }}
    />
  );
};
