<template>
  <section id="contact" class="py-24 bg-gray-50">
    <div class="container mx-auto px-4">
      <div class="text-center mb-16">
        <h2 class="text-4xl md:text-5xl font-bold text-gray-900 mb-4">{{ t('ContactFormTitle') }}</h2>
        <p class="text-xl text-gray-600 max-w-2xl mx-auto">{{ t('ContactFormDescription') }}</p>
      </div>
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
        <div>
          <form @submit.prevent.stop="submitForm" class="space-y-6">
            <div>
              <input
                type="text"
                id="name"
                v-model="form.name"
                required
                class="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50"
                :placeholder="t('NamePlaceholder')"
              />
            </div>
            <div>
              <input
                type="email"
                id="email"
                v-model="form.email"
                required
                class="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50"
                :placeholder="t('EmailPlaceholder')"
              />
            </div>
            <div>
              <input
                type="tel"
                id="phone"
                v-model="form.phone"
                class="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50"
                :placeholder="t('PhonePlaceholder')"
              />
            </div>
            <div>
              <textarea
                id="message"
                v-model="form.message"
                required
                rows="5"
                class="flex w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50 resize-none"
                :placeholder="t('MessagePlaceholder')"
              ></textarea>
            </div>
            <button
              type="submit"
              :disabled="isSubmitting"
              class="w-full bg-teal-500 hover:bg-teal-600 text-white font-medium rounded-md px-8 py-3 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {{ isSubmitting ? t('SubmittingButton') : t('SubmitButton') }}
            </button>
            <div v-if="successMessage" class="text-center text-green-600 font-medium">
              {{ successMessage }}
            </div>
            <div v-if="errorMessage" class="text-center text-red-600 font-medium">
              {{ errorMessage }}
            </div>
          </form>
        </div>
        <div class="space-y-8">
          <div class="bg-white p-6 rounded-lg">
            <h3 class="text-2xl font-bold text-gray-900 mb-6">{{ t('ContactInfoTitle') }}</h3>
            <div class="space-y-4">
              <div class="flex items-start gap-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-6 w-6 text-teal-600 mt-1">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                </svg>
                <div>
                  <div class="font-semibold text-gray-900">{{ t('PhoneLabel') }}</div>
                  <div class="text-gray-600">{{ t('PhoneNumber') }}</div>
                </div>
              </div>
              <div class="flex items-start gap-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-6 w-6 text-teal-600 mt-1">
                  <rect width="20" height="16" x="2" y="4" rx="2"></rect>
                  <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
                </svg>
                <div>
                  <div class="font-semibold text-gray-900">{{ t('EmailLabel') }}</div>
                  <div class="text-gray-600">{{ t('EmailAddress') }}</div>
                </div>
              </div>
              <div class="flex items-start gap-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-6 w-6 text-teal-600 mt-1">
                  <path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"></path>
                  <circle cx="12" cy="10" r="3"></circle>
                </svg>
                <div>
                  <div class="font-semibold text-gray-900">{{ t('AddressLabel') }}</div>
                  <div class="text-gray-600">
                    {{ t('AddressLine1') }}<br>
                    {{ t('AddressLine2') }}<br>
                    {{ t('AddressLine3') }}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="bg-white p-6 rounded-lg">
            <h3 class="text-xl font-bold text-gray-900 mb-3">{{ t('OfficeHoursTitle') }}</h3>
            <div class="space-y-2 text-gray-900">
              <div class="flex justify-between">
                <span>{{ t('Weekdays') }}</span>
                <span class="text-gray-600">{{ t('WeekdaysHours') }}</span>
              </div>
              <div class="flex justify-between">
                <span>{{ t('Saturday') }}</span>
                <span class="text-gray-600">{{ t('SaturdayHours') }}</span>
              </div>
              <div class="flex justify-between">
                <span>{{ t('Sunday') }}</span>
                <span class="text-gray-600">{{ t('SundayHours') }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const { t } = useI18n({
  useScope: 'local'
})

const config = useRuntimeConfig()

const form = ref({
  name: '',
  email: '',
  phone: '',
  message: ''
})

const isSubmitting = ref(false)
const successMessage = ref('')
const errorMessage = ref('')

const submitForm = async () => {
  isSubmitting.value = true
  successMessage.value = ''
  errorMessage.value = ''

  // Track form submission start
  const { trackEvent, trackConversion, isAnalyticsEnabled } = useAnalytics()
  
  if (isAnalyticsEnabled.value) {
    trackEvent('form_submit_start', {
      event_category: 'engagement',
      event_label: 'contact_form',
      value: 1
    })
  }

  try {
    const response = await $fetch(`${config.public.apiBaseUrl}/form`, {
      method: 'POST',
      body: form.value
    })

    successMessage.value = t('SuccessMessage')
    
    // Track successful form submission with exact same conversion tracking as old site
    if (isAnalyticsEnabled.value) {
      console.log('Form submitted - tracking conversion')
      
      // Google Ads conversion tracking (matching your existing setup exactly)
      trackConversion()
      
      // Additional GA4 event tracking
      trackEvent('form_submit_success', {
        event_category: 'conversion',
        event_label: 'contact_form',
        value: 1
      })
    } else {
      console.log('Form submitted - analytics disabled')
    }
    
    // Reset form
    form.value = {
      name: '',
      email: '',
      phone: '',
      message: ''
    }

    // Clear success message after 5 seconds
    setTimeout(() => {
      successMessage.value = ''
    }, 5000)
  } catch (error) {
    console.error('Error submitting form:', error)
    errorMessage.value = t('ErrorMessage')

    // Track form submission error
    if (isAnalyticsEnabled.value) {
      trackEvent('form_submit_error', {
        event_category: 'error',
        event_label: 'contact_form',
        value: 0
      })
    }

    // Clear error message after 5 seconds
    setTimeout(() => {
      errorMessage.value = ''
    }, 5000)
  } finally {
    isSubmitting.value = false
  }
}
</script>

<i18n lang="json">
{
  "uk": {
    "ContactFormTitle": "Зв'яжіться зі мною",
    "ContactFormDescription": "Замовте безкоштовну консультацію сьогодні. Я тут, щоб допомогти.",
    "NamePlaceholder": "Ваше ім'я",
    "EmailPlaceholder": "Електронна адреса",
    "PhonePlaceholder": "Номер телефону",
    "MessagePlaceholder": "Розкажіть мені про вашу юридичну справу...",
    "SubmitButton": "Надіслати повідомлення",
    "SubmittingButton": "Надсилання...",
    "SuccessMessage": "Заявку успішно надіслано! Я зв'яжуся з вами найближчим часом.",
    "ErrorMessage": "Помилка при надсиланні заявки. Будь ласка, спробуйте ще раз.",
    "ContactInfoTitle": "Контактна інформація",
    "PhoneLabel": "Телефон",
    "PhoneNumber": "+38 (066) 25-19-627",
    "EmailLabel": "Email",
    "EmailAddress": "alla27243{'@'}gmail.com",
    "AddressLabel": "Адреса",
    "AddressLine1": "м. Харків,",
    "AddressLine2": "пров. Отакара Яроша 18,",
    "AddressLine3": "офіс 100",
    "OfficeHoursTitle": "Години роботи офісу",
    "Weekdays": "Понеділок - П'ятниця:",
    "WeekdaysHours": "9:00 - 18:00",
    "Saturday": "Субота:",
    "SaturdayHours": "10:00 - 14:00",
    "Sunday": "Неділя:",
    "SundayHours": "Закрито"
  },
  "ru": {
    "ContactFormTitle": "Свяжитесь со мной",
    "ContactFormDescription": "Запланируйте бесплатную консультацию сегодня. Я здесь, чтобы помочь.",
    "NamePlaceholder": "Ваше имя",
    "EmailPlaceholder": "Электронный адрес",
    "PhonePlaceholder": "Номер телефона",
    "MessagePlaceholder": "Расскажите мне о вашем юридическом деле...",
    "SubmitButton": "Отправить сообщение",
    "SubmittingButton": "Отправка...",
    "SuccessMessage": "Заявка успешно отправлена! Я свяжусь с вами в ближайшее время.",
    "ErrorMessage": "Ошибка при отправке заявки. Пожалуйста, попробуйте еще раз.",
    "ContactInfoTitle": "Контактная информация",
    "PhoneLabel": "Телефон",
    "PhoneNumber": "+38 (066) 25-19-627",
    "EmailLabel": "Email",
    "EmailAddress": "alla27243{'@'}gmail.com",
    "AddressLabel": "Адрес",
    "AddressLine1": "г. Харьков,",
    "AddressLine2": "пер. Отакара Яроша 18,",
    "AddressLine3": "офис 100",
    "OfficeHoursTitle": "Часы работы офиса",
    "Weekdays": "Понедельник - Пятница:",
    "WeekdaysHours": "9:00 - 18:00",
    "Saturday": "Суббота:",
    "SaturdayHours": "10:00 - 14:00",
    "Sunday": "Воскресенье:",
    "SundayHours": "Закрыто"
  }
}
</i18n>
