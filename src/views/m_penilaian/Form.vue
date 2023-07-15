<template>
    <CCard class="mb-4">
        <CCardHeader>
            <div class="d-flex justify-content-between">
                <span class="d-inline-block">
                    Tambah Penilaian
                </span>
            </div>
        </CCardHeader>
        <CCardBody>
            <CForm method="post" @submit.prevent="onSubmit" autocomplete="off">
                <input type="hidden" name="__method" v-model="method" />
                <input type="hidden" name="id" v-if="method == 'PUT'" v-model="id" />
                <CRow class="align-items-end">
                    <CCol :md="3">
                        <div class="mb-1">
                            <CFormLabel for="nama">Nama</CFormLabel>
                            <CFormInput id="nama" type="text" v-model="form.nama" />
                            <div class=" invalid-feedback d-inline-block" v-if="validate?.nama">
                                {{ validate?.nama[0] }}
                            </div>
                        </div>
                    </CCol>
                    <CCol :md="3">
                        <div class="mb-1">
                            <CFormLabel for="tipe">Tipe Penilaian</CFormLabel>
                            <v-select v-model="form.id_tipe" :options="tipePenilaianList" :reduce="tipe => tipe.id">
                            </v-select>
                            <div class="invalid-feedback d-inline-block" v-if="validate?.id_tipe">
                                {{ validate?.id_tipe[0] }}
                            </div>
                        </div>
                    </CCol>
                    <CCol :md="1">
                        <div class="mb-1">
                            <CFormLabel for="nama">Bobot</CFormLabel>
                            <CFormInput id="nama" type="number" v-model="form.bobot" />
                            <div class="invalid-feedback d-inline-block" v-if="validate?.bobot">
                                {{ validate?.bobot[0] }}
                            </div>
                        </div>
                    </CCol>
                    <CCol>
                        <div class="mb-1">
                            <CButton type="submit" color="primary" class="mt-1" style="margin-right: 7px;">
                                <CIcon :content="cilSave" size="sm" />
                                Simpan
                            </CButton>
                            <CButton type="reset" color="secondary" class="mt-1" style="margin-right: 7px;"
                                @click.prevent="onReset">
                                <CIcon :content="cilSync" size="sm" />
                                Reset
                            </CButton>
                        </div>
                    </CCol>
                </CRow>
            </CForm>
        </CCardBody>
    </CCard>
</template>
<script>
import { cilSave, cilSync, cilArrowCircleLeft } from '@coreui/icons'
import { mapActions } from 'pinia'
import { mapState } from 'pinia'
import { useToastStore } from '@/store/toast'
import { useJabatanStore } from '@/store/jabatan'
import DatePicker from 'vue-datepicker-next'
import 'vue-datepicker-next/index.css'
import { useSpinnerStore } from '@/store/spinner'
import { useMPenilaianStore } from '@/store/m_penilaian'
import { useMTipeStore } from '@/store/m_tipe'

export default {
    components: {
        DatePicker,
    },
    data() {
        return {
            cilSave,
            cilSync,
            cilArrowCircleLeft,
            jabatanLists: [],
            tipePenilaianList: []
        }
    },
    computed: {
        ...mapState(useMPenilaianStore, [
            'id',
            'form',
            'url',
            'method',
            'validate',
            'tipeLists',
        ]),
    },
    watch: {
        'form.nama'() {
            this.form.nama = this.form.nama.toUpperCase()
        },
        'form.bobot'(newVal) {
            this.form.bobot = newVal.length > 3 ? '' : newVal
        }
    },
    created() {
        this.resetForm()
        this.getTipe()
    },
    methods: {
        ...mapActions(useMPenilaianStore, [
            'store',
            'update',
            'resetForm',
            'setValidation',
            'setMethod',
            'resetValidation',
        ]),

        ...mapActions(useToastStore, ['showToast']),

        ...mapActions(useSpinnerStore, ['loading']),

        getJabatans() {
            useJabatanStore()
                .fetchData()
                .then((response) => {
                    let prepareData = response.data.map((val) => ({
                        id: val.id,
                        label: val.nama + ' / ' + val.level,
                    }))
                    this.jabatanLists = prepareData
                })
                .catch((errors) => {
                    this.showToast({
                        show: true,
                        classType: 'bg-danger',
                        title: 'Gagal',
                        msg: errors.response.data.message,
                    })
                })
        },

        getTipe() {
            useMTipeStore()
                .fetchData()
                .then((response) => {
                    console.log(response)
                    let prepareData = response.data.data.map((val) => ({
                        id: val.id,
                        label: val.tipe + ' / ' + val.nama,
                    }))
                    this.tipePenilaianList = prepareData
                })
                .catch((errors) => {
                    this.showToast({
                        show: true,
                        classType: 'bg-danger',
                        title: 'Gagal',
                        msg: errors.response.data.message,
                    })
                })
        },

        onSubmit() {
            this.loading(true)

            let action

            if (this.method == 'POST') {
                action = this.store()
            } else if (this.method == 'PUT') {
                action = this.update(this.id)
            }

            action
                .then((response) => {
                    this.showToast({
                        show: true,
                        classType: 'bg-success',
                        title: 'Berhasil',
                        msg: 'Tindakan Berhasil',
                    })
                    this.resetForm() // reset form value
                    this.resetValidation() // reset form validation
                    this.onRefresh()
                    this.setMethod('POST')
                    this.loading(false) // remove spinner loading
                })
                .catch((errors) => {
                    this.loading(false)
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

        onReset() {
            this.$emit('fetch') // reload data in table
            this.getTipe()
            this.resetForm()
            this.resetValidation()
        },

        onRefresh() {
            this.$emit('fetch') // reload data in table
        }
    },
}
</script>
