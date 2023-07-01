<template>
    <CCard class="mb-4">
        <CCardHeader>
            <div class="d-flex justify-content-between">
                <span class="d-inline-block">
                    Tambah Tipe
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
                            <CFormInput id="nama" type="text" v-model="form.nama" />
                            <div class="invalid-feedback d-inline-block" v-if="validate?.nama">
                                {{ validate?.nama[0] }}
                            </div>
                        </div>
                    </CCol>
                    <CCol :md="12">
                        <div class="mb-1">
                            <CFormLabel for="nama">Tipe</CFormLabel>
                            <v-select v-model="form.tipe" :options="tipeLists" :reduce="tipe => tipe.id">
                            </v-select>
                            <div class="invalid-feedback d-inline-block" v-if="validate?.tipe">
                                {{ validate?.tipe[0] }}
                            </div>
                        </div>
                    </CCol>
                    <CCol :md="12">
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
            cilMedicalCross,
            cilX,
            tipeLists: [
                {
                    id: 'pk_khusus',
                    label: 'Penilaian Khusus'
                },
                {
                    id: 'pk_umum',
                    label: 'Penilaian Umum'
                }
            ],
        }
    },
    computed: {
        ...mapState(useMTipeStore, [
            'id',
            'form',
            'validate',
            'method',
            'tipePenilaian',
        ]),
    },
    watch: {
        'form.nama'(newVal) {
            this.form.nama = newVal.toUpperCase()
        }
    },
    methods: {
        ...mapActions(useMTipeStore, [
            'store',
            'update',
            'setMethod',
            'setValidation',
            'resetForm',
            'resetValidation',
        ]),

        ...mapActions(useToastStore, ['showToast']),

        ...mapActions(useSpinnerStore, ['loading']),

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
                        msg: response?.data,
                    })
                    this.resetForm() // reset form value
                    this.resetValidation() // reset form validation
                    this.onRefresh() // reload data in table
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
            this.resetForm()
            this.resetValidation()
            this.onRefresh()
        },

        onRefresh() {
            this.$emit('fetch')
        },
    },
}
</script>
