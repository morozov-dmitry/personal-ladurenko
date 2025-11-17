# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Lostal Frontend - A bilingual (Ukrainian/Russian) Nuxt 3 website built with TypeScript and Tailwind CSS. The project uses static site generation (SSG) for optimal performance and SEO.

**Tech Stack:**
- Nuxt 3 (v4.1.3) with TypeScript
- Vue 3 (v3.5.22)
- Tailwind CSS (v3.4.18)
- @nuxtjs/i18n (v10.1.1) for internationalization
- nuxt-gtag for Google Analytics/Ads tracking

**Dev Server:** Runs on port 3002

## Development Commands

```bash
# Install dependencies
npm install

# Run development server (localhost:3002)
npm run dev

# Build for production
npm run build

# Generate static site (SSG)
npm run generate

# Preview production build
npm run preview
```

## Architecture & Patterns

### 1. Internationalization Strategy

**CRITICAL: All translations MUST be local to components using `<i18n>` tags.**

- **Supported locales:** Ukrainian (uk - default), Russian (ru)
- **URL strategy:** Prefix-based (`/uk/`, `/ru/`)
- **No global translation files** - each component manages its own translations
- **Server middleware** (`server/middleware/redirect-locale.global.ts`) detects browser language and redirects root `/` to appropriate locale

**Component translation pattern:**
```vue
<template>
  <div>{{ t('TranslationKey') }}</div>
</template>

<script setup lang="ts">
const { t } = useI18n({
  useScope: 'local'  // ALWAYS use local scope
})
</script>

<i18n lang="json">
{
  "uk": {
    "TranslationKey": "Ukrainian text"
  },
  "ru": {
    "TranslationKey": "Russian text"
  }
}
</i18n>
```

### 2. Composables Architecture

**Location:** `/composables/`

Two key composables provide shared functionality:

#### `useAnalytics.ts`
Wraps Google Analytics/Ads tracking with environment-aware logic:
- **Functions:** `trackEvent()`, `trackConversion()`, `trackPageView()`, `trackPhoneClick()`, `trackNavigationClick()`
- **Key feature:** Automatically checks if analytics is enabled via runtime config before tracking
- **Usage:** Import and use in components that need tracking (e.g., contact form submissions)

#### `useSmoothScroll.ts`
Provides custom smooth scrolling with cubic easing:
- **Functions:** `scrollToSection(sectionId)`, `scrollToTop()`
- **Implementation:** Uses `requestAnimationFrame` for optimal performance
- **Duration:** Auto-calculates based on distance (800-1500ms range)

### 3. Runtime Configuration

**Environment Variables (from `nuxt.config.ts`):**
- `NUXT_PUBLIC_API_BASE_URL` - Backend API endpoint for form submissions
- `NUXT_PUBLIC_GOOGLE_ANALYTICS_ID` - GA4 measurement ID
- `NUXT_PUBLIC_GOOGLE_ADS_ID` - Google Ads account ID
- `NUXT_PUBLIC_GOOGLE_ADS_CONVERSION_ID` - Conversion tracking ID

**Access in components:**
```typescript
const config = useRuntimeConfig()
const apiUrl = config.public.apiBaseUrl
```

### 4. Form Submission Flow

Forms submit to external backend via `$fetch`:
```typescript
await $fetch(`${config.public.apiBaseUrl}/form`, {
  method: 'POST',
  body: formData
})
```

**Important:** Form submissions trigger conversion tracking via `useAnalytics().trackConversion()`

### 5. Component Structure

**Key components:**
- `navigation.vue` - Main header navigation with smooth scroll integration
- `contact-form.vue` - Form with analytics tracking and API integration
- `footer.vue` - Site footer
- Other content components: `main-header.vue`, `services.vue`, `advantages.vue`, `about-us.vue`, `scroll-arrow.vue`

**Pages:**
- `index.vue` - Main landing page
- `st130.vue` - Special page (uses `st130-header.vue` and `st130-content.vue` components)

**Layout:**
- Single `default.vue` layout with Navigation and Footer

### 6. Styling Conventions

- **Framework:** Tailwind CSS utility-first approach
- **Custom colors:** `section-bg` (#ededed) defined in `tailwind.config.js`
- **Main CSS:** `/assets/css/main.css` imported in nuxt.config
- **Responsive:** Mobile-first approach with Tailwind breakpoints

### 7. Static Site Generation

This project is optimized for SSG:
- Use `npm run generate` to create static files in `.output/public/`
- All pages pre-rendered at build time
- No server-side rendering required for deployment
- Compatible with static hosting (Vercel, Netlify, etc.)

### 8. Sitemap Configuration

The project includes `@nuxtjs/sitemap` (v7.4.7) module for SEO optimization. The sitemap is automatically generated during the build process.

## Key Development Guidelines

### When Adding New Components:
1. Always include `<i18n lang="json">` block with uk/ru translations
2. Use `useI18n({ useScope: 'local' })` in script setup
3. Use Tailwind utility classes for styling
4. Add TypeScript type annotations for props/events

### When Adding Analytics Tracking:
1. Import `useAnalytics` composable
2. Check `isAnalyticsEnabled.value` before tracking
3. Use appropriate tracking function (`trackEvent`, `trackConversion`, etc.)
4. Always log fallback messages when analytics is disabled

### When Working with Forms:
1. Use runtime config for API endpoints
2. Implement proper loading states (`isSubmitting`)
3. Add success/error message handling
4. Track form events with analytics (start, success, error)
5. Track conversions on successful submissions

### When Modifying Navigation:
1. Use `useSmoothScroll` for internal anchor links
2. Track navigation clicks with `trackNavigationClick()`
3. Ensure translations are updated in component's `<i18n>` block

## Project-Specific Notes

- **No global langDir**: Unlike typical i18n setups, this project intentionally avoids global translation files
- **Port 3002**: Development server runs on 3002 (not default 3000)
- **Legacy compatibility**: Analytics tracking maintains exact compatibility with previous site implementation
- **Dist symlink**: There's a symlink `dist -> .output/public` for deployment compatibility
