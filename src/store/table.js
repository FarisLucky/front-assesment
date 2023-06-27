import { http } from "@/config";
import { defineStore } from "pinia";
import queryString from "query-string";
import { useAuthStore } from "./auth";
import { useToastStore } from "./toast";

export const useTableStore = defineStore('table', {
  state: () => ({
    isLoading: true,
    columns: [],
    rows: [],
    totalRecords: 0,
    serverParams: {
      columnFilters: {},
      sort: {
        sort_by: '',
        sort_type: '',
      },
      page: 1,
      perPage: 10,
      search: '',
      filterBy: {
        column_key: '',
        column_val: '',
      },
    },
    paginations: {
      enabled: true,
      mode: 'records',
    },
    search: {
      enabled: true,
      placeholder: 'Silahkan cari data disini',
    },
    selectedRows: null,
    fetchUrl: null,
  }),
  actions: {

    updateParams(newProps) {
      this.serverParams = Object.assign({}, this.serverParams, newProps)
    },

    onPageChange(params) {
      this.loading()
      this.updateParams({ page: params.currentPage })
      this.fetchData()
    },

    onPerPageChange(params) {
      this.loading()
      this.updateParams({
        page: 1, // mulai dari awal ketika rows per page diubah
        perPage: params.currentPerPage,
      })
      this.fetchData()
    },

    onColumnFilter(params) {
      let vKey = this.removeNullFilter(params.columnFilters, 'key')
      let vVal = this.removeNullFilter(params.columnFilters, 'val')
      let customParams = {
        filterBy: {
          column_key: vKey,
          column_val: vVal,
        },
      }
      let filterLength =
        Object.values(params.columnFilters)[0]?.length ?? 0
      if (filterLength >= 3 || filterLength == 0) {
        this.updateParams(customParams)
        this.fetchData()
      }
    },

    onSortChange(params) {
      let sort = {
        sort: {
          sort_by: params[0].field,
          sort_type: params[0].type,
        },
      }
      this.updateParams(sort)
      this.fetchData()
    },

    onSelectAll(params) {
      this.selectedRows = params
    },

    removeNullFilter(obj, type) {
      for (var propName in obj) {
        if (obj[propName] === '') {
          delete obj[propName]
        }
      }
      if (type == 'key') {
        return Object.keys(obj)
      }
      return Object.values(obj)
    },

    setColumn(columns) {
      this.columns = columns
    },

    setTotalRecord(totalRecord) {
      this.totalRecords = totalRecord
    },

    setRow(row) {
      this.rows = row
    },

    loading(status) {
      this.isLoading = status
    },

    setUrl(url) {
      this.fetchUrl = url

    },

    reset() {
      this.columns = []
      this.rows = []
      this.totalRecords = 0
      this.fetchUrl = null
      this.selectedRows = null
    },

    async fetchData() {

      let query = queryString.stringify(
        Object.assign(
          this.serverParams.filterBy,
          this.serverParams.sort,
        ),
        { arrayFormat: 'index' },
      )

      this.loading(true)

      await http
        .get(`${this.fetchUrl}?${query}&page=${this.serverParams.page}&per_page=${this.serverParams.perPage}`)
        .then((response) => {

          let from_page = response.data.meta.from
          let rows = response.data.data.map((item, key) => {
            item.no = from_page
            from_page++
            return item
          })

          this.setTotalRecord(response.data.meta.total)
          this.setRow(rows)
          this.loading(false)
        }).catch(errors => {
          useToastStore().showToast({
            show: true,
            classType: 'bg-danger',
            title: 'Gagal',
            msg: errors,
          })
          this.loading(false)
        })
    },
  }
})

export default useTableStore
