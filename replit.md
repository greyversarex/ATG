# ATG.TJ - AMIR TECH GROUP Website

## Overview
Corporate website with product catalog for AMIR TECH GROUP (ATG) - a leading supplier of automotive parts and diagnostic equipment in Tajikistan. The site features a product catalog, brand pages, news section, admin panel, and company information.

## Recent Changes
- 2026-02-24: Full i18n (Russian/English) — I18nProvider context, language switcher in header (Globe icon), all UI strings translated, page titles/meta bilingual, currency formatting (сом./TJS), date locale switching, "Amir Tech Group" text mobile-only
- 2026-02-24: Comprehensive mobile optimization — all pages, components, header, footer, catalog filters (bottom sheet), hero slider (4:3 mobile, prev/next buttons), product cards (compact), floating contact, splash screen (min() sizing), consistent responsive breakpoints across all pages
- 2026-02-24: Added favorites/wishlist feature — heart button on product cards, favorites counter in header, dedicated /favorites page, localStorage-based (no auth required)
- 2026-02-24: Fixed production session management — manual session table creation, fallback SESSION_SECRET, removed dependency on connect-pg-simple's table.sql file
- 2026-02-24: Full SEO optimization — meta tags (OG, Twitter, geo, keywords), JSON-LD structured data (Organization, LocalBusiness, WebSite), dynamic page titles/descriptions per route, robots.txt, sitemap.xml, noscript fallback content, optimized Google Fonts loading (Inter only)
- 2026-02-21: Enhanced image management - drag & drop upload, image gallery modal for selecting previously uploaded images, improved image preview with replace/remove on hover. Added API for listing/deleting uploaded images.
- 2026-02-18: Initial MVP build - all pages, backend API, database with seed data, admin panel

## Architecture
- **Frontend**: React + Vite + TypeScript + TailwindCSS + shadcn/ui
- **Backend**: Express.js REST API
- **Database**: PostgreSQL with Drizzle ORM
- **Routing**: wouter (client-side)
- **State**: TanStack React Query

## Key Pages
- `/` - Home (hero slider, brands, categories, bestsellers, promo banner, services)
- `/catalog` - Product catalog with filters (category, brand, price)
- `/product/:id` - Product detail page
- `/brands` - All brands grid
- `/news` - News articles
- `/about` - About company
- `/discounts` - Discounted products
- `/favorites` - Favorites/wishlist page (localStorage-based)
- `/admin` - Admin panel for managing all content

## Data Models
- Users, Brands, Categories, Products, Banners (hero/promo), News, Services

## Admin Panel
- Manages: products, brands, categories, banners, news, services
- Available at `/admin` route

## Color Theme
- Primary: Red (hue 0, saturation 84%)
- Neutral grays for backgrounds
- Dark mode supported via CSS variables

## i18n
- System: React Context (`client/src/lib/i18n.tsx`) with `useI18n()` hook
- Languages: Russian (default) / English, saved to localStorage key "atg-lang"
- `t("section.key")` for strings, `ta("section.arrayKey")` for string arrays
- Page titles: key-based bilingual meta in `client/src/hooks/use-page-title.ts`
- Product content (names, descriptions) from DB in Russian; only UI strings are translated

## User Preferences
- Language: Russian/English (switchable via header Globe button)
- Font: Inter
