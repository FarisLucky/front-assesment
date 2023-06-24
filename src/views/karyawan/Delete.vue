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
                    @click.prevent="destroy()"
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
import { useKaryawansStore } from '@/store/karyawans'

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
    methods: {
        ...mapActions(useKaryawansStore, ['destroy']),
    },
}
</script>
