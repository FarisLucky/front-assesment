import { h, resolveComponent } from 'vue'
import { createRouter, createWebHashHistory } from 'vue-router'

import DefaultLayout from '@/layouts/DefaultLayout'
import { useAuthStore } from '@/store/auth'
import { useToastStore } from '@/store/toast'

const routes = [
    {
        path: '/',
        name: 'Home',
        component: DefaultLayout,
        redirect: '/dashboard',
        children: [
            {
                path: '/dashboard',
                name: 'Dashboard',
                // route level code-splitting
                // this generates a separate chunk (about.[hash].js) for this route
                // which is lazy-loaded when the route is visited.
                component: () =>
                    import(
                        /* webpackChunkName: "dashboard" */ '@/views/Dashboard.vue'
                    ),

                beforeEnter: (to, from) => {
                    // reject the navigation
                    const auth = useAuthStore()
                    useToastStore().showToast({
                        // perlu login
                        show: true,
                        title: 'Notifikasi',
                        msg: 'Selamat Datang ~ ' + auth.getUser().name + ' ~',
                        classType: 'bg-info',
                    })
                    useToastStore().hideToast()
                },
            },
            {
                path: '/theme',
                name: 'Theme',
                redirect: '/theme/typography',
            },
            {
                path: '/theme/colors',
                name: 'Colors',
                component: () => import('@/views/theme/Colors.vue'),
            },
            {
                path: '/theme/typography',
                name: 'Typography',
                component: () => import('@/views/theme/Typography.vue'),
            },

            /**
             * Custom Route For Production
             */
            {
                path: '/karyawans',
                name: 'Karyawan',
                component: () => import('@/views/karyawan/Index.vue'),
                children: [
                    {
                        path: '',
                        name: 'list-karyawan',
                        component: () => import('@/views/karyawan/List.vue'),
                    },
                    {
                        path: '/tambah',
                        name: 'tambah-karyawan',
                        component: () => import('@/views/karyawan/Add.vue'),
                    },
                    {
                        path: '/edit/:id',
                        name: 'edit-karyawan',
                        component: () => import('@/views/karyawan/Edit.vue'),
                    },
                ],
            },
            {
                path: '/jabatans',
                name: 'Jabatans',
                component: () => import('@/views/jabatan/Index.vue'),
                children: [
                    {
                        path: '',
                        name: 'ListJabatan',
                        component: () => import('@/views/jabatan/List.vue'),
                    },
                ],
            },
            {
                path: '/units',
                name: 'Units',
                component: () => import('@/views/unit/Index.vue'),
                children: [
                    {
                        path: '',
                        component: () => import('@/views/unit/List.vue'),
                        name: 'ListUnit',
                    },
                ],
            },
            {
                path: '/m-penilaians',
                name: 'MasterPenilaians',
                component: () => import('@/views/m_penilaian/Index.vue'),
                children: [
                    {
                        path: '',
                        name: 'ListPenilaian',
                        component: () => import('@/views/m_penilaian/List.vue'),
                    },
                ],
            },
            {
                path: '/m-sub-penilaians',
                name: 'MasterSub',
                component: () => import('@/views/m_sub/Index.vue'),
                children: [
                    {
                        path: '',
                        name: 'ListSub',
                        component: () => import('@/views/m_sub/List.vue'),
                    },
                ],
            },
            {
                path: '/m-valid-penilai',
                name: 'MasterValidPenilai',
                component: () => import('@/views/m_valid_penilai/Index.vue'),
                children: [
                    {
                        path: '',
                        name: 'ListSub',
                        component: () => import('@/views/m_valid_penilai/List.vue'),
                    },
                ],
            },
            {
                path: '/tipe',
                name: 'MasterTipe',
                component: () => import('@/views/m_tipe/Index.vue'),
                children: [
                    {
                        path: '',
                        name: 'ListTipe',
                        component: () => import('@/views/m_tipe/List.vue'),
                    },
                ],
            },
            {
                path: '/penilaian-karyawans',
                name: 'PenilaianKaryawan',
                component: () => import('@/views/penilaian/Index.vue'),
                children: [
                    {
                        path: '',
                        name: 'ListPenilaian',
                        component: () => import('@/views/penilaian/ProgressTab.vue'),
                    },
                    {
                        path: '/nilai/:id_karyawan/:tipe',
                        name: 'PenilaianEdit',
                        component: () => import('@/views/penilaian/Form.vue'),
                    },
                    {
                        path: '/nilai/:id_penilaian/progress/',
                        name: 'PenilaianProgressEdit',
                        component: () => import('@/views/penilaian/FormProgress.vue'),
                    },
                ],
            },
            {
                path: '/history-penilaians',
                name: 'HistoryPenilaian',
                component: () => import('@/views/history/Index.vue'),
                children: [
                    {
                        path: '',
                        name: 'ListHistoryPenilaian',
                        component: () => import('@/views/history/List.vue'),
                    },
                    {
                        path: '/:id_karyawan/:tipe',
                        name: 'ShowUmumHistory',
                        component: () => import('@/views/history/Form.vue'),
                    },
                    {
                        path: '/:id_karyawan/:tipe',
                        name: 'ShowKhususHistory',
                        component: () => import('@/views/history/Form.vue'),
                    },
                    {
                        path: '/:id_karyawan/:tipe/:month/:year/generate-pdf',
                        name: 'GeneratePdf',
                        component: () => import('@/components/HtmlToPdf.vue'),
                    },
                ],
            },
            {
                path: '/base',
                name: 'Base',
                component: {
                    render() {
                        return h(resolveComponent('router-view'))
                    },
                },
                redirect: '/base/breadcrumbs',
                children: [
                    {
                        path: '/base/accordion',
                        name: 'Accordion',
                        component: () => import('@/views/base/Accordion.vue'),
                    },
                    {
                        path: '/base/breadcrumbs',
                        name: 'Breadcrumbs',
                        component: () => import('@/views/base/Breadcrumbs.vue'),
                    },
                    {
                        path: '/base/cards',
                        name: 'Cards',
                        component: () => import('@/views/base/Cards.vue'),
                    },
                    {
                        path: '/base/carousels',
                        name: 'Carousels',
                        component: () => import('@/views/base/Carousels.vue'),
                    },
                    {
                        path: '/base/collapses',
                        name: 'Collapses',
                        component: () => import('@/views/base/Collapses.vue'),
                    },
                    {
                        path: '/base/list-groups',
                        name: 'List Groups',
                        component: () => import('@/views/base/ListGroups.vue'),
                    },
                    {
                        path: '/base/navs',
                        name: 'Navs',
                        component: () => import('@/views/base/Navs.vue'),
                    },
                    {
                        path: '/base/paginations',
                        name: 'Paginations',
                        component: () => import('@/views/base/Paginations.vue'),
                    },
                    {
                        path: '/base/placeholders',
                        name: 'Placeholders',
                        component: () =>
                            import('@/views/base/Placeholders.vue'),
                    },
                    {
                        path: '/base/popovers',
                        name: 'Popovers',
                        component: () => import('@/views/base/Popovers.vue'),
                    },
                    {
                        path: '/base/progress',
                        name: 'Progress',
                        component: () => import('@/views/base/Progress.vue'),
                    },
                    {
                        path: '/base/spinners',
                        name: 'Spinners',
                        component: () => import('@/views/base/Spinners.vue'),
                    },
                    {
                        path: '/base/tables',
                        name: 'Tables',
                        component: () => import('@/views/base/Tables.vue'),
                    },
                    {
                        path: '/base/tooltips',
                        name: 'Tooltips',
                        component: () => import('@/views/base/Tooltips.vue'),
                    },
                ],
            },
            {
                path: '/buttons',
                name: 'Buttons',
                component: {
                    render() {
                        return h(resolveComponent('router-view'))
                    },
                },
                redirect: '/buttons/standard-buttons',
                children: [
                    {
                        path: '/buttons/standard-buttons',
                        name: 'Buttons',
                        component: () => import('@/views/buttons/Buttons.vue'),
                    },
                    {
                        path: '/buttons/dropdowns',
                        name: 'Dropdowns',
                        component: () =>
                            import('@/views/buttons/Dropdowns.vue'),
                    },
                    {
                        path: '/buttons/button-groups',
                        name: 'Button Groups',
                        component: () =>
                            import('@/views/buttons/ButtonGroups.vue'),
                    },
                ],
            },
            {
                path: '/forms',
                name: 'Forms',
                component: {
                    render() {
                        return h(resolveComponent('router-view'))
                    },
                },
                redirect: '/forms/form-control',
                children: [
                    {
                        path: '/forms/form-control',
                        name: 'Form Control',
                        component: () =>
                            import('@/views/forms/FormControl.vue'),
                    },
                    {
                        path: '/forms/select',
                        name: 'Select',
                        component: () => import('@/views/forms/Select.vue'),
                    },
                    {
                        path: '/forms/checks-radios',
                        name: 'Checks & Radios',
                        component: () =>
                            import('@/views/forms/ChecksRadios.vue'),
                    },
                    {
                        path: '/forms/range',
                        name: 'Range',
                        component: () => import('@/views/forms/Range.vue'),
                    },
                    {
                        path: '/forms/input-group',
                        name: 'Input Group',
                        component: () => import('@/views/forms/InputGroup.vue'),
                    },
                    {
                        path: '/forms/floating-labels',
                        name: 'Floating Labels',
                        component: () =>
                            import('@/views/forms/FloatingLabels.vue'),
                    },
                    {
                        path: '/forms/layout',
                        name: 'Layout',
                        component: () => import('@/views/forms/Layout.vue'),
                    },
                    {
                        path: '/forms/validation',
                        name: 'Validation',
                        component: () => import('@/views/forms/Validation.vue'),
                    },
                ],
            },
            {
                path: '/charts',
                name: 'Charts',
                component: () => import('@/views/charts/Charts.vue'),
            },
            {
                path: '/icons',
                name: 'Icons',
                component: {
                    render() {
                        return h(resolveComponent('router-view'))
                    },
                },
                redirect: '/icons/coreui-icons',
                children: [
                    {
                        path: '/icons/coreui-icons',
                        name: 'CoreUI Icons',
                        component: () =>
                            import('@/views/icons/CoreUIIcons.vue'),
                    },
                    {
                        path: '/icons/brands',
                        name: 'Brands',
                        component: () => import('@/views/icons/Brands.vue'),
                    },
                    {
                        path: '/icons/flags',
                        name: 'Flags',
                        component: () => import('@/views/icons/Flags.vue'),
                    },
                ],
            },
            {
                path: '/notifications',
                name: 'Notifications',
                component: {
                    render() {
                        return h(resolveComponent('router-view'))
                    },
                },
                redirect: '/notifications/alerts',
                children: [
                    {
                        path: '/notifications/alerts',
                        name: 'Alerts',
                        component: () =>
                            import('@/views/notifications/Alerts.vue'),
                    },
                    {
                        path: '/notifications/badges',
                        name: 'Badges',
                        component: () =>
                            import('@/views/notifications/Badges.vue'),
                    },
                    {
                        path: '/notifications/modals',
                        name: 'Modals',
                        component: () =>
                            import('@/views/notifications/Modals.vue'),
                    },
                ],
            },
            {
                path: '/widgets',
                name: 'Widgets',
                component: () => import('@/views/widgets/Widgets.vue'),
            },
        ],
    },
    {
        path: '/login',
        name: 'Login',
        component: () => import('@/views/auth/Login'),
        beforeEnter: (to, from) => {
            // reject the navigation
            const auth = useAuthStore()

            if (auth.getLoggedIn()) {
                return '/'
            }
        },
    },
    {
        path: '/pages',
        redirect: '/pages/404',
        name: 'Pages',
        component: {
            render() {
                return h(resolveComponent('router-view'))
            },
        },
        children: [
            {
                path: '404',
                name: 'Page404',
                component: () => import('@/views/pages/Page404'),
            },
            {
                path: '500',
                name: 'Page500',
                component: () => import('@/views/pages/Page500'),
            },
            {
                path: 'register',
                name: 'Register',
                component: () => import('@/views/pages/Register'),
            },
        ],
    },
]

const router = createRouter({
    history: createWebHashHistory(process.env.BASE_URL),
    routes,
    scrollBehavior() {
        // always scroll to top
        return { top: 0 }
    },
})

router.beforeEach(async (to) => {
    // redirect to login page if not logged in and trying to access a restricted page
    const publicPages = ['/login']
    const authRequired = !publicPages.includes(to.path)
    const auth = useAuthStore()

    if (authRequired && !auth.getLoggedIn()) {
        auth.returnUrl = to.fullPath

        useToastStore().showToast({
            // perlu login
            show: true,
            title: 'Notifikasi',
            msg: 'Anda perlu login !',
            classType: 'bg-warning',
        })
        useToastStore().hideToast()

        return '/login'
    }
})

export default router
