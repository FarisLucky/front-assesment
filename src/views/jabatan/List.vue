<template>
    <Form @fetch="onRefresh" />
    <CCard class="mb-4">
        <CCardHeader>
            <div class="d-flex justify-content-between">
                <span class="d-inline-block">
                    List Jabatan
                </span>
                <CButton color="light" @click.prevent="onRefresh">
                    <CIcon :content="cilSync" size="sm" />
                </CButton>
            </div>
        </CCardHeader>
        <CCardBody>
            <div class="text-end">
                <a href="http://localhost/simpeg/jabatan/cetak/" target="_blank" class="btn btn-sm btn-warning mb-2">
                    <CIcon :content="cilPrint" size="sm" />
                </a>
            </div>
            <vue-good-table mode="local" :isLoading="isLoading" :columns="columns" :rows="rows" :line-numbers="true"
                :pagination-options="{
                    enabled: true
                }" theme="polar-bear">
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
    <Modal @fetch="onRefresh"></Modal>
</template>
<script>
import Form from './Form.vue'
import Modal from './Modal.vue'
import { cilPencil, cilTrash, cilUserFollow, cilSync, cilPrint } from '@coreui/icons'
import { VueGoodTable } from 'vue-good-table-next'
import { mapActions, mapState } from 'pinia'
import { useModalStore } from '@/store/modal'
import { useJabatanStore } from '@/store/jabatan'
import { useToastStore } from '@/store/toast'
import { useSpinnerStore } from '@/store/spinner'
import { http } from '@/config'

export default {
    components: {
        VueGoodTable, Modal, Form
    },
    data() {
        return {
            cilPencil,
            cilTrash,
            cilUserFollow,
            cilSync,
            cilPrint,
            isLoading: true,
            columns: [
                {
                    label: 'Nama',
                    field: 'nama',
                    filterOptions: {
                        enabled: true,
                    },
                },
                {
                    label: 'Kategori',
                    field: 'kategori_desc',
                    filterOptions: {
                        enabled: true,
                    },
                },
                {
                    label: 'Atasan',
                    field: 'relationship.parent.nama',
                    filterOptions: {
                        enabled: true,
                    },
                },
                {
                    label: 'Terakhir diubah',
                    field: 'updated_at',
                    filterOptions: {
                        enabled: false,
                    },
                },
                {
                    label: 'Aksi',
                    field: 'action',
                    filterOptions: {
                        enabled: false,
                    },
                    sortable: false,
                },
            ],
            rows: [],
        }
    },
    computed: {
        ...mapState(useJabatanStore, ['url', 'form', 'method', 'validate']),
    },
    created() {
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

        ...mapActions(useJabatanStore, [
            'setId',
            'show',
            'resetForm',
            'resetValidation',
            'setMethod',
        ]),
        ...mapActions(useSpinnerStore, [
            'loading',
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
                    console.log(errors.toJSON())
                    if (errors) {

                    }
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

        onRefresh() {
            this.fetchData()
        },

        async fetchData() {

            this.isLoading = true

            await http
                .get(this.url)
                .then((response) => {
                    let rows = response.data.data

                    this.rows = rows

                    this.isLoading = false
                })
                .catch((errors) => {
                    useToastStore().showToast({
                        show: true,
                        classType: 'bg-danger',
                        title: 'Gagal',
                        msg: errors,
                    })
                    this.isLoading = false
                })
        },

    },
}
</script>
