<template>
    <div>
        <CCard>
            <CCardHeader>
                <div class="d-flex justify-content-between">
                    <span class="d-inline-block">
                        Nilai Karyawan
                    </span>
                    <router-link class="btn btn-sm btn-secondary" :to="{ name: 'ListPenilaian' }">
                        <CIcon :content="cilArrowCircleLeft" size="sm" />
                        Kembali
                    </router-link>
                </div>
            </CCardHeader>
            <CCardBody>
                <CForm @submit.prevent="onSubmit" autocomplete="off">
                    <CRow>
                        <CCol :md="12">
                            <table class="table table-bordered"
                                style="width: 100%; border-radius: 10px; border-collapse: collapse;">
                                <thead>
                                    <tr>
                                        <th>
                                            <div class="d-flex justify-content-between">
                                                <span class="title-fs">
                                                    Indikator Penilaian
                                                    <strong class="border-bottom pb-1">
                                                        {{ (tipe).toUpperCase() }}
                                                    </strong>
                                                </span>
                                                <CButton color="light" @click.prevent="onRefresh">
                                                    <CIcon :content="cilSync" size="sm" />
                                                </CButton>
                                            </div>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>
                                            <ul class="data-karyawan">
                                                <li>
                                                    <span>Nama: <strong>{{ karyawan.nama }}</strong></span>
                                                </li>
                                                <li>
                                                    <span>Jabatan: <strong>{{
                                                        karyawan.relationship?.jabatan.nama }}</strong></span>
                                                </li>
                                                <li>
                                                    <span>Penilaian: <strong>{{ (tipe).toUpperCase() }}</strong></span>
                                                </li>
                                            </ul>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <p class="mb-1">Pilih Waktu</p>
                                            <div class="row">
                                                <div class="col-md-3">
                                                    <v-select v-model="field.month" :options="months" label="name"
                                                        :reduce="m => m.id" placeholder="Pilih Bulan" />
                                                    <div class="invalid-feedback d-inline-block"
                                                        v-if="validate?.bulan_nilai">
                                                        {{ validate?.bulan_nilai[0] }}
                                                    </div>
                                                </div>
                                                <div class="col-md-3">
                                                    <v-select v-model="field.year" :options="years"
                                                        placeholder="Pilih Tahun" />
                                                    <div class="invalid-feedback d-inline-block"
                                                        v-if="validate?.tahun_nilai">
                                                        {{ validate?.tahun_nilai[0] }}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                    <tr v-for="tipe in penilaians" :key="tipe.id">
                                        <td>
                                            <div class="panel-tipe">
                                                <div class="panel-header">
                                                    <strong class="title-fs pb-2">{{ tipe.nama }}</strong>
                                                </div>
                                                <div class="panel-body">
                                                    <div v-for="penilaian in tipe.relationship?.m_penilaian"
                                                        :key="penilaian.id" class="penilaian-item">
                                                        <div v-if="penilaian.sub_count > 0">
                                                            <div class="d-flex justify-content-between">
                                                                <strong class="penilaian-nama pb-2">{{ penilaian.nama
                                                                }}</strong>
                                                            </div>
                                                            <ul class="list-group list-group-flush">
                                                                <li v-for="(sub_penilaian, idx) in penilaian.relationship.sub_penilaian"
                                                                    :key="sub_penilaian.id"
                                                                    :countNilai="nilai.countNilai = 0"
                                                                    class="list-group-item">
                                                                    <span class="d-inline-block" style="width: 80%;">{{
                                                                        sub_penilaian.nama }}</span>
                                                                    <div class="d-inline-block">
                                                                        <CFormInput type="number" size="sm"
                                                                            v-model="sub_penilaian.nilai"
                                                                            :ttlNilai="ttlNilai" :disabled="tipe.check < 1"
                                                                            :countNilai="nilai.countNilai = ++idx" />
                                                                    </div>
                                                                </li>
                                                            </ul>
                                                            <div class="penilaian-jumlah">
                                                                <span class="d-inline-block"
                                                                    style="width: 80%;">Jumlah</span>
                                                                <div class="d-inline-block">
                                                                    <CFormInput type="number" size="sm" :readonly="true"
                                                                        v-model="nilai.ttlNilai" />
                                                                </div>
                                                            </div>
                                                            <div class="penilaian-avg">
                                                                <span class="d-inline-block"
                                                                    style="width: 80%;">Rata-rata</span>
                                                                <div class="d-inline-block">
                                                                    <CFormInput type="number" size="sm" :readonly="true"
                                                                        v-model="nilai.ttlNilai" />
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="panel-footer">
                                                    <div class="penilaian-catatan">
                                                        <CFormTextarea label="Catatan" rows="2"
                                                            text="Silahkan diisi apabila terdapat catatan"
                                                            :disabled="tipe.check < 1" v-model="tipe.catatan">
                                                        </CFormTextarea>
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                    <tr v-if="routeParams.tipe == 'pk_umum'">
                                        <td>
                                            <div class="row">
                                                <div class="col-12">
                                                    <strong class="title-fs pb-2 d-flex">Analisis SWOT</strong>
                                                </div>
                                                <div class="col-md-3">
                                                    <CFormTextarea label="Strenght/ Kelebihan" rows="3"
                                                        text="Silahkan diisi apabila terdapat catatan"
                                                        v-model="form.kelebihan">
                                                    </CFormTextarea>
                                                </div>
                                                <div class="col-md-3">
                                                    <CFormTextarea label="Weakness/ Kekurangan" rows="3"
                                                        text="Silahkan diisi apabila terdapat catatan"
                                                        v-model="form.kekurangan">
                                                    </CFormTextarea>
                                                </div>
                                                <div class="col-md-3">
                                                    <CFormTextarea label="Oportunity/ Kesempatan" rows="3"
                                                        text="Silahkan diisi apabila terdapat catatan"
                                                        v-model="form.kesempatan">
                                                    </CFormTextarea>
                                                </div>
                                                <div class="col-md-3">
                                                    <CFormTextarea label="Threat/ Ancaman" rows="3"
                                                        text="Silahkan diisi apabila terdapat catatan"
                                                        v-model="form.ancaman">
                                                    </CFormTextarea>
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </CCol>
                        <CCol :md="12" style="text-align: end;">
                            <hr style="margin: .5rem 0">
                            <CButton type="submit" color="primary">
                                <CIcon :content="cilSave" size="sm" />
                                Simpan
                            </CButton>
                        </CCol>
                    </CRow>
                </CForm>
            </CCardBody>
        </CCard>
    </div>
</template>
<script>
import { cilSave, cilSync, cilArrowCircleLeft } from '@coreui/icons'
import { mapActions } from 'pinia'
import { mapState } from 'pinia'
import { usePenilaianStore } from '@/store/penilaian'
import { useToastStore } from '@/store/toast'
import { useJabatanStore } from '@/store/jabatan'
import DatePicker from 'vue-datepicker-next'
import 'vue-datepicker-next/index.css'
import { useSpinnerStore } from '@/store/spinner'
import { useUnitStore } from '@/store/unit'
import { CButton } from '@coreui/vue'
import { useAuthStore } from '@/store/auth'
import { useKaryawansStore } from '@/store/karyawans'

export default {
    components: {
        DatePicker,
        CButton,
    },
    props: {
        params: Object,
    },
    data() {
        const years = Array.from(Array(new Date().getFullYear() - 1949), (_, i) => (i + 1950).toString()).reverse()

        const months = [
            {
                id: 1,
                name: "Januari"
            },
            {
                id: 2,
                name: "Februari"
            },
            {
                id: 3,
                name: "Maret"
            },
            {
                id: 4,
                name: "April"
            },
            {
                id: 5,
                name: "Mei"
            },
            {
                id: 6,
                name: "Juni"
            },
            {
                id: 7,
                name: "Juli"
            },
            {
                id: 8,
                name: "Augustus"
            },
            {
                id: 9,
                name: "September"
            },
            {
                id: 10,
                name: "Oktober"
            },
            {
                id: 11,
                name: "November"
            },
            {
                id: 12,
                name: "Desember"
            }
        ]

        const field = {
            month: '',
            year: '',
        }

        const nilai = {
            ttlNilai: 0,
            countNilai: 0,
        }

        return {
            cilSave,
            cilArrowCircleLeft,
            cilSync,
            penilaians: [],
            karyawan: [],
            tipe: this.$route.params.tipe,
            level: '',
            routeParams: '',
            currentTime: '',
            nilai,
            months,
            years,
            field,
            validate: ''
        }
    },
    created() {
        this.onRefresh()
        this.routeParams = this.$route.params
        this.newCurrent = new Date()
    },
    computed: {
        ...mapState(usePenilaianStore, ['form', 'url']),

        ...mapState(useAuthStore, ['user']),

        getLevel() {
            this.level = this.user.karyawan
        }
    },
    methods: {
        ...mapActions(usePenilaianStore, [
            'show',
            'store',
            'resetForm',
            'resetValidation',
            'getPenilaian',
            'setIdKaryawan',
        ]),

        ...mapActions(useJabatanStore, {
            jabatanFetch: 'fetchData',
        }),

        ...mapActions(useUnitStore, {
            unitFetch: 'fetchData',
        }),

        ...mapActions(useSpinnerStore, ['loading']),

        ...mapActions(useToastStore, ['showToast']),

        async getPenilaians() {
            let params = {
                id_karyawan: this.$route.params.id_karyawan,
                tipe: this.$route.params.tipe,
            }
            this.loading(true)
            this.getPenilaian(params)
                .then((response) => {
                    this.penilaians = response.data.data
                    this.loading(false)
                })
                .catch((errors) => {
                    console.log(errors)
                    this.loading(false)
                    this.showToast({
                        show: true,
                        classType: 'bg-danger',
                        title: 'Gagal',
                        msg: errors.response.data.message,
                    })
                })
        },

        async getKaryawan() {
            let params = {
                id_karyawan: this.$route.params.id_karyawan,
            }
            this.loading(true)
            useKaryawansStore()
                .show(params.id_karyawan)
                .then((response) => {
                    console.log(response.data)
                    this.karyawan = response.data
                    console.log(this.karyawan.nama)
                    this.loading(false)
                })
                .catch((errors) => {
                    console.log(errors)
                    this.loading(false)
                    this.showToast({
                        show: true,
                        classType: 'bg-danger',
                        title: 'Gagal',
                        msg: errors.response.data.message,
                    })
                })
        },

        onRefresh() {
            this.getPenilaians()
            this.getKaryawan()
        },

        onSubmit() {
            this.loading(true)

            const formRequest = {
                id_karyawan: this.$route.params.id_karyawan,
                penilaians: this.penilaians,
                tipe: this.$route.params.tipe,
                analisis_swot: this.form,
                bulan_nilai: this.field.month,
                tahun_nilai: this.field.year,
            }

            console.log(this.field)
            this.store(formRequest)
                .then((response) => {

                    console.log(response)

                    this.loading(false)

                    this.showToast({
                        show: true,
                        classType: 'bg-success',
                        title: 'Tindakan Berhasil',
                        msg: 'Nilai sudah terisi',
                    })

                    this.resetForm()

                    this.$router.push({
                        name: 'PenilaianProgressEdit', params: {
                            id_penilaian: response.data.data.data.id
                        }
                    })
                })
                .catch((errors) => {
                    this.loading(false)
                    console.log(errors)
                    if (errors.response.status == 422) {
                        this.validate = errors.response.data.errors
                    } else {
                        this.showToast({
                            show: true,
                            classType: 'bg-danger',
                            title: 'Gagal',
                            msg: errors.response.data.data.message,
                        })

                        this.resetValidation()
                    }


                })
        },

        linkPenilaian(link) {
            return {
                name: 'PenilaianEdit',
                params: {
                    id_karyawan: this.$route.params.id_karyawan,
                    tipe: link,
                },
            }
        },

        ttlNilai(param) {
            this.nilai.ttlNilai += param
        },

    },
}
</script>
<style>
.penilaian-item,
.penilaian-catatan {
    margin: 0 10px;
}

.panel-header {
    border-bottom: 1px solid rgba(195, 195, 195, 0.4);
}

.penilaian-nama {
    font-size: 13px;
    font-weight: 600;
    margin: 0.3rem 0;
}

.panel-tipe {
    background: rgba(222, 229, 232, 0.4);
    padding: 0.7rem 0.4rem;
    border-radius: 0.4rem;
    padding-left: 0.5rem;
}

.panel-body {
    margin-top: 0.5rem;
    margin-bottom: 1rem;
}

.list-group {
    border-radius: 0.4rem !important;
}

.list-group-item {
    background: rgb(255, 255, 255);
}

.penilaian-jumlah {
    padding: 0.5rem 1rem;
    background: rgba(220, 221, 225, 0.3);
}

.penilaian-avg {
    padding: 0.5rem 1rem;
    background: rgba(220, 221, 225, 0.5);
}
</style>
