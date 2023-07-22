import { defineStore } from 'pinia'
import { http } from '@/config';

export const useMSubStore = defineStore('m_sub', {
    state: () => ({
        id: '',
        form: {
            id_penilaian: '',
            nama: '',
            id_jabatan_penilai: '',
            id_unit_penilai: '',
        },
        validate: '',
        url: '/sub-penilaians',
        method: 'POST',
    }),
    actions: {
        setId(id) {
            this.id = id
        },

        async fetchData() {
            const jabatans = await http.get(this.url)

            return jabatans
        },
        async fetchDataKhusus() {
            const jabatans = await http.get(`${this.url}/khusus/data`)

            return jabatans
        },

        async store(request) {

            const penilaian = await http.post(this.url, request)

            return penilaian;
        },

        async show(id) {

            const penilaian = await http.get(`${this.url}/${id}`)

            return penilaian;
        },

        async update(request, id) {

            const penilaian = await http.put(`${this.url}/${id}`, request)
                .then(response => {
                    return response.data
                })

            return penilaian
        },

        async destroy(id) {

            const penilaian = await http.delete(`${this.url}/${id}`)

            return penilaian
        },

        resetForm() {
            this.form.id_penilaian = ''
            this.form.nama = ''
            this.form.id_jabatan_penilai = ''
            this.form.id_jabatan_kinerja = ''
            this.form.id_unit_penilai = ''
        },

        resetValidation() {
            this.validate = ''
        },

        setValidation(validation) {
            this.validate = validation
        },

        setMethod(method) {
            this.method = method
        },

        setNama(nama) {
            this.form.nama = nama
        },

        setNama(nama) {
            this.form.nama = nama
        },
    },
})
