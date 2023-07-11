<template>
    <CModal ref="modal" :visible="modal" @close="setModal(false)" :size="size" scrollable>
        <CModalHeader>
            <CModalTitle>{{ title }}</CModalTitle>
        </CModalHeader>
        <CModalBody>
            <component @fetchData="onFetch()" :is="component"></component>
        </CModalBody>
        <button @click="onFetch()">fetch modla</button>
    </CModal>
</template>
<script>
import Delete from './Delete.vue'
import { useModalStore } from '@/store/modal'
import { mapActions, mapState } from 'pinia'

export default {
    components: {
        Delete,
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
        onFetch() {
            this.$emit('fetch')
        },
    },

}
</script>
