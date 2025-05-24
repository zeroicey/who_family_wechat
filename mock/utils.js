/**
 * Mock 数据工具函数
 * 用于生成统一的模拟数据响应格式
 */
import { createResponse, API_CODE } from '@/api/config';

/**
 * 创建模拟延迟
 * @param {Number} delay 延迟时间(毫秒)
 * @returns {Promise} Promise对象
 */
export const delay = (ms = 500) => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

/**
 * 模拟异步API调用
 * @param {*} data 返回的数据
 * @param {Number} code 状态码
 * @param {String} message 消息
 * @param {Number} delayTime 延迟时间
 * @returns {Promise} Promise对象，返回统一格式的响应
 */
export const mockApiCall = async (data, code = 200, message = '操作成功', delayTime = 500) => {
  await delay(delayTime);
  return {
    code,
    data,
    message
  };
};

/**
 * 模拟分页数据
 * @param {Array} list 数据列表
 * @param {Number} page 页码
 * @param {Number} pageSize 每页条数
 * @returns {Object} 分页数据对象
 */
export const mockPagination = (list, page = 1, pageSize = 10) => {
  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const data = list.slice(startIndex, endIndex);
  
  return {
    list: data,
    pagination: {
      page,
      pageSize,
      total: list.length,
      totalPages: Math.ceil(list.length / pageSize)
    }
  };
};

/**
 * 生成随机ID
 * @returns {String} 随机ID
 */
export const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 5).toUpperCase();
};

/**
 * 按条件筛选数据
 * @param {Array} list 数据列表
 * @param {Object} filters 筛选条件
 * @returns {Array} 筛选后的数据列表
 */
export const filterData = (list, filters = {}) => {
  return list.filter(item => {
    return Object.keys(filters).every(key => {
      if (filters[key] === undefined || filters[key] === '') return true;
      return item[key] === filters[key];
    });
  });
};
