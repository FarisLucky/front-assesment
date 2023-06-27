<template>
    <div>
        <CCard class="mb-4">
            <CCardHeader>
                <div class="d-flex justify-content-between">
                    <span class="d-inline-block">
                        Histori Penilaian Karyawan
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
                                :to="{name: 'ShowUmumHistory', params: { id_karyawan: props.row.id, tipe: tipe, month: month, year: year}}"
                                class="link-primary"
                                style="margin-right: 2px;"
                            >
                                <CIcon
                                    :content="cilChevronDoubleRight"
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
import {
    cilPen,
    cilTrash,
    cilUserFollow,
    cilChevronDoubleRight,
} from '@coreui/icons'
import { VueGoodTable } from 'vue-good-table-next'
import { mapActions, mapState } from 'pinia'
import { useTableStore } from '@/store/table'
import { useModalStore } from '@/store/modal'
import { useHistoryStore } from '@/store/history_penilaian'

export default {
    components: {
        VueGoodTable,
    },
    data() {
        return {
            cilPen,
            cilTrash,
            cilUserFollow,
            cilChevronDoubleRight,
            tipe: 'pk_umum',
            month: new Date().getUTCMonth() + 1,
            year: new Date().getUTCFullYear(),
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
        ...mapState(useHistoryStore, ['url']),
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

        ...mapActions(useHistoryStore, ['setId']),

        deleteAll() {
            console.log(this.selectedRows)
        },
    },
}
</script>
