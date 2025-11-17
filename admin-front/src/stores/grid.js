import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useGridStore = defineStore('grid', () => {
  // Store for multiple grids by ID
  const grids = ref({})

  // Initialize or fetch a grid by token
  const fetchGrid = (token) => {
    if (!grids.value[token]) {
      grids.value[token] = {
        rows: [],
        totalRecords: 0,
        isLoading: false,
        serverParams: {
          page: 1,
          perPage: 10,
          sort: [],
          columnFilters: {}
        },
        selectedRows: []
      }
    }
  }

  // Get a grid by token
  const getGrid = (token) => {
    return grids.value[token] || null
  }

  // Update a grid
  const updateGrid = ({ data, token }) => {
    grids.value[token] = data
  }

  return { 
    grids, 
    fetchGrid, 
    getGrid, 
    updateGrid 
  }
})

