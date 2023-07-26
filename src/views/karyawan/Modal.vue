<template>
    <CModal ref="modal" :visible="modal" @close="setModal(false)" :size="size" scrollable>
        <CModalHeader>
            <CModalTitle>{{ title }}</CModalTitle>
        </CModalHeader>
        <CModalBody>
            <Error v-if="nError">
                <strong>{{ nError.message }}</strong>
                <div v-for="(error, idx) in nError.errors" :key="idx">
                    <span>{{ error[0] }}</span>
                </div>
            </Error>
            <component :is="component"></component>
        </CModalBody>
    </CModal>
</template>
<script>
import Add from './Add.vue'
import Delete from './Delete.vue'
import Edit from './Edit.vue'
import Excel from './Excel.vue'
import Error from '@/components/Error.vue'
import { useModalStore } from '@/store/modal'
import { mapActions, mapState } from 'pinia'

export default {
    components: {
        Add,
        Edit,
        Delete,
        Excel,
        Error,
    },
    props: {
        mComponent: String,
    },
    data() {
        return {
            nError: false,
        }
    },
    computed: {
        ...mapState(useModalStore, [
            'title',
            'params',
            'modal',
            'size',
            'component',
        ]),
    },
    methods: {
        ...mapActions(useModalStore, {
            setTitle: 'setTitle',
            setModal: 'setModal',
            setParams: 'setParams',
            setComponent: 'setComponent',
        }),
    },
}
</script>
