<template>
    <div>
        <AppSidebar />
        <div class="wrapper d-flex flex-column min-vh-100 bg-light">
            <AppHeader />
            <div class="body flex-grow-1 px-3 position-relative">
                <transition
                    name="shrink"
                    mode="in-out"
                >
                    <Spinner v-if="isLoading"></Spinner>
                </transition>
                <CContainer lg>
                    <router-view v-slot="{Component, route}">
                        <Transition
                            name="fade-x"
                            mode="out-in"
                        >
                            <div :key="route.name">
                                <component :is="Component"></component>
                            </div>
                        </Transition>
                    </router-view>
                </CContainer>
            </div>
            <AppFooter />
            <Transition
                name="fade-x"
                mode="out-in"
            >
                <Toast />
            </Transition>
        </div>
    </div>
</template>
<script>
import { CContainer } from '@coreui/vue'
import AppFooter from '@/components/AppFooter.vue'
import AppHeader from '@/components/AppHeader.vue'
import AppSidebar from '@/components/AppSidebar.vue'
import { CSpinner } from '@coreui/vue'
import Spinner from '@/components/Spinner.vue'
import { useSpinnerStore } from '@/store/spinner'
import { mapState } from 'pinia'
import Toast from '@/components/Toast.vue'

export default {
    name: 'DefaultLayout',
    components: {
        AppFooter,
        AppHeader,
        AppSidebar,
        CContainer,
        CSpinner,
        Spinner,
        Toast,
    },
    computed: {
        ...mapState(useSpinnerStore, ['isLoading']),
    },
}
</script>
