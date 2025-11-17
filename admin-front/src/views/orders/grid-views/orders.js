/**
 * Orders Grid Columns Definition
 * Now using formatters instead of callbacks for better maintainability
 */
export const columns = [
  {
    label: 'orders.form.name',
    field: 'name',
    width: '30%',
    sortable: true,
    formatter: 'CommonTruncateFormatter',
    formatterOptions: {
      maxLength: 30,
      suffix: '...'
    },
    filterOptions: {
      enabled: true,
      filterType: 'text',
      placeholderKey: 'grid.filterByName',
    },
  },
  {
    label: 'orders.form.phone',
    field: 'phone',
    width: '30%',
    sortable: true,
    filterOptions: {
      enabled: true,
      filterType: 'text',
      placeholderKey: 'grid.filterByPhone',
    },
  },
  {
    label: 'orders.date',
    field: 'createdAt',
    width: '20%',
    sortable: true,
    formatRowValue: true,
    formatter: 'CommonDateFormatter',
    formatterOptions: {
      format: 'dd.MM.yyyy'
    },
    filterOptions: {
      enabled: true,
      filterType: 'daterange',
      placeholderKey: 'grid.filterByDate',
    },
  },
  {
    label: 'orders.status',
    field: 'status',
    width: '10%',
    sortable: true,
    formatter: 'CommonStatusFormatter',
    formatterOptions: {
      mapping: {
        1: 'orders.statusValues.active',
        0: 'orders.statusValues.closed'
      }
    },
    filterOptions: {
      enabled: true,
      filterType: 'select',
      strict: true,
      placeholderKey: 'grid.filterByStatus',
      items: [
        {
          textKey: 'orders.statusValues.active',
          value: 1,
        },
        {
          textKey: 'orders.statusValues.closed',
          value: 0,
        },
      ],
    },
  },
  {
    label: 'common.actions',
    field: 'actions',
    width: '10%',
    sortable: false,
    actions: [
      {
        action: {
          type: 'component',
          componentName: 'CommonEditAction',
        },
        props: {
          routeName: 'Update Order',
          entityName: 'Order'
        }
      },
      {
        action: {
          type: 'component',
          componentName: 'CommonDeleteAction',
        },
        props: {
          confirmMessage: 'Are you sure you want to delete this order?',
          successMessage: 'Order deleted successfully',
          errorMessage: 'Error deleting order'
        }
      },
      {
        action: {
          type: 'component',
          componentName: 'OrdersPrintAction',
        },
      },
    ],
  },
]

