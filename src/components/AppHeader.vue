<template>
    <CHeader
        position="sticky"
        class="mb-4"
    >
        <CContainer fluid>
            <CHeaderToggler
                class="ps-1"
                @click="$store.commit('toggleSidebar')"
            >
                <CIcon
                    icon="cil-menu"
                    size="lg"
                />
            </CHeaderToggler>
            <CHeaderBrand class="mx-auto d-lg-none">
                <CIcon
                    :icon="logo"
                    height="48"
                    alt="Logo"
                />
            </CHeaderBrand>
            <CHeaderNav>
                <CNavItem>
                    <CNavLink
                        href="javascript: void(0);"
                        class="text-success"
                    >
                        {{ jabatan }}
                    </CNavLink>
                </CNavItem>
                <AppHeaderDropdownAccnt />
            </CHeaderNav>
        </CContainer>
        <CHeaderDivider />
        <CContainer fluid>
            <AppBreadcrumb />
        </CContainer>
    </CHeader>
</template>

<script>
import AppBreadcrumb from './AppBreadcrumb'
import AppHeaderDropdownAccnt from './AppHeaderDropdownAccnt'
import { logo } from '@/assets/brand/logo'
import { useAuthStore } from '@/store/auth'
export default {
    name: 'AppHeader',
    components: {
        AppBreadcrumb,
        AppHeaderDropdownAccnt,
    },
    setup() {
        let jabatan = useAuthStore().getUser().karyawan.jabatan.nama
        console.log(jabatan)
        return {
            jabatan,
            logo,
        }
    },
}
</script>
