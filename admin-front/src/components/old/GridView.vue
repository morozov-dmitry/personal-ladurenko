<template>
    <div :id="grid">
      <b-row class="mt-3">
        <b-col md="4" lg="3" sm="12">
          <b-button block variant="primary" v-if="extendedFilterSchema && Object.keys(extendedFilterSchema).length > 0" v-on:click="updateExtendedFilterVisibility">
            <span class="fa fa-search" /> {{ $t('extendedSearch') }}
          </b-button>
        </b-col>
        <b-col md="4" offset-md="6" lg="3" sm="12" class="pull-right" v-if="addRoute">
          <router-link :to="{name: addRoute, params: addRouteParams}">
            <b-button block variant="success"><span class="fa fa-plus"/> {{ addText }}</b-button>
          </router-link>
        </b-col>
        <b-col sm="12" v-if="showExtendedFilter">
          <br />
          <b-card>
            <div slot="header">
              <strong>{{ $t('extendedSearch') }}</strong>
            </div>
            <vue-form-generator
              :schema="extendedFilterFormFinalSchema"
              :model="extendedFilterForm"
              :options="{
                validateAfterLoad: false,
                validateAfterChanged: true,
              }"
            />
          </b-card>
        </b-col>
      </b-row>
      <br/>
      <b-row class="justify-content-center">
        <b-col md="12">
          <vue-good-table
            ref="table"
            mode="remote"
            @on-page-change="onPageChange"
            @on-sort-change="onSortChange"
            @on-column-filter="onColumnFilter"
            @on-per-page-change="onPerPageChange"
            @on-selected-rows-change="selectionChanged"
            :totalRows="grid.totalRecords"
            :isLoading="grid.isLoading"
            :row-style-class="rowStyleClassFn"
            :pagination-options="{
              perPage,
              enabled: true,
              perPageDropdownEnabled: !perPage,
              dropdownAllowAll: false,
              setCurrentPage: grid.serverParams.page,
              nextLabel: $t('next'),
              prevLabel: $t('prev'),
              rowsPerPageLabel: $t('rowsPerPage'),
              allLabel: $t('allItemPerPage'),
            }"
            :rows="grid.rows"
            :columns="translatedColumns"
            :select-options="{ enabled: this.enableCheckboxes }"
          >
            <template slot="loadingContent">
              <div style="margin: auto">
                <clip-loader :loading="grid.isLoading" color="#20a8d8" :height="200" :width="200"></clip-loader>
              </div>
            </template>  
            <template slot="table-row" slot-scope="props">
              <span v-if="props.column.field === 'actions'">
                <span v-if="props.column.actions">
                  <span
                    style="margin-right: 3px"
                    v-for="action in props.column.actions"
                    v-show="!action.action.visibilityResolver || action.action.visibilityResolver(props.row)"
                    :key="action.field"
                  >
                   <router-link
                     v-if="action.action.type==='route'"
                     :to="{
                       name: action.action.name ? action.action.name : action.action.nameResolver(actionParams),
                       params: action.action.paramsResolver(props.row),
                     }"
                   >
                    <span v-bind:class="action.class ? action.class : action.classCallback(props.row)">
                      {{ action.label}}
                    </span>
                   </router-link>
                   <span
                     style="color: #20a8d8; cursor: pointer"
                     v-if="action.action.type==='callback'"
                   >
                    <span
                      v-on:click.prevent="action.action.callbackFunction(grid.rows, props.row, actionParams, loadItems, $eventBus)"
                      v-bind:class="action.class ? action.class : action.classCallback(props.row)"
                    >
                      {{ action.label}}
                    </span>
                   </span>
                  </span>
                </span>
                <span v-else> {{ $t('operationsAreNotResolved') }} </span>
              </span>
              <div v-else>
                <span v-if="props.column.formatRowValue">
                  {{ props.column.formatFn(props.row) }}
                </span>
                <span v-else v-html="props.formattedRow[props.column.field]"/>
              </div>
            </template>
            <template slot="column-filter" slot-scope="{ column, updateFilters }">
              <div v-if="column.filterOptions && column.filterOptions.enabled" style="width: 100%">
                <div
                  style="background: #fff; border 1px solid red;"
                  v-if="column.filterOptions.date"
                >
                  <date-picker
                    :column="column"
                    :updateFilters="updateFilters"
                  />
                </div>
                <b-form-select
                  style="width: 100%"
                  v-else-if="column.filterOptions.filterDropdownItems && column.filterOptions.filterDropdownItems.length > 0"
                  :options="[{value: null, text: column.filterOptions.placeholder}].concat(column.filterOptions.filterDropdownItems)"
                  @input="(value) => updateFilters(column, value)"
                />
                <b-form-input
                  style="width: 100%"
                  v-else
                  @input="(value) => updateFilters(column, value)"
                />
              </div>  
            </template>
          </vue-good-table>
        </b-col>
      </b-row>
      <br/>
    </div>
  </template>
  
  <script>
    import moment from 'moment';
    import 'vue-good-table/dist/vue-good-table.css';
    import {VueGoodTable} from 'vue-good-table';
    import ClipLoader from 'vue-spinner/src/ClipLoader.vue'
    import datePicker from './grid-views/filters/datepicker.vue';
    import {component as VueFormGenerator} from 'vue-form-generator';
    import {APIService} from "../services/api";
  
    export default {
      name: 'GridViewTable',
      components: {
        VueGoodTable,
        ClipLoader,
        datePicker,
        "vue-form-generator": VueFormGenerator
      },
      props: {
        id: {
          type: String,
          required: true,
        },
        columns: {
          type: Array,
          required: true,
        },
        path: {
          type: String,
          required: true,
          default: ''
        },
        defaultSort: {
          type: String,
          required: false,
          default: 'id,DESC'
        },
        perPage: {
          type: Number,
          required: false,
          default: null
        },
        extraParams: {
          type: String,
          required: false,
          default: ''
        },
        extraData: {
          type: Object,
          required: false,
          default: () => {}
        },
        addRoute: {
          type: String,
          required: false,
          default: ''
        },
        addRouteParams: {
          type: Object,
          required: false,
          default: () => {}
        },
        updateRoute: {
          type: String,
          required: false,
          default: ''
        },
        viewRoute: {
          type: String,
          required: false,
          default: ''
        },
        addText: {
          type: String,
          required: false,
          default: ''
        },
        enableCheckboxes: {
          type: Boolean,
          required: false,
          default: false,
        },
        rowStyleClassFn: {
          type: Function,
          required: false,
          default: () => {},
        },
        extendedFilterSchema: {
          type: Object,
          required: false,
          default: () => {},
        },
      },
      data: () => {
        return {
          showExtendedFilter: false,
          translatedColumns: [],
          extendedFilterForm: {},
          extendedFilterFormFinalSchema: {},
        }
      },
      watch: {
        id: {
          immediate: true,
          deep: true,
          async handler() {
            await this.loadItems();
          }
        },
        extraParams: {
          immediate: true,
          deep: true,
          async handler() {
            await this.loadItems();
          }
        }
      },
      computed: {
        grid() {
          return this.$store.getters.GET_GRID(this.id)
        },
        actionParams() {
          return {
            url: APIService.getBaseUrl() + this.path,
            host: APIService.getBaseUrl(),
            path: this.path,
            updateRoute : this.updateRoute,
            viewRoute : this.viewRoute,
            extraData: this.extraData,
          }
        }
      },
      methods: {
        getGridDataForUpdate(){
          return Object.assign({}, this.grid);
        },
  
        updateParams(newProps) {
          let grid = this.getGridDataForUpdate();
          const token = this.id;
          grid.serverParams = Object.assign({}, grid.serverParams, newProps);
          this.$store.dispatch('UPDATE_GRID', {data: grid, token});
        },
  
        updateExtendedFilterVisibility() {
          this.showExtendedFilter = !this.showExtendedFilter;
        },
  
        onPageChange(params) {
          this.updateParams({page: params.currentPage});
          this.loadItems();
        },
  
        async onPerPageChange(params) {
          this.updateParams({perPage: params.currentPerPage});
          await this.loadItems();
        },
  
        async onSortChange(params) {
          const fieldIndex = this.columns.findIndex((column) => column.field === params[0].field);
          if (fieldIndex > -1) {
            const column = this.columns[fieldIndex]
            this.updateParams({
              sort: [{
                type: params[0].type,
                field: column.field,
              }],
            });
            await this.loadItems();
          }
        },
  
        onColumnFilter(params) {
          const columnFilters = {}
          for (let field in params.columnFilters) {
            const fieldValue = params.columnFilters[field]
            const fieldIndex = this.columns.findIndex((column) => {
              return column.field && column.field.toString() === field
            })
            if (fieldValue) {
              const column = this.columns[fieldIndex];
              const fieldName = (fieldIndex > -1 && column.filterField)
                ? column[fieldIndex].filterField
                : field;
              columnFilters[fieldName] = fieldValue;
            }
          }
          this.updateParams({
            columnFilters
          });
          this.extendedFilterForm = params.columnFilters;
          this.loadItems();
        },
  
        async markGridAsLoading() {
          const grid = this.getGridDataForUpdate();
          grid.isLoading = true;
          const token = this.id;
          this.$store.dispatch('UPDATE_GRID', {data: grid, token});
        },
  
        buildLinkForDataLoad() {
          let url = `${this.host}${this.path}?&page=${this.grid.serverParams.page}&limit=${this.grid.serverParams.perPage}`;
          if (this.grid.serverParams.sort.length > 0) {
            url += `&sort=${this.grid.serverParams.sort[0].field},${this.grid.serverParams.sort[0].type.toUpperCase()}`;
          }
          else {
            url += `&sort=${this.defaultSort}`;
          }
          if (Object.keys(this.grid.serverParams.columnFilters).length > 0) {
            for (let field in this.grid.serverParams.columnFilters) {
              const fieldValue = this.grid.serverParams.columnFilters[field];
              url += this.getFilter(field, fieldValue);
            }
          }
          if (this.extraParams) {
            url += this.extraParams;
          }
          return url;
        },
  
        async loadItems() {
          const store = this.$store;
          const token = this.id;
  
          if (this.grid) {
            const url = this.buildLinkForDataLoad();
            await this.markGridAsLoading();
            const result = await APIService.get(url);
            const grid = this.getGridDataForUpdate();
            if (result) {
              grid.totalRecords = result.total;
              grid.rows = result.data;
              if (this.enableCheckboxes) {
                grid.rows = grid.rows.map(row => {
                  const checked = grid.selectedRows.find(selectedRow => row.id === selectedRow.id);
                  row.vgtSelected = checked;
                  return row;
                });
              }
              grid.isLoading = false;
            } else {
              grid.isLoading = false;
            }
            store.dispatch('UPDATE_GRID', {data: grid, token});
          }
        },
  
        submitExtendedSearch() {
          const formattedFilter = Object.assign({}, this.grid.serverParams.columnFilters);
          for (const [key, value] of Object.entries(this.extendedFilterForm)) {
            if (
              typeof value === 'object' &&
              !Array.isArray(value) &&
              value !== null
            ) {
              for (const [nestedKey, nestedValue] of Object.entries(value)) {
                formattedFilter[`${key}.${nestedKey}`] = typeof(nestedValue) === 'string' ? nestedValue : nestedValue.toString();
              }
              delete formattedFilter[key];
            } else {
              formattedFilter[key] = typeof(value) === 'string' ? value : value.toString();
            }
          }
          this.onColumnFilter({
            columnFilters: formattedFilter,
          })
        },
  
        getFilter(fieldName, fieldValue) {
          const fieldColumnIndex = this.columns.findIndex((column) => {
            return column.field && column.field.toString() === fieldName
          });
          if (fieldColumnIndex > -1) {
            const column = this.columns[fieldColumnIndex];
            if (column.filterOptions.date) {
              const startDate = moment(fieldValue).utcOffset(0, false).startOf('day');
              const endDate = moment(startDate).endOf('day');
              return `&filter=${fieldName}||between||${encodeURIComponent(startDate.format())},${encodeURIComponent(endDate.format())}`;
            }
            const operation = column && column.filterOptions && column.filterOptions.strict ? 'eq' : 'cont';
            return `&filter=${fieldName}||${operation}||${fieldValue}`;
          }
          const fieldFormIndex = this.extendedFilterSchema.fields.findIndex((formField) => {
            return formField.model === fieldName;
          });
          if (fieldFormIndex > -1) {
            const field = this.extendedFilterSchema.fields[fieldFormIndex];
            if (field.filterOptions && field.filterOptions.date) {
              const startDate = moment(fieldValue).utc().startOf('day');
              const endDate = moment(startDate).endOf('day');
              return `&filter=${fieldName}||between||${encodeURIComponent(startDate.format())},${encodeURIComponent(endDate.format())}`;
            }
            const operation = field && field.strict ? 'eq' : 'cont';
            return `&filter=${fieldName}||${operation}||${fieldValue}`;
          }
          return `&filter=${fieldName}||cont||${fieldValue}`;
        },
  
        async selectionChanged(rowsSettings) {
          const token = this.id;
          const store = this.$store;
          const grid = this.getGridDataForUpdate();
          grid.selectedRows = rowsSettings.selectedRows;
          await store.dispatch('UPDATE_GRID', {data: grid, token});
        },
      },
  
      async beforeMount () {
        this.translatedColumns = this.columns.map(column => {
          column.label = this.$t(column.label);
          return column;
        });
        this.host = APIService.getBaseUrl();
        this.$store.dispatch('FETCH_GRID', this.id);
        if (this.perPage) {
          const token = this.id;
          const grid = this.grid;
          grid.serverParams.perPage = this.perPage;
          await this.$store.dispatch('UPDATE_GRID', {data: grid, token});
        }
        if (this.extendedFilterSchema) {
          let extendedFilterFormSchema = Object.assign({}, this.extendedFilterSchema)
          extendedFilterFormSchema.fields = extendedFilterFormSchema.fields.filter(formElement => {
            return formElement.type !== 'submit';
          });
          const submit =
            {
              type: "submit",
              buttonText: this.$t('search'),
              onSubmit: this.submitExtendedSearch,
              attributes: {
                class: "btn btn-primary btn-block",
              },
              styleClasses: "col-sm-12 col-md-4 col-lg-3 offset-md-8 offset-lg-9 no-padding",
            };
            extendedFilterFormSchema.fields.push(submit);
            extendedFilterFormSchema.fields = extendedFilterFormSchema.fields.map(field => {
              field.label = this.$t(field.label);
              if (field.placeholder) {
                field.placeholder = this.$t(field.placeholder);
              }
              return field;
            });
          this.extendedFilterFormFinalSchema = extendedFilterFormSchema;
        }
        await this.loadItems();
      }
    }
  </script>
  
  <style lang="scss">
    .vgt-selection-info-row {
      display: none;
    }
    .vgt-inner-wrap.is-loading {
      opacity: 0.75;
    }
    .footer__row-count__label {
      margin-bottom: 0;
    }
    .footer__row-count__label,
    .footer__row-count__select,
    .footer__navigation__page-info,
    .footer__navigation__page-btn span
    {
      font-size: 0.9rem !important;
    }
    .footer__navigation__page-btn {
      vertical-align: top !important;
    }
  </style>
  