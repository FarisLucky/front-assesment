<template>
    <div>
        <CCard class="mb-4">
            <CCardHeader>
                <span class="d-inline-block">
                    File Karyawan
                </span>
                <div class="text-end">
                    <router-link :to="{ name: 'tambah-karyawan' }" class="btn btn-sm btn-primary me-2">
                        <CIcon :content="cilUserFollow" size="sm" />
                        Tambah
                    </router-link>
                    <CButton color="success" variant="outline" @click.prevent="uploadModal">
                        <CIcon :content="cilCloudUpload" size="sm" />
                        Upload
                    </CButton>
                </div>
            </CCardHeader>
            <CCardBody>
                <vue-good-table mode="remote" :totalRows="totalRecords" :pagination-options="paginations"
                    :isLoading="isLoading" :columns="columns" :rows="rows" :select-options="{ enabled: true }"
                    v-on:page-change="onPageChange" v-on:per-page-change="onPerPageChange"
                    v-on:column-filter="onColumnFilter" v-on:sort-change="onSortChange" v-on:select-all="onSelectAll"
                    theme="polar-bear">
                    <template #table-actions>
                        <CButton color="secondary" class="me-2" @click.prevent="deleteAll">
                            <CIcon :content="cilTrash" size="sm" />
                        </CButton>
                    </template>
                    <template #table-row="props">
                        <span v-if="props.column.field == 'action'">
                            <router-link :to="{ name: 'edit-karyawan', params: { id: props.row.id } }">
                                <CIcon :content="cilPencil" size="sm" />
                            </router-link>
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
        <Modal></Modal>
    </div>
</template>
<script>
import Toast from '../../components/Toast.vue'
import Modal from './Modal.vue'
import { cilPencil, cilTrash, cilUserFollow, cilCloudUpload } from '@coreui/icons'
import { VueGoodTable } from 'vue-good-table-next'
import { mapActions, mapState } from 'pinia'
import { useKaryawansStore } from '@/store/karyawans'
import { useModalStore } from '@/store/modal'
import { http } from '@/config'
import queryString from 'query-string'

export default {
    components: {
        VueGoodTable,
        Toast,
        Modal,
    },
    data() {
        return {
            cilPencil,
            cilTrash,
            cilUserFollow,
            cilCloudUpload,
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
                        enabled: false,
                    },
                },
                {
                    label: 'Alamat',
                    field: 'alamat',
                    filterOptions: {
                        enabled: false,
                    },
                    sortable: false,
                },
                {
                    label: 'Jabatan',
                    field: 'jabatan_nama',
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
        ...mapState(useKaryawansStore, ['url']),
    },
    created() {
        this.setUrl(this.url)

        this.fetchData()
    },
    methods: {
        ...mapActions(useKaryawansStore, ['setId']),

        ...mapActions(useModalStore, [
            'setModal',
            'setParams',
            'setSize',
            'setTitle',
            'setComponent',
        ]),

        uploadModal() {
            this.setModal(true)
            this.setTitle('Excel')
            this.setSize('xl')
            this.setComponent('Excel')
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
