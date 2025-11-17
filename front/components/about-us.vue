<template>
  <section id="about" class="py-24 bg-gray-50">
    <div class="container mx-auto px-4">
      <div class="text-center mb-16">
        <h2 class="text-4xl md:text-5xl font-bold text-gray-900 mb-4">{{ t('SectionTitle') }}</h2>
        <p class="text-xl text-gray-600 max-w-2xl mx-auto">{{ t('SectionSubtitle') }}</p>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
        <div class="bg-white p-8 rounded-lg text-center hover:shadow-lg transition-shadow">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-12 w-12 text-teal-600 mx-auto mb-4">
            <path d="m15.477 12.89 1.515 8.526a.5.5 0 0 1-.81.47l-3.58-2.687a1 1 0 0 0-1.197 0l-3.586 2.686a.5.5 0 0 1-.81-.469l1.514-8.526"></path>
            <circle cx="12" cy="8" r="6"></circle>
          </svg>
          <div class="text-4xl font-bold text-gray-900 mb-2">20+</div>
          <div class="text-gray-600">{{ t('Stat1Label') }}</div>
        </div>
        <div class="bg-white p-8 rounded-lg text-center hover:shadow-lg transition-shadow">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-12 w-12 text-teal-600 mx-auto mb-4">
            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
            <circle cx="9" cy="7" r="4"></circle>
            <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
            <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
          </svg>
          <div class="text-4xl font-bold text-gray-900 mb-2">1000+</div>
          <div class="text-gray-600">{{ t('Stat2Label') }}</div>
        </div>
        <div class="bg-white p-8 rounded-lg text-center hover:shadow-lg transition-shadow">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-12 w-12 text-teal-600 mx-auto mb-4">
            <circle cx="12" cy="12" r="10"></circle>
            <polyline points="12 6 12 12 16 14"></polyline>
          </svg>
          <div class="text-4xl font-bold text-gray-900 mb-2">24/7</div>
          <div class="text-gray-600">{{ t('Stat3Label') }}</div>
        </div>
        <div class="bg-white p-8 rounded-lg text-center hover:shadow-lg transition-shadow">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-12 w-12 text-teal-600 mx-auto mb-4">
            <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"></path>
          </svg>
          <div class="text-4xl font-bold text-gray-900 mb-2">98%</div>
          <div class="text-gray-600">{{ t('Stat4Label') }}</div>
        </div>
      </div>
      <div class="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-lg">
        <h3 class="text-2xl font-bold text-gray-900 mb-4">{{ t('CommitmentTitle') }}</h3>
        <p class="text-gray-900 mb-4">{{ t('CommitmentText1') }}</p>
        <p class="text-gray-700">{{ t('CommitmentText2') }}</p>
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
    "SectionTitle": "Чому обирають мене",
    "SectionSubtitle": "Я поєдную юридичний досвід з особистим підходом для досягнення виняткових результатів для моїх клієнтів.",
    "Stat1Label": "Років досвіду",
    "Stat2Label": "Задоволених клієнтів",
    "Stat3Label": "Підтримка доступна",
    "Stat4Label": "Рівень успішності",
    "CommitmentTitle": "Моя відданість досконалості",
    "CommitmentText1": "Маючи понад два десятиліття юридичного досвіду, я створила репутацію надання комплексних юридичних послуг з чесністю та професіоналізмом. Я розумію, що юридичні питання можуть бути складними та стресовими, тому я присвячую себе тому, щоб вести вас через кожен крок процесу.",
    "CommitmentText2": "Я спеціалізуюся на різних галузях права, забезпечуючи вам експертне представництво, адаптоване до ваших конкретних потреб. Я пишаюся своїм клієнтоорієнтованим підходом, прозорою комунікацією та прихильністю до досягнення найкращих можливих результатів."
  },
  "ru": {
    "SectionTitle": "Почему выбирают меня",
    "SectionSubtitle": "Я сочетаю юридический опыт с личным подходом для достижения исключительных результатов для моих клиентов.",
    "Stat1Label": "Лет опыта",
    "Stat2Label": "Довольных клиентов",
    "Stat3Label": "Поддержка доступна",
    "Stat4Label": "Уровень успешности",
    "CommitmentTitle": "Моя приверженность совершенству",
    "CommitmentText1": "Имея более двух десятилетий юридического опыта, я создала репутацию предоставления комплексных юридических услуг с честностью и профессионализмом. Я понимаю, что юридические вопросы могут быть сложными и стрессовыми, поэтому я посвящаю себя тому, чтобы вести вас через каждый шаг процесса.",
    "CommitmentText2": "Я специализируюсь на различных областях права, обеспечивая вам экспертное представительство, адаптированное к вашим конкретным потребностям. Я горжусь своим клиентоориентированным подходом, прозрачной коммуникацией и приверженностью к достижению наилучших возможных результатов."
  }
}
</i18n>