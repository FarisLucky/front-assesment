<template>
    <div class="row position-relative">
        <div class="col-md-12">
            <CCard class="mb-3">
                <CCardBody>
                    <router-view>
                    </router-view>
                </CCardBody>
            </CCard>
        </div>
    </div>
</template>
<script>
import ProgressTab from './ProgressTab.vue'
export default {
    components: { ProgressTab }

}
</script>
