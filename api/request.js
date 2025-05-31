/**
 * 网络请求封装模块
 */

// 导入配置
import { BASE_URL, DEV_BASE_URL, TIMEOUT, CURRENT_ENV, ENV } from "./config";

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

const responseInterceptor = (response) => {
  // 这里可以对响应结果进行统一处理
  if (response.statusCode === 200) {
    return response.data;
  } else if (response.statusCode === 401) {
    // token过期，跳转到登录页
    uni.navigateTo({
      url: "/pages/login",
    });
    return Promise.reject("登录已过期，请重新登录");
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
      success: (res) => {
        try {
          const result = responseInterceptor(res);
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
