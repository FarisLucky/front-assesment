<template>
    <div class="mb-3">
        <CAccordion>
            <CAccordionItem :item-key="1">
                <CAccordionHeader>
                    Filter
                </CAccordionHeader>
                <CAccordionBody>
                    <CForm method="POST" @submit.prevent="onSearch">
                        <CRow>
                            <CCol :md="3">
                                <CFormLabel class="col-sm-2 col-form-label">Bulan</CFormLabel>
                                <date-picker v-model:value="filters.month" type="month" placeholder="Pilih Bulan"
                                    value-type="format" format="MM"></date-picker>
                            </CCol>
                            <CCol :md="3">
                                <CFormLabel class="col-sm-2 col-form-label">Tahun</CFormLabel>
                                <date-picker v-model:value="filters.year" type="year" placeholder="Pilih Tahun"
                                    value-type="format" format="YYYY"></date-picker>
                            </CCol>
                            <CCol :md="3" class="align-self-end mt-2">
                                <CButton type="submit" color="primary" class="me-2">
                                    <CIcon :content="cilSearch" size="sm" />
                                    Cari
                                </CButton>
                                <CButton type="reset" color="secondary" variant="outline" @click.prevent="onReset">
                                    <CIcon :content="cilSync" size="sm" />
                                    Reset
                                </CButton>
                            </CCol>
                        </CRow>
                    </CForm>
                </CAccordionBody>
            </CAccordionItem>
        </CAccordion>
    </div>
</template>
<script>
import { cilSearch, cilSync } from '@coreui/icons';
import DatePicker from 'vue-datepicker-next'
import 'vue-datepicker-next/index.css'

export default {
    components: {
        DatePicker,
        cilSearch,
        cilSync
    },
    data() {
        return {
            cilSearch,
            cilSync,
            filters: {},
        }
    },
    methods: {
        onSearch() {
            let params = {
                type: 'filterExt',
                columnFilters: this.filters
            }
            this.$emit('columnFilter', params)
        },
        onReset() {
            this.filters.month = ''
            this.filters.year = ''
            let params = {
                type: 'filterExt',
                columnFilters: this.filters
            }
            this.$emit('columnFilter', params)
        }
    },
}
</script>
