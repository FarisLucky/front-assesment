import { defineStore } from "pinia";

export const useModalStore = defineStore('modal', {
  state: () => ({
    title: null,
    params: null,
    modal: false,
    size: null,
    component: null,
  }),
  actions: {
    openModal(type, params) {
      this.modal = true
      this.mTitle = type
      this.params = params
    },
    setTitle(title) {
      this.title = title
    },
    setModal(modal, params) {
      this.modal = modal
      this.params = params
    },
    setParams(params) {
      this.params = params
    },
    setSize(size) {
      this.size = size
    },
    setComponent(component) {
      this.component = component
    },
  }
})
