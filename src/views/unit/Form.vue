<template>
    <CCard class="mb-4">
        <CCardHeader>
            <div class="d-flex justify-content-between">
                <span class="d-inline-block">
                    Tambah Unit
                </span>
            </div>
        </CCardHeader>
        <CCardBody>
            <form
                method="post"
                @submit.prevent="onSubmit"
                autocomplete="off"
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
                <CRow class="align-items-end">
                    <CCol :md="4">
                        <div class="mb-1">
                            <CFormLabel for="nama">Nama</CFormLabel>
                            <CFormInput
                                id="nama"
                                type="text"
                                v-model="form.nama"
                                autofocus
                            />
                            <div
                                class="invalid-feedback d-inline-block"
                                v-if="validate?.nama"
                            >
                                {{ validate?.nama[0] }}
                            </div>
                        </div>
                    </CCol>
                    <CCol>
                        <div class="mb-1">
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
                                type="reset"
                                color="secondary"
                                variant="outline"
                                @click.prevent="onReset"
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
            </form>
        </CCardBody>
    </CCard>
</template>
<script>
import { cilSave, cilSync } from '@coreui/icons'
import { useUnitStore } from '@/store/unit'
import { mapActions } from 'pinia'
import { mapState } from 'pinia'
import { useToastStore } from '@/store/toast'
import { useSpinnerStore } from '@/store/spinner'
import useTableStore from '@/store/table'

export default {
    data() {
        return {
            cilSave,
            cilSync,
        }
    },
    computed: {
        ...mapState(useUnitStore, ['id', 'form', 'method', 'url', 'validate']),
    },
    watch: {
        'form.nama'() {
            this.form.nama = this.form.nama.toUpperCase()
        },
    },
    methods: {
        ...mapActions(useUnitStore, [
            'fetchData',
            'store',
            'update',
            'resetForm',
            'setMethod',
            'resetValidation',
            'setValidation',
        ]),
        onSubmit() {
            useSpinnerStore().loading(true)
            let action

            if (this.method == 'POST') {
                action = this.store(this.form)
            } else if (this.method == 'PUT') {
                action = this.update(this.form, this.id)
            }

            action
                .then((response) => {
                    useToastStore().showToast({
                        show: true,
                        classType: 'bg-success',
                        title: 'Berhasil ditambahkan !',
                        msg: response.data,
                    })
                    this.resetForm()
                    this.resetValidation()
                    this.setMethod('POST')
                    useTableStore().fetchData()
                    useSpinnerStore().loading(false)
                })
                .catch((errors) => {
                    useSpinnerStore().loading(false)
                    console.log(errors)
                    if (errors?.response.status == 422) {
                        this.setValidation(errors.response.data.errors)
                    } else {
                        useToastStore().showToast({
                            show: true,
                            classType: 'bg-danger',
                            title: 'Gagal',
                            msg: errors?.response.data.message,
                        })

                        this.resetValidation()
                    }
                })
        },

        onReset() {
            useTableStore().fetchData()
            this.resetForm()
            this.resetValidation()
        },
    },
}
</script>
