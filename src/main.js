import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import CoreuiVue from '@coreui/vue'
import CIcon from '@coreui/icons-vue'
import { iconsSet as icons } from '@/assets/icons'
import DocsExample from '@/components/DocsExample'
import 'bootstrap'
import Spinner from '@/components/Spinner.vue'
import VueGoodTablePlugin from 'vue-good-table-next';
import { createPinia } from 'pinia'
import VueSelect from "vue-select";

// import the styles
import 'vue-good-table-next/dist/vue-good-table-next.css'

const pinia = createPinia()
const app = createApp(App)
app.use(store)
app.use(router)
app.use(CoreuiVue)
app.use(VueGoodTablePlugin);
app.use(pinia)
app.provide('icons', icons)
app.component('CIcon', CIcon)
app.component('Spinner', Spinner) // spinner
app.component("v-select", VueSelect)
app.component('DocsExample', DocsExample)

app.mount('#app')
