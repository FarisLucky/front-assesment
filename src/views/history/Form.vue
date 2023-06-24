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
    <div>
        <CCard>
            <CCardHeader>
                <div class="d-flex justify-content-between">
                    <span class="d-inline-block">
                        Detail Nilai Karyawan <strong class="text-primary">{{ ($route.params.tipe).toUpperCase() }}</strong>
                    </span>
                    <router-link
                        :to="{name: 'ListHistoryPenilaian'}"
                        class="btn btn-sm btn-secondary"
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
                <div class="d-flex justify-content-end">
                    <router-link
                        :to="{name: routeName, params: { id_karyawan: $route.params.id_karyawan, tipe: getTextLink, month: month, year: year}}"
                        class="text-info"
                    >
                        {{ getTextLink.toUpperCase() }}
                    </router-link>
                </div>
                <CRow>
                    <CCol
                        :md="12"
                        class="mb-2"
                    >
                        <ul>
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
                        <table
                            class="table table-bordered"
                            style="width: 100%; border-radius: 10px; border-collapse: collapse;"
                        >
                            <tbody>
                                <tr
                                    v-for="(p) in detail"
                                    :key="p.id"
                                >
                                    <td class="td-striped">
                                        <strong class="title-fs pb-2 d-flex">{{ p.nama_penilaian }}</strong>
                                        <ul class="list-group list-group-flush">
                                            <li
                                                v-for="(sp) in p.relationship.sub"
                                                :key="sp.id"
                                                class="list-group-item border-bottom"
                                                :ttlNilai="ttlNilai = 0"
                                            >
                                                <span
                                                    class="d-inline-block"
                                                    style="width: 80%;"
                                                    :ttlNilai="ttlNilai += sp.nilai"
                                                >{{ sp.sub_penilaian }}</span>
                                                <div class="d-inline-block">
                                                    <strong class="txt_nilai">{{ sp.nilai }}</strong>
                                                </div>
                                            </li>
                                            <li class="list-group-item ttl-color">
                                                <span
                                                    class="d-inline-block"
                                                    style="width: 80%;"
                                                >Jumlah</span>
                                                <strong class="txt_nilai">{{ ttlNilai }}</strong>
                                            </li>
                                        </ul>
                                        <div class="px-2 py-2">
                                            <p class="mb-1 ttl-catatan">
                                                Catatan:
                                            </p>
                                            <p class="mb-1 p-3 bg-white">
                                                {{ p.catatan ?? '-'  }}
                                            </p>
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
        return {
            cilSave,
            cilArrowCircleLeft,
            cilSync,
            penilaian: [],
            detail: [],
            month: new Date().getUTCMonth() + 1,
            year: new Date().getUTCFullYear(),
            ttlNilai: 0,
        }
    },
    created() {
        // this.onShow()
    },
    computed: {
        ...mapState(useHistoryStore, ['url', 'validate']),
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
    methods: {
        ...mapActions(useHistoryStore, [
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

        onShow() {
            this.show({
                id_karyawan: this.$route.params.id_karyawan,
                tipe: this.$route.params.tipe,
                month: this.$route.params.month,
                year: this.$route.params.year,
            })
                .then((response) => {
                    console.log(response)
                    this.penilaian = response.data
                    this.detail = this.penilaian.relationship.detail
                })
                .catch((errors) => {
                    console.log(errors)
                    this.showToast({
                        show: true,
                        classType: 'bg-danger',
                        title: 'Gagal',
                        msg: 'Tidak ada data',
                    })
                    this.$router.back()
                })
        },
    },
    beforeRouteEnter(to, from, next) {
        next((vm) => vm.onShow())
    },
}
</script>
