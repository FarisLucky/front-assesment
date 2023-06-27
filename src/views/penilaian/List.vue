<template>
    <div>
        <CCard class="mb-4">
            <CCardHeader>
                <div class="d-flex justify-content-between">
                    <span class="d-inline-block">
                        Penilaian Karyawan
                    </span>
                </div>
            </CCardHeader>
            <CCardBody>
                <vue-good-table
                    mode="remote"
                    :totalRows="totalRecords"
                    :pagination-options="paginations"
                    :isLoading="isLoading"
                    :columns="columns"
                    :rows="rows"
                    :select-options="{ enabled: true }"
                    v-on:page-change="onPageChange"
                    v-on:per-page-change="onPerPageChange"
                    v-on:column-filter="onColumnFilter"
                    v-on:sort-change="onSortChange"
                    v-on:select-all="onSelectAll"
                >
                    <template #table-row="props">
                        <span v-if="props.column.field == 'action'">
                            <router-link
                                v-if="props.row.relationship.pk_umum?.length < 1 || props.row.relationship.pk_umum[0].status == 'draft'"
                                :to="{name: 'PenilaianEdit', params: { id_karyawan: props.row.id, tipe: tipe.umum }}"
                                class="link-primary"
                                style="margin-right: 2px;"
                            >
                                <CIcon
                                    :content="cilPen"
                                    size="sm"
                                />
                            </router-link>
                            <router-link
                                v-if="props.row.relationship.pk_khusus?.length < 1 || props.row.relationship.pk_khusus[0]?.status == 'draft'"
                                :to="{name: 'PenilaianEdit', params: { id_karyawan: props.row.id, tipe: tipe.khusus }}"
                                class="link-info"
                            >
                                <CIcon
                                    :content="cilPenAlt"
                                    size="sm"
                                />
                            </router-link>
                        </span>
                    </template>
                </vue-good-table>
            </CCardBody>
        </CCard>
    </div>
</template>
<script>
import { cilPen, cilTrash, cilUserFollow, cilPenAlt } from '@coreui/icons'
import { VueGoodTable } from 'vue-good-table-next'
import { mapActions, mapState } from 'pinia'
import { useModalStore } from '@/store/modal'
import { usePenilaianStore } from '@/store/penilaian'
import { http } from '@/config'
import queryString from 'query-string'

export default {
    components: {
        VueGoodTable,
    },
    data() {
        return {
            cilPen,
            cilTrash,
            cilUserFollow,
            cilPenAlt,
            tipe: {
                umum: 'pk_umum',
                khusus: 'pk_khusus',
            },
            isLoading: true,
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
            columns: [
                {
                    label: '#',
                    field: 'no',
                    sortable: false,
                },
                {
                    label: 'Nama',
                    field: 'nama',
                    filterOptions: {
                        enabled: true,
                    },
                },
                {
                    label: 'Nip',
                    field: 'nip',
                    filterOptions: {
                        enabled: true,
                    },
                },
                {
                    label: 'Sex',
                    field: 'sex',
                    sortable: false,
                },
                {
                    label: 'Tgl Lahir',
                    field: 'tgl_lahir',
                    filterOptions: {
                        enabled: true,
                    },
                },
                {
                    label: 'Alamat',
                    field: 'alamat',
                    filterOptions: {
                        enabled: true,
                    },
                    sortable: false,
                },
                {
                    label: 'Jabatan',
                    field: 'relationship.jabatans.nama',
                    filterOptions: {
                        enabled: true,
                    },
                    sortable: false,
                },
                {
                    label: 'Aksi',
                    field: 'action',
                    html: true,
                    sortable: false,
                },
            ],
            rows: [],
            totalRecords: 0,
        }
    },
    computed: {
        ...mapState(usePenilaianStore, ['url']),
    },
    created() {
        this.setUrl(this.url)

        this.fetchData()
    },
    methods: {
        ...mapActions(useModalStore, [
            'setModal',
            'setParams',
            'setSize',
            'setTitle',
            'setComponent',
        ]),
        ...mapActions(usePenilaianStore, ['setId']),

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
                .get(
                    `${this.fetchUrl}?${query}&page=${this.serverParams.page}&per_page=${this.serverParams.perPage}`,
                )
                .then((response) => {
                    let from_page = response.data.meta.from
                    let rows = response.data.data.map((item, key) => {
                        item.no = from_page
                        from_page++
                        return item
                    })

                    this.totalRecords = response.data.meta.total
                    this.rows = rows

                    this.loading(false)
                })
                .catch((errors) => {
                    useToastStore().showToast({
                        show: true,
                        classType: 'bg-danger',
                        title: 'Gagal',
                        msg: errors,
                    })
                    this.loading(false)
                })
        },

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

        deleteAll() {
            console.log(this.selectedRows)
        },

        loading(status) {
            this.isLoading = status
        },

        setUrl(url) {
            this.fetchUrl = url
        },
    },
}
</script>
