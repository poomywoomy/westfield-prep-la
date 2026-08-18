import { createFileRoute } from "@tanstack/react-router";
import Blog from "@/pages/Blog";
import { blogPostsQueryOptions } from "@/lib/blogPostQuery";

export const Route = createFileRoute("/blog/")({
  component: Blog,
  loader: ({ context }) => context.queryClient.ensureQueryData(blogPostsQueryOptions()),
  head: () => ({
    meta: [
          {
                "title": "Prep Center Blog | E-Commerce Tips & Fulfillment Insights - Westfield"
          },
          {
                "name": "description",
                "content": "Expert insights from our Los Angeles prep center. Learn about Amazon FBA prep, Shopify fulfillment, and e-commerce logistics best practices."
          },
          {
                "property": "og:title",
                "content": "Prep Center Blog | E-Commerce Tips & Fulfillment Insights - Westfield"
          },
          {
                "property": "og:description",
                "content": "Expert insights from our Los Angeles prep center. Learn about Amazon FBA prep, Shopify fulfillment, and e-commerce logistics best practices."
          },
          {
                "property": "og:url",
                "content": "https://westfieldprepcenter.com/blog"
          },
          {
                "property": "og:type",
                "content": "website"
          },
          {
                "property": "og:image",
                "content": "https://storage.googleapis.com/gpt-engineer-file-uploads/bXqmPMMaXvQ7FVHXCE76ed3moJI3/social-images/social-1759478221094-Westfield_Prep_Center_Logo_Square.png"
          },
          {
                "name": "twitter:card",
                "content": "summary_large_image"
          },
          {
                "name": "twitter:title",
                "content": "Prep Center Blog | E-Commerce Tips & Fulfillment Insights - Westfield"
          },
          {
                "name": "twitter:description",
                "content": "Expert insights from our Los Angeles prep center. Learn about Amazon FBA prep, Shopify fulfillment, and e-commerce logistics best practices."
          },
          {
                "name": "twitter:image",
                "content": "https://storage.googleapis.com/gpt-engineer-file-uploads/bXqmPMMaXvQ7FVHXCE76ed3moJI3/social-images/social-1759478221094-Westfield_Prep_Center_Logo_Square.png"
          }
    ],
    links: [
          {
                "rel": "canonical",
                "href": "https://westfieldprepcenter.com/blog"
          }
    ],
  }),
});
