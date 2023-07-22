import { defineStore } from 'pinia'
import { http } from '@/config';

export const useMValidasiStore = defineStore('m_validasi', {
  state: () => ({
    id: '',
    form: {
      sub_penilaians: [],
      id_penilaian: '',
    },
    validate: '',
    url: '/m-validasi-penilai',
    method: 'POST',
  }),
  actions: {

    setId(id) {
      this.id = id
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

      const tipe = await http.put(`${this.url}/${id}`, request)
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
      this.form.sub_penilaians = ''
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

    setSubPenilaian(penilaian) {
      this.form.sub_penilaians.push(penilaian)
    },

  },
})
