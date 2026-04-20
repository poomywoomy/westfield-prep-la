

## Plan: Auto-Update Homepage Blog Preview with Latest 3 Posts

### Goal
Replace the hardcoded 3 articles in `BlogPreview.tsx` with a live query that pulls the **3 most recently published blog posts** from the database, including their real cover images. Whenever you publish a new post in the admin Blog Editor, the homepage section refreshes automatically — no code change needed.

### What changes

**`src/components/BlogPreview.tsx`** — full rewrite of the data layer (UI/layout stays identical):

1. Use `@tanstack/react-query` (already in the project) to fetch the latest 3 posts:
   ```ts
   supabase
     .from("blog_posts")
     .select("id, title, slug, excerpt, category, cover_image_url, published_at")
     .eq("published", true)
     .order("published_at", { ascending: false })
     .limit(3)
   ```
2. Replace the placeholder 📦 emoji block with the real `cover_image_url`:
   - If `cover_image_url` exists → render `<img>` with `loading="lazy"`, alt = post title.
   - If missing → keep the existing gradient + 📦 fallback so the layout never breaks.
3. Render states:
   - **Loading:** 3 skeleton cards (uses existing `Skeleton` UI component) so the section doesn't pop in empty.
   - **Empty (no published posts yet):** hide the section entirely (return `null`) — avoids showing an awkward blank grid.
   - **Loaded:** map the 3 posts into the existing card markup (Badge → Title → Excerpt → Read More arrow).
4. Keep the section header, container, grid, hover/animation classes, and `TranslatedText` wrappers exactly as they are.
5. Remove the hardcoded `articles` array.

### Auto-update behavior
- React Query cache: `staleTime: 5 minutes`. Visitors landing on the homepage after a new post is published will see it within 5 minutes (or immediately on a hard refresh).
- No webhook or manual trigger needed — every page load re-checks the database when the cache expires.

### Out of scope
- No DB schema changes (table already has everything we need).
- No changes to the admin blog editor or the `/blog` listing page.
- No changes to the `Index.tsx` lazy-load wrapper.

### Files affected
- **Edit:** `src/components/BlogPreview.tsx` (only file touched)

