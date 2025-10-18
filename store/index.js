import { createStore } from "vuex";

import task from "@/store/modules/task";
import user from "@/store/modules/user";
import focus from "@/store/modules/focus";
import community from "@/store/modules/community";
import recruit from "@/store/modules/recruit";
import address from "@/store/modules/address";
import print from "@/store/modules/print";
import helper from "@/store/modules/helper";

// 根级别的 state
const state = {
  appVersion: "1.0.0",
  appName: "互成一家",
};

// 根级别的 getters
const getters = {
  appVersion: (state) => state.appVersion,
  appName: (state) => state.appName,
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
  init_app() {
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
    focus,
    community,
    recruit,
    task,
    address,
    print,
    helper,
  },
});

export default store;
