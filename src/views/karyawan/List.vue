<template>
    <div>
        <CCard class="mb-4">
            <CCardHeader>
                <div class="d-flex justify-content-between">
                    <span class="d-inline-block">
                        File Karyawan
                    </span>
                    <router-link
                        :to="{name:'tambah-karyawan'}"
                        class="btn btn-sm btn-primary"
                    >
                        <CIcon
                            :content="cilUserFollow"
                            size="sm"
                        />
                        Tambah
                    </router-link>
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
                            <router-link :to="{ name: 'edit-karyawan', params: { id: props.row.id }}">
                                <CIcon
                                    :content="cilPencil"
                                    size="sm"
                                />
                            </router-link>
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
        <Modal></Modal>
    </div>
</template>
<script>
import Toast from '../../components/Toast.vue'
import Modal from './Modal.vue'
import { cilPencil, cilTrash, cilUserFollow } from '@coreui/icons'
import { VueGoodTable } from 'vue-good-table-next'
import { mapActions, mapState } from 'pinia'
import { useKaryawansStore } from '@/store/karyawans'
import { useTableStore } from '@/store/table'
import { useModalStore } from '@/store/modal'

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
        ...mapState(useKaryawansStore, ['url']),
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

        ...mapActions(useKaryawansStore, ['setId']),

        deleteAll() {
            console.log(this.selectedRows)
        },
    },
}
</script>
