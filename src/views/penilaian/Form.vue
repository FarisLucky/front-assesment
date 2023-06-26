<template>
    <div>
        <CCard>
            <CCardHeader>
                <div class="d-flex justify-content-between">
                    <span class="d-inline-block">
                        Nilai Karyawan
                    </span>
                    <router-link
                        class="btn btn-sm btn-secondary"
                        :to="{name: 'ListPenilaian'}"
                    >
                        <CIcon
                            :content="cilArrowCircleLeft"
                            size="sm"
                        />
                        Kembali
                    </router-link>
                </div>
            </CCardHeader>
            <CCardBody>
                <CForm
                    @submit.prevent="onSubmit"
                    autocomplete="off"
                >
                    <CRow>
                        <CCol :md="12">
                            <table
                                class="table table-bordered"
                                style="width: 100%; border-radius: 10px; border-collapse: collapse;"
                            >
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
                                            </div>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr
                                        v-for="tipe in penilaians"
                                        :key="tipe.id"
                                    >
                                        <td>
                                            <div class="panel-tipe">
                                                <div class="panel-header">
                                                    <strong class="title-fs pb-2">{{ tipe.nama }}</strong>
                                                </div>
                                                <div class="panel-body">
                                                    <div
                                                        v-for="penilaian in tipe.relationship?.m_penilaian"
                                                        :key="penilaian.id"
                                                        class="penilaian-item"
                                                    >
                                                        <div class="d-flex justify-content-between">
                                                            <strong class="penilaian-nama pb-2">{{ penilaian.nama }}</strong>
                                                        </div>
                                                        <ul class="list-group list-group-flush">
                                                            <li
                                                                v-for="(sub_penilaian, idx) in penilaian.relationship.sub_penilaian"
                                                                :key="sub_penilaian.id"
                                                                :countNilai="nilai.countNilai = 0"
                                                                class="list-group-item"
                                                            >
                                                                <span
                                                                    class="d-inline-block"
                                                                    style="width: 80%;"
                                                                >{{ sub_penilaian.nama }}</span>
                                                                <div class="d-inline-block">
                                                                    <CFormInput
                                                                        type="number"
                                                                        size="sm"
                                                                        v-model="sub_penilaian.nilai"
                                                                        :ttlNilai="ttlNilai"
                                                                        :countNilai="nilai.countNilai = ++idx"
                                                                    />
                                                                </div>
                                                            </li>
                                                        </ul>
                                                        <div class="penilaian-jumlah">
                                                            <span
                                                                class="d-inline-block"
                                                                style="width: 80%;"
                                                            >Jumlah</span>
                                                            <span>{{ nilai.ttlNilai }}</span>
                                                        </div>
                                                        <div class="penilaian-avg">
                                                            <span
                                                                class="d-inline-block"
                                                                style="width: 80%;"
                                                            >Rata-rata</span>
                                                            <span>{{ nilai.ttlNilai / nilai.countNilai }}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="panel-footer">
                                                    <div class="penilaian-catatan">
                                                        <CFormTextarea
                                                            label="Catatan"
                                                            rows="2"
                                                            text="Silahkan diisi apabila terdapat catatan"
                                                            v-model="tipe.catatan"
                                                        >
                                                        </CFormTextarea>
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <div class="row">
                                                <div class="col-12">
                                                    <strong class="title-fs pb-2 d-flex">Analisis SWOT</strong>
                                                </div>
                                                <div class="col-md-3">
                                                    <CFormTextarea
                                                        label="Strenght/ Kelebihan"
                                                        rows="3"
                                                        text="Silahkan diisi apabila terdapat catatan"
                                                        v-model="form.kelebihan"
                                                    >
                                                    </CFormTextarea>
                                                </div>
                                                <div class="col-md-3">
                                                    <CFormTextarea
                                                        label="Weakness/ Kekurangan"
                                                        rows="3"
                                                        text="Silahkan diisi apabila terdapat catatan"
                                                        v-model="form.kekurangan"
                                                    >
                                                    </CFormTextarea>
                                                </div>
                                                <div class="col-md-3">
                                                    <CFormTextarea
                                                        label="Oportunity/ Kesempatan"
                                                        rows="3"
                                                        text="Silahkan diisi apabila terdapat catatan"
                                                        v-model="form.kesempatan"
                                                    >
                                                    </CFormTextarea>
                                                </div>
                                                <div class="col-md-3">
                                                    <CFormTextarea
                                                        label="Threat/ Ancaman"
                                                        rows="3"
                                                        text="Silahkan diisi apabila terdapat catatan"
                                                        v-model="form.ancaman"
                                                    >
                                                    </CFormTextarea>
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </CCol>
                        <CCol
                            :md="12"
                            style="text-align: end;"
                        >
                            <hr style="margin: .5rem 0">
                            <CButton
                                type="submit"
                                color="primary"
                            >
                                <CIcon
                                    :content="cilSave"
                                    size="sm"
                                />
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

export default {
    components: {
        DatePicker,
        CButton,
    },
    props: {
        params: Object,
    },
    data() {
        return {
            cilSave,
            cilArrowCircleLeft,
            cilSync,
            penilaians: [],
            tipe: this.$route.params.tipe,
            level: '',
            nilai: {
                ttlNilai: 0,
                countNilai: 0,
            },
        }
    },
    created() {
        this.getPenilaians()
        this.setIdKaryawan(this.$route.params.id_karyawan)
    },
    computed: {
        ...mapState(usePenilaianStore, ['form', 'url', 'validate']),

        ...mapState(useAuthStore, ['user']),

        getLevel() {
            this.level = this.user.karyawan
        },
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

        getPenilaians() {
            let params = {
                id_karyawan: this.$route.params.id_karyawan,
                tipe: this.$route.params.tipe,
            }
            this.loading(true)
            this.getPenilaian(params)
                .then((response) => {
                    this.penilaians = response.data.data
                    console.log(this.penilaians)
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

        onSubmit() {
            this.loading(true)

            const formRequest = {
                id_karyawan: this.$route.params.id_karyawan,
                penilaians: this.penilaians,
                tipe: this.$route.params.tipe,
            }

            this.store(formRequest)
                .then((response) => {
                    this.loading(false)

                    this.showToast({
                        show: true,
                        classType: 'bg-success',
                        title: 'Tindakan Berhasil',
                        msg: 'Nilai sudah terisi',
                    })

                    this.$router.push({ name: 'ListPenilaian' })
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
