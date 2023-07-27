<template>
    <div class="bg-light min-vh-100 d-flex flex-row align-items-center" style="background-color: #DBC4F0 !important;">
        <CContainer>
            <CRow class="justify-content-center">
                <CCol :md="4">
                    <CCardGroup>
                        <CCard class="p-4">
                            <CCardBody>
                                <CForm @submit.prevent="onSubmit()" autocomplete="off">
                                    <h1>Log In</h1>
                                    <p class="text-medium-emphasis">Silakan lengkapi data berikut</p>
                                    <div class="mb-1">
                                        <CFormLabel>Nip</CFormLabel>
                                        <CInputGroup>
                                            <CInputGroupText>
                                                <CIcon icon="cil-user" />
                                            </CInputGroupText>
                                            <CFormInput type="text" placeholder="Email" autocomplete="Email"
                                                v-model="form.email" />
                                            <div class="invalid-feedback d-inline-block" v-if="validate?.email">
                                                {{ validate?.email[0] }}
                                            </div>
                                        </CInputGroup>
                                    </div>
                                    <div class="mb-1">
                                        <CFormLabel>Password</CFormLabel>
                                        <CInputGroup>
                                            <CInputGroupText>
                                                <CIcon icon="cil-lock-locked" />
                                            </CInputGroupText>
                                            <CFormInput type="password" placeholder="Password" v-model="form.password" />
                                            <div class="invalid-feedback d-inline-block" v-if="validate?.password">
                                                {{ validate?.password[0] }}
                                            </div>
                                        </CInputGroup>
                                    </div>
                                    <div class="mt-2">
                                        <CButton type="submit" color="primary" class="px-4"> Login </CButton>
                                    </div>
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
                    if (errors?.response?.status == 422) {
                        this.setValidation(errors.response.data.errors)
                    } else {
                        useToastStore().showToast({
                            show: true,
                            classType: 'bg-danger',
                            title: 'Gagal',
                            msg: errors?.response.data,
                        })
                    }
                })
        },
    }
}
</script>
