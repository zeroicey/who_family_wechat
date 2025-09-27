import { fetchPrintPrice, fetchPrintIsOpen } from "@/api/print";

const state = {
  priceText: "",
  isOpen: false,
  loading: false,
};

const getters = {
  get_price_text: (state) => state.priceText,
  get_is_open: (state) => state.isOpen,
  get_loading: (state) => state.loading,
};

const mutations = {
  set_price_text(state, priceText) {
    state.priceText = priceText;
  },
  set_is_open(state, isOpen) {
    state.isOpen = isOpen;
  },
  set_loading(state, loading) {
    state.loading = loading;
  },
};

const actions = {
  async fetch_print_price({ commit }) {
    try {
      commit("set_loading", true);
      const response = await fetchPrintPrice();
      commit("set_price_text", response.data.text);
      console.log("[打印模块] 获取打印价格成功");
    } catch (error) {
      console.error("[打印模块] 获取打印价格失败", error);
      return Promise.reject(error);
    } finally {
      commit("set_loading", false);
    }
  },

  async fetch_print_is_open({ commit }) {
    try {
      commit("set_loading", true);
      const response = await fetchPrintIsOpen();
      commit("set_is_open", response.data.isOpen);
      console.log("[打印模块] 获取打印服务状态成功");
    } catch (error) {
      console.error("[打印模块] 获取打印服务状态失败", error);
      return Promise.reject(error);
    } finally {
      commit("set_loading", false);
    }
  },

  async fetch_print_info({ dispatch }) {
    try {
      // 同时获取价格和服务状态
      await Promise.all([
        dispatch("fetch_print_price"),
        dispatch("fetch_print_is_open"),
      ]);
      console.log("[打印模块] 获取打印信息成功");
    } catch (error) {
      console.error("[打印模块] 获取打印信息失败", error);
      return Promise.reject(error);
    }
  },
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
};
