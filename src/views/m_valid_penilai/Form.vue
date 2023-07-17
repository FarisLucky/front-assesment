<template>
    <CCard class="mb-4">
        <CCardHeader>
            <div class="d-flex justify-content-between">
                <span class="d-inline-block">
                    Tambah Validasi Penilaian Khusus
                </span>
            </div>
        </CCardHeader>
        <CCardBody>
            <CForm method="post" @submit.prevent="onSubmit" autocomplete="off">
                <input type="hidden" name="__method" v-model="method" />
                <input type="hidden" name="id" v-if="method == 'PUT'" v-model="id" />
                <CRow class="align-items-end">
                    <CCol :md="12">
                        <div class="mb-1">
                            <CFormLabel for="nama">Nama</CFormLabel>
                            <VueMultiselect v-model="form.sub_penilaians" :options="subPenilains" label="nama" track-by="id"
                                :multiple="true">
                            </VueMultiselect>
                        </div>
                    </CCol>
                    <CCol :md="3">
                        <div class="mb-1">
                            <CFormLabel for="penilai">Jabatan Penilai</CFormLabel>
                            <CFormInput type="text" :value="idJabatanPenilai.karyawan.jabatan.nama" :disabled="true" />
                        </div>
                    </CCol>
                    <CCol>
                        <div class="mb-1 text-start">
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
import {
    cilSave,
    cilSync,
    cilArrowCircleLeft,
    cilMedicalCross,
    cilX,
} from '@coreui/icons'
import { mapActions, mapState } from 'pinia'
import { useToastStore } from '@/store/toast'
import DatePicker from 'vue-datepicker-next'
import 'vue-datepicker-next/index.css'
import { useSpinnerStore } from '@/store/spinner'
import { useMSubStore } from '@/store/m_sub'
import VueMultiselect from 'vue-multiselect'
import { useAuthStore } from '@/store/auth'
import { useMValidasiStore } from '@/store/m_validasi'

export default {
    components: {
        DatePicker,
        VueMultiselect,
    },
    data() {

        const idJabatanPenilai = useAuthStore().user

        return {
            cilSave,
            cilSync,
            cilArrowCircleLeft,
            cilMedicalCross,
            cilX,
            idJabatanPenilai,
            subPenilains: [],
        }
    },
    mounted() {
        this.btnStatus = this.addBtn
    },
    watch: {
        'addBtn'(newVal) {
            this.btnStatus = newVal
        }
    },
    created() {
        this.getSubPenilaians()
    },
    computed: {
        ...mapState(useMValidasiStore, ['id', 'form', 'validate', 'method']),
    },
    methods: {
        ...mapActions(useMValidasiStore, [
            'store',
            'update',
            'setMethod',
            'setValidation',
            'resetForm',
            'resetValidation',
        ]),

        ...mapActions(useToastStore, ['showToast']),

        ...mapActions(useSpinnerStore, ['loading']),

        getSubPenilaians() {
            useMSubStore()
                .fetchDataKhusus()
                .then((response) => {
                    let data = response.data.data.map((val) => ({
                        id: val.id,
                        nama: `${val.nama} ( ${val.relationship?.penilaian.nama} )`,
                    }))
                    this.subPenilains = data
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
                action = this.store(this.form)
            } else if (this.method == 'PUT') {
                action = this.update(this.form, this.id)
            }

            action
                .then((response) => {
                    this.showToast({
                        show: true,
                        classType: 'bg-success',
                        title: 'Berhasil ditambahkan !',
                        msg: response.data,
                    })
                    this.resetForm() // reset form value
                    this.resetValidation() // reset form validation
                    this.onRefresh()
                    this.setMethod('POST')
                    this.loading(false) // remove spinner loading
                    this.$emit('resetBtn')
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

                        // this.resetForm()
                        // this.resetValidation()
                    }
                })
        },

        onReset() {
            this.onRefresh()
            this.resetForm()
            this.resetValidation()
        },

        onRefresh() {
            this.$emit('fetch')
            this.getSubPenilaians()
        },
    },
}
</script>
<style src="vue-multiselect/dist/vue-multiselect.css"></style>
<style>
.multiselect,
.multiselect__tags,
.multiselect__input,
.multiselect__single {
    font-size: 12px !important;
}
</style>
