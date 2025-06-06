import { createStore } from "vuex";

import user from "@/store/modules/user";
import community from "@/store/modules/community";
import recruit from "@/store/modules/recruit";

// 根级别的 state
const state = {
  appVersion: "1.0.0",
  appName: "互成一家",
  //   platform: uni.getSystemInfoSync().platform,
};

// 根级别的 getters
const getters = {
  appVersion: (state) => state.appVersion,
  appName: (state) => state.appName,
  //   platform: (state) => state.platform,
};

const mutations = {
  // 更新应用版本
  update_app_version(state, version) {
    state.appVersion = version;
  },
};

// 根级别的 actions
const actions = {
  // 初始化应用
  init_app({ dispatch }) {
    console.log("初始化应用");

    return Promise.resolve();
  },
};

// 创建 store 实例
const store = createStore({
  state,
  getters,
  mutations,
  actions,
  modules: {
    user,
    community,
    recruit,
  },
});

export default store;
