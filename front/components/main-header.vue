<template>
  <section id="hero" class="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
    <div class="absolute inset-0">
      <img src="/hero-law.jpg" alt="Professional law office" class="w-full h-full object-cover">
      <div class="absolute inset-0 bg-gradient-to-r from-gray-900/65 to-gray-900/55"></div>
    </div>
    <div class="container mx-auto px-4 relative z-10">
      <div class="max-w-3xl">
        <h1 class="text-5xl md:text-7xl font-bold text-white mb-6 animate-fade-in">{{ t('HeroTitle') }}</h1>
        <p class="text-xl md:text-2xl text-white/90 mb-8 animate-fade-in" style="animation-delay: 0.2s;">{{ t('HeroSubtitle') }}</p>
        <div class="flex flex-col sm:flex-row gap-4 animate-fade-in" style="animation-delay: 0.4s;">
          <button @click="scrollToSection('contact')" class="bg-teal-500 hover:bg-teal-600 text-white font-medium rounded-md text-lg px-8 py-4 transition-colors">{{ t('FreeConsultation') }}</button>
          <button @click="scrollToSection('services')" class="border border-white text-white hover:bg-white/10 font-medium rounded-md text-lg px-8 py-4 transition-colors">{{ t('OurServices') }}</button>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const { t } = useI18n({
  useScope: 'local'
})

const { scrollToSection } = useSmoothScroll()
</script>

<i18n lang="json">
{
  "uk": {
    "HeroTitle": "Експертне юридичне представництво",
    "HeroSubtitle": "Захищаю ваші права з відданістю, чесністю та досконалістю.",
    "FreeConsultation": "Безкоштовна консультація",
    "OurServices": "Мої послуги"
  },
  "ru": {
    "HeroTitle": "Экспертное юридическое представительство",
    "HeroSubtitle": "Защищаю ваши права с преданностью, честностью и совершенством.",
    "FreeConsultation": "Бесплатная консультация",
    "OurServices": "Мои услуги"
  }
}
</i18n>