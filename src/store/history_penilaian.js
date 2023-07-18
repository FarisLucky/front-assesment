import { defineStore } from "pinia"
import { http } from "@/config"

export const useHistoryStore = defineStore('historyPenilaian', {
  state: () => ({
    id: '',
    validate: '',
    url: 'history-penilaian',
    method: 'POST',
  }),
  actions: {
    setId(id) {
      this.id = id
    },

    async getPenilaian(params) {
      const { tipe } = params

      const nilai = await http.get(`${this.url}/get-nilai/${tipe}`)

      return nilai;
    },

    async getPenilaiansKaryawan(params) {
    const {id_karyawan, tipe} = params

      const nilai = await http.get(`${this.url}/karyawan/${id_karyawan}/${tipe}`)

      return nilai;
    },

    async store(formRequest) {

      const penilaian = await http.post(this.url, formRequest)

      return penilaian;
    },

    async show(params) {

      const penilaian = await http.get(`${this.url}/${params.id_karyawan}/${params.tipe}/${params.month}/${params.year}`)

      return penilaian;
    },

    async showById(id) {

      const penilaian = await http.get(`${this.url}/by-id/${id}`)

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
  }
})
