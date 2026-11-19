# Seven blog-to-service-page conversion
- [x] Inspect the supplied brief, service templates, routes, database rows, sitemap, redirects, and live-versus-preview differences.
- [x] Build seven lossless service pages with the existing site shell, stock images, metadata, service breadcrumbs, and 10 FAQs each.
- [x] Add service discovery links, sitemap entries, and permanent redirects from the seven legacy blog URLs.
- [x] Validate all supplied copy, metadata, schemas, routes, FAQs, redirects, and desktop/mobile rendering.
- [x] Assess scoped publishing. Blocked: publishing is full-project only. Live /pricing is the older static pricing page, while preview adds the unrelated interactive ROI calculator; the unpublished lockfile commit 594b73d also changes @lovable.dev/vite-tanstack-config from 2.26.5 to 2.27.1. Neither unrelated change may be released by this conversion.
- [ ] After the service pages are live, unpublish only the seven source blog rows and verify blog/related-post removal without deleting source records. Blocked because no route-scoped publish is available and the live replacement URLs are still 404; all seven source rows intentionally remain published.

# Scoped production-baseline snapshot
- [ ] Preserve the full current preview, including the ROI calculator and lockfile work, on a named recoverable branch and commit.
- [ ] Establish the exact live pricing and dependency-lock baseline from deployment and git evidence; do not infer or reconstruct it.
- [ ] Prepare an isolated conversion-only snapshot on the verified production baseline without switching the current branch or losing pending work.
- [ ] Verify build status and production parity outside the seven service paths, intended service links/sitemap, and legacy redirects. Do not publish.
