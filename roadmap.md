# Seven blog-to-service-page conversion
- [x] Inspect the supplied brief, service templates, routes, database rows, sitemap, redirects, and live-versus-preview differences.
- [x] Build seven lossless service pages with the existing site shell, stock images, metadata, service breadcrumbs, and 10 FAQs each.
- [x] Add service discovery links, sitemap entries, and permanent redirects from the seven legacy blog URLs.
- [x] Validate all supplied copy, metadata, schemas, routes, FAQs, redirects, and desktop/mobile rendering.
- [x] Assess scoped publishing. Publishing is full-project only. The earlier raw-HTML pricing difference was not a hydrated visible difference: live and preview pricing main content is identical at 6,403 characters and both include the ROI calculator. The unpublished lockfile commit 594b73d remains outside the conversion.
- [ ] After the service pages are live, unpublish only the seven source blog rows and verify blog/related-post removal without deleting source records. Blocked because no route-scoped publish is available and the live replacement URLs are still 404; all seven source rows intentionally remain published.

# Scoped production-baseline snapshot
- [x] Preserve the full current preview on branch preserve/full-preview-2026-11-19 at commit 1a2099bde9e625aa5717556a648e943076c37d57, including the ROI calculator and lockfile 2.27.1.
- [ ] Establish the exact live deployment commit. Blocked: deployment metadata exposes no source SHA, and CLI build status exposes only the preview SHA. Candidate 010786b594752dc70c26a815243b30a3c104b91d is the last commit before the recorded publish and has lockfile 2.26.5, but it is not proven to be the live baseline.
- [x] Prepare named branch scoped/seven-service-migration-2026-11-19 at commit 3e59142f0c6a13a2610c93b629977a5a04510226, whose parent is candidate 010786b. Its 15-file diff excludes pricing, ROI, package, and lockfile changes. Main remains on the full preview.
- [ ] Verify exact production parity. Scoped candidate parity is established by git diff, sitemap adds exactly seven URLs and removes none, and five tests pass. Exact live parity remains unclaimed because the live baseline SHA is unavailable. Hosted checks for 3e59142 return no recorded checks; the full preview automatic build is OK. Do not publish.
