import { defineStore } from "pinia";
import {
  fetchPrintPrice,
  fetchPrintIsOpen,
  uploadPrintOrder,
  fetchPrintOrders,
} from "@/api/print";

export const usePrintStore = defineStore("print", {
  state: () => ({
    priceText: "",
    isOpen: false,
    loading: false,
    orders: [],
    ordersLoading: false,
  }),

  getters: {
    get_price_text: (state) => state.priceText,
    get_is_service_open: (state) => state.isOpen,
    get_loading: (state) => state.loading,
    get_price_loading: (state) => state.loading,
    get_orders: (state) => state.orders,
    get_orders_loading: (state) => state.ordersLoading,
    get_order_by_id: (state) => (orderId) => {
      return state.orders.find((order) => order.id === parseInt(orderId));
    },
  },

  actions: {
    set_price_text(priceText) {
      this.priceText = priceText;
    },

    set_is_open(isOpen) {
      this.isOpen = isOpen;
    },

    set_loading(loading) {
      this.loading = loading;
    },

    set_orders(orders) {
      this.orders = orders;
    },

    set_orders_loading(loading) {
      this.ordersLoading = loading;
    },

    add_order(order) {
      this.orders.unshift(order);
    },

    update_order({ orderId, updates }) {
      const orderIndex = this.orders.findIndex((order) => order.id === orderId);
      if (orderIndex !== -1) {
        this.orders[orderIndex] = {
          ...this.orders[orderIndex],
          ...updates,
        };
      }
    },

    async fetch_print_price() {
      try {
        this.set_loading(true);
        const response = await fetchPrintPrice();
        this.set_price_text(response.data.text);
        console.log("[打印模块] 获取打印价格成功");
      } catch (error) {
        console.error("[打印模块] 获取打印价格失败", error);
        return Promise.reject(error);
      } finally {
        this.set_loading(false);
      }
    },

    async check_service_open() {
      try {
        this.set_loading(true);
        const response = await fetchPrintIsOpen();
        this.set_is_open(response.data.isOpen);
        console.log("[打印模块] 获取打印服务状态成功");
      } catch (error) {
        console.error("[打印模块] 获取打印服务状态失败", error);
        return Promise.reject(error);
      } finally {
        this.set_loading(false);
      }
    },

    async fetch_print_is_open() {
      return this.check_service_open();
    },

    async fetch_print_info() {
      try {
        await Promise.all([this.fetch_print_price(), this.fetch_print_is_open()]);
        console.log("[打印模块] 获取打印信息成功");
      } catch (error) {
        console.error("[打印模块] 获取打印信息失败", error);
        return Promise.reject(error);
      }
    },

    async upload_print_order(orderData) {
      try {
        this.set_loading(true);
        console.log("[打印模块] 开始上传打印订单", orderData);
        const response = await uploadPrintOrder(orderData);
        console.log("[打印模块] 上传打印订单成功", response.data);

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
          this.add_order(newOrder);
        }

        return response.data;
      } catch (error) {
        console.error("[打印模块] 上传打印订单失败", error);
        return Promise.reject(error);
      } finally {
        this.set_loading(false);
      }
    },

    async fetch_print_orders() {
      try {
        this.set_orders_loading(true);
        console.log("[打印模块] 开始获取打印订单列表");
        const response = await fetchPrintOrders();

        if (response.data && Array.isArray(response.data)) {
          this.set_orders(response.data);
          console.log(
            "[打印模块] 获取打印订单列表成功",
            response.data.length,
            "条订单"
          );
        } else {
          console.warn("[打印模块] 订单数据格式异常", response);
          this.set_orders([]);
        }

        return response.data;
      } catch (error) {
        console.error("[打印模块] 获取打印订单列表失败", error);
        this.set_orders([]);
        return Promise.reject(error);
      } finally {
        this.set_orders_loading(false);
      }
    },
  },
});

export default usePrintStore;
