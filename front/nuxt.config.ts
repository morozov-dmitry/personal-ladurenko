// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  devServer: {
    port: 3003
  },
  runtimeConfig: {
    public: {
      apiBaseUrl: process.env.NUXT_PUBLIC_API_BASE_URL || '',
      googleAnalyticsId: process.env.NUXT_PUBLIC_GOOGLE_ANALYTICS_ID || '',
      googleAdsId: process.env.NUXT_PUBLIC_GOOGLE_ADS_ID || '',
      googleAdsConversionId: process.env.NUXT_PUBLIC_GOOGLE_ADS_CONVERSION_ID || ''
    }
  },
  css: ['~/assets/css/main.css'],
  modules: ['@nuxtjs/i18n', 'nuxt-gtag'],
  gtag: {
    id: process.env.NUXT_PUBLIC_GOOGLE_ANALYTICS_ID || '',
    config: process.env.NUXT_PUBLIC_GOOGLE_ANALYTICS_ID ? {
      // Additional Google Ads configuration
      [process.env.NUXT_PUBLIC_GOOGLE_ADS_ID || '']: {
        conversion_id: process.env.NUXT_PUBLIC_GOOGLE_ADS_CONVERSION_ID || ''
      }
    } : {}
  },
  i18n: {
    strategy: 'prefix',
    locales: [
      { code: 'uk', language: 'uk-UA', name: 'Українська' },
      { code: 'ru', language: 'ru-RU', name: 'Русский' },
    ],
    defaultLocale: 'uk'
  },
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },
  nitro: {
    compatibilityDate: '2025-11-17'
  }
})
