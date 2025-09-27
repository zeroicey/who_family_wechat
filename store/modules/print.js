import {
  fetchPrintPrice,
  fetchPrintIsOpen,
  uploadPrintOrder,
  fetchPrintOrders,
} from "@/api/print";

const state = {
  priceText: "",
  isOpen: false,
  loading: false,
  orders: [], // 存储用户的打印订单列表
  ordersLoading: false, // 订单加载状态
};

const getters = {
  get_price_text: (state) => state.priceText,
  get_is_service_open: (state) => state.isOpen,
  get_loading: (state) => state.loading,
  get_orders: (state) => state.orders,
  get_orders_loading: (state) => state.ordersLoading,
  // 根据ID获取特定订单信息
  get_order_by_id: (state) => (orderId) => {
    return state.orders.find((order) => order.id === parseInt(orderId));
  },
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
  set_orders(state, orders) {
    state.orders = orders;
  },
  set_orders_loading(state, loading) {
    state.ordersLoading = loading;
  },
  // 添加单个订单到列表中（用于新创建的订单）
  add_order(state, order) {
    state.orders.unshift(order); // 添加到列表开头
  },
  // 更新特定订单的状态
  update_order(state, { orderId, updates }) {
    const orderIndex = state.orders.findIndex((order) => order.id === orderId);
    if (orderIndex !== -1) {
      state.orders[orderIndex] = { ...state.orders[orderIndex], ...updates };
    }
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

  async check_service_open({ commit }) {
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

  async upload_print_order({ commit }, orderData) {
    try {
      commit("set_loading", true);
      console.log("[打印模块] 开始上传打印订单", orderData);
      const response = await uploadPrintOrder(orderData);
      console.log("[打印模块] 上传打印订单成功", response.data);

      // 将新创建的订单添加到本地订单列表中
      if (response.data && response.data.id) {
        const newOrder = {
          id: response.data.id,
          type: "print",
          status: "待处理",
          createdAt: new Date().toISOString(),
          data: {
            addressDetails: orderData.address,
            copies: orderData.count,
            fileName: orderData.fileName,
            serviceType: orderData.type,
            name: orderData.name,
            phone: orderData.phone,
            remark: orderData.remark,
          },
          startOrderTime: new Date().toLocaleString("zh-CN"),
          endOrderTime: null,
          fileUrl: null,
        };
        commit("add_order", newOrder);
      }

      return response.data;
    } catch (error) {
      console.error("[打印模块] 上传打印订单失败", error);
      return Promise.reject(error);
    } finally {
      commit("set_loading", false);
    }
  },

  async fetch_print_orders({ commit }) {
    try {
      commit("set_orders_loading", true);
      console.log("[打印模块] 开始获取打印订单列表");
      const response = await fetchPrintOrders();

      if (response.data && Array.isArray(response.data)) {
        commit("set_orders", response.data);
        console.log(
          "[打印模块] 获取打印订单列表成功",
          response.data.length,
          "条订单"
        );
      } else {
        console.warn("[打印模块] 订单数据格式异常", response);
        commit("set_orders", []);
      }

      return response.data;
    } catch (error) {
      console.error("[打印模块] 获取打印订单列表失败", error);
      commit("set_orders", []);
      return Promise.reject(error);
    } finally {
      commit("set_orders_loading", false);
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
