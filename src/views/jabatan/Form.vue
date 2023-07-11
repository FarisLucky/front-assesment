<template>
    <CCard class="mb-4">
        <CCardHeader>
            <div class="d-flex justify-content-between">
                <span class="d-inline-block">
                    Tambah Jabatan
                </span>
            </div>
        </CCardHeader>
        <CCardBody>
            <form method="post" @submit.prevent="onSubmit" autocomplete="off">
                <input type="hidden" name="__method" v-model="method" />
                <input type="hidden" name="id" v-if="method == 'PUT'" v-model="id" />
                <CRow class="align-items-end">
                    <CCol :md="4">
                        <div class="mb-1">
                            <CFormLabel for="nama">Nama</CFormLabel>
                            <CFormInput id="nama" type="text" v-model="form.nama" autofocus />
                            <div class="invalid-feedback d-inline-block" v-if="validate?.nama">
                                {{ validate?.nama[0] }}
                            </div>
                        </div>
                    </CCol>
                    <CCol :md="4">
                        <div class="mb-1">
                            <CFormLabel for="penilai">Parent</CFormLabel>
                            <v-select v-model="form.id_parent" :options="jabatanLists" :reduce="jabatan => jabatan.id">
                            </v-select>
                            <div class="invalid-feedback d-inline-block" v-if="validate?.id_parent">
                                {{ validate?.id_parent[0] }}
                            </div>
                        </div>
                    </CCol>
                    <CCol>
                        <div class="mb-1">
                            <CButton type="submit" color="primary" style="margin-right: 7px;">
                                <CIcon :content="cilSave" size="sm" />
                                Simpan
                            </CButton>
                            <CButton type="reset" color="secondary" variant="outline" @click.prevent="onReset">
                                <CIcon :content="cilSync" size="sm" />
                                Reset
                            </CButton>
                        </div>
                    </CCol>
                </CRow>
            </form>
        </CCardBody>
    </CCard>
</template>
<script>
import { cilSave, cilSync } from '@coreui/icons'
import { useJabatanStore } from '@/store/jabatan'
import { mapActions } from 'pinia'
import { mapState } from 'pinia'
import { useToastStore } from '@/store/toast'
import { useSpinnerStore } from '@/store/spinner'

export default {
    data() {
        return {
            cilSave,
            cilSync,
            jabatanLists: [],
        }
    },
    computed: {
        ...mapState(useJabatanStore, [
            'id',
            'form',
            'method',
            'url',
            'validate',
        ]),
    },
    created() {
        this.getJabatanList()
    },
    watch: {
        'form.nama'() {
            this.form.nama = this.form.nama.toUpperCase()
        },
        'form.id_parent'(newVal) {
            console.log(newVal)
        },
    },
    methods: {
        ...mapActions(useJabatanStore, [
            'fetchData',
            'store',
            'update',
            'resetForm',
            'setMethod',
            'resetValidation',
            'setValidation',
        ]),

        getJabatanList() {
            this.fetchData()
                .then((response) => {
                    const data = response.data.map((val) => {
                        return {
                            id: val.id,
                            label: val.nama_with_parent,
                        }
                    })
                    this.jabatanLists = data
                })
                .catch((errors) => {
                    console.log(errors)
                    if (errors.response.status == 422) {
                        this.setValidation(errors.response.data.errors)
                    } else {
                        this.showToast({
                            show: true,
                            classType: 'bg-danger',
                            title: 'Gagal',
                            msg: errors?.response.data.message,
                        })

                        this.resetForm()
                        this.resetValidation()
                    }
                })
        },

        onRefresh() {
            this.$emit('fetch')
        },

        onSubmit() {

            useSpinnerStore().loading(true)

            let action

            if (this.method == 'POST') {
                action = this.store(this.form)
            } else if (this.method == 'PUT') {
                action = this.update(this.form, this.id)
            }

            action
                .then((response) => {
                    useToastStore().showToast({
                        show: true,
                        classType: 'bg-success',
                        title: 'Berhasil ditambahkan !',
                        msg: response.data,
                    })
                    this.resetForm()
                    this.resetValidation()
                    this.setMethod('POST')
                    this.onRefresh()
                    useSpinnerStore().loading(false)
                    this.getJabatanList() // reload get jabatan list
                })
                .catch((errors) => {
                    useSpinnerStore().loading(false)
                    console.log(errors)
                    if (errors.response?.status == 422) {
                        this.setValidation(errors.response.data.errors)
                    } else {
                        useToastStore().showToast({
                            show: true,
                            classType: 'bg-danger',
                            title: 'Gagal',
                            msg: errors?.response.data.message,
                        })

                        this.resetValidation()
                    }
                })
        },

        onReset() {
            this.onRefresh()
            this.resetForm()
            this.resetValidation()
        },
    },
}
</script>
