<template>
    <section>
        <div class="mb-2">
            <CFormInput type="file" @change="onChange" />
        </div>
        <xlsx-read :file="file">
            <xlsx-table />
        </xlsx-read>
        <hr>
        <CButton color="primary">
            Upload
        </CButton>
    </section>
</template>
<script>
import { XlsxRead, XlsxTable } from "vue3-xlsx/dist/vue3-xlsx.cjs.prod";

export default {
    components: {
        XlsxRead,
        XlsxTable
    },
    data() {
        return {
            file: null,
        };
    },
    methods: {
        onChange(event) {
            this.file = event.target.files ? event.target.files[0] : null;
            console.log(this.file)
        },
    },
}
</script>
