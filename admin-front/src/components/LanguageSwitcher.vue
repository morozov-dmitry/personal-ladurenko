<template>
  <CDropdown variant="nav-item">
    <CDropdownToggle color="link" class="nav-link py-0 d-flex align-items-center">
      <FontAwesomeIcon :icon="faGlobe" class="me-2" style="vertical-align: middle;" />
      <span class="d-md-down-none">{{ currentLanguageName }}</span>
    </CDropdownToggle>
    <CDropdownMenu class="pt-0">
      <CDropdownItem
        v-for="language in languages"
        :key="language.code"
        @click="changeLanguage(language.code)"
        :class="{ active: currentLocale === language.code }"
      >
        <FontAwesomeIcon :icon="language.flag" class="me-2" style="vertical-align: middle;" />
        {{ language.name }}
      </CDropdownItem>
    </CDropdownMenu>
  </CDropdown>
</template>

<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faGlobe, faFlag } from '@fortawesome/free-solid-svg-icons'

const { locale } = useI18n()

const languages = [
  {
    code: 'uk',
    name: 'Українська',
    flag: faFlag
  },
  {
    code: 'ru',
    name: 'Русский',
    flag: faFlag
  }
]

const currentLocale = computed(() => locale.value)

const currentLanguageName = computed(() => {
  const currentLang = languages.find(lang => lang.code === currentLocale.value)
  return currentLang ? currentLang.name : 'Українська'
})

const changeLanguage = (langCode) => {
  locale.value = langCode
  // Save to localStorage for persistence
  localStorage.setItem('preferred-language', langCode)
  // Refresh the page to ensure all components are re-rendered with new locale
  window.location.reload()
}
</script>

<style scoped>
.nav-link {
  color: var(--cui-nav-link-color) !important;
}

.nav-link:hover {
  color: var(--cui-nav-link-hover-color) !important;
}

.dropdown-item.active {
  background-color: var(--cui-primary);
  color: white;
}
</style>
