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
                    <CCol :md="12">
                        <CButton type="submit" class="btn btn-sm btn-outline-info" @click.prevent="addNamaField"
                            v-if="btnStatus">
                            <CIcon :content="cilMedicalCross" size="sm" />
                        </CButton>
                        <CButton type="submit" class="btn btn-sm btn-outline-secondary" style="margin-left: 5px;"
                            @click.prevent="removeNamaField">
                            <CIcon :content="cilX" size="sm" />
                        </CButton>
                    </CCol>
                    <CCol :md="3" v-for="(sub, idx) in subsNama" :key="sub.iterate">
                        <div class="mb-1">
                            <CFormLabel for="nama">Nama</CFormLabel>
                            <CFormInput id="nama" type="text" v-model="sub.nama" @keyup.ctrl.tab="onTab"
                                @keyup.ctrl.delete="onTabRemove" />
                        </div>
                    </CCol>
                    <CCol :md="12">
                        <CRow>
                            <CCol :md="3">
                                <div class="mb-1">
                                    <CFormLabel for="penilai">Jenis Penilaian</CFormLabel>
                                    <v-select v-model="form.id_penilaian" :options="jenisPenilaianList"
                                        :reduce="jp => jp.id">
                                    </v-select>
                                    <div class="invalid-feedback d-inline-block" v-if="validate?.id_penilaian">
                                        {{ validate?.id_penilaian[0] }}
                                    </div>
                                </div>
                            </CCol>
                            <CCol :md="3">
                                <div class="mb-1">
                                    <CFormLabel for="penilai">Jabatan Penilai</CFormLabel>
                                    <v-select v-model="form.id_jabatan_penilai" :options="jabatanPenilaiList"
                                        :reduce="jpl => jpl.id">
                                    </v-select>
                                    <div class="invalid-feedback d-inline-block" v-if="validate?.id_jabatan_penilai">
                                        {{ validate?.id_jabatan_penilai[0] }}
                                    </div>
                                </div>
                            </CCol>
                            <CCol :md="3">
                                <div class="mb-1">
                                    <CFormLabel for="penilai">Penilaian Kinerja</CFormLabel>
                                    <v-select v-model="form.id_jabatan_kinerja" :options="jabatanKinerjaList"
                                        :reduce="jkl => jkl.id">
                                    </v-select>
                                    <div class="invalid-feedback d-inline-block" v-if="validate?.id_jabatan_kinerja">
                                        {{ validate?.id_jabatan_kinerja[0] }}
                                    </div>
                                </div>
                            </CCol>
                            <CCol :md="3">
                                <div class="mb-1">
                                    <CFormLabel for="penilai">Kategori</CFormLabel>
                                    <v-select v-model="form.kategori" :options="kategories" :reduce="kat => kat.id">
                                    </v-select>
                                    <div class="invalid-feedback d-inline-block" v-if="validate?.kategori">
                                        {{ validate?.kategori[0] }}
                                    </div>
                                </div>
                            </CCol>
                        </CRow>
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
import { useJabatanStore } from '@/store/jabatan'
import DatePicker from 'vue-datepicker-next'
import 'vue-datepicker-next/index.css'
import { useSpinnerStore } from '@/store/spinner'
import { useMPenilaianStore } from '@/store/m_penilaian'
import { useMSubStore } from '@/store/m_sub'

export default {
    components: {
        DatePicker,
    },
    props: ['nama', 'addBtn'],
    data() {
        return {
            cilSave,
            cilSync,
            cilArrowCircleLeft,
            cilMedicalCross,
            cilX,
            subsNama: [
                {
                    nama: '',
                    iterate: 1,
                },
            ],
            iterate: 1,
            jenisPenilaianList: [],
            jabatanPenilaiList: [],
            jabatanKinerjaList: [],
            unitKinerjaList: [],
            kategories: [
                {
                    id: 0,
                    label: 'NON MEDIS',
                },
                {
                    id: 1,
                    label: 'MEDIS',
                },
            ],
            btnStatus: true
        }
    },
    mounted() {
        this.btnStatus = this.addBtn
        console.log(this.addBtn)
    },
    watch: {
        'addBtn'(newVal) {
            this.btnStatus = newVal
        }
    },
    created() {
        this.getJenisPenilaianList()
        this.getJabatanList()
    },
    computed: {
        ...mapState(useMSubStore, ['id', 'form', 'validate', 'method']),
    },
    methods: {
        ...mapActions(useMSubStore, [
            'store',
            'update',
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

        addNamaField() {
            this.subsNama.push({
                nama: '',
                iterate: ++this.iterate,
            })
        },

        onTab() {
            this.addNamaField()
        },

        onTabRemove() {
            if (this.subsNama.length > 1) {
                this.subsNama.pop()
            }
        },

        removeNamaField() {
            if (this.iterate > 1) {
                this.subsNama.pop()
                iterate: this.iterate--
            }
        },

        getJenisPenilaianList() {
            useMPenilaianStore()
                .fetchData()
                .then((response) => {
                    let data = response.data.data.map((val) => ({
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

        getJabatanList() {
            useJabatanStore()
                .fetchData()
                .then((response) => {
                    let data = response.data.map((val) => ({
                        id: val.id,
                        label: val.nama_with_parent.toUpperCase(),
                    }))
                    this.jabatanPenilaiList = data
                    this.jabatanKinerjaList = data
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

        onSubmit() {
            this.loading(true)

            let action

            this.form.nama = this.subsNama

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

                        this.resetForm()
                        this.resetValidation()
                    }
                })
        },

        onReset() {
            this.onRefresh()
            this.resetForm()
            this.resetValidation()
            this.subsNama = [
                {
                    nama: '',
                    iterate: 1,
                },
            ]
            this.$emit('resetBtn')
        },

        onRefresh() {
            this.$emit('fetch')
            this.getJenisPenilaianList()
            this.getJabatanList()
        },
    },
}
</script>
