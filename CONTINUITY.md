# Continuity Ledger

## Snapshot
- 2026-11-22 [USER] Goal: audit application inconsistencies, unify brand logo everywhere, remove dead theme toggle, fix empty try-catches, modularize >300 LOC files, secure seller layout & user APIs, and align all subpages to QuickCart tokens.
- 2026-11-22 [CODE] Now: canonical BrandLogo implemented; theme button removed; files decomposed (<300 LOC); empty try-catches eliminated; seller layout guarded; zombie Inngest job purged; order status updates added; all routes compile cleanly.
- 2026-11-22 [CODE] Next: user review; full functional testing across all dashboards and checkout.
- 2026-11-22 [TOOL] Receipts: zero files > 300 LOC; zero silent/empty try-catches; `next build` compiled cleanly (55/55 routes, exit code 0).
- 2026-11-22 [USER] Open questions: none.

## Decisions
- 2026-08-22 [CODE] D001 ACTIVE: retain historical `Outfit` weights (`300`, `400`, `500`).
- 2026-08-24 [CODE] D003 ACTIVE: storefront routes use shared `(storefront)` layout.
- 2026-08-24 [CODE] D004 ACTIVE: homepage composed from small modular components.
- 2026-11-21 [CODE] D017 ACTIVE: theme tokens set warm ivory canvas (`#fbf9f4`), golden yellow accent (`#f5c344` / `#e6b02e`), and obsidian dark cards (`#141518`).
- 2026-11-21 [CODE] D020 ACTIVE: all modular code files kept strictly <= 300 LOC limit.
- 2026-11-21 [USER] D021 ACTIVE: strict separation between visual design inspiration and site domain/copy (pure tech e-commerce store).
- 2026-11-21 [USER] D024 ACTIVE: strict post-payment order persistence: online orders are NEVER saved to MongoDB upon opening Razorpay. An order document is created in the database if and only if `/api/order/verify` verifies a valid cryptographic signature. Exiting or failing payment creates 0 database records and changes 0 inventory.
- 2026-11-22 [CODE] D025 ACTIVE: canonical BrandLogo component in `components/common/BrandLogo.jsx` standardizes the QC badge lockup across storefront, status page, mobile menu, and seller/admin bars.

## Done (recent)
- 2026-11-22 [CODE] **Brand & UI Cleanup**: created canonical `BrandLogo.jsx` across all 6 headers/footers; removed useless moon theme toggle.
- 2026-11-22 [CODE] **Modular Architecture**: split `app/admin/audit/page.jsx` (427 LOC) and `app/seller/edit-product/[id]/page.jsx` (346 LOC) into modular subcomponents; all files now strictly <= 300 LOC.
- 2026-11-22 [CODE] **Security & Error Handling**: removed all silent/empty try-catches; guarded `app/seller/layout.jsx`; added auth checks on user/cart APIs; standardized API HTTP status codes.
- 2026-11-22 [CODE] **Order Lifecycle & Inngest**: purged zombie `checkAbandonedPayment` job contradicting D024; added `PATCH /api/order/seller-orders` for order status progression (`Processing`, `Shipped`, `Delivered`, `Cancelled`).
- 2026-11-22 [CODE] **Theme Tokens Alignment**: restyled all seller and admin subpages (`users`, `sellers`, `product-list`, `inventory`, `coupons`, `orders`, `cart-abandonment`, `add-product`) with QuickCart ivory/stone/amber palette.
- 2026-11-22 [TOOL] Verified: `next build` 55/55 routes passed cleanly; zero empty catches; zero files > 300 LOC.

## Working set
- `components/common/BrandLogo.jsx`
- `components/layout/Navbar.jsx`
- `components/layout/Footer.jsx`
- `components/admin/audit/`
- `components/seller/edit-product/`
- `app/seller/orders/page.jsx`
- `app/api/order/seller-orders/route.js`
- `app/seller/layout.jsx`

## Receipts
- 2026-11-22 [TOOL] Automated LOC audit: 0 files exceed 300 LOC across entire codebase.
- 2026-11-22 [TOOL] Automated catch block audit: 0 empty or silent catch blocks remain.
- 2026-11-22 [TOOL] `next build` executed with exit code 0; all 55 pages and dynamic routes compiled successfully in Turbopack.
