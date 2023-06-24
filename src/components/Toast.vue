<template>
    <Transition
        name="fade"
        mode="out-in"
    >
        <div
            class="position-fixed top-0 end-0 p-3"
            style="z-index: 9999"
        >
            <div
                id="liveToast"
                class="toast"
                :class="show ? 'show' : 'hide'"
                role="alert"
                aria-live="assertive"
                aria-atomic="true"
            >
                <div
                    class="toast-header text-white"
                    :class="classType"
                >
                    <strong class="me-auto">{{ title }}</strong>
                    <small></small>
                    <button
                        type="button"
                        class="btn-close"
                        data-bs-dismiss="toast"
                        aria-label="Close"
                    ></button>
                </div>
                <div class="toast-body">
                    {{ msg }}
                </div>
            </div>
        </div>
    </Transition>
</template>
<script>
import { useToastStore } from '@/store/toast'
import { mapActions, mapState } from 'pinia'
export default {
    name: 'Toast',
    computed: {
        ...mapState(useToastStore, ['show', 'title', 'msg', 'classType']),
    },
    watch: {
        show() {
            this.hideToast()
        },
    },
    methods: {
        ...mapActions(useToastStore, ['showToast', 'hideToast']),
    },
}
</script>
