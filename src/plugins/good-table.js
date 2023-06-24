class GoodTableSetup {
  constructor(fetch) {
    this.fetch = fetch
  }

  updateParams(newProps) {
    this.serverParams = Object.assign({}, this.serverParams, newProps)
  }

  onPageChange(params) {
    this.loading()
    this.updateParams({ page: params.currentPage })
    this.fetchData()
  }

  onPerPageChange(params) {
    this.loading()
    this.updateParams({
      page: 1, // mulai dari awal ketika rows per page diubah
      perPage: params.currentPerPage,
    })
    this.fetchData()
  }

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
  }

  onSortChange(params) {
    let sort = {
      sort: {
        sort_by: params[0].field,
        sort_type: params[0].type,
      },
    }
    this.updateParams(sort)
    this.fetchData()
  }

  onSelectAll(params) {
    this.selectedRows = params
  }

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
  }
}
