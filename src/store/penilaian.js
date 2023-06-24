
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
      this.form.id_karyawan = ''
      this.form.jabatan = ''
      this.form.nama_karyawan = ''
      this.form.id_penilai = ''
      this.form.nama_penilai = ''
      this.form.jabatan_penilai = ''
      this.form.tgl_nilai = ''
      this.form.ttl_nilai = ''
      this.form.rata_nilai = ''
      this.form.tipe = ''
      this.form.status = ''
      this.form.validasi_by = ''
      this.form.created_by = ''
      this.form.updated_by = ''
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
    },

    setIdKaryawan(id) {
      this.form.id_karyawan = id
    }
  }
})
