<template>
    <div class="bg-light min-vh-100 d-flex flex-row align-items-center">
        <CContainer>
            <CRow class="justify-content-center">
                <CCol :md="6">
                    <div class="clearfix">
                        <h1 class="float-start display-3 me-4">404</h1>
                        <h4 class="pt-3">Oops! Anda Kehilangan arah</h4>
                        <p class="text-medium-emphasis float-start">
                            Menu yang anda tidak tersedia.
                        </p>
                    </div>
                    <div class="text-end">
                        <CButton color="info" @click.prevent="onBack">
                            Kembali
                        </CButton>
                    </div>
                </CCol>
            </CRow>
        </CContainer>
    </div>
</template>

<script>
export default {
    name: 'Page404',
    methods: {
        onBack() {
            return this.$router.back()
        }
    },
}
</script>
