/**
 * Orders Form Schema
 * 
 * Defines the form structure for creating and editing orders.
 * This schema is used by the CrudForm component to generate form fields.
 */

export const ordersSchema = {
  fields: [
    {
      type: 'input',
      model: 'name',
      label: 'orders.form.name',
      placeholder: 'orders.form.namePlaceholder',
      required: true,
      maxLength: 255
    },
    {
      type: 'input',
      model: 'phone',
      label: 'orders.form.phone',
      placeholder: 'orders.form.phonePlaceholder',
      required: true,
      maxLength: 255
    },
    {
      type: 'textarea',
      model: 'message',
      label: 'orders.form.message',
      placeholder: 'orders.form.messagePlaceholder',
      required: true,
      rows: 4
    },
    {
      type: 'select',
      model: 'status',
      label: 'orders.form.status',
      required: false,
      values: [
        {
          name: 'orders.statusValues.active',
          value: 1
        },
        {
          name: 'orders.statusValues.closed',
          value: 0
        }
      ]
    }
  ]
}
