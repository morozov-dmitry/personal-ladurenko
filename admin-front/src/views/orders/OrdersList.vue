<template>
  <div>
    <CRow>
      <CCol :xs="12">
        <CCard class="mb-4">
          <CCardHeader>
            <strong>{{ $t('orders.title') }}</strong>
          </CCardHeader>
          <CCardBody>
            <GridView
              id="orders-grid"
              :columns="columns"
              :columns-module="ordersColumns"
              path="/orders"
              add-route="Add Order"
              :add-text="$t('orders.addOrder')"
              default-sort="createdAt,DESC"
            />
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  </div>
</template>

<script setup>
import GridView from '@/components/GridView/index.vue'
import * as ordersColumns from './grid-views/orders.js'

const columns = ordersColumns.columns
</script>
