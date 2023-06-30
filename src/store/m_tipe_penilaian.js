import { defineStore } from 'pinia'
import { http } from '@/config';

export const useMTipePenilaianStore = defineStore('m_tipe_penilaian', {
  state: () => ({
    id: '',
    form: {
      nama: '',
      tipe: '',
    },
    validate: '',
    url: '/tipe-penilaians',
    method: 'POST',
  }),
  actions: {

    setId(id) {
      this.id = id
    },

    async fetch() {
      const tipe = await http.get(this.url)

      return tipe
    },

    async fetchData() {
      const tipe = await http.get(this.url + '/all/data')

      return tipe
    },

    async getByTipe(params) {

      const tipe = await http.get(`${this.url}/by/${params.tipe}`)

      return tipe;
    },

    async store(request) {

      const tipe = await http.post(this.url, request)

      return tipe;
    },

    async show(id) {

      const tipe = await http.get(`${this.url}/${id}`)

      return tipe;
    },

    async update(request, id) {

      const tipe = await http.put(`${this.url}/update`, request)
        .then(response => {
          return response.data
        })

      return tipe
    },

    async destroy(id) {

      const tipe = await http.delete(`${this.url}/${id}`)

      return tipe
    },

    resetForm() {
      this.form.nama = ''
      this.form.tipe = ''
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

  },
})
