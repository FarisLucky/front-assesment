<style>
.button {
    margin-top: 35px;
}
.flip-list-move {
    transition: transform 0.5s;
}
.no-move {
    transition: transform 0s;
}
</style>
<template>
    <CCard class="mb-4">
        <CCardHeader>
            <div class="d-flex justify-content-between">
                <span class="d-inline-block">
                    Pengaturan Penilaian
                </span>
            </div>
        </CCardHeader>
        <CCardBody>
            <div class="text-end mb-3">
                <CButton
                    type="reset"
                    color="light"
                    class="mt-1"
                    style="margin-right: 7px;"
                    @click.prevent="onRefresh"
                >
                    <CIcon
                        :content="cilSync"
                        size="sm"
                    />
                    Refresh
                </CButton>
            </div>
            <CForm
                method="post"
                autocomplete="off"
                @submit.prevent="onSubmitPenilaian"
            >
                <input
                    type="hidden"
                    name="__method"
                    v-model="method"
                />
                <input
                    type="hidden"
                    name="id"
                    v-if="method == 'PUT'"
                    v-model="id"
                />
                <CRow>
                    <CCol>
                        <CCard class="border-primary">
                            <CCardHeader>Item Penilaian</CCardHeader>
                            <CCardBody>
                                <draggable
                                    class="list-group w-full"
                                    v-model="tipePenilaian"
                                    v-bind="dragOptions"
                                    @start="isDragging = true"
                                    @end="isDragging = false"
                                >
                                    <transition-group
                                        type="transition"
                                        name="flip-list"
                                    >
                                        <CListGroupItem
                                            v-for="tipe in tipePenilaian"
                                            :key="tipe.nama"
                                        >
                                            {{ tipe.nama }}
                                        </CListGroupItem>
                                    </transition-group>
                                </draggable>
                            </CCardBody>
                        </CCard>
                    </CCol>
                    <CCol :md="4">
                        <CCard class="border-info">
                            <CCardHeader>Penilaian Umum</CCardHeader>
                            <CCardBody>
                                <draggable
                                    class="list-group w-full"
                                    v-model="penilaianUmum"
                                    v-bind="dragOptions"
                                    @start="isDragging = true"
                                    @end="isDragging = false"
                                >
                                    <transition-group
                                        type="transition"
                                        name="flip-list"
                                    >
                                        <CListGroupItem
                                            v-for="element in penilaianUmum"
                                            :key="element.id"
                                        >
                                            <p>{{ element.tipe?.nama.toUpperCase() }}</p>
                                            <Multiselect
                                                v-model="element.jabatan"
                                                :options="jabatan"
                                                label="nama"
                                                trackBy="nama"
                                                :close-on-select="true"
                                                :multiple="true"
                                                @remove="onDeselect(element.id)"
                                            ></Multiselect>
                                        </CListGroupItem>
                                    </transition-group>
                                </draggable>
                            </CCardBody>
                        </CCard>
                    </CCol>
                    <CCol :md="4">
                        <CCard class="border-info">
                            <CCardHeader>Penilaian Khusus</CCardHeader>
                            <CCardBody>
                                <draggable
                                    class="list-group w-full"
                                    v-model="penilaianKhusus"
                                    v-bind="dragOptions"
                                    @start="isDragging = true"
                                    @end="isDragging = false"
                                >
                                    <transition-group
                                        type="transition"
                                        name="flip-list"
                                    >
                                        <CListGroupItem
                                            v-for="element in penilaianKhusus"
                                            :key="element.nama"
                                        >
                                            <p>{{ element.nama }}</p>
                                        </CListGroupItem>
                                    </transition-group>
                                </draggable>
                            </CCardBody>
                        </CCard>
                    </CCol>
                    <CCol
                        :sm="12"
                        class="text-end border-top mt-3 pb-5"
                    >
                        <CButton
                            type="submit"
                            color="primary"
                            class="mt-1"
                            style="margin-right: 7px;"
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
import { useSpinnerStore } from '@/store/spinner'
import { useMTipeStore } from '@/store/m_tipe'
import { useJabatanStore } from '@/store/jabatan'
import { useMTipePenilaianStore } from '@/store/m_tipe_penilaian'
import { VueDraggableNext } from 'vue-draggable-next'
import Multiselect from 'vue-multiselect'

export default {
    components: {
        draggable: VueDraggableNext,
        Multiselect,
    },
    data() {
        return {
            cilSave,
            cilSync,
            cilArrowCircleLeft,
            cilMedicalCross,
            cilX,
            enabled: true,
            dragging: false,
            tipePenilaian: [],
            tipe: ['Penilaian Umum', 'Penilaian Khusus'],
            penilaianKhusus: [],
            penilaianUmum: [],
            options: ['list', 'of', 'options'],
            jabatan: [],
            test: [
                { id: 1, nama: 'vaja' },
                { id: 2, nama: 'kava' },
            ],
        }
    },
    created() {
        this.onRefresh()
        this.onGetJabatan()
        console.log(this.penilaianUmum)
    },
    computed: {
        ...mapState(useMTipeStore, ['id', 'form', 'validate', 'method']),

        dragOptions() {
            return {
                animation: 0,
                group: 'description',
                disabled: false,
                ghostClass: 'ghost',
            }
        },
    },
    watch: {
        'element.pengisi'(newVal) {
            console.log(newVal)
        },
    },
    methods: {
        ...mapActions(useMTipePenilaianStore, {
            tipePenilaianUpdate: 'update',
        }),

        ...mapActions(useToastStore, ['showToast']),

        ...mapActions(useSpinnerStore, ['loading']),

        onDeselect(id) {
            console.log(id)

            this.loading(true)

            useMTipePenilaianStore()
                .destroy(id)
                .then((response) => {
                    this.onRefresh()
                    this.loading(true)
                })
        },

        getTipe() {
            this.loading(true)
            useMTipeStore()
                .fetchData()
                .then((response) => {
                    let data = response.data.data.map((val) => ({
                        id: val.id,
                        nama: val.nama.toUpperCase(),
                    }))
                    this.tipePenilaian = data
                    this.loading(true)
                })
                .catch((errors) => {
                    this.showToast({
                        show: true,
                        classType: 'bg-danger',
                        title: 'Gagal',
                        msg: errors.response.data.message,
                    })
                    this.loading(false)
                })
        },

        onGetJabatan() {
            this.loading(true)

            useJabatanStore()
                .fetchData()
                .then((response) => {
                    console.log(response)
                    let data = response.data.map((val) => ({
                        id: val.id,
                        nama: val.nama.toUpperCase(),
                    }))
                    this.jabatan = data
                    this.loading(true)
                })
                .catch((errors) => {
                    console.log(errors)
                    this.showToast({
                        show: true,
                        classType: 'bg-danger',
                        title: 'Gagal',
                        msg: errors.response.data.message,
                    })
                    this.loading(false)
                })
        },

        onGetByTipe(tipe) {
            this.loading(true)
            return useMTipeStore()
                .getByTipe(tipe)
                .then((response) => {
                    console.log(response)
                    let data = response?.data
                    this.loading(true)

                    return data
                })
                .catch((errors) => {
                    console.log(errors)
                    this.showToast({
                        show: true,
                        classType: 'bg-danger',
                        title: 'Gagal',
                        msg: errors.response.data.message,
                    })
                    this.loading(false)
                })
        },

        onSubmitPenilaian() {
            this.loading(true)

            let formData = {
                penilaian_umum: this.penilaianUmum,
                penilaian_khusus: this.penilaianKhusus,
            }
            // console.log(formData)
            // return

            this.tipePenilaianUpdate(formData)
                .then((response) => {
                    console.log(response)
                    this.showToast({
                        show: true,
                        classType: 'bg-success',
                        title: 'Berhasil ditambahkan !',
                        msg: response,
                    })
                    this.loading(false) // remove spinner loading
                    this.onRefresh()
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
            useTableStore().fetchData()
            this.resetForm()
            this.resetValidation()
        },

        onRefresh() {
            this.getTipe()

            this.onGetByTipe({
                // pk umum
                tipe: 'pk_umum',
            }).then((result) => {
                this.penilaianUmum = result
            })

            this.onGetByTipe({
                // pk khusus
                tipe: 'pk_khusus',
            }).then((result) => {
                this.penilaianKhusus = result
            })
        },
    },
}
</script>
<style src="vue-multiselect/dist/vue-multiselect.css"></style>
<style>
.multiselect__tags,
.multiselect {
    font-size: 12px !important;
}
</style>
