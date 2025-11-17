<template>
  <section class="py-16">
    <div class="container mx-auto px-4">
      <div class="text-center mb-12">
        <h2 class="text-4xl font-bold mb-4">{{ t('Advantages') }}</h2>
        <p class="text-lg text-gray-700 max-w-2xl mx-auto">{{ t('AdvantagesDescription') }}</p>
      </div>
      
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <!-- Advantage 1 -->
        <div class="bg-white p-6">
          <h3 class="text-xl font-bold mb-4 flex items-center">
            <img src="/tick.svg" alt="Tick" class="w-6 h-6 mr-3">
            {{ t('Advantage1Title') }}
          </h3>
          <p class="text-gray-700">{{ t('Advantage1Description') }}</p>
        </div>
        
        <!-- Advantage 2 -->
        <div class="bg-white p-6">
          <h3 class="text-xl font-bold mb-4 flex items-center">
            <img src="/tick.svg" alt="Tick" class="w-6 h-6 mr-3">
            {{ t('Advantage2Title') }}
          </h3>
          <p class="text-gray-700">{{ t('Advantage2Description') }}</p>
        </div>
        
        <!-- Advantage 3 -->
        <div class="bg-white p-6">
          <h3 class="text-xl font-bold mb-4 flex items-center">
            <img src="/tick.svg" alt="Tick" class="w-6 h-6 mr-3">
            {{ t('Advantage3Title') }}
          </h3>
          <p class="text-gray-700">{{ t('Advantage3Description') }}</p>
        </div>
        
        <!-- Advantage 4 -->
        <div class="bg-white p-6">
          <h3 class="text-xl font-bold mb-4 flex items-center">
            <img src="/tick.svg" alt="Tick" class="w-6 h-6 mr-3">
            {{ t('Advantage4Title') }}
          </h3>
          <p class="text-gray-700">{{ t('Advantage4Description') }}</p>
        </div>
        
        <!-- Advantage 5 -->
        <div class="bg-white p-6">
          <h3 class="text-xl font-bold mb-4 flex items-center">
            <img src="/tick.svg" alt="Tick" class="w-6 h-6 mr-3">
            {{ t('Advantage5Title') }}
          </h3>
          <p class="text-gray-700">{{ t('Advantage5Description') }}</p>
        </div>
        
        <!-- Advantage 6 -->
        <div class="bg-white p-6">
          <h3 class="text-xl font-bold mb-4 flex items-center">
            <img src="/tick.svg" alt="Tick" class="w-6 h-6 mr-3">
            {{ t('Advantage6Title') }}
          </h3>
          <p class="text-gray-700">{{ t('Advantage6Description') }}</p>
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
    "Advantages": "Наші переваги",
    "AdvantagesDescription": "Чому варто обрати саме наш правовий офіс для вирішення ваших юридичних питань.",
    "Advantage1Title": "Безкоштовна перша консультація",
    "Advantage1Description": "Замовивши першу консультацію, Ви отримуєте безкоштовно професійну правову допомогу від досвідченого адвоката",
    "Advantage2Title": "Індивідуальний підхід до кожного клієнта",
    "Advantage2Description": "Кожен клієнт - особливий, тому для вирішення його питання розробляється індивідуальний комплекс правових способів захисту інтересів",
    "Advantage3Title": "Об'єктивна оцінка судової перспективи",
    "Advantage3Description": "Професійний досвід адвоката та посилений аналіз справи дає змогу об'єктивно оцінити перспективу Вашої судової справи - чесно, без невиправданих сподівань і обіцянок, що дасть змогу заощадити Ваш час і фінансові ресурси.",
    "Advantage4Title": "Прозора оплата",
    "Advantage4Description": "Оплата послуг адвоката чітко фіксується в договорі, без будь-яких непрозорих платежів",
    "Advantage5Title": "Персональний адвокат",
    "Advantage5Description": "Ви можете скористатися реальною можливістю звертатися по правову допомогу й отримувати консультації досвідченого адвоката у зручний для Вас час, ми гнучкі в спілкуванні з клієнтом і завжди спілкуємося на взаємовигідних умовах.",
    "Advantage6Title": "Доведення справи до результату",
    "Advantage6Description": "Ми працюємо на результат, а не виставляємо рахунки за безрезультатно витрачений час"
  },
  "ru": {
    "Advantages": "Наши преимущества",
    "AdvantagesDescription": "Почему стоит выбрать именно наш правовой офис для решения ваших юридических вопросов.",
    "Advantage1Title": "Бесплатная первая консультация",
    "Advantage1Description": "Заказав первую консультацию, Вы получаете бесплатно профессиональную правовую помощь от опытного адвоката",
    "Advantage2Title": "Индивидуальный подход к каждому клиенту",
    "Advantage2Description": "Каждый клиент - особенный, поэтому для решения его вопроса разрабатывается индивидуальный комплекс правовых способов защиты интересов",
    "Advantage3Title": "Объективная оценка судебной перспективы",
    "Advantage3Description": "Профессиональный опыт адвоката и усиленный анализ дела дает возможность объективно оценить перспективу Вашего судебного дела - честно, без неоправданных надежд и обещаний, что даст возможность сэкономить Ваше время и финансовые ресурсы.",
    "Advantage4Title": "Прозрачная оплата",
    "Advantage4Description": "Оплата услуг адвоката четко фиксируется в договоре, без каких-либо непрозрачных платежей",
    "Advantage5Title": "Персональный адвокат",
    "Advantage5Description": "Вы можете воспользоваться реальной возможностью обращаться за правовой помощью и получать консультации опытного адвоката в удобное для Вас время, мы гибки в общении с клиентом и всегда общаемся на взаимовыгодных условиях.",
    "Advantage6Title": "Доведение дела до результата",
    "Advantage6Description": "Мы работаем на результат, а не выставляем счета за безрезультатно потраченное время"
  }
}
</i18n>
