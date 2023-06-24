<template>
    <div class="bg-light min-vh-100 d-flex flex-row align-items-center">
        <CContainer>
            <CRow class="justify-content-center">
                <CCol :md="4">
                    <CCardGroup>
                        <CCard class="p-4">
                            <CCardBody>
                                <CForm
                                    @submit.prevent="onSubmit()"
                                    autocomplete="off"
                                >
                                    <h1>Login</h1>
                                    <p class="text-medium-emphasis">Sign In to your account</p>
                                    <CInputGroup class="mb-3">
                                        <CInputGroupText>
                                            <CIcon icon="cil-user" />
                                        </CInputGroupText>
                                        <CFormInput
                                            type="email"
                                            placeholder="Email"
                                            autocomplete="Email"
                                            v-model="form.email"
                                        />
                                        <div
                                            class="invalid-feedback d-inline-block"
                                            v-if="validate?.email"
                                        >
                                            {{ validate?.email[0] }}
                                        </div>
                                    </CInputGroup>
                                    <CInputGroup class="mb-4">
                                        <CInputGroupText>
                                            <CIcon icon="cil-lock-locked" />
                                        </CInputGroupText>
                                        <CFormInput
                                            type="password"
                                            placeholder="Password"
                                            v-model="form.password"
                                        />
                                        <div
                                            class="invalid-feedback d-inline-block"
                                            v-if="validate?.password"
                                        >
                                            {{ validate?.password[0] }}
                                        </div>
                                    </CInputGroup>
                                    <CRow>
                                        <CCol :xs="6">
                                            <CButton
                                                type="submit"
                                                color="primary"
                                                class="px-4"
                                            > Login </CButton>
                                        </CCol>
                                    </CRow>
                                </CForm>
                            </CCardBody>
                        </CCard>
                    </CCardGroup>
                </CCol>
            </CRow>
        </CContainer>
    </div>
    <Toast></Toast>
    <Spinner v-if="isLoading"></Spinner>
</template>

<script>
import Spinner from '../../components/Spinner.vue'
import Toast from '../../components/Toast.vue'
import { useAuthStore } from '@/store/auth'
import { mapActions, mapState } from 'pinia'
import { useToastStore } from '@/store/toast'
import { useSpinnerStore } from '@/store/spinner'
import Cookies from 'js-cookie'

export default {
    components: { Toast, Spinner },
    name: 'Login',
    computed: {
        ...mapState(useAuthStore, ['user', 'form', 'token', 'validate']),
        ...mapState(useSpinnerStore, ['isLoading']),
    },
    created() {
        // useAuthStore().setUser({ name: 'Salman Al Faris' })
    },
    methods: {
        ...mapActions(useAuthStore, [
            'login',
            'logout',
            'getLoggedIn',
            'getToken',
            'getUser',
            'setValidation',
            'resetValidation',
        ]),

        ...mapActions(useSpinnerStore, ['loading']),

        onSubmit() {
            this.loading(true)

            this.resetValidation()

            this.login(this.form)
                .then((response) => {
                    // update pinia state
                    Cookies.set(
                        'user',
                        JSON.stringify({
                            loggedIn: true,
                            data: response.data.user,
                            token: response.data.token,
                        }),
                    )

                    this.getLoggedIn()
                    this.getToken()
                    this.getUser()

                    // store user details and jwt in local storage to keep user logged in between page refreshes

                    this.loading(false)
                    console.log('berhasil')

                    // redirect to previous url or default to home page
                    this.$router.go('/dashboard')
                })
                .catch((errors) => {
                    this.loading(false)
                    console.log(errors)
                    if (errors.response.status == 422) {
                        this.setValidation(errors.response.data.errors)
                    } else {
                        useToastStore.showToast({
                            show: true,
                            classType: 'bg-danger',
                            title: 'Gagal',
                            msg: errors.response.data.message,
                        })
                    }
                })
        },
    },
}
</script>
