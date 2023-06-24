<template>
    <CCard class="mb-4">
        <CCardHeader>
            <div class="d-flex justify-content-between">
                <span class="d-inline-block">
                    List Jabatan
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
</template>
<script>
import { cilPencil, cilTrash, cilUserFollow } from '@coreui/icons'
import { VueGoodTable } from 'vue-good-table-next'
import { mapActions, mapState } from 'pinia'
import { useTableStore } from '@/store/table'
import { useModalStore } from '@/store/modal'
import { useJabatanStore } from '@/store/jabatan'
import { useToastStore } from '@/store/toast'

export default {
    components: {
        VueGoodTable,
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
        ...mapState(useJabatanStore, ['url', 'form', 'method', 'validate']),
    },
    created() {
        this.setColumn([
            {
                label: 'Nama',
                field: 'nama_with_parent',
                filterOptions: {
                    enabled: true,
                },
            },
            {
                label: 'Level',
                field: 'level',
                filterOptions: {
                    enabled: true,
                },
            },
            {
                label: 'Aksi',
                field: 'action',
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

        ...mapActions(useJabatanStore, [
            'setId',
            'show',
            'resetForm',
            'resetValidation',
            'setMethod',
        ]),

        onShow(params) {
            this.loading(true)

            this.show(params.id)
                .then((response) => {
                    this.form.nama = response.data.nama
                    this.form.id_parent = response.data.id_parent

                    this.setId(response.data.id)
                    this.setMethod('PUT')
                    this.loading(false)
                })
                .catch((errors) => {
                    useToastStore().showToast({
                        show: true,
                        classType: 'bg-danger',
                        title: 'Gagal',
                        msg: errors,
                    })

                    this.resetForm()
                    this.resetValidation()
                    this.loading(false)
                })
        },
    },
}
</script>
