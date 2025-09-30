/**
 * 网络请求封装模块
 */

// 导入配置
import { BASE_URL, DEV_BASE_URL, TIMEOUT, CURRENT_ENV, ENV } from "./config";
import store from "@/store";

/**
 * 请求拦截器
 * @param {Object} config 请求配置
 */
const requestInterceptor = (config) => {
  // 获取token
  const token = uni.getStorageSync("token");
  if (token) {
    config.header = {
      ...config.header,
      Authorization: token,
    };
  }
  return config;
};

// 用于存储正在进行的登录请求，避免重复登录
let isRefreshing = false;
let failedQueue = [];

// 处理队列中的请求
const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  
  failedQueue = [];
};

const responseInterceptor = async (response, originalConfig) => {
  // 这里可以对响应结果进行统一处理
  if (response.statusCode === 200) {
    return response.data;
  } else if (response.statusCode === 401) {
    // 如果正在刷新token，将请求加入队列
    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      }).then(() => {
        // 重新发起原请求
        return request(originalConfig.method, originalConfig.url, originalConfig.data, originalConfig);
      });
    }

    isRefreshing = true;

    try {
      // 使用store中的wechat_login action进行登录
      await store.dispatch("user/wechat_login");
      
      // 获取新的token
      const newToken = uni.getStorageSync("token");
      
      // 处理队列中的请求
      processQueue(null, newToken);
      
      // 重新发起原请求
      return request(originalConfig.method, originalConfig.url, originalConfig.data, originalConfig);
    } catch (error) {
      // 登录失败，处理队列中的请求
      processQueue(error, null);
      
      // 清除本地token
      uni.removeStorageSync("token");
      
      // 跳转到登录页面
      uni.reLaunch({
        url: '/pages/login'
      });
      
      return Promise.reject("登录已过期，请重新登录");
    } finally {
      isRefreshing = false;
    }
  } else {
    return Promise.reject(response.data || "服务器异常");
  }
};
const request = (method, url, data = {}, options = {}) => {
  // 完整请求路径
  const apiBaseUrl = CURRENT_ENV === ENV.PROD ? BASE_URL : DEV_BASE_URL;
  const requestUrl = /^(http|https):\/\//.test(url) ? url : apiBaseUrl + url;

  // 请求配置
  const config = {
    url: requestUrl,
    method,
    data,
    timeout: options.timeout || TIMEOUT,
    header: {
      "Content-Type": "application/json",
      ...options.header,
    },
    ...options,
  };

  // 应用请求拦截器
  const interceptedConfig = requestInterceptor(config);

  // 发起请求
  return new Promise((resolve, reject) => {
    uni.request({
      ...interceptedConfig,
      success: async (res) => {
        try {
          const result = await responseInterceptor(res, config);
          resolve(result);
        } catch (error) {
          reject(error);
        }
      },
      fail: (err) => {
        reject(err);
      },
    });
  });
};

// 导出请求方法
export default {
  get: (url, data, options) => request("GET", url, data, options),
  post: (url, data, options) => request("POST", url, data, options),
  put: (url, data, options) => request("PUT", url, data, options),
  delete: (url, data, options) => request("DELETE", url, data, options),
};
