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
                    @click.prevent="onDestroy()"
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
import { mapActions } from 'pinia'
import { useMPenilaianStore } from '@/store/m_penilaian'
import { mapState } from 'pinia'
import { useModalStore } from '@/store/modal'
import { useSpinnerStore } from '@/store/spinner'
import { useToastStore } from '@/store/toast'
import useTableStore from '@/store/table'

export default {
    name: 'Delete',
    data() {
        return {
            cilSave,
            cilSync,
        }
    },
    computed: {
        ...mapState(useMPenilaianStore, ['id']),
    },
    methods: {
        ...mapActions(useMPenilaianStore, ['destroy']),

        ...mapActions(useModalStore, ['setModal']),

        ...mapActions(useSpinnerStore, ['loading']),

        ...mapActions(useToastStore, ['showToast']),

        onDestroy() {
            this.destroy(this.id)
                .then((response) => {
                    this.showToast({
                        show: true,
                        classType: 'bg-success',
                        title: 'Berhasil',
                        msg: 'Tindakan Berhasil !',
                    })
                    useTableStore().fetchData()
                })
                .catch((errors) => {
                    console.log(errors)
                })
                .finally(() => {
                    this.setModal(false)
                })
        },
    },
}
</script>
