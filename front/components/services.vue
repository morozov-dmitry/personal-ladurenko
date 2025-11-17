<template>
  <section id="services" class="py-24 bg-white">
    <div class="container mx-auto px-4">
      <div class="text-center mb-16">
        <h2 class="text-4xl md:text-5xl font-bold text-gray-900 mb-4">{{ t('SectionTitle') }}</h2>
        <p class="text-xl text-gray-600 max-w-2xl mx-auto">{{ t('SectionSubtitle') }}</p>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <!-- Business Law -->
        <div class="rounded-lg border border-gray-200 bg-white shadow-sm hover:shadow-xl transition-shadow cursor-pointer group">
          <div class="flex flex-col space-y-1.5 p-6">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-12 w-12 text-teal-600 mb-4 group-hover:scale-110 transition-transform">
              <path d="M16 20V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
              <rect width="20" height="14" x="2" y="6" rx="2"></rect>
            </svg>
            <h3 class="text-2xl font-semibold leading-none tracking-tight text-gray-900">{{ t('Service1Title') }}</h3>
          </div>
          <div class="p-6 pt-0">
            <p class="text-sm text-gray-600">{{ t('Service1Description') }}</p>
          </div>
        </div>
        <!-- Real Estate Law -->
        <div class="rounded-lg border border-gray-200 bg-white shadow-sm hover:shadow-xl transition-shadow cursor-pointer group">
          <div class="flex flex-col space-y-1.5 p-6">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-12 w-12 text-teal-600 mb-4 group-hover:scale-110 transition-transform">
              <path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8"></path>
              <path d="M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
            </svg>
            <h3 class="text-2xl font-semibold leading-none tracking-tight text-gray-900">{{ t('Service2Title') }}</h3>
          </div>
          <div class="p-6 pt-0">
            <p class="text-sm text-gray-600">{{ t('Service2Description') }}</p>
          </div>
        </div>
        <!-- Personal Injury -->
        <div class="rounded-lg border border-gray-200 bg-white shadow-sm hover:shadow-xl transition-shadow cursor-pointer group">
          <div class="flex flex-col space-y-1.5 p-6">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-12 w-12 text-teal-600 mb-4 group-hover:scale-110 transition-transform">
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
              <circle cx="9" cy="7" r="4"></circle>
              <polyline points="16 11 18 13 22 9"></polyline>
            </svg>
            <h3 class="text-2xl font-semibold leading-none tracking-tight text-gray-900">{{ t('Service3Title') }}</h3>
          </div>
          <div class="p-6 pt-0">
            <p class="text-sm text-gray-600">{{ t('Service3Description') }}</p>
          </div>
        </div>
        <!-- Estate Planning -->
        <div class="rounded-lg border border-gray-200 bg-white shadow-sm hover:shadow-xl transition-shadow cursor-pointer group">
          <div class="flex flex-col space-y-1.5 p-6">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-12 w-12 text-teal-600 mb-4 group-hover:scale-110 transition-transform">
              <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"></path>
              <path d="M14 2v4a2 2 0 0 0 2 2h4"></path>
              <path d="M10 9H8"></path>
              <path d="M16 13H8"></path>
              <path d="M16 17H8"></path>
            </svg>
            <h3 class="text-2xl font-semibold leading-none tracking-tight text-gray-900">{{ t('Service4Title') }}</h3>
          </div>
          <div class="p-6 pt-0">
            <p class="text-sm text-gray-600">{{ t('Service4Description') }}</p>
          </div>
        </div>
        <!-- Civil Litigation -->
        <div class="rounded-lg border border-gray-200 bg-white shadow-sm hover:shadow-xl transition-shadow cursor-pointer group">
          <div class="flex flex-col space-y-1.5 p-6">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-12 w-12 text-teal-600 mb-4 group-hover:scale-110 transition-transform">
              <rect width="16" height="20" x="4" y="2" rx="2" ry="2"></rect>
              <path d="M9 22v-4h6v4"></path>
              <path d="M8 6h.01"></path>
              <path d="M16 6h.01"></path>
              <path d="M12 6h.01"></path>
              <path d="M12 10h.01"></path>
              <path d="M12 14h.01"></path>
              <path d="M16 10h.01"></path>
              <path d="M16 14h.01"></path>
              <path d="M8 10h.01"></path>
              <path d="M8 14h.01"></path>
            </svg>
            <h3 class="text-2xl font-semibold leading-none tracking-tight text-gray-900">{{ t('Service5Title') }}</h3>
          </div>
          <div class="p-6 pt-0">
            <p class="text-sm text-gray-600">{{ t('Service5Description') }}</p>
          </div>
        </div>
        <!-- Family Law -->
        <div class="rounded-lg border border-gray-200 bg-white shadow-sm hover:shadow-xl transition-shadow cursor-pointer group">
          <div class="flex flex-col space-y-1.5 p-6">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-12 w-12 text-teal-600 mb-4 group-hover:scale-110 transition-transform">
              <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"></path>
            </svg>
            <h3 class="text-2xl font-semibold leading-none tracking-tight text-gray-900">{{ t('Service6Title') }}</h3>
          </div>
          <div class="p-6 pt-0">
            <p class="text-sm text-gray-600">{{ t('Service6Description') }}</p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const { t } = useI18n({
  useScope: 'local'
})
</script>

<i18n lang="json">
{
  "uk": {
    "SectionTitle": "Галузі практики",
    "SectionSubtitle": "Комплексні юридичні послуги, адаптовані до ваших унікальних потреб",
    "Service1Title": "Господарське право",
    "Service1Description": "Комплексна юридична підтримка бізнесу, від створення до контрактів та спорів.",
    "Service2Title": "Нерухомість",
    "Service2Description": "Експертна консультація щодо угод з нерухомістю, спорів та інвестицій.",
    "Service3Title": "Особисті травми",
    "Service3Description": "Борюся за ваші права та справедливу компенсацію після нещасних випадків або травм.",
    "Service4Title": "Планування спадщини",
    "Service4Description": "Забезпечте свою спадщину заповітами, трастами та комплексним плануванням майна.",
    "Service5Title": "Цивільні спори",
    "Service5Description": "Сильне представництво в суді для цивільних спорів та правових конфліктів.",
    "Service6Title": "Сімейне право",
    "Service6Description": "Співчутлива підтримка у питаннях розлучення, опіки та сімейних правових питань."
  },
  "ru": {
    "SectionTitle": "Области практики",
    "SectionSubtitle": "Комплексные юридические услуги, адаптированные к вашим уникальным потребностям",
    "Service1Title": "Хозяйственное право",
    "Service1Description": "Комплексная юридическая поддержка бизнеса, от создания до контрактов и споров.",
    "Service2Title": "Недвижимость",
    "Service2Description": "Экспертная консультация по сделкам с недвижимостью, спорам и инвестициям.",
    "Service3Title": "Личные травмы",
    "Service3Description": "Борюсь за ваши права и справедливую компенсацию после несчастных случаев или травм.",
    "Service4Title": "Планирование наследства",
    "Service4Description": "Обеспечьте свое наследие завещаниями, трастами и комплексным планированием имущества.",
    "Service5Title": "Гражданские споры",
    "Service5Description": "Сильное представительство в суде для гражданских споров и правовых конфликтов.",
    "Service6Title": "Семейное право",
    "Service6Description": "Сострадательная поддержка в вопросах развода, опеки и семейных правовых вопросов."
  }
}
</i18n>
