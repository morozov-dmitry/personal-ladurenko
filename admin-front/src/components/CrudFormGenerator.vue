<script setup>
import { ref, reactive, computed, onBeforeMount } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import VueFormGenerator from '@kevinkosterr/vue3-form-generator'
import { APIService } from '@/services/api'

// Props
const props = defineProps({
  schema: {
    type: Object,
    required: true,
  },
  model: {
    type: Object,
    required: false,
    default: () => ({})
  },
  modelId: {
    required: false,
    default: null
  },
  path: {
    type: String,
    required: true,
    default: ''
  },
  extraQueryString: {
    type: String,
    required: false,
    default: ''
  },
  redirectRoute: {
    type: String,
    required: true,
    default: ''
  },
  redirectParams: {
    type: Object,
    default: () => ({})
  },
  formTitle: {
    type: String,
    required: true,
    default: ''
  },
  formOptions: {
    type: Object,
    required: false,
    default: () => ({
      validateAfterLoad: false,
      validateAfterChanged: true,
    })
  },
})

// Composables
const router = useRouter()
const { t } = useI18n()

// State
const formLoaded = ref(false)
const form = reactive({})
const isValid = ref(true)
const errors = ref([])
const formSchema = reactive({ fields: [] })

// Computed
const isCreateForm = computed(() => !props.modelId)

// Methods
const onValidated = (valid, errs) => {
  isValid.value = valid
  errors.value = errs
}

const submit = async () => {
  if (!isValid.value) return

  // Apply transforms
  formSchema.fields.filter(el => el.transforms).forEach(el => {
    el.transforms.forEach(transformFunction => {
      const fieldName = el.model
      form[fieldName] = transformFunction(form[fieldName])
    })
  })

  try {
    const savedModel = isCreateForm.value
      ? await APIService.post(props.path, form)
      : await APIService.patch(APIService.getRestFullEntityUrl(props.path, form), form)

    if (savedModel) {
      // Handle image uploads
      const imagesFields = formSchema.fields
        .filter(formElement => formElement.type === 'imageUpload')
        .map(formElement => formElement.model)

      for (const imageField of imagesFields) {
        const imageTypeObject = formSchema.fields.find(formElement => {
          return formElement.type === 'imageUpload' && formElement.model === imageField
        })
        const imageType = imageTypeObject ? imageTypeObject.imageType : null
        await APIService.post(`image/${savedModel.id}/${imageType}`, form[imageField])
      }

      // Success notification
      console.log(t('dataWasSuccessfullySaved'))
    } else {
      // Error notification
      console.error(t('errorOnDataSaving'))
    }

    // Redirect
    const params = Object.assign({}, props.redirectParams)
    props.redirectRoute === 'prev'
      ? router.back()
      : router.push({ name: props.redirectRoute, params })
  } catch (error) {
    console.error('Error saving data:', error)
    console.error(t('errorOnDataSaving'))
  }
}

// Lifecycle
onBeforeMount(async () => {
  // Load form data
  if (isCreateForm.value) {
    Object.assign(form, props.model)
  } else {
    const extraCriteria = props.extraQueryString !== '' ? '?' + props.extraQueryString : ''
    
    try {
      const data = await APIService.get(
        APIService.getRestFullEntityUrl(props.path, { id: props.modelId }) + extraCriteria
      )
      Object.assign(form, data)
    } catch (error) {
      console.error('Error loading form data:', error)
    }
  }

  // Initialize image upload fields
  props.schema.fields
    .filter(formElement => formElement.type === 'imageUpload')
    .forEach(formElement => {
      form[formElement.model] = []
    })

  formLoaded.value = true

  // Filter out existing submit fields
  formSchema.fields = props.schema.fields.filter(formElement => {
    return formElement.type !== 'submit'
  })

  // Translate field labels and placeholders
  formSchema.fields = formSchema.fields.map(field => {
    if (field.label) {
      field.label = t(field.label)
    }
    if (field.placeholder) {
      field.placeholder = t(field.placeholder)
    }
    return field
  })

  // Add submit button
  const submitButton = {
    type: 'submit',
    buttonText: t('save'),
    onSubmit: submit,
    validateBeforeSubmit: true,
    attributes: {
      class: 'btn btn-primary btn-block',
    },
    styleClasses: 'col-sm-12 col-md-4 col-lg-3 offset-md-8 offset-lg-9 no-padding',
  }

  formSchema.fields.push(submitButton)
})
</script>

<template>
  <div class="app flex-row align-items-center">
    <div class="container">
      <CCard>
        <CCardHeader v-if="formTitle">
          <strong>{{ formTitle }}</strong>
        </CCardHeader>
        <CCardBody>
          <VueFormGenerator
            v-if="formLoaded"
            :is-new-model="isCreateForm"
            :schema="formSchema"
            :model="form"
            :options="formOptions"
            @validated="onValidated"
          />
        </CCardBody>
      </CCard>
    </div>
  </div>
</template>
  
  <style lang="scss">
    .custom-error {
      color: red;
    }
    .vue-form-generator {
      .error:not([class*="dummy-error"]) {
        input {
          border-color: red;
        }
        select {
          border-color: red;
        }
        .errors {
          span {
            color: red;
          }
        }
      }
      .dummy-error {
        .help-block {
          display: none;
        }
      }
      .field-array:has([class*="dummy-error"]) {
        & > .errors {
          display: none;
        }
      }
      .field-checkbox {
        .field-wrap {
          display: block;
          padding-top: 1px;
          padding-right: 6px;
          padding-left: 1px;
          float: left;
        }
      }
      .error{
        .cke {
          border: 1px solid red;
        }
      }
    }  
  </style>
  