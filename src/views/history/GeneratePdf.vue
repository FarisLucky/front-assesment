<template>
    <div>
        <HtmlToPdf ref="html2Pdf">

            <section class="pdf-item">
                <h4>
                    Title
                </h4>

                <span>
                    Value
                </span>
            </section>

            <!--
    After this element below, the page will break and any elements after
    <div class="html2pdf__page-break"/> will go to the next page.
-->
            <div class="html2pdf__page-break" />

            <section class="pdf-item">
                <h4>
                    Title
                </h4>

                <span>
                    Value
                </span>
            </section>
        </HtmlToPdf>
        <CButton color="primary" @click.prevent="generateReport">
            Generate PDF
        </CButton>
    </div>
</template>
<script>
import HtmlToPdf from '@/components/HtmlToPdf.vue';

export default {
    components: { HtmlToPdf },
    methods: {
        generateReport() {
            this.$refs.html2Pdf.generatePdf()
        }
    },
}
</script>
