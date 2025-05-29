/**
 * 时间格式化工具函数
 * 提供各种时间格式化方法，确保在所有平台（包括iOS）上的兼容性
 */

/**
 * 标准化时间字符串，确保iOS兼容性
 * iOS只支持 "yyyy/MM/dd"、"yyyy/MM/dd HH:mm:ss"、"yyyy-MM-dd"、"yyyy-MM-ddTHH:mm:ss"、"yyyy-MM-ddTHH:mm:ss+HH:mm" 格式
 * @param {string} timeString - 需要标准化的时间字符串
 * @returns {Date} - 日期对象
 */
const parseTimeString = (timeString) => {
  if (!timeString) return new Date();
  
  // 尝试处理格式，确保iOS兼容性
  try {
    // 检查是否为标准格式，否则进行转换
    if (timeString.includes(' ')) {
      // 将 "yyyy-MM-dd HH:mm:ss" 转换为 "yyyy-MM-ddTHH:mm:ss"
      timeString = timeString.replace(' ', 'T');
    }
    return new Date(timeString);
  } catch (e) {
    console.error('时间解析错误:', e);
    return new Date();
  }
};

/**
 * 相对时间格式化（如：刚刚、5分钟前、2小时前等）
 * @param {string} timeString - 时间字符串
 * @returns {string} - 格式化后的相对时间
 */
export const formatRelativeTime = (timeString) => {
  if (!timeString) return '';
  
  try {
    const date = parseTimeString(timeString);
    const now = new Date();
    const diff = now - date;
    
    // 一分钟内
    if (diff < 60 * 1000) {
      return '刚刚';
    }
    
    // 一小时内
    if (diff < 60 * 60 * 1000) {
      return `${Math.floor(diff / (60 * 1000))}分钟前`;
    }
    
    // 一天内
    if (diff < 24 * 60 * 60 * 1000) {
      return `${Math.floor(diff / (60 * 60 * 1000))}小时前`;
    }
    
    // 一周内
    if (diff < 7 * 24 * 60 * 60 * 1000) {
      return `${Math.floor(diff / (24 * 60 * 60 * 1000))}天前`;
    }
    
    // 超过一周，返回标准日期格式
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
    
  } catch (e) {
    console.error('时间格式化错误:', e);
    return timeString;
  }
};

/**
 * 标准日期格式化（YYYY-MM-DD）
 * @param {string} timeString - 时间字符串
 * @returns {string} - 格式化后的日期字符串
 */
export const formatDate = (timeString) => {
  if (!timeString) return '';
  
  try {
    const date = parseTimeString(timeString);
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  } catch (e) {
    console.error('日期格式化错误:', e);
    return '';
  }
};

/**
 * 标准时间格式化（YYYY-MM-DD HH:MM:SS）
 * @param {string} timeString - 时间字符串
 * @returns {string} - 格式化后的时间字符串
 */
export const formatDateTime = (timeString) => {
  if (!timeString) return '';
  
  try {
    const date = parseTimeString(timeString);
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  } catch (e) {
    console.error('时间格式化错误:', e);
    return '';
  }
};

export default {
  formatRelativeTime,
  formatDate,
  formatDateTime
};
