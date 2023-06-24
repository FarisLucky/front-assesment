import { defineStore } from "pinia";

export const useToastStore = defineStore('toast', {
  state: () => ({
    show: false,
    title: 'Notifikasi',
    msg: 'Tindakan Berhasil',
    classType: 'bg-success',
  }),
  actions: {
    showToast(param) {
      this.show = param.show
      this.msg = param.msg
      this.classType = param.classType
    },
    hideToast() {
      if (this.show) {
        setTimeout(() => {
          this.show = false
        }, 3000)
      }
    }
  }
})
