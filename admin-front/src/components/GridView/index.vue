<!--
  GridView Wrapper Component
  
  This wrapper automatically injects the apiClient so you don't need to
  pass it explicitly in every component that uses GridView.
  
  Usage:
    <GridView
      id="my-grid"
      :columns="columns"
      path="/api/endpoint"
    />
  
  The apiClient is automatically injected from the global provide.
-->
<template>
  <GridViewBase
    v-bind="$attrs"
    :api-client="apiClient"
  />
</template>

<script setup>
import { inject } from 'vue'
import { GridView as GridViewBase } from '@uecsio/gridview'
import '@uecsio/gridview/dist/index.css'

// Inject the global apiClient
const apiClient = inject('apiClient')

if (!apiClient) {
  console.warn('GridView: apiClient not found in Vue context. Make sure it is provided in main.js')
}
</script>

