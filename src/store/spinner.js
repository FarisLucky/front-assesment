import { defineStore } from "pinia";

export const useSpinnerStore = defineStore('spinner', {
  state: () => ({
    isLoading: false,
  }),
  actions: {
    loading() {
      this.isLoading = !this.isLoading
    }
  }
})
