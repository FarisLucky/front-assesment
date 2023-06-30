
import { defineStore } from "pinia"
import { http } from "@/config"

export const usePenilaianStore = defineStore('penilaian', {
  state: () => ({
    id: '',
    form: {
      'kelebihan': '',
      'kekurangan': '',
      'kesempatan': '',
      'ancaman': '',
    },
    validate: '',
    url: 'penilaian-karyawans',
    method: 'POST',
  }),
  actions: {
    setId(id) {
      this.id = id
    },

    async getPenilaian(params) {
      const { id_karyawan, tipe } = params

      const nilai = await http.get(`${this.url}/get-nilai/${id_karyawan}/${tipe}`)

      return nilai;
    },

    async store(formRequest) {

      const penilaian = await http.post(this.url, formRequest)

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
      this.form.kelebihan = ''
      this.form.kesempatan = ''
      this.form.kekurangan = ''
      this.form.ancaman = ''
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

  }
})
