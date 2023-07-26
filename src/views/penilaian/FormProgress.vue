<style scoped>
ul {
    list-style-type: none;
    padding-left: 0.4rem;
    margin-bottom: 0;
}

ul li {
    padding-bottom: 0.3rem;
}

.txt_nilai {
    font-weight: 700;
}

.ttl-catatan {
    font-weight: 700;
    font-size: 13px;
}

.ttl-color {
    background: #eff8ff;
}
</style>
<template>
    <div id="penilaian-form">
        <form @submit.prevent="onUpdate" autocomplete="">
            <CCard>
                <CCardHeader>
                    <div class="d-flex justify-content-between">
                        <span class="d-inline-block">
                            Detail Nilai Karyawan <strong class="text-primary">{{ $route.params.tipe }}</strong>
                        </span>
                        <div>
                            <router-link :to="{ name: 'ListPenilaian' }" class="btn btn-sm btn-secondary me-2">
                                <CIcon :content="cilArrowCircleLeft" size="sm" />
                                Kembali
                            </router-link>
                        </div>
                    </div>
                </CCardHeader>
                <CCardBody>
                    <CRow>
                        <CCol :md="12" class="text-end mb-2">
                            <CButton size="sm" color="light" @click.prevent="onRefresh">
                                <CIcon :content="cilSync" size="sm" />
                            </CButton>
                        </CCol>
                        <CCol :md="12" class="mb-2">
                            <div class="d-flex justify-content-between">
                                <ul class="data-karyawan">
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
                                <span class="d-inline-block">
                                    Tanggal Nilai: <strong>{{ penilaian.tgl_nilai }}</strong>
                                </span>
                            </div>
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
                                                            <li v-for="(sub_penilaian) in detail.relationship.sub"
                                                                :key="sub_penilaian.id" class="list-group-item">
                                                                <span class="d-inline-block" style="width: 80%;">{{
                                                                    sub_penilaian.sub_penilaian }}</span>
                                                                <div class="d-inline-block">
                                                                    <CFormInput type="number" size="sm"
                                                                        :disabled="tipe.check_penilai < 1"
                                                                        v-model="sub_penilaian.nilai" />
                                                                </div>
                                                            </li>
                                                        </ul>
                                                        <div class="penilaian-jumlah">
                                                            <span class="d-inline-block" style="width: 80%;">Jumlah</span>
                                                            <div class="d-inline-block">
                                                                <CFormInput type="number" size="sm" :disabled=true
                                                                    v-model="detail.ttl_nilai" />
                                                            </div>
                                                        </div>
                                                        <div class="penilaian-avg">
                                                            <span class="d-inline-block"
                                                                style="width: 80%;">Rata-rata</span>
                                                            <div class="d-inline-block">
                                                                <CFormInput type="number" size="sm" :disabled=true
                                                                    v-model="detail.rata_nilai" />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="panel-footer" v-if="penilaian.tipe == 'pk_umum'">
                                                    <div class="penilaian-catatan row">
                                                        <div class="item col-9">
                                                            <CFormTextarea label="Catatan" rows="2"
                                                                :disabled="tipe.check_penilai < 1" v-model="tipe.catatan">
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
                                                                <span class="d-inline-block" style="width: 80%;">TOTAL
                                                                    NILAI</span>
                                                                <div class="d-inline-block">
                                                                    <CFormInput type="number" size="sm" :disabled=true
                                                                        v-model="penilaian.ttl_nilai" />
                                                                </div>
                                                            </li>
                                                            <li class="list-group-item">
                                                                <span class="d-inline-block" style="width: 80%;">TOTAL RATA
                                                                    RATA
                                                                    NILAI</span>
                                                                <div class="d-inline-block">
                                                                    <CFormInput type="number" size="sm" :disabled=true
                                                                        v-model="penilaian.rata_nilai" />
                                                                </div>
                                                            </li>
                                                        </ul>
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                    <tr v-if="penilaian.tipe == 'pk_khusus'">
                                        <td>
                                            <CRow>
                                                <CCol :md="4">
                                                    <CFormTextarea label="Catatan" rows="3"
                                                        text="Silahkan diisi apabila terdapat catatan"
                                                        v-model="penilaian.relationship.comment.catatan">
                                                    </CFormTextarea>
                                                </CCol>
                                                <CCol :md="4">
                                                    <CFormTextarea label="Tanggapan dari Pegawai yang dinilai" rows="3"
                                                        text="Silahkan diisi apabila terdapat catatan"
                                                        v-model="penilaian.relationship.comment.penilai">
                                                    </CFormTextarea>
                                                </CCol>
                                                <CCol :md="4">
                                                    <CFormTextarea label="Komentar Kepala Seksi ata Tanggapan" rows="3"
                                                        text="Silahkan diisi apabila terdapat catatan"
                                                        v-model="penilaian.relationship.comment.dinilai">
                                                    </CFormTextarea>
                                                </CCol>
                                            </CRow>
                                        </td>
                                    </tr>
                                    <tr v-if="penilaian.tipe == 'pk_umum'">
                                        <td>
                                            <div class="panel-tipe">
                                                <div class="panel-body">
                                                    <ul class="list-group">
                                                        <li class="list-group-item">
                                                            <div class="row">
                                                                <div class="col-12">
                                                                    <strong class="title-fs pb-2 d-flex">Analisis
                                                                        SWOT</strong>
                                                                </div>
                                                                <div class="col-md-3">
                                                                    <CFormTextarea label="Strenght/ Kelebihan" rows="3"
                                                                        text="Silahkan diisi apabila terdapat catatan"
                                                                        v-model="penilaian.relationship.analisis_swot.kelebihan"
                                                                        :disabled="true">
                                                                    </CFormTextarea>
                                                                </div>
                                                                <div class="col-md-3">
                                                                    <CFormTextarea label="Weakness/ Kekurangan" rows="3"
                                                                        text="Silahkan diisi apabila terdapat catatan"
                                                                        v-model="penilaian.relationship.analisis_swot.kekurangan"
                                                                        :disabled="true">
                                                                    </CFormTextarea>
                                                                </div>
                                                                <div class="col-md-3">
                                                                    <CFormTextarea label="Oportunity/ Kesempatan" rows="3"
                                                                        text="Silahkan diisi apabila terdapat catatan"
                                                                        v-model="penilaian.relationship.analisis_swot.kesempatan"
                                                                        :disabled="true">
                                                                    </CFormTextarea>
                                                                </div>
                                                                <div class="col-md-3">
                                                                    <CFormTextarea label="Threat/ Ancaman" rows="3"
                                                                        text="Silahkan diisi apabila terdapat catatan"
                                                                        v-model="penilaian.relationship.analisis_swot.ancaman"
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
                                                <p class="mb-1" style="text-transform: capitalize;">Yang melaksanakan
                                                    penilaian
                                                </p>
                                                <b class="txt-penilai">{{ penilaian.nama_penilai }}</b>
                                            </div>
                                        </td>
                                    </tr>
                                    <tr v-if="user.role == 'ADMIN'">
                                        <td>
                                            <div class="text-end">
                                                <CButton color="success" @click.prevent="onValidasi">
                                                    <CIcon :content="cilCheck" />
                                                </CButton>
                                            </div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <div class="d-flex justify-content-between">
                                                <!-- <a :href="'http://localhost/simpeg/pdf-view/' + penilaian.id"
                                                class="btn btn-sm btn-warning" target="_blank">
                                                Cetak Nilai 1
                                            </a> -->
                                                <div class="text-end" v-if="penilaian.tipe == 'pk_umum'">
                                                    <!-- Penilaian khusus  medis -->
                                                    <a :href="urlUmum + penilaian.id" class="btn btn-sm btn-warning"
                                                        target="_blank">
                                                        <CIcon :content="cilPrint" />
                                                        Cetak Nilai
                                                    </a>
                                                </div>
                                                <div class="text-end" v-if="penilaian.tipe == 'pk_khusus'">
                                                    <!-- Penilaian khusus non medis -->
                                                    <a :href="urlKhusus + penilaian.id" class="btn btn-sm btn-warning"
                                                        target="_blank">
                                                        <CIcon :content="cilPrint" />
                                                        Cetak Nilai
                                                    </a>
                                                </div>
                                                <CButton type="submit" color="primary" @click.prevent="onUpdate">
                                                    <CIcon :content="cilSave" size="sm" class="text-white" />
                                                    Simpan
                                                </CButton>
                                            </div>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </CCol>
                    </CRow>
                </CCardBody>
            </CCard>
        </form>
    </div>
</template>
<script>
import { cilSave, cilSync, cilArrowCircleLeft, cilCheck, cilPrint } from '@coreui/icons'
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
import { usePenilaianStore } from '@/store/penilaian'
import { useAuthStore } from '@/store/auth'
import { url_print } from '@/config/http'

export default {
    components: {
        DatePicker,
        CButton,
    },
    props: {
        params: Object,
    },
    data() {
        const user = useAuthStore().user
        const urlUmum = url_print + "/pdf-view/"
        const urlKhusus = url_print + "/pdf-khusus/"

        return {
            cilSave,
            cilArrowCircleLeft,
            cilSync,
            cilCheck,
            cilPrint,
            penilaian: [],
            detail: [],
            month: new Date().getUTCMonth() + 1,
            year: new Date().getUTCFullYear(),
            ttlNilai: 0,
            sumNilai: 0,
            avgNilai: 0,
            user,
            urlUmum,
            urlKhusus,
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
                ? 'PenilaianProgressEdit'
                : 'PenilaianProgressKhususEdit'
        },
    },
    methods: {
        ...mapActions(useHistoryStore, [
            'show',
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

        onShow() {
            this.loading(true)

            usePenilaianStore()
                .showProgress(this.$route.params.id_penilaian, this.$route.params.tipe)
                .then((response) => {
                    console.log(response)
                    this.penilaian = response.data
                    this.loading(false)
                })
                .catch((errors) => {
                    console.log(errors)
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

        onRefresh() {
            this.onShow()
        },

        onUpdate() {
            this.loading(true)

            const formRequest = {
                id_penilaian: this.$route.params.id_penilaian,
                penilaian: this.penilaian,
                comment: this.penilaian.relationship?.comment,
                analisis_swot: this.penilaian.relationship?.analisis_swot,
            }

            usePenilaianStore()
                .update(formRequest, formRequest.id_penilaian)
                .then((response) => {

                    this.loading(false)

                    this.showToast({
                        show: true,
                        classType: 'bg-success',
                        title: 'Tindakan Berhasil',
                        msg: 'Nilai sudah terisi',
                    })

                    this.onShow();
                })
                .catch((errors) => {
                    this.loading(false)

                    this.showToast({
                        show: true,
                        classType: 'bg-danger',
                        title: 'Gagal',
                        msg: errors.response.data.message,
                    })

                    this.resetValidation()
                })
        },

        onValidasi() {
            this.loading(true)

            if (confirm('Apakah Ingin divalidasi ?')) {
                usePenilaianStore()
                    .validasiNilai(this.$route.params.id_penilaian)
                    .then(response => {
                        this.loading(false)

                        this.showToast({
                            show: true,
                            classType: 'bg-success',
                            title: 'Tindakan Berhasil',
                            msg: 'Nilai sudah terisi',
                        })

                        this.$router.push({
                            name: 'ShowUmumHistory',
                            params: {
                                id_karyawan: this.penilaian.id_karyawan,
                                tipe: this.penilaian.tipe,
                            }
                        });
                    })
                    .catch(errors => {
                        console.log(errors)

                        this.loading(false)

                        this.showToast({
                            show: true,
                            classType: 'bg-danger',
                            title: 'Gagal',
                            msg: errors.response?.data?.message,
                        })

                        this.resetValidation()
                    })
            }
        },
    },
    beforeRouteEnter(to, from, next) {
        next((vm) => vm.onRefresh())
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

.form-control:disabled {
    background-color: #d8dbe07d;
}

.data-karyawan li span {
    font-size: 13px;
    text-transform: uppercase;
    border-bottom: 1px solid rgba(148, 148, 148, 0.8);
}

.txt-penilai {
    margin-top: 4rem;
    display: inline-block;
}
</style>
