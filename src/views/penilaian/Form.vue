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
                                        v-for="(penilaian) in penilaians"
                                        :key="penilaian.id"
                                    >
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
            ttlNilai: 0,
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
                sub_penilaian: this.penilaians,
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
    },
}
</script>
