import { defineStore } from 'pinia'
import { useModalStore } from './modal';
import { useToastStore } from './toast';
import useTableStore from './table';
import { http } from '@/config';

export const useKaryawansStore = defineStore('karyawan', {
  state: () => ({
    id: '',
    form: {
      nip: '',
      nama: '',
      sex: '',
      tgl_lahir: '',
      pendidikan: '',
      jabatan: '',
      unit: '',
      status: '',
      alamat: '',
      tgl_lulus: '',
    },
    sexList: ['L', 'p'],
    statusList: ['AKTIF', 'NON AKTIF'],
    validate: '',
    url: '/karyawans'
  }),
  actions: {
    setId(id) {
      this.id = id
    },

    async store() {

      const karyawan = await http.post(this.url, this.form)

      return karyawan;
    },

    async show(id) {

      const karyawan = await http
        .get(`${this.url}/${id}`)
        .catch(errors => {
          return errors
        })

      return karyawan;
    },

    async update(id) {

      const karyawan = await http.put(`${this.url}/${id}`, this.form).then(response => {
        return response.data
      })

      return karyawan
    },

    async destroy() {
      const tableStore = useTableStore();
      const modalStore = useModalStore();
      const toastStore = useToastStore();

      await http
        .delete(`${this.url}/${this.id}`)
        .then((response) => {

          tableStore.loading(false)
          modalStore.setModal(false)
          toastStore.showToast({
            show: true,
            classType: 'bg-success',
            title: 'Berhasil',
            msg: 'Tindakan Berhasil'
          })
          tableStore.fetchData(this.fetchUrl)

        })
        .catch((errors) => {

          toastStore.showToast({
            show: true,
            classType: 'bg-danger',
            title: 'Gagal',
            msg: errors.response.data.message
          })

          this.resetForm()
          this.resetValidation()
        })
    },

    resetForm() {
      this.form.nip = ''
      this.form.nama = ''
      this.form.sex = ''
      this.form.tgl_lahir = ''
      this.form.alamat = ''
      this.form.jabatan = ''
      this.form.pendidikan = ''
      this.form.tgl_lulus = ''
      this.form.status = ''
    },

    resetValidation() {
      this.validate = ''
    },

    setValidation(validation) {
      this.validate = validation
    }
  },
})
