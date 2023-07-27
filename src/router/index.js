import { h, resolveComponent } from 'vue'
import { createRouter, createWebHashHistory } from 'vue-router'

import DefaultLayout from '@/layouts/DefaultLayout'
import { useAuthStore } from '@/store/auth'

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
                    // const auth = useAuthStore()
                    // useToastStore().showToast({
                    //     // perlu login
                    //     show: true,
                    //     title: 'Notifikasi',
                    //     msg: 'Selamat Datang ~ ' + auth.getUser().name + ' ~',
                    //     classType: 'bg-info',
                    // })
                    // useToastStore().hideToast()
                },
            },

            /**
             * Custom Route For Production
             */
            {
                path: '/karyawans',
                name: 'Karyawan',
                component: () => import('@/views/karyawan/Index.vue'),
                meta:{
                    roles: ['ADMIN','USER'],
                    authRequired: true
                },
                children: [
                    {
                        path: '',
                        name: 'list-karyawan',
                        component: () => import('@/views/karyawan/List.vue'),
                        meta:{
                            roles: ['ADMIN','USER'],
                            authRequired: true
                        }
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
                meta:{
                    roles: ['ADMIN','USER'],
                    authRequired: true
                },
                children: [
                    {
                        path: '',
                        name: 'ListJabatan',
                        component: () => import('@/views/jabatan/List.vue'),
                        meta:{
                            roles: ['ADMIN','USER'],
                            authRequired: true
                        }
                    },
                ],
            },
            {
                path: '/units',
                name: 'Units',
                component: () => import('@/views/unit/Index.vue'),
                meta:{
                    roles: ['ADMIN','USER'],
                    authRequired: true
                },
                children: [
                    {
                        path: '',
                        component: () => import('@/views/unit/List.vue'),
                        name: 'ListUnit',
                        meta:{
                            roles: ['ADMIN','USER'],
                        }
                    },
                ],
            },
            {
                path: '/m-penilaians',
                name: 'MasterPenilaians',
                component: () => import('@/views/m_penilaian/Index.vue'),
                meta:{
                    roles: ['ADMIN'],
                    authRequired: true
                },
                children: [
                    {
                        path: '',
                        name: 'ListPenilaian',
                        component: () => import('@/views/m_penilaian/List.vue'),
                        meta:{
                            roles: ['ADMIN']
                        }
                    },
                ],
            },
            {
                path: '/m-sub-penilaians',
                name: 'MasterSub',
                component: () => import('@/views/m_sub/Index.vue'),
                meta:{
                    roles: ['ADMIN'],
                    authRequired: true
                },
                children: [
                    {
                        path: '',
                        name: 'ListSub',
                        component: () => import('@/views/m_sub/List.vue'),
                        meta:{
                            roles: ['ADMIN']
                        }
                    },
                ],
            },
            {
                path: '/m-valid-penilai',
                name: 'MasterValidPenilai',
                component: () => import('@/views/m_valid_penilai/Index.vue'),
                meta:{
                    roles: ['ADMIN','USER'],
                    authRequired: true
                },
                children: [
                    {
                        path: '',
                        name: 'ListSub',
                        component: () => import('@/views/m_valid_penilai/List.vue'),
                        meta:{
                            roles: ['ADMIN','USER']
                        }
                    },
                ],
            },
            {
                path: '/tipe',
                name: 'MasterTipe',
                component: () => import('@/views/m_tipe/Index.vue'),
                meta:{
                    roles: ['ADMIN'],
                    authRequired: true
                },
                children: [
                    {
                        path: '',
                        name: 'ListTipe',
                        component: () => import('@/views/m_tipe/List.vue'),
                        meta:{
                            roles: ['ADMIN']
                        }
                    },
                ],
            },
            {
                path: '/penilaian-karyawans',
                name: 'PenilaianKaryawan',
                component: () => import('@/views/penilaian/Index.vue'),
                meta:{
                    roles: ['ADMIN','USER'],
                    authRequired: true
                },
                children: [
                    {
                        path: '',
                        name: 'ListPenilaian',
                        component: () => import('@/views/penilaian/ProgressTab.vue'),
                        meta:{
                            roles: ['ADMIN','USER']
                        }
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
                meta:{
                    roles: ['ADMIN','USER'],
                    authRequired: true
                },
                children: [
                    {
                        path: '',
                        name: 'ListHistoryPenilaian',
                        component: () => import('@/views/history/List.vue'),
                        meta:{
                            roles: ['ADMIN','USER']
                        }
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
                path: '/charts',
                name: 'Charts',
                component: () => import('@/views/charts/Charts.vue'),
            },
        ],
    },
    {
        path: '/login',
        name: 'Login',
        component: () => import('@/views/auth/Login'),
        meta:{
            authRequired: false
        },
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
                path: '403',
                name: 'Page403',
                component: () => import('@/views/pages/Page403'),
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

        return '/login'
    }
})

router.beforeEach((to, from, next) => {
    const auth = useAuthStore()
    console.log(auth.getUser())
    console.log(to)

    if (to.meta.authRequired) {
        if (!to.meta.roles.includes(auth.getUser().role)) {
            console.log('test')
        // if (to.matched.some((record) => record.meta.roles.includes(auth.getUser().role))) {
            next('/pages/403');
            return;
        } else {
            next();
        }
    } else {
        next()
    }

});

export default router
