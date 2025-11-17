<template>
    <div class="app flex-row align-items-center">
      <div class="container">
        <b-card>
          <div slot="header" v-if="formTitle">
            <strong>{{ formTitle }}</strong>
          </div>
          <vue-form-generator
            v-if="formLoaded"
            :isNewModel="!modelId"
            :schema="schema"
            :model="form"
            :options="formOptions"
            @validated="onValidated"
          />
        </b-card>
      </div>
    </div>
  </template>
  
  <script>
    import { component as VueFormGenerator} from 'vue-form-generator';
    import {APIService} from "../services/api";
    import i18n from "@/plugins/i18n";
  
    export default {
      name: 'CrudForm',
      components: {
        "vue-form-generator": VueFormGenerator
      },
      props: {
        schema: {
          type: Object,
          required: true,
        },
        model: {
          type: Object,
          required: false,
        },
        modelId: {
          required: false,
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
          default: () => {
            return {}
          },
        },
        formTitle: {
          type: String,
          required: true,
          default: ''
        },
        formOptions: {
          type: Object,
          required: false,
          default: () => {
            return {
              validateAfterLoad: false,
              validateAfterChanged: true,
            }
          }
        },
      },
      data: () => {
        return {
          formLoaded: false,
          form: {},
          isValid: true,
          errors: [],
        }
      },
      methods: {
        onValidated(isValid, errors) {
          this.isValid = isValid;
          this.errors = errors;
        },
        submit : async function(){
  
          if (this.isValid) {
  
            this.schema.fields.filter(el => el.transforms).forEach(el => {
              el.transforms.forEach(transformFunction => {
                const fieldName = el.model;
                this.form[fieldName] = transformFunction(this.form[fieldName]);
              });
            });
  
            const savedModel = this.isCreateForm()
              ? await APIService.post(this.path, this.form)
              : await APIService.patch(APIService.getRestFullEntityUrl(this.path, this.form), this.form);
  
            if (savedModel) {
              const imagesFields = this.schema.fields.filter(formElement => {
                return formElement.type === 'imageUpload';
              }).map(formElement => formElement.model);
  
              for (const imageField of imagesFields) {
                const imageTypeObject = this.schema.fields.find(formElement => {
                  return formElement.type === 'imageUpload' && formElement.model === imageField;
                });
                const imageType = imageTypeObject ? imageTypeObject.imageType : null;
                await APIService.post(`image/${savedModel.id}/${imageType}`, this.form[imageField])
              }
              this.$eventBus.$emit('alert', {
                type: 'success',
                text: i18n.t('dataWasSuccessfullySaved'),
              });
            } else {
              this.$eventBus.$emit('alert', {
                type: 'danger',
                text: i18n.t('errorOnDataSaving'),
              });
            }
  
            const params = Object.assign({}, this.redirectParams);
            this.redirectRoute === 'prev'
              ? this.$router.back()
              : this.$router.push({name: this.redirectRoute, params});
          }
        },
        isCreateForm: function() {
          return !this.modelId;
        }
      },
      async beforeMount () {
  
        if (this.isCreateForm()) {
          this.form = Object.assign({}, this.form, this.model);
        }
        else {
          const extraCriteria =
            this.extraQueryString !== '' ? '?' + this.extraQueryString : '';
  
          const data = await APIService.get(
            APIService.getRestFullEntityUrl(this.path, { id: this.modelId }) +
            extraCriteria
          )
          this.form = Object.assign({}, this.form, data);
        }
  
        this.schema.fields.filter(formElement => {
          return formElement.type === 'imageUpload';
        }).forEach(formElement => {
          this.form[formElement.model] = [];
        });
  
        this.formLoaded = true;
  
        this.schema.fields = this.schema.fields.filter(formElement => {
          return formElement.type !== 'submit';
        });
  
        const submit =
          {
            type: "submit",
            buttonText: this.$t("save"),
            onSubmit: this.submit,
            validateBeforeSubmit: true,
            attributes: {
              class: "btn btn-primary btn-block",
            },
            styleClasses: "col-sm-12 col-md-4 col-lg-3 offset-md-8 offset-lg-9 no-padding",
          }
  
        this.schema.fields = this.schema.fields.map(field => {
          field.label = this.$t(field.label);
          field.placeholder = this.$t(field.placeholder);
          return field;
        });
  
        this.schema.fields.push(submit);
      },
    }
  </script>
  
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
  