import request from "./request";

/**
 * 检查文本
 * @param {object} data - 检查数据
 * @returns {Promise}
 */
export const checkText = async (data) => {
  return request.post("/check/text", { text: JSON.stringify(data) });
};

/**
 * 检查图片
 * @param {string} img - 图片base64编码
 * @returns {Promise}
 */
export const checkImg = async (img) => {
  return request.post("/check/img", { img });
};
