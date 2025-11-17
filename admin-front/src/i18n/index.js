import { createI18n } from 'vue-i18n'
import uk from './locales/uk.json'
import ru from './locales/ru.json'

const messages = {
  uk,
  ru
}

// Get saved language from localStorage or default to Ukrainian
const savedLanguage = localStorage.getItem('preferred-language') || 'uk'

const i18n = createI18n({
  legacy: false, // Use Composition API mode
  locale: savedLanguage, // Default locale
  fallbackLocale: 'ru', // Fallback locale
  messages,
  globalInjection: true, // Enable global $t, $tc, etc.
})

export default i18n
