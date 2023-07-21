<template>
    <Form @fetch="onRefresh"></Form>
    <div>
        <CCard class="mb-4">
            <CCardHeader>
                <div class="d-flex justify-content-between">
                    <span class="d-inline-block">
                        Master Penilaian
                    </span>
                    <CButton color="light" @click.prevent="onRefresh">
                        <CIcon :content="cilSync" size="sm" />
                    </CButton>
                </div>
            </CCardHeader>
            <CCardBody>
                <vue-good-table mode="remote" :totalRows="totalRecords" :pagination-options="paginations"
                    :isLoading="isLoading" :columns="columns" :rows="rows" :select-options="{ enabled: true }"
                    v-on:page-change="onPageChange" v-on:per-page-change="onPerPageChange"
                    v-on:column-filter="onColumnFilter" v-on:sort-change="onSortChange" v-on:select-all="onSelectAll"
                    theme="polar-bear">
                    <template #table-row="props">
                        <span v-if="props.column.field == 'action'">
                            <a href="javascript:" @click.prevent="onShow({ id: props.row.id })">
                                <CIcon :content="cilPencil" size="sm" />
                            </a>
                            <a href="javascript:" @click.prevent="
                                setModal(true);
                            setSize('sm');
                            setComponent('Delete');
                            setId(props.row.id);
                            " class="text-danger">
                                <CIcon :content="cilTrash" size="sm" />
                            </a>
                        </span>
                    </template>
                </vue-good-table>
            </CCardBody>
        </CCard>
    </div>
    <Modal @fetch="onRefresh"></Modal>
</template>
<script>
import Toast from '../../components/Toast.vue'
import Modal from './Modal.vue'
import Form from './Form.vue'
import { cilPencil, cilTrash, cilUserFollow, cilSync } from '@coreui/icons'
import { VueGoodTable } from 'vue-good-table-next'
import { mapActions, mapState } from 'pinia'
import { useMPenilaianStore } from '@/store/m_penilaian'
import { useModalStore } from '@/store/modal'
import { useToastStore } from '@/store/toast'
import { useSpinnerStore } from '@/store/spinner'
import { http } from '@/config'
import queryString from 'query-string'

export default {
    components: {
        VueGoodTable,
        Toast,
        Modal,
        Form
    },
    data() {
        return {
            cilPencil,
            cilTrash,
            cilUserFollow,
            cilSync,
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
                    label: 'Tipe',
                    field: 'relationship.tipe_penilaian.nama',
                    filterOptions: {
                        enabled: true,
                    },
                },
                {
                    label: 'Jenis',
                    field: 'tipe',
                    filterOptions: {
                        enabled: true,
                    },
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
        ...mapState(useMPenilaianStore, ['id', 'url', 'form', 'method']),
    },
    created() {
        this.setUrl(this.url)

        this.onRefresh()
    },
    methods: {
        ...mapActions(useModalStore, [
            'setModal',
            'setParams',
            'setSize',
            'setTitle',
            'setComponent',
        ]),

        ...mapActions(useMPenilaianStore, ['setId', 'show', 'setMethod']),

        ...mapActions(useSpinnerStore, ['loading']),

        ...mapActions(useToastStore, ['showToast']),

        onShow(params) {
            this.loading(true)

            this.show(params.id)
                .then((response) => {
                    this.form.nama = response.data.nama
                    this.form.id_tipe = response.data.id_tipe
                    this.form.bobot = response.data.bobot

                    this.setId(response.data.id)
                    this.setMethod('PUT')
                    this.loading(false)
                })
                .catch((errors) => {
                    console.log(errors)
                    this.showToast({
                        show: true,
                        classType: 'bg-danger',
                        title: 'Gagal',
                        msg: errors.response.data.message,
                    })

                    this.resetForm()
                    this.resetValidation()
                    this.loading(false)
                })
        },

        onRefresh() {
            this.fetchData()
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
