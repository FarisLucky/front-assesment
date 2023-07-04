<template>
    <CNav variant="tabs" role="tablist">
        <CNavItem>
            <CNavLink href="javascript:void(0);" :active="tabPaneActiveKey === 1" @click="() => { tabPaneActiveKey = 1 }">
                Mulai
            </CNavLink>
        </CNavItem>
        <CNavItem>
            <CNavLink href="javascript:void(0);" :active="tabPaneActiveKey === 2" @click="() => { tabPaneActiveKey = 2 }">
                Progress
            </CNavLink>
        </CNavItem>
    </CNav>
    <CTabContent>
        <CTabPane v-if="tabPaneActiveKey == 1" role="tabpanel" aria-labelledby="home-tab" :visible="tabPaneActiveKey === 1"
            class="mt-3">
            <ListInit />
        </CTabPane>
        <CTabPane v-if="tabPaneActiveKey == 2" role="tabpanel" aria-labelledby="profile-tab"
            :visible="tabPaneActiveKey === 2" class="mt-3">
            <ListProgress />
        </CTabPane>
    </CTabContent>
</template>
<script>
import ListInit from './ListInit.vue'
import ListProgress from './ListProgress.vue';

export default {
    components: {
        ListInit,
        ListProgress
    },
    data() {
        return {
            tabPaneActiveKey: 1,
        }
    }
}
</script>
