<template>
  <footer class="w-full bg-gray-900 text-white py-8">
    <div class="container mx-auto px-4">
      <div class="flex flex-col md:flex-row items-center justify-between gap-4">
        <div class="flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-6 w-6 text-teal-500">
            <path d="m16 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z"></path>
            <path d="m2 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z"></path>
            <path d="M7 21h10"></path>
            <path d="M12 3v18"></path>
            <path d="M3 7h2c2 0 5-1 7-2 2 1 5 2 7 2h2"></path>
          </svg>
          <span class="font-bold">{{ t('LogoText') }}</span>
        </div>
        <div class="text-center md:text-right text-gray-400">
          <p>{{ t('CopyrightText') }}</p>
          <p class="text-sm mt-1">{{ t('SubText') }}</p>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
const { t } = useI18n({
  useScope: 'local'
})
</script>

<i18n lang="json">
{
  "uk": {
    "LogoText": "Адвокат Ладуренко Алла",
    "CopyrightText": "© 2025 Адвокат. Усі права захищені.",
    "SubText": "Професійні юридичні послуги"
  },
  "ru": {
    "LogoText": "Адвокат Ладуренко Алла",
    "CopyrightText": "© 2025 Адвокат. Все права защищены.",
    "SubText": "Профессиональные юридические услуги"
  }
}
</i18n>
