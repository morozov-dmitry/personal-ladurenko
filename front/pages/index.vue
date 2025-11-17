<template>
  <div>
    <MainHeader />
    <Attorney />
    <AboutUs />
    <Services />
    <ContactForm />
  </div>
</template>

<script setup lang="ts">
// Constants
const BASE_URL = process.env.NUXT_PUBLIC_BASE_URL || 'https://lostal.com.ua'
const OG_IMAGE = '/ogMainImage.jpeg'
const AUTHOR = 'Юридичний офіс STAL'

// Composables
const { t, locale } = useI18n()

// Computed properties
const canonicalUrl = computed(() => {
  const languagePath = locale.value === 'ru' ? '/ru' : '/uk'
  return `${BASE_URL}${languagePath}`
})

// SEO Meta configuration
useSeoMeta({
  title: () => t('seo.title'),
  ogTitle: () => t('seo.title'),
  description: () => t('seo.description'),
  ogDescription: () => t('seo.description'),
  ogImage: OG_IMAGE,
  ogImageAlt: () => t('seo.imageAlt'),
  ogType: 'website',
  ogUrl: () => canonicalUrl.value,
  robots: 'index, follow',
  keywords: () => t('seo.keywords'),
  author: AUTHOR
})

// Head configuration
useHead({
  htmlAttrs: {
    lang: () => locale.value
  },
  link: [
    {
      rel: 'canonical',
      href: () => canonicalUrl.value
    }
  ]
})
</script>

<i18n lang="json">
{
  "uk": {
    "seo": {
      "title": "Адвокат - Експертне юридичне представництво",
      "description": "Досвідчені юристи, що надають комплексні юридичні послуги. Понад 20 років досконалості у господарському, нерухомості, особистих травмах та сімейному праві.",
      "keywords": "юридичні послуги, адвокат, юрист, правова допомога, господарське право, нерухомість, сімейне право, цивільні спори, планування спадщини, юридична консультація, Україна, Харків",
      "imageAlt": "Професійне юридичне представництво"
    }
  },
  "ru": {
    "seo": {
      "title": "Адвокат - Экспертное юридическое представительство",
      "description": "Опытные юристы, предоставляющие комплексные юридические услуги. Более 20 лет совершенства в хозяйственном, недвижимости, личных травмах и семейном праве.",
      "keywords": "юридические услуги, адвокат, юрист, правовая помощь, хозяйственное право, недвижимость, семейное право, гражданские споры, планирование наследства, юридическая консультация, Украина, Харьков",
      "imageAlt": "Профессиональное юридическое представительство"
    }
  }
}
</i18n>