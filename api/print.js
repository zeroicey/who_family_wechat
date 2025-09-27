import request from "./request";

/**
 * 获取打印价格信息
 * @returns {Promise} 返回打印价格信息
 */
export const fetchPrintPrice = async () => {
  return request.get("/print/price");
};

/**
 * 检查打印服务是否开启
 * @returns {Promise<boolean>} 返回服务开启状态，true表示开启，false表示关闭
 */
export const fetchPrintIsOpen = async () => {
  return request.get("/print/is-open");
};

/**
 * 上传打印订单
 * @param {Object} data - 打印订单数据
 * @param {string} data.type - 服务类型，如"派送服务"
 * @param {string} data.address - 收货地址，如"广东东软学院 sovo 互成一家"
 * @param {string} data.name - 收货人姓名，如"王某某"
 * @param {string} data.phone - 联系电话，如"15812341234"
 * @param {number} data.count - 打印份数，如4
 * @param {string} data.fileName - 文件名称，如"file.pdf"
 * @param {string} [data.remark] - 备注信息，可选
 * @param {string} data.file - 文件内容，base64编码格式，如"data:application/pdf;base64,JVBERi0xLjcK"
 * @returns {Promise<Object>} 返回上传结果
 * @returns {number} returns.code - 状态码，200表示成功
 * @returns {string} returns.msg - 返回消息，如"创建订单成功"
 * @returns {Object} returns.data - 返回数据
 * @returns {number} returns.data.id - 订单ID
 */
export const uploadPrintOrder = async (data) => {
  return request.post("/print/order", data);
};
