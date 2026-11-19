# Seven blog-to-service-page conversion
- [x] Inspect the supplied brief, service templates, routes, database rows, sitemap, redirects, and live-versus-preview differences.
- [x] Build seven lossless service pages with the existing site shell, stock images, metadata, service breadcrumbs, and 10 FAQs each.
- [x] Add service discovery links, sitemap entries, and permanent redirects from the seven legacy blog URLs.
- [x] Validate all supplied copy, metadata, schemas, routes, FAQs, redirects, and desktop/mobile rendering.
- [x] Assess scoped publishing. Blocked: publishing is full-project only, while the pre-existing bun.lock change from @lovable.dev/vite-tanstack-config 2.26.5 to 2.27.1 is outside the authorized scope and must not be released by this conversion.
- [ ] After the service pages are live, unpublish only the seven source blog rows and verify blog/related-post removal without deleting source records. Blocked by the scoped-publish safeguard; all seven source rows intentionally remain published.
