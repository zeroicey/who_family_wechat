const state = {
  orders: uni.getStorageSync("orders") || [],
};

const getters = {
  get_orders: (state) => state.orders,
  get_order_by_id: (state) => (id) => {
    return state.orders.find((order) => order.id === id);
  },
  get_orders_by_type: (state) => (type) => {
    return state.orders.filter((order) => order.type === type);
  },
  get_orders_by_status: (state) => (status) => {
    return state.orders.filter((order) => order.status === status);
  },
};

const mutations = {
  set_orders(state, orders) {
    state.orders = orders;
    uni.setStorageSync("orders", state.orders);
  },

  add_order(state, orderPayload) {
    const newOrder = {
      id: `order_${new Date().getTime()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      status: '待支付', // '待支付', '待完成', '已完成', '已取消'
      ...orderPayload,
    };
    state.orders.unshift(newOrder);
    uni.setStorageSync("orders", state.orders);
  },

  update_order(state, updatedOrder) {
    const index = state.orders.findIndex((order) => order.id === updatedOrder.id);
    if (index !== -1) {
      const newOrder = { ...state.orders[index], ...updatedOrder, updatedAt: new Date().toISOString() };
      state.orders.splice(index, 1, newOrder);
      uni.setStorageSync("orders", state.orders);
    }
  },

  delete_order(state, orderId) {
    state.orders = state.orders.filter((order) => order.id !== orderId);
    uni.setStorageSync("orders", state.orders);
  },
};

const actions = {
  load_orders({ commit }) {
    const orders = uni.getStorageSync("orders") || [];
    commit("set_orders", orders);
    console.log("[订单模块] 订单加载成功");
  },

  create_order({ commit }, orderPayload) {
    commit("add_order", orderPayload);
    console.log("[订单模块] 订单创建成功");
  },

  update_order_status({ commit, state }, { orderId, status }) {
    const order = state.orders.find(o => o.id === orderId);
    if (order) {
      commit("update_order", { ...order, status });
      console.log(`[订单模块] 订单 ${orderId} 状态更新为 ${status}`);
    } else {
      console.error(`[订单模块] 未找到ID为 ${orderId} 的订单`);
    }
  },

  delete_order({ commit }, orderId) {
    commit("delete_order", orderId);
    console.log(`[订单模块] 订单 ${orderId} 已删除`);
  },
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
};
