<template>
  <nav class="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200">
    <div class="container mx-auto px-4">
      <div class="flex items-center justify-between h-16">
        <!-- Logo -->
        <NuxtLink :to="localePath('/')" class="flex items-center gap-2 cursor-pointer">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-8 w-8 text-teal-600">
            <path d="m16 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z"></path>
            <path d="m2 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z"></path>
            <path d="M7 21h10"></path>
            <path d="M12 3v18"></path>
            <path d="M3 7h2c2 0 5-1 7-2 2 1 5 2 7 2h2"></path>
          </svg>
          <span class="text-xl font-bold text-gray-900">{{ t('LogoText') }}</span>
        </NuxtLink>

        <!-- Desktop Menu -->
        <div class="hidden md:flex items-center gap-8">
          <button @click="scrollToSection('about')" class="text-gray-900 hover:text-teal-600 transition-colors">{{ t('About') }}</button>
          <button @click="scrollToSection('services')" class="text-gray-900 hover:text-teal-600 transition-colors">{{ t('Services') }}</button>
          <button @click="scrollToSection('contact')" class="text-gray-900 hover:text-teal-600 transition-colors">{{ t('Contact') }}</button>
          <button @click="scrollToSection('contact')" class="bg-teal-500 hover:bg-teal-600 text-white font-medium rounded-md px-4 py-2 transition-colors">{{ t('FreeConsultation') }}</button>
          <!-- Language Switcher -->
          <div class="flex items-center gap-2 border-l border-gray-300 pl-4">
            <NuxtLink 
              v-for="lang in availableLocales" 
              :key="lang.code"
              :to="switchLocalePath(lang.code)"
              :class="[
                'px-3 py-1 rounded-md text-sm font-medium transition-colors',
                locale === lang.code 
                  ? 'bg-teal-500 text-white' 
                  : 'text-gray-700 hover:bg-gray-100'
              ]"
            >
              {{ getLanguageLabel(lang.code) }}
            </NuxtLink>
          </div>
        </div>

        <!-- Mobile Menu Toggle -->
        <button @click="isMenuOpen = !isMenuOpen" class="md:hidden text-gray-900" aria-label="Toggle menu">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-6 w-6">
            <line x1="4" x2="20" y1="12" y2="12"></line>
            <line x1="4" x2="20" y1="6" y2="6"></line>
            <line x1="4" x2="20" y1="18" y2="18"></line>
          </svg>
        </button>
      </div>
    </div>

    <!-- Mobile Menu -->
    <div v-show="isMenuOpen" class="md:hidden bg-white border-t border-gray-200 shadow-lg">
      <div class="flex flex-col px-4 py-2">
        <button @click="scrollToSection('about'); isMenuOpen = false" class="px-4 py-3 text-left text-gray-900 hover:bg-gray-100 transition-colors rounded">{{ t('About') }}</button>
        <button @click="scrollToSection('services'); isMenuOpen = false" class="px-4 py-3 text-left text-gray-900 hover:bg-gray-100 transition-colors rounded">{{ t('Services') }}</button>
        <button @click="scrollToSection('contact'); isMenuOpen = false" class="px-4 py-3 text-left text-gray-900 hover:bg-gray-100 transition-colors rounded">{{ t('Contact') }}</button>
        <button @click="scrollToSection('contact'); isMenuOpen = false" class="mx-4 my-2 bg-teal-500 hover:bg-teal-600 text-white font-medium rounded-md px-4 py-2 transition-colors">{{ t('FreeConsultation') }}</button>
        <!-- Language Switcher Mobile -->
        <div class="flex items-center gap-2 px-4 py-3 border-t border-gray-200 mt-2">
          <span class="text-sm text-gray-600 mr-2">{{ t('Language') }}:</span>
          <NuxtLink 
            v-for="lang in availableLocales" 
            :key="lang.code"
            :to="switchLocalePath(lang.code)"
            :class="[
              'px-3 py-1 rounded-md text-sm font-medium transition-colors',
              locale === lang.code 
                ? 'bg-teal-500 text-white' 
                : 'text-gray-700 hover:bg-gray-100'
            ]"
            @click="isMenuOpen = false"
          >
            {{ lang.code.toUpperCase() }}
          </NuxtLink>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const { t } = useI18n({
  useScope: 'local'
})

// Get global i18n for locale switching
const { locale, locales } = useI18n()
const localePath = useLocalePath()
const switchLocalePath = useSwitchLocalePath()
const { scrollToSection } = useSmoothScroll()

const isMenuOpen = ref(false)

const availableLocales = computed(() => {
  return (locales.value as Array<{ code: string; name: string }>).filter(i => i.code)
})

const getLanguageLabel = (code: string) => {
  const labels: Record<string, string> = {
    'uk': 'УКР',
    'ru': 'РУС'
  }
  return labels[code] || code.toUpperCase()
}
</script>

<i18n lang="json">
{
  "uk": {
    "LogoText": "Адвокат Ладуренко Алла",
    "About": "Про мене",
    "Services": "Послуги",
    "Contact": "Контакти",
    "FreeConsultation": "Безкоштовна консультація",
    "Language": "Мова"
  },
  "ru": {
    "LogoText": "Адвокат Ладуренко Алла",
    "About": "Обо мне",
    "Services": "Услуги",
    "Contact": "Контакты",
    "FreeConsultation": "Бесплатная консультация",
    "Language": "Язык"
  }
}
</i18n> 