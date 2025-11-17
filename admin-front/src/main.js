import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { VueQueryPlugin } from '@tanstack/vue-query'
import { plugin as FormKitPlugin, defaultConfig } from '@formkit/vue'
import { ru, uk } from '@formkit/i18n'

import App from './App.vue'
import router from './router'
import i18n from './i18n'
import { useAuthStore } from '@/stores/auth'
import apiConfigService from '@/services/apiConfig.service'
import { apiClient } from '@/services/api'

import CoreuiVue from '@coreui/vue'
import CIcon from '@coreui/icons-vue'
import { iconsSet as icons } from '@/assets/icons'
import DocsComponents from '@/components/DocsComponents'
import DocsExample from '@/components/DocsExample'
import DocsIcons from '@/components/DocsIcons'

// CrudForm styles
import '@uecsio/crud-form/dist/crud-form.css'

// FontAwesome
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { 
  faTrashAlt, 
  faEdit, 
  faEye, 
  faSpinner,
  faFile,
  faUser,
  faLock,
  faSignOutAlt
} from '@fortawesome/free-solid-svg-icons'

// Add icons to library
library.add(faTrashAlt, faEdit, faEye, faSpinner, faFile, faUser, faLock, faSignOutAlt)

const app = createApp(App)
app.use(createPinia())
app.use(VueQueryPlugin)
app.use(router)
app.use(i18n)
app.use(FormKitPlugin, defaultConfig({
  locales: { ru, uk },
  locale: 'uk', // Default locale, will be changed dynamically based on Vue i18n
  config: {
    classes: {
      label: 'formkit-label',
      outer: 'formkit-outer',
      wrapper: 'formkit-wrapper',
      input: 'formkit-input',
      help: 'formkit-help',
      messages: 'formkit-messages',
      message: 'formkit-message'
    }
  },
  messages: {
    uk: {
      ui: {
        required: ' *'
      }
    },
    ru: {
      ui: {
        required: ' *'
      }
    }
  }
}))
app.use(CoreuiVue)

// Provide global dependencies
app.provide('icons', icons)
app.provide('apiClient', apiClient)

app.component('CIcon', CIcon)
app.component('FontAwesomeIcon', FontAwesomeIcon)
app.component('DocsComponents', DocsComponents)
app.component('DocsExample', DocsExample)
app.component('DocsIcons', DocsIcons)

// Initialize authentication state
const authStore = useAuthStore()
authStore.initializeAuth()

// Initialize API configuration
apiConfigService.initialize()

// Apply current authentication to API service
apiConfigService.applyCurrentAuth()

app.mount('#app')
