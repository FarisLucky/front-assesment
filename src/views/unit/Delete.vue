<template>
    <CRow>
        <CCol :md="12">
            <p class="mb-5">Apakah ingin menghapus data ?</p>
        </CCol>
        <CCol :md="12">
            <div class="mb-3 text-end">
                <CButton
                    type="button"
                    color="danger"
                    class="text-white"
                    style="margin-right: 7px;"
                    @click.prevent="onDestroy"
                >
                    <CIcon
                        :content="cilSave"
                        size="sm"
                    />
                    Hapus
                </CButton>
            </div>
        </CCol>
    </CRow>
</template>
<script>
import { cilSave, cilSync } from '@coreui/icons'
import { mapActions, mapState } from 'pinia'
import { useModalStore } from '@/store/modal'
import { useToastStore } from '@/store/toast'
import useTableStore from '@/store/table'
import { useUnitStore } from '@/store/unit'

export default {
    name: 'Delete',
    props: {
        params: Object,
    },
    data() {
        return {
            cilSave,
            cilSync,
        }
    },
    computed: {
        ...mapState(useUnitStore, ['id']),
    },
    methods: {
        ...mapActions(useUnitStore, ['destroy']),

        onDestroy() {
            this.destroy(this.id)
                .then((response) => {
                    useToastStore().showToast({
                        show: true,
                        classType: 'bg-success',
                        title: 'Berhasil',
                        msg: 'Tindakan Berhasil !',
                    })
                    useTableStore().fetchData()
                })
                .catch((errors) => {
                    useToastStore().showToast({
                        show: true,
                        classType: 'bg-success',
                        title: 'Berhasil',
                        msg: errors,
                    })
                })
                .finally(() => {
                    useModalStore().setModal(false)
                })
        },
    },
}
</script>
