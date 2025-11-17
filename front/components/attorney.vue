<template>
  <section id="attorney" class="py-20 bg-white">
    <div class="container mx-auto px-4">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
        <div class="order-2 lg:order-1">
          <h3 class="text-2xl font-semibold text-teal-600 mb-4">{{ t('AttorneyName') }}</h3>
          <p class="text-lg text-gray-900 mb-8">{{ t('Bio1') }}</p>
          <div class="space-y-4">
            <div class="flex items-start gap-3">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-6 w-6 text-teal-600 flex-shrink-0 mt-1">
                <path d="M21.42 10.922a1 1 0 0 0-.019-1.838L12.83 5.18a2 2 0 0 0-1.66 0L2.6 9.08a1 1 0 0 0 0 1.832l8.57 3.908a2 2 0 0 0 1.66 0z"></path>
                <path d="M22 10v6"></path>
                <path d="M6 12.5V16a6 3 0 0 0 12 0v-3.5"></path>
              </svg>
              <div>
                <h4 class="font-semibold text-gray-900 mb-1">{{ t('EducationTitle') }}</h4>
                <p class="text-gray-600">{{ t('EducationText') }}</p>
              </div>
            </div>
            <!-- BACKUP: Bar section - commented out, can be restored if needed -->
            <!-- <div class="flex items-start gap-3">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-6 w-6 text-teal-600 flex-shrink-0 mt-1">
                <path d="m16 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z"></path>
                <path d="m2 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z"></path>
                <path d="M7 21h10"></path>
                <path d="M12 3v18"></path>
                <path d="M3 7h2c2 0 5-1 7-2 2 1 5 2 7 2h2"></path>
              </svg>
              <div>
                <h4 class="font-semibold text-gray-900 mb-1">{{ t('BarTitle') }}</h4>
                <p class="text-gray-600">{{ t('BarText') }}</p>
              </div>
            </div> -->
            <!-- BACKUP: Recognition section - commented out, can be restored if needed -->
            <!-- <div class="flex items-start gap-3">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-6 w-6 text-teal-600 flex-shrink-0 mt-1">
                <path d="m15.477 12.89 1.515 8.526a.5.5 0 0 1-.81.47l-3.58-2.687a1 1 0 0 0-1.197 0l-3.586 2.686a.5.5 0 0 1-.81-.469l1.514-8.526"></path>
                <circle cx="12" cy="8" r="6"></circle>
              </svg>
              <div>
                <h4 class="font-semibold text-gray-900 mb-1">{{ t('RecognitionTitle') }}</h4>
                <p class="text-gray-600">{{ t('RecognitionText') }}</p>
              </div>
            </div> -->
          </div>
        </div>
        <div class="order-1 lg:order-2">
          <div class="relative">
            <div class="absolute inset-0 bg-gradient-to-br from-teal-500/20 to-teal-600/20 rounded-lg transform rotate-3"></div>
            <img src="/alla.jpeg" alt="Attorney Alla Ladurenko - Professional Legal Representation" class="relative rounded-lg shadow-2xl w-full object-cover aspect-square">
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
    "AttorneyName": "Ладуренко Алла Олександрівна",
    "Bio1": "Адвокат. Господарське, цивільне, сімейне, адміністративне право. Здобула вищу освіту у Національному юридичному університеті України ім. Ярослава Мудрого за спеціальністю «Правознавство». Досвід роботи у сфері права близько 9-ти років.",
    "EducationTitle": "Освіта",
    "EducationText": "Національний юридичний університет України ім. Ярослава Мудрого, спеціальність «Правознавство»",
    "_comment_BACKUP_Bar": "BACKUP: Bar section translations - kept for potential restoration",
    "BarTitle": "Адвокатура",
    "BarText": "Адвокатська палата України, Ліцензований адвокат",
    "_comment_BACKUP_Recognition": "BACKUP: Recognition section translations - kept for potential restoration",
    "RecognitionTitle": "Визнання",
    "RecognitionText": "Високо оцінений адвокат з 98% успішністю у вирішенні справ"
  },
  "ru": {
    "AttorneyName": "Ладуренко Алла Александровна",
    "Bio1": "Адвокат. Хозяйственное, гражданское, семейное, административное право. Получила высшее образование в Национальном юридическом университете Украины им. Ярослава Мудрого по специальности «Правоведение». Опыт работы в сфере права около 9 лет.",
    "EducationTitle": "Образование",
    "EducationText": "Национальный юридический университет Украины им. Ярослава Мудрого, специальность «Правоведение»",
    "_comment_BACKUP_Bar": "BACKUP: Bar section translations - kept for potential restoration",
    "BarTitle": "Адвокатура",
    "BarText": "Адвокатская палата Украины, Лицензированный адвокат",
    "_comment_BACKUP_Recognition": "BACKUP: Recognition section translations - kept for potential restoration",
    "RecognitionTitle": "Признание",
    "RecognitionText": "Высоко оцененный адвокат с 98% успешностью в решении дел"
  }
}
</i18n>
