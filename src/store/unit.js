import { defineStore } from 'pinia'
import { http } from '@/config'

export const useUnitStore = defineStore('unit', {
  state: () => ({
    id: '',
    form: {
      id: '',
      nama: '',
    },
    validate: '',
    url: '/units',
    method: 'POST'
  }),
  actions: {
    setId(id) {
      this.id = id
    },

    async fetchData() {
      const jabatans = await http.get(`${this.url}/all/data`)

      return jabatans
    },

    async store(request) {
      const jabatanStore = await http
        .post(this.url, request)

      return jabatanStore
    },

    async show(id) {
      const jabatan = await http
        .get(`${this.url}/${id}`)

      return jabatan
    },

    async update(request, id) {
      const jabatanUpdate = await http
        .put(`${this.url}/${id}`, request)

      return jabatanUpdate
    },

    async destroy(id) {
      const jabatanDestroy = await http
        .delete(`${this.url}/${id}`)

      return jabatanDestroy
    },

    resetForm() {
      this.form.id = ''
      this.form.nama = ''
    },

    resetValidation() {
      this.validate = ''
    },

    setValidation(validation) {
      this.validate = validation
    },

    setMethod(method) {
      this.method = method
    }
  },
})
