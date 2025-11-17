<template>
  <div class="wrapper min-vh-100 d-flex flex-row align-items-center">
    <CContainer>
      <CRow class="justify-content-center">
        <CCol :sm="8" :md="6" :lg="4" :xl="4">
          <CCard class="p-4">
              <CCardBody>
                <CForm @submit.prevent="handleLogin">
                  <h1>{{ t('auth.login.title') }}</h1>
                  <p class="text-body-secondary">{{ t('auth.login.subtitle') }}</p>
                  
                  <!-- Error Alert -->
                  <CAlert 
                    v-if="loginError" 
                    color="danger" 
                    class="mb-3"
                    dismissible
                    @close="loginError = ''"
                  >
                    {{ loginError }}
                  </CAlert>
                  
                  <!-- Username Input -->
                  <CInputGroup class="mb-3">
                    <CInputGroupText>
                      <FontAwesomeIcon :icon="faUser" />
                    </CInputGroupText>
                    <CFormInput
                      v-model="loginForm.username"
                      :placeholder="t('auth.login.usernamePlaceholder')"
                      autocomplete="username"
                      :disabled="isLoading"
                      required
                    />
                  </CInputGroup>
                  
                  <!-- Password Input -->
                  <CInputGroup class="mb-4">
                    <CInputGroupText>
                      <FontAwesomeIcon :icon="faLock" />
                    </CInputGroupText>
                    <CFormInput
                      v-model="loginForm.password"
                      type="password"
                      :placeholder="t('auth.login.passwordPlaceholder')"
                      autocomplete="current-password"
                      :disabled="isLoading"
                      required
                    />
                  </CInputGroup>
                  
                  <!-- Login Button -->
                  <CRow>
                    <CCol :xs="12" class="text-center">
                      <CButton 
                        type="submit"
                        color="primary" 
                        class="px-4"
                        :disabled="isLoading"
                      >
                        <FontAwesomeIcon 
                          v-if="isLoading" 
                          :icon="faSpinner" 
                          spin 
                          class="me-2" 
                        />
                        {{ isLoading ? t('auth.login.loggingIn') : t('auth.login.loginButton') }}
                      </CButton>
                    </CCol>
                  </CRow>
                </CForm>
              </CCardBody>
            </CCard>
        </CCol>
      </CRow>
    </CContainer>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useAuthStore } from '@/stores/auth'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faUser, faLock, faSpinner } from '@fortawesome/free-solid-svg-icons'

/**
 * Login Page Component
 * 
 * Handles user authentication with username and password.
 * Provides login form with validation and error handling.
 * Redirects to dashboard on successful login.
 * 
 * @component Login
 * @example
 * ```vue
 * <Login />
 * ```
 */

// Composables
const router = useRouter()
const { t } = useI18n()
const authStore = useAuthStore()

// Reactive data
const isLoading = ref(false)
const loginError = ref('')

// Login form data
const loginForm = reactive({
  username: '',
  password: '',
})

/**
 * Handle login form submission
 * 
 * Validates form data and attempts to authenticate user.
 * Redirects to dashboard on success or shows error on failure.
 * 
 * @async
 * @function handleLogin
 * @example
 * ```javascript
 * // Called when form is submitted
 * await handleLogin()
 * ```
 */
const handleLogin = async () => {
  // Clear previous errors
  loginError.value = ''
  
  // Validate form
  if (!loginForm.username.trim() || !loginForm.password.trim()) {
    loginError.value = t('auth.login.validation.required')
    return
  }

  try {
    isLoading.value = true
    
    // Attempt login
    await authStore.login(loginForm.username.trim(), loginForm.password)
    
    // Redirect to dashboard on success
    router.push('/dashboard')
    
  } catch (error) {
    console.error('Login error:', error)
    loginError.value = error.message || t('auth.login.errors.generic')
  } finally {
    isLoading.value = false
  }
}


/**
 * Initialize component
 * 
 * Check if user is already authenticated and redirect if necessary.
 * 
 * @function onMounted
 * @example
 * ```javascript
 * // Called when component is mounted
 * onMounted()
 * ```
 */
onMounted(() => {
  // Check if user is already authenticated
  if (authStore.isAuthenticated) {
    router.push('/dashboard')
  }
})
</script>

<style scoped>
.wrapper {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.card {
  border: none;
  border-radius: 15px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
}

.btn-primary {
  background: linear-gradient(45deg, #667eea, #764ba2);
  border: none;
  border-radius: 25px;
  padding: 10px 30px;
  font-weight: 600;
  transition: all 0.3s ease;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
}

.btn-primary:disabled {
  opacity: 0.6;
  transform: none;
}

.form-control {
  border-radius: 10px;
  border: 2px solid #e9ecef;
  padding: 12px 15px;
  transition: all 0.3s ease;
}

.form-control:focus {
  border-color: #667eea;
  box-shadow: 0 0 0 0.2rem rgba(102, 126, 234, 0.25);
}

.input-group-text {
  background: #f8f9fa;
  border: 2px solid #e9ecef;
  border-radius: 10px 0 0 10px;
}

.alert {
  border-radius: 10px;
  border: none;
}

.text-body-secondary {
  color: #6c757d !important;
}

h1 {
  font-weight: 700;
  color: #2c3e50;
}

h2 {
  font-weight: 600;
}
</style>
