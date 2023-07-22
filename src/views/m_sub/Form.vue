<template>
    <CCard class="mb-4">
        <CCardHeader>
            <div class="d-flex justify-content-between">
                <span class="d-inline-block">
                    Tambah Sub Penilaian
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
                            <CFormInput id="nama" type="text" size="sm" v-model="form.nama" autofocus />
                        </div>
                    </CCol>
                    <CCol :md="2">
                        <div class="mb-1">
                            <CFormLabel for="penilai">Tipe Penilaian</CFormLabel>
                            <v-select v-model="tipe" :options="listTipes">
                            </v-select>
                        </div>
                    </CCol>
                    <CCol :md="3">
                        <div class="mb-1">
                            <CFormLabel for="penilai">Jenis Penilaian</CFormLabel>
                            <v-select v-model="form.id_penilaian" :options="jenisPenilaianList" :reduce="jp => jp.id">
                            </v-select>
                            <div class="invalid-feedback d-inline-block" v-if="validate?.id_penilaian">
                                {{ validate?.id_penilaian[0] }}
                            </div>
                        </div>
                    </CCol>
                    <CCol v-if="user.role == ADMIN" :md="3">
                        <div class="mb-1">
                            <CFormLabel for="penilai">Jabatan Penilai</CFormLabel>
                            <v-select v-model="form.id_jabatan_penilai" :options="jabatanPenilaiList"
                                :reduce="jab => jab.id">
                            </v-select>
                            <div class="invalid-feedback d-inline-block" v-if="validate?.id_jabatan_penilai">
                                {{ validate?.id_jabatan_penilai[0] }}
                            </div>
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
import { useJabatanStore } from '@/store/jabatan'
import DatePicker from 'vue-datepicker-next'
import 'vue-datepicker-next/index.css'
import { useSpinnerStore } from '@/store/spinner'
import { useMPenilaianStore } from '@/store/m_penilaian'
import { useMSubStore } from '@/store/m_sub'
import { useAuthStore } from '@/store/auth'
import { ADMIN, USER } from '@/store/auth'

export default {
    components: {
        DatePicker,
    },
    data() {
        const listTipes = [
            'pk_khusus',
            'pk_umum',
        ];

        const user = useAuthStore().user

        const kategories = [
            {
                id: 0,
                label: 'NON MEDIS',
            },
            {
                id: 1,
                label: 'MEDIS',
            },
        ]

        return {
            cilSave,
            cilSync,
            cilArrowCircleLeft,
            cilMedicalCross,
            cilX,
            iterate: 1,
            jenisPenilaianList: [],
            jabatanPenilaiList: [],
            jabatanKinerjaList: [],
            unitKinerjaList: [],
            tipe: '',
            btnStatus: true,
            kategories,
            listTipes,
            user,
            ADMIN,
            USER,
        }
    },
    mounted() {
        this.btnStatus = this.addBtn
    },
    watch: {
        'tipe'(newVal) {
            if (newVal != null) {
                this.getJenisPenilaianList(newVal)
            } else {
                this.jenisPenilaianList = []
            }
        },
    },
    computed: {
        ...mapState(useMSubStore, ['id', 'form', 'validate', 'method']),
    },
    created() {
        this.getJabatanPenilaiList()
    },
    methods: {
        ...mapActions(useMSubStore, [
            'store',
            'update',
            'setNama',
            'setMethod',
            'setValidation',
            'resetForm',
            'resetValidation',
        ]),

        ...mapActions(useJabatanStore, {
            jabatanFetch: 'fetchData',
        }),

        ...mapActions(useToastStore, ['showToast']),

        ...mapActions(useSpinnerStore, ['loading']),

        getJenisPenilaianList(tipe) {
            useMPenilaianStore()
                .fetchDataByTipe(tipe)
                .then((response) => {
                    let data = response.data.map((val) => ({
                        id: val.id,
                        label: `${val.nama} - ${val.tipe}`,
                    }))
                    this.jenisPenilaianList = data
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

        getJabatanPenilaiList() {
            useJabatanStore()
                .fetchData()
                .then((response) => {
                    let data = response.data.map((val) => ({
                        id: val.id,
                        label: val.nama_with_parent.toUpperCase(),
                    }))
                    this.jabatanPenilaiList = data
                })
                .catch((errors) => {
                    console.log(errors)
                    this.showToast({
                        show: true,
                        classType: 'bg-danger',
                        title: 'Gagal',
                        msg: errors?.response.data.message,
                    })
                })
        },

        tipeSelected() {
            console.log('test')
            this.getJenisPenilaianList()
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
                        title: 'Tindakan Berhasil',
                        msg: 'Berhasil ditambahkan !',
                    })
                    this.setNama('')
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
                            msg: errors?.response.data,
                        })

                        this.resetValidation()
                    }
                })
        },

        onReset() {
            this.onRefresh()
            this.resetForm()
            this.resetValidation()
            this.jenisPenilaianList = []
        },

        onRefresh() {
            this.$emit('fetch')
        },
    },
}
</script>
