# ATG.TJ - AMIR TECH GROUP Website

## Overview
Corporate website with product catalog for AMIR TECH GROUP (ATG) - a leading supplier of automotive parts and diagnostic equipment in Tajikistan. The site features a product catalog, brand pages, news section, admin panel, and company information.

## Recent Changes
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

## User Preferences
- Language: Russian (site content in Russian)
- Font: Inter
