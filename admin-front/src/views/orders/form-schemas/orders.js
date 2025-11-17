/**
 * Orders Form Schema for Vue 3 Form Generator
 * 
 * Defines the form structure for creating and editing orders.
 * This schema is used by the CrudFormGenerator component.
 * 
 * Based on @kevinkosterr/vue3-form-generator
 * Documentation: https://github.com/kevinkosterr/vue3-form-generator
 */

export const ordersSchema = {
  fields: [
    {
      type: 'input',
      inputType: 'text',
      model: 'name',
      label: 'orders.form.name',
      placeholder: 'orders.form.namePlaceholder',
      required: true,
      min: 4,
      max: 255,
      validator: ['string', 'required'],
      styleClasses: 'col-md-6'
    },
    {
      type: 'input',
      inputType: 'text',
      model: 'phone',
      label: 'orders.form.phone',
      placeholder: 'orders.form.phonePlaceholder',
      required: true,
      min: 4,
      max: 255,
      validator: ['string', 'required'],
      styleClasses: 'col-md-6'
    },
    {
      type: 'textArea',
      model: 'message',
      label: 'orders.form.message',
      placeholder: 'orders.form.messagePlaceholder',
      required: true,
      rows: 4,
      validator: ['string', 'required'],
      styleClasses: 'col-md-12'
    },
    {
      type: 'select',
      model: 'status',
      label: 'orders.form.status',
      required: false,
      selectOptions: {
        noneSelectedText: 'orders.form.chooseStatus'
      },
      values: [
        { 
          name: 'orders.statusValues.active', 
          id: 1 
        },
        { 
          name: 'orders.statusValues.closed', 
          id: 0 
        }
      ],
      styleClasses: 'col-md-6'
    }
  ]
}

