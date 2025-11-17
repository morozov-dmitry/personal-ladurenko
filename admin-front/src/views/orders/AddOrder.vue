<template>
  <div>
    <CRow>
      <CCol :xs="12">
        <CrudFormGenerator
          :schema="ordersSchema"
          :path="'/orders'"
          :redirect-route="'Orders List'"
          :form-title="$t('orders.addOrder')"
        />
      </CCol>
    </CRow>
  </div>
</template>

<script setup>
import CrudFormGenerator from '@/components/CrudFormGenerator.vue'
import { ordersSchema } from './form-schemas/orders.js'
</script>
