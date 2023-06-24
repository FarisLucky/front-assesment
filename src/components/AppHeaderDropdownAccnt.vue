<template>
    <CDropdown variant="nav-item">
        <CDropdownToggle
            placement="bottom-end"
            class="py-0"
            :caret="false"
            href="javascript: void(0)"
        >
            <CAvatar
                :src="avatar"
                size="md"
            />
        </CDropdownToggle>
        <CDropdownMenu class="pt-0">
            <CDropdownHeader
                component="h6"
                class="bg-light fw-semibold py-2"
            >
                Pengaturan
            </CDropdownHeader>
            <CDropdownItem
                @click="onLogout"
                style="cursor: pointer;"
            >
                <CIcon icon="cil-lock-locked" /> Logout
            </CDropdownItem>
        </CDropdownMenu>
    </CDropdown>
</template>

<script>
import avatar from '@/assets/images/avatars/8.jpg'
import { useAuthStore } from '@/store/auth'
import { useRouter } from 'vue-router'
export default {
    name: 'AppHeaderDropdownAccnt',
    setup() {
        const router = useRouter()

        const onLogout = () => {
            const logoutAct = useAuthStore().logout()

            if (logoutAct) {
                router.go('/login')
            }
        }

        return {
            avatar: avatar,
            itemsCount: 42,
            onLogout: onLogout,
        }
    },
}
</script>
