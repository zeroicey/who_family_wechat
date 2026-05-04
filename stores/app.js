import { defineStore } from "pinia";

export const useAppStore = defineStore("app", {
  state: () => ({
    appVersion: "1.0.0",
    appName: "互成一家",
  }),

  actions: {
    update_app_version(version) {
      this.appVersion = version;
    },

    init_app() {
      console.log("初始化应用");
      return Promise.resolve();
    },
  },
});

export default useAppStore;
