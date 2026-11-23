# Continuity Ledger

## Snapshot
- 2026-11-23 [USER] Goal: open in-app sign-in modal instead of external Clerk redirect when clicking cart while signed out; bump header text size.
- 2026-11-23 [CODE] Now: guarded cart navigation in `Navbar.jsx`, `CatalogSidebar.jsx`, and `ProductPageClient.jsx` with `openSignIn({ fallbackRedirectUrl: '/cart' })` when `!user`; bumped header text sizes.
- 2026-11-23 [CODE] Next: user review.
- 2026-11-23 [TOOL] Receipts: 0 files > 300 LOC (max 245 LOC); `next build --webpack` 54/54 routes passed cleanly (exit code 0).
- 2026-11-23 [USER] Open questions: none.

## Decisions
- 2026-08-22 [CODE] D001 ACTIVE: retain historical `Outfit` weights (`300`, `400`, `500`).
- 2026-08-24 [CODE] D003 ACTIVE: storefront routes use shared `(storefront)` layout.
- 2026-08-24 [CODE] D004 ACTIVE: homepage composed from small modular components.
- 2026-11-21 [CODE] D017 ACTIVE: theme tokens set warm ivory canvas (`#fbf9f4`), golden yellow accent (`#f5c344` / `#e6b02e`), and obsidian dark cards (`#141518`).
- 2026-11-21 [CODE] D020 ACTIVE: all modular code files kept strictly <= 300 LOC limit.
- 2026-11-21 [USER] D021 ACTIVE: strict separation between visual design inspiration and site domain/copy (pure tech e-commerce store).
- 2026-11-21 [USER] D024 ACTIVE: strict post-payment order persistence: online orders are NEVER saved to MongoDB upon opening Razorpay. An order document is created in the database if and only if `/api/order/verify` verifies a valid cryptographic signature. Exiting or failing payment creates 0 database records and changes 0 inventory.
- 2026-11-22 [CODE] D025 ACTIVE: canonical BrandLogo component in `components/common/BrandLogo.jsx` standardizes the QC badge lockup across storefront, status page, mobile menu, and seller/admin bars.
- 2026-11-23 [CODE] D026 ACTIVE: log purge APIs require explicit `all=true` or positive `days` param; rejects ambiguous delete operations with HTTP 400.

## Done (recent)
- 2026-11-23 [CODE] **Storefront & Navbar UI Polish**: wired `+ Add to Cart` on `ProductCard`, replaced fake `4.8` rating & SKU with discount badge + strikethrough price + real review state, removed dead heart button; removed Orders/Cart from header nav while keeping Cart next to Sign in, wired `/` search shortcut, fixed `lg` Seller/Admin visibility, removed redundant inline Sign out.
- 2026-11-23 [CODE] **Admin Console & Global UX**: added reusable `ConfirmDialog.jsx` replacing `window.confirm` across Dashboard/Logs/Audit; collapsed Error Logs test cases into `Simulate Error` dropdown; aligned `LogToolbar`/`LogResults` to warm stone palette & SVG icons; widened Audit page to `max-w-7xl`; added interactive tooltips to `Sparkline`; scoped scrollbar hiding to `.no-scrollbar`.
- 2026-11-23 [CODE] **Removed Tag Existing Logs**: deleted `app/api/admin/logs/migrate/route.js` and removed `handleMigrate` / `migrating` / button from `app/admin/logs/page.jsx` and `components/admin/logs/LogToolbar.jsx`.
- 2026-11-23 [CODE] **Audit Logs Clear Actions**: added `Clear All Audit Logs` and `Clear > 30 days` to `app/admin/audit/page.jsx`, wiring to `DELETE /api/admin/audit` with live feed and stats refresh.
- 2026-11-23 [CODE] **Admin Dashboard Maintenance**: added quick log maintenance actions to `app/admin/dashboard/page.jsx` for clearing error and audit logs, plus inline clear on Recent Errors.
- 2026-11-23 [CODE] **API Parameter Safety**: secured `DELETE /api/admin/logs` and `DELETE /api/admin/audit` to guard against empty query parameter wipes.
- 2026-11-22 [CODE] **Brand & UI Cleanup**: created canonical `BrandLogo.jsx` across all headers/footers; removed useless moon theme toggle.

## Working set
- `components/common/ConfirmDialog.jsx`
- `components/ProductCard.jsx`
- `components/layout/Navbar.jsx`
- `components/layout/MobileMenu.jsx`
- `app/globals.css`
- `components/admin/logs/LogToolbar.jsx`
- `components/admin/logs/LogResults.jsx`
- `components/admin/audit/AuditStats.jsx`
- `app/admin/logs/page.jsx`
- `app/admin/audit/page.jsx`
- `app/admin/dashboard/page.jsx`

## Receipts
- 2026-11-23 [TOOL] LOC audit: 0 files exceed 300 LOC (largest edited file is 239 LOC).
- 2026-11-23 [TOOL] `next build` executed with exit code 0; all 55 pages and dynamic routes compiled successfully.
