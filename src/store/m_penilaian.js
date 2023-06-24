import { defineStore } from 'pinia'
import { http } from '@/config';

export const useMPenilaianStore = defineStore('m_penilaian', {
  state: () => ({
    id: '',
    form: {
      nama: '',
      tipe: '',
      level: '',
    },
    tipeLists: [
      {
        id: 'pk_khusus',
        label: 'Penilaian Khusus'
      },
      {
        id: 'pk_umum',
        label: 'Penilaian Umum'
      }
    ],
    validate: '',
    url: '/penilaians',
    method: 'POST'
  }),
  actions: {
    setId(id) {
      this.id = id
    },

    async fetchData() {
      const jabatans = await http.get(this.url)

      return jabatans
    },

    async store() {

      const penilaian = await http.post(this.url, this.form)

      return penilaian;
    },

    async show(id) {

      const penilaian = await http
        .get(`${this.url}/${id}`)
        .catch(errors => {
          return errors
        })

      return penilaian;
    },

    async update(id) {

      const penilaian = await http.put(`${this.url}/${id}`, this.form).then(response => {
        return response.data
      })

      return penilaian
    },

    async destroy(id) {

      const penilaian = await http.delete(`${this.url}/${id}`)

      return penilaian
    },

    resetForm() {
      this.form.nama = ''
      this.form.tipe = ''
      this.form.id_jabatan_penilai = ''
      this.form.created_at = ''
      this.form.updated_at = ''
      this.form.deleted_at = ''
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
