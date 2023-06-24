<template>
    <div>
        <CCard>
            <CCardHeader>
                <div class="d-flex justify-content-between">
                    <span class="d-inline-block">
                        Edit Karyawan
                    </span>
                    <router-link
                        class="btn btn-sm btn-secondary"
                        :to="{name: 'list-karyawan'}"
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
                        <CCol :md="3">
                            <div class="mb-1">
                                <CFormLabel for="nama">Nama</CFormLabel>
                                <CFormInput
                                    id="nama"
                                    type="text"
                                    v-model="form.nama"
                                />
                                <div
                                    class="invalid-feedback"
                                    v-if="validate?.nama"
                                >
                                    {{ validate?.nama[0] }}
                                </div>
                            </div>
                        </CCol>
                        <CCol :md="3">
                            <div class="mb-1">
                                <CFormLabel for="nip">Nip</CFormLabel>
                                <CFormInput
                                    id="nip"
                                    type="text"
                                    v-model="form.nip"
                                />
                                <div
                                    class="invalid-feedback"
                                    v-if="validate?.nip"
                                >
                                    {{ validate?.nip[0] }}
                                </div>
                            </div>
                        </CCol>
                        <CCol :md="3">
                            <div class="mb-1">
                                <CFormLabel for="sex">Sex</CFormLabel>
                                <v-select
                                    v-model="form.sex"
                                    :options="['L','P']"
                                >
                                </v-select>
                                <div
                                    class="invalid-feedback"
                                    v-if="validate?.sex"
                                >
                                    {{ validate?.sex[0] }}
                                </div>
                            </div>
                        </CCol>
                        <CCol :md="3">
                            <div class="mb-1">
                                <CFormLabel for="tgl_lahir">Tgl Lahir</CFormLabel>
                                <div>
                                    <date-picker
                                        v-model:value="form.tgl_lahir"
                                        type="date"
                                        placeholder="Pilih Tanggal"
                                        value-type="format"
                                        format="YYYY-MM-DD"
                                    ></date-picker>
                                </div>
                                <div
                                    class="invalid-feedback"
                                    v-if="validate?.tgl_lahir"
                                >
                                    {{ validate?.tgl_lahir[0] }}
                                </div>
                            </div>
                        </CCol>
                        <CCol :md="3">
                            <div class="mb-1">
                                <CFormLabel for="nip">Pendidikan</CFormLabel>
                                <CFormInput
                                    id="pendidikan"
                                    type="text"
                                    v-model="form.pendidikan"
                                />
                                <div
                                    class="invalid-feedback d-inline-block"
                                    v-if="validate?.pendidikan"
                                >
                                    {{ validate?.pendidikan[0] }}
                                </div>
                            </div>
                        </CCol>
                        <CCol :md="3">
                            <div class="mb-1">
                                <CFormLabel for="jabatan">Jabatan</CFormLabel>
                                <v-select
                                    v-model="form.jabatan"
                                    :options="jabatans"
                                    :reduce="jabatan => jabatan.id"
                                >
                                </v-select>
                                <div
                                    class="invalid-feedback"
                                    v-if="validate?.jabatan"
                                >
                                    {{ validate?.jabatan[0] }}
                                </div>
                            </div>
                        </CCol>
                        <CCol :md="3">
                            <div class="mb-1">
                                <CFormLabel for="unit">Unit</CFormLabel>
                                <v-select
                                    v-model="form.unit"
                                    :options="units"
                                    :reduce="unit => unit.id"
                                >
                                </v-select>
                                <div
                                    class="invalid-feedback d-inline-block"
                                    v-if="validate?.unit"
                                >
                                    {{ validate?.unit[0] }}
                                </div>
                            </div>
                        </CCol>
                        <CCol :md="3">
                            <div class="mb-1">
                                <CFormLabel for="status">Pegawai</CFormLabel>
                                <v-select
                                    v-model="form.status"
                                    :options="statusList"
                                >
                                </v-select>
                                <div
                                    class="invalid-feedback d-inline-block"
                                    v-if="validate?.status"
                                >
                                    {{ validate?.status[0] }}
                                </div>
                            </div>
                        </CCol>
                        <CCol :md="6">
                            <div class="mb-1">
                                <CFormLabel for="alamat">Alamat</CFormLabel>
                                <CFormInput
                                    id="alamat"
                                    type="text"
                                    v-model="form.alamat"
                                />
                                <div
                                    class="invalid-feedback"
                                    v-if="validate?.alamat"
                                >
                                    {{ validate?.alamat[0] }}
                                </div>
                            </div>
                        </CCol>
                        <CCol :md="3">
                            <div class="mb-1">
                                <CFormLabel for="tgl_lulus">Tgl Lulus</CFormLabel>
                                <div>
                                    <date-picker
                                        v-model:value="form.tgl_lulus"
                                        type="date"
                                        placeholder="Pilih Tanggal"
                                        value-type="format"
                                        format="YYYY-MM-DD"
                                    ></date-picker>
                                </div>
                                <div
                                    class="invalid-feedback d-inline-block"
                                    v-if="validate?.tgl_lulus"
                                >
                                    {{ validate?.tgl_lulus[0] }}
                                </div>
                            </div>
                        </CCol>
                        <CCol :md="12">
                            <div class="mb-1 text-end">
                                <CButton
                                    type="submit"
                                    color="primary"
                                    style="margin-right: 7px;"
                                >
                                    <CIcon
                                        :content="cilSave"
                                        size="sm"
                                    />
                                    Simpan
                                </CButton>
                                <CButton
                                    type="button"
                                    color="secondary"
                                    variant="outline"
                                    @click.prevent="onShow"
                                >
                                    <CIcon
                                        :content="cilSync"
                                        size="sm"
                                    />
                                    Reset
                                </CButton>
                            </div>
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
import { useKaryawansStore } from '@/store/karyawans'
import { useToastStore } from '@/store/toast'
import { useJabatanStore } from '@/store/jabatan'
import DatePicker from 'vue-datepicker-next'
import 'vue-datepicker-next/index.css'
import { useSpinnerStore } from '@/store/spinner'
import { useUnitStore } from '@/store/unit'

export default {
    components: {
        DatePicker,
    },
    props: {
        params: Object,
    },
    data() {
        return {
            cilSave,
            cilArrowCircleLeft,
            cilSync,
            jabatans: [],
            units: [],
        }
    },
    created() {
        this.resetForm()
        this.onShow()
        this.getJabatans()
        this.getUnits()
    },
    computed: {
        ...mapState(useKaryawansStore, [
            'form',
            'url',
            'validate',
            'sexList',
            'statusList',
        ]),
    },
    methods: {
        ...mapActions(useKaryawansStore, [
            'show',
            'update',
            'resetForm',
            'resetValidation',
        ]),
        ...mapActions(useJabatanStore, {
            jabatanFetch: 'fetchData',
        }),
        ...mapActions(useUnitStore, {
            unitFetch: 'fetchData',
        }),
        ...mapActions(useSpinnerStore, ['loading']),
        getJabatans() {
            this.jabatanFetch()
                .then((response) => {
                    let prepareData = response.data.data.map((val) => ({
                        id: val.id,
                        label: val.nama,
                    }))
                    this.jabatans = prepareData
                })
                .catch((errors) => {
                    useToastStore.showToast({
                        show: true,
                        classType: 'bg-danger',
                        title: 'Gagal',
                        msg: errors.response.data.message,
                    })
                })
        },

        getUnits() {
            this.unitFetch()
                .then((response) => {
                    let prepareData = response.data.data.map((val) => ({
                        id: val.id,
                        label: val.nama,
                    }))
                    this.units = prepareData
                })
                .catch((errors) => {
                    useToastStore.showToast({
                        show: true,
                        classType: 'bg-danger',
                        title: 'Gagal',
                        msg: errors.response.data.message,
                    })
                })
        },

        onShow() {
            const id = this.$route.params.id

            this.loading(true)

            this.show(id)
                .then((response) => {
                    this.id = response.data.id
                    this.form.nama = response.data.nama
                    this.form.nip = response.data.nip
                    this.form.sex = response.data.sex
                    this.form.tgl_lahir = response.data.tgl_lahir
                    this.form.alamat = response.data.alamat
                    this.form.jabatan = response.data.id_jabatan
                    this.form.unit = response.data.id_unit
                    this.form.tgl_lulus = response.data.tgl_lulus
                    this.form.status = response.data.status
                    this.loading(false)
                })
                .catch((errors) => {
                    useToastStore.showToast({
                        show: true,
                        classType: 'bg-danger',
                        title: 'Gagal',
                        msg: errors.response.data.message,
                    })

                    this.resetForm()
                    this.resetValidation()
                    this.loading(false)
                })
        },

        onSubmit() {
            const id = this.$route.params.id

            this.loading(true)

            this.update(id)
                .then((response) => {
                    this.loading(false)
                    this.$router.push({ name: 'list-karyawan' })
                })
                .catch((errors) => {
                    this.loading(false)
                    useToastStore.showToast({
                        show: true,
                        classType: 'bg-danger',
                        title: 'Gagal',
                        msg: errors.response.data.message,
                    })

                    this.resetValidation()
                })
        },
    },
}
</script>
