<template>
  <div>
    <CRow>
      <CCol :xs="12">
        <CrudFormGenerator
          :schema="ordersSchema"
          :path="'/orders'"
          :model-id="orderId"
          :redirect-route="'Orders List'"
          :form-title="$t('orders.editOrder')"
        />
      </CCol>
    </CRow>
  </div>
</template>

<script setup>
import { useRoute } from 'vue-router'
import CrudFormGenerator from '@/components/CrudFormGenerator.vue'
import { ordersSchema } from './form-schemas/orders.js'

const route = useRoute()
const orderId = route.params.id
</script>
