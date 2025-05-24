/**
 * API 通用配置文件
 * 此文件定义了项目中 API 相关的通用配置
 */

// API 基础路径（生产环境）
export const BASE_URL = "http://8.148.233.134:3000";

// API 基础路径（开发环境）
export const DEV_BASE_URL = "http://localhost:3000";

// API 请求超时时间（毫秒）
export const TIMEOUT = 10000;

// API 响应状态码
export const API_CODE = {
  SUCCESS: 0, // 成功
  UNAUTHORIZED: 401, // 未授权
  FORBIDDEN: 403, // 禁止访问
  NOT_FOUND: 404, // 未找到
  SERVER_ERROR: 500, // 服务器错误
};

// 请求方法
export const METHOD = {
  GET: "GET",
  POST: "POST",
  PUT: "PUT",
  DELETE: "DELETE",
};

// 统一响应结构
export const createResponse = (
  code = API_CODE.SUCCESS,
  data = null,
  msg = ""
) => {
  return {
    code,
    data,
    msg,
  };
};

// 项目环境模式
export const ENV = {
  DEV: "development",
  PROD: "production",
};

// 当前环境
export const CURRENT_ENV = ENV.PROD;
