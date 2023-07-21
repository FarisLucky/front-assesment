
<template>
    <div id="penilaian-form">
        <CCard>
            <CCardHeader>
                <div class="d-flex justify-content-between">
                    <span class="d-inline-block">
                        Detail Nilai Karyawan <strong class="text-primary">{{ ($route.params.tipe).toUpperCase() }}</strong>
                    </span>
                    <router-link :to="{ name: 'ListHistoryPenilaian' }" class="btn btn-sm btn-outline-secondary">
                        <CIcon :content="cilArrowCircleLeft" size="sm" />
                        Kembali
                    </router-link>
                </div>
            </CCardHeader>
            <CCardBody>
                <div class="d-flex flex-column text-end">
                    <router-link
                        :to="{ name: routeName, params: { id_karyawan: $route.params.id_karyawan, tipe: getTextLink, month: month, year: year } }"
                        class="text-primary mb-1">
                        {{ getTextLink.toUpperCase() }}
                    </router-link>
                    <div>
                        <CButton color="light" @click.prevent="onRefresh">
                            <CIcon :content="cilSync" size="sm" />
                        </CButton>
                    </div>
                </div>
                <CRow class="layout">
                    <CCol :md="6">
                        <div style="padding-left: 0.5rem;">
                            <p class="mb-1">Pilih Nilai</p>
                            <v-select v-model="nilai" :options="penilaians" @option:selected="setNilaiSelected"
                                label="label" :reduce="m => m.id" placeholder="Pilih Penilaian" />
                        </div>
                    </CCol>
                    <CCol :md="12" class="mb-2">
                        <ul class="data-karyawan bg-data my-2">
                            <li>
                                <h4 style="font-size: 13px; font-weight: 700">Data Karyawan</h4>
                            </li>
                            <li>
                                <span>Nama: <strong>{{ penilaian.nama_karyawan }}</strong></span>
                            </li>
                            <li>
                                <span>Jabatan: <strong>{{ penilaian.jabatan }}</strong></span>
                            </li>
                            <li>
                                <span>Penilaian: <strong>{{ penilaian.tipe }}</strong></span>
                            </li>
                        </ul>
                    </CCol>
                    <CCol :md="12">
                        <table class="table" style="width: 100%; border-radius: 10px; border-collapse: collapse;">
                            <tbody>
                                <tr v-for="tipe in penilaian.relationship?.tipe_penilaian" :key="tipe.id">
                                    <td>
                                        <div class="panel-tipe">
                                            <div class="panel-header">
                                                <strong class="title-fs pb-2">{{ tipe.nama_tipe }}</strong>
                                            </div>
                                            <div class="panel-body">
                                                <div v-for="detail in tipe.relationship?.detail" :key="detail.id"
                                                    class="penilaian-item">
                                                    <div class="d-flex justify-content-between">
                                                        <strong class="penilaian-nama pb-2">{{ detail.nama_penilaian
                                                        }}</strong>
                                                    </div>
                                                    <ul class="list-group list-group-flush">
                                                        <li v-for="(sub_penilaian) in detail.relationship?.sub"
                                                            :key="sub_penilaian.id" class="list-group-item">
                                                            <span class="d-inline-block" style="width: 80%;">{{
                                                                sub_penilaian.sub_penilaian }}</span>
                                                            <div class="d-inline-block">
                                                                <CFormInput type="number" size="sm" :disabled=true
                                                                    v-model="sub_penilaian.nilai" />
                                                            </div>
                                                        </li>
                                                    </ul>
                                                    <div class="penilaian-jumlah">
                                                        <span class="d-inline-block" style="width: 80%;">Jumlah</span>
                                                        <div class="d-inline-block">
                                                            <CFormInput type="number" size="sm" :disabled=true
                                                                :value="detail.ttl_nilai" />
                                                        </div>
                                                    </div>
                                                    <div class="penilaian-avg">
                                                        <span class="d-inline-block" style="width: 80%;">Rata-rata</span>
                                                        <div class="d-inline-block">
                                                            <CFormInput type="number" size="sm" :disabled=true
                                                                :value="detail.rata_nilai" />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="panel-footer">
                                                <div class="penilaian-catatan row">
                                                    <div class="item col-9">
                                                        <CFormTextarea label="Catatan" rows="2" :disabled=true
                                                            :value="tipe.catatan">
                                                        </CFormTextarea>
                                                    </div>
                                                    <div class="item text-end col">
                                                        <p>Yang Memberi Penilaian</p>
                                                        <b class="txt-penilai">{{ tipe.nama_penilai }}</b>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <div class="panel-tipe">
                                            <div class="panel-body">
                                                <div class="penilaian-item">
                                                    <ul class="list-group">
                                                        <li class="list-group-item">
                                                            <span class="d-inline-block" style="width: 80%;">TOTAL RATA RATA
                                                                NILAI</span>
                                                            <div class="d-inline-block">
                                                                <CFormInput type="number" size="sm" :disabled=true
                                                                    :value="penilaian.ttl_nilai" />
                                                            </div>
                                                        </li>
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                                <tr v-if="$route.params.tipe == 'pk_umum'">
                                    <td>
                                        <div class="panel-tipe">
                                            <div class="panel-body">
                                                <ul class="list-group">
                                                    <li class="list-group-item">
                                                        <div class="row">
                                                            <div class="col-12">
                                                                <strong class="title-fs pb-2 d-flex">Analisis SWOT</strong>
                                                            </div>
                                                            <div class="col-md-3">
                                                                <CFormTextarea label="Strenght/ Kelebihan" rows="3"
                                                                    text="Silahkan diisi apabila terdapat catatan"
                                                                    :value="penilaian.relationship?.analisis_swot?.kelebihan"
                                                                    :disabled="true">
                                                                </CFormTextarea>
                                                            </div>
                                                            <div class="col-md-3">
                                                                <CFormTextarea label="Weakness/ Kekurangan" rows="3"
                                                                    text="Silahkan diisi apabila terdapat catatan"
                                                                    :value="penilaian.relationship?.analisis_swot?.kekurangan"
                                                                    :disabled="true">
                                                                </CFormTextarea>
                                                            </div>
                                                            <div class="col-md-3">
                                                                <CFormTextarea label="Oportunity/ Kesempatan" rows="3"
                                                                    text="Silahkan diisi apabila terdapat catatan"
                                                                    :value="penilaian.relationship?.analisis_swot?.kesempatan"
                                                                    :disabled="true">
                                                                </CFormTextarea>
                                                            </div>
                                                            <div class="col-md-3">
                                                                <CFormTextarea label="Threat/ Ancaman" rows="3"
                                                                    text="Silahkan diisi apabila terdapat catatan"
                                                                    :value="penilaian.relationship?.analisis_swot?.ancaman"
                                                                    :disabled="true">
                                                                </CFormTextarea>
                                                            </div>
                                                        </div>
                                                    </li>
                                                </ul>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <div class="text-end">
                                            <p class="mb-1">Kraksaan, <strong>{{ penilaian.created_at }}</strong></p>
                                            <p class="mb-1" style="text-transform: capitalize;">Yang melaksanakan penilaian
                                            </p>
                                            <b class="txt-penilai">{{ penilaian.nama_penilai }}</b>
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <div class="text-end" v-if="penilaian.kategori == 1">
                                            <!-- Penilaian khusus  medis -->
                                            <a :href="'http://localhost/simpeg/pdf-view/' + id"
                                                class="btn btn-sm btn-warning" target="_blank">
                                                Cetak Nilai
                                            </a>
                                        </div>
                                        <div class="text-end" v-if="penilaian.kategori == 0">
                                            <!-- Penilaian khusus non medis -->
                                            <a :href="'http://localhost/simpeg/pdf-khusus/' + id"
                                                class="btn btn-sm btn-warning" target="_blank">
                                                Cetak Nilai
                                            </a>
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </CCol>
                </CRow>
            </CCardBody>
        </CCard>
    </div>
</template>
<script>
import { cilSave, cilSync, cilArrowCircleLeft } from '@coreui/icons'
import { mapActions } from 'pinia'
import { mapState } from 'pinia'
import { useHistoryStore } from '@/store/history_penilaian'
import { useJabatanStore } from '@/store/jabatan'
import DatePicker from 'vue-datepicker-next'
import 'vue-datepicker-next/index.css'
import { useSpinnerStore } from '@/store/spinner'
import { useUnitStore } from '@/store/unit'
import { CButton } from '@coreui/vue'
import { useToastStore } from '@/store/toast'

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

        return {
            cilSave,
            cilArrowCircleLeft,
            cilSync,
            penilaian: [],
            detail: [],
            month: new Date().getUTCMonth() + 1,
            year: new Date().getUTCFullYear(),
            ttlNilai: 0,
            id: 0,
            penilaians: [],
            nilai: ''
        }
    },
    computed: {
        ...mapState(useHistoryStore, ['url', 'validate', 'form']),

        getTextLink() {
            return this.$route.params.tipe === 'pk_khusus'
                ? 'pk_umum'
                : 'pk_khusus'
        },

        routeName() {
            return this.$route.params.tipe === 'pk_khusus'
                ? 'ShowUmumHistory'
                : 'ShowKhususHistory'
        },
    },
    created() {
        this.listPenilaians()
        this.onShow()
    },
    methods: {
        ...mapActions(useHistoryStore, [
            'show',
            'showById',
            'store',
            'resetForm',
            'resetValidation',
            'getPenilaian',
            'getPenilaiansKaryawan',
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

        onShow() {
            this.show({
                id_karyawan: this.$route.params.id_karyawan,
                tipe: this.$route.params.tipe,
            })
                .then((response) => {
                    this.penilaian = response.data
                    this.id = response.data.id
                    this.nilai = response.data.id
                    // this.detail = this.penilaian.relationship.detail
                    this.loading(false)
                })
                .catch((errors) => {
                    this.showToast({
                        show: true,
                        classType: 'bg-danger',
                        title: 'Gagal',
                        msg: 'Tidak ada data',
                    })
                    this.loading(false)

                    this.$router.back()
                })
        },

        onShowById(id) {
            this.loading(true)

            this.showById(id)
                .then((response) => {
                    this.penilaian = response.data
                    this.id = response.data.id
                    this.loading(false)
                })
                .catch((errors) => {
                    this.showToast({
                        show: true,
                        classType: 'bg-danger',
                        title: 'Gagal',
                        msg: 'Tidak ada data',
                    })
                    this.loading(false)

                    this.$router.back()
                })
        },

        listPenilaians() {
            let params = {
                id_karyawan: this.$route.params.id_karyawan,
                tipe: this.$route.params.tipe,
            }
            this.getPenilaiansKaryawan(params)
                .then(response => {
                    this.penilaians = response.data.map(item => ({
                        id: item.id,
                        label: `${item.tipe} - ${item.tgl_nilai} - Penilai: ${item.nama_penilai}`
                    }))
                    this.loading(false)

                })
                .catch((errors) => {
                    this.loading(false)
                    this.showToast({
                        show: true,
                        classType: 'bg-danger',
                        title: 'Gagal',
                        msg: 'Tidak ada data',
                    })
                })
        },

        setNilaiSelected(params) {
            this.nilai = params.id
            this.onShowById(this.nilai)
        },

        onRefresh() {
            this.onShow()
            this.listPenilaians()
        },
    },
}
</script>

<style>
.penilaian-item,
.penilaian-catatan {
    margin: 0 10px;
}

.penilaian-catatan .item {
    width: 50%;
}

.panel-header {
    border-bottom: 1px solid rgba(195, 195, 195, 0.4);
}

.penilaian-nama {
    font-size: 12px;
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

.form-control:disabled {
    background-color: #d8dbe07d;
}

.data-karyawan li span {
    font-size: 12px;
}

.bg-data {
    background-color: rgba(170, 196, 255, .4);
    border-radius: .2rem;
    padding: .4rem .3rem;
    margin: 0 .5rem;
}

.txt-penilai {
    margin-top: 4rem;
    display: inline-block;
}

ul {
    list-style-type: none;
    padding-left: 0.5rem;
    margin-bottom: 0;
}

.txt_nilai {
    font-weight: 700;
}

.ttl-catatan {
    font-weight: 700;
    font-size: 12px;
}

.ttl-color {
    background: #eff8ff;
}
</style>
