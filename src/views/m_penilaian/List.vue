<template>
    <div>
        <CCard class="mb-4">
            <CCardHeader>
                <div class="d-flex justify-content-between">
                    <span class="d-inline-block">
                        Master Penilaian
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
                    <template #table-actions>
                        <CButton
                            color="secondary"
                            class="me-2"
                            @click.prevent="deleteAll"
                        >
                            <CIcon
                                :content="cilTrash"
                                size="sm"
                            />
                        </CButton>
                    </template>
                    <template #table-row="props">
                        <span v-if="props.column.field == 'action'">
                            <a
                                href="javascript:"
                                @click.prevent="onShow({id: props.row.id})"
                            >
                                <CIcon
                                    :content="cilPencil"
                                    size="sm"
                                />
                            </a>
                            <a
                                href="javascript:"
                                @click.prevent="
                                      setModal(true);
                                      setSize('sm');
                                      setComponent('Delete');
                                      setId(props.row.id);
                                  "
                                class="text-danger"
                            >
                                <CIcon
                                    :content="cilTrash"
                                    size="sm"
                                />
                            </a>
                        </span>
                    </template>
                </vue-good-table>
            </CCardBody>
        </CCard>
    </div>
</template>
<script>
import Toast from '../../components/Toast.vue'
import Modal from './Modal.vue'
import { cilPencil, cilTrash, cilUserFollow } from '@coreui/icons'
import { VueGoodTable } from 'vue-good-table-next'
import { mapActions, mapState } from 'pinia'
import { useMPenilaianStore } from '@/store/m_penilaian'
import { useTableStore } from '@/store/table'
import { useModalStore } from '@/store/modal'
import { useToastStore } from '@/store/toast'
import { useSpinnerStore } from '@/store/spinner'

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
        }
    },
    computed: {
        ...mapState(useTableStore, [
            'isLoading',
            'columns',
            'rows',
            'totalRecords',
            'serverParams',
            'paginations',
            'search',
            'selectedRows',
        ]),

        ...mapState(useMPenilaianStore, ['id', 'url', 'form', 'method']),
    },
    created() {
        this.setColumn([
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
                field: 'tipe',
                filterOptions: {
                    enabled: true,
                },
            },
            {
                label: 'Jabatan',
                field: 'relationship.jabatan.nama',
                sortable: false,
            },
            {
                label: 'Level',
                field: 'level',
                sortable: false,
            },
            {
                label: 'Aksi',
                field: 'action',
                html: true,
                sortable: false,
            },
        ])
        this.setUrl(this.url)

        this.fetchData()
    },
    methods: {
        ...mapActions(useTableStore, {
            updateParams: 'updateParams',
            onPageChange: 'onPageChange',
            onPerPageChange: 'onPerPageChange',
            onColumnFilter: 'onColumnFilter',
            onSortChange: 'onSortChange',
            onSelectAll: 'onSelectAll',
            removeNullFilter: 'removeNullFilter',
            fetchData: 'fetchData',
            setColumn: 'setColumn',
            setRow: 'setRow',
            setUrl: 'setUrl',
            setTotalRecord: 'setTotalRecord',
            loading: 'loading',
        }),

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
                    this.form.tipe = response.data.tipe
                    this.form.id_jabatan_penilai =
                        response.data.id_jabatan_penilai

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
        deleteAll() {
            console.log(this.selectedRows)
        },
    },
}
</script>
