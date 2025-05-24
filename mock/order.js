/**
 * 订单模块Mock数据
 * @module mock/order
 * @author 团队名称
 * @description 订单相关的模拟数据和模拟接口
 */
import { mockApiCall, mockPagination, filterData } from './utils';

/**
 * 订单状态枚举
 * @enum {String}
 */
export const ORDER_STATUS = {
  /** 待付款 */
  UNPAID: 'unpaid',
  /** 待发货 */
  UNDELIVERED: 'undelivered',
  /** 待收货 */
  DELIVERED: 'delivered',
  /** 已完成 */
  COMPLETED: 'completed',
  /** 已取消 */
  CANCELLED: 'cancelled'
};

/**
 * 订单列表数据
 * @type {Array.<Object>}
 */
export const orderList = [
  {
    id: 1,
    orderNumber: 'DD20250424001',
    createTime: Date.now() - 86400000 * 2,
    status: ORDER_STATUS.UNPAID,
    productName: '电子产品高级订制版',
    productDesc: '黑色 全新未拆封',
    productImage: '/static/images/orders/product1.png',
    price: 1999.00,
    quantity: 1,
    totalPrice: 1999.00
  },
  {
    id: 2,
    orderNumber: 'DD20250423002',
    createTime: Date.now() - 86400000 * 3,
    status: ORDER_STATUS.UNDELIVERED,
    productName: '学习资料完整版',
    productDesc: '电子版 永久有效',
    productImage: '/static/images/orders/product2.png',
    price: 299.00,
    quantity: 2,
    totalPrice: 598.00
  },
  {
    id: 3,
    orderNumber: 'DD20250422003',
    createTime: Date.now() - 86400000 * 5,
    status: ORDER_STATUS.DELIVERED,
    productName: '在线课程会员年卡',
    productDesc: '内含所有专业课程',
    productImage: '/static/images/orders/product3.png',
    price: 1288.00,
    quantity: 1,
    totalPrice: 1288.00
  },
  {
    id: 4,
    orderNumber: 'DD20250420004',
    createTime: Date.now() - 86400000 * 10,
    status: ORDER_STATUS.COMPLETED,
    productName: '学习方法指南手册',
    productDesc: '精装版 实体书籍',
    productImage: '/static/images/orders/product4.png',
    price: 88.00,
    quantity: 1,
    totalPrice: 88.00
  }
];

/**
 * 物流信息数据
 * @type {Object.<number, Array.<Object>>}
 */
export const logisticsData = {
  1: [
    { time: Date.now() - 86400000 * 2, status: '订单已创建', desc: '等待支付' }
  ],
  2: [
    { time: Date.now() - 86400000 * 3, status: '订单已创建', desc: '等待支付' },
    { time: Date.now() - 86400000 * 3 + 3600000, status: '支付成功', desc: '等待发货' }
  ],
  3: [
    { time: Date.now() - 86400000 * 5, status: '订单已创建', desc: '等待支付' },
    { time: Date.now() - 86400000 * 5 + 3600000, status: '支付成功', desc: '等待发货' },
    { time: Date.now() - 86400000 * 3, status: '商品已发货', desc: '【北京市】包裹已经发出' },
    { time: Date.now() - 86400000 * 2, status: '运输中', desc: '【上海市】包裹已到达中转站' },
    { time: Date.now() - 86400000 * 1, status: '运输中', desc: '【广州市】包裹正在派送中' }
  ],
  4: [
    { time: Date.now() - 86400000 * 10, status: '订单已创建', desc: '等待支付' },
    { time: Date.now() - 86400000 * 10 + 3600000, status: '支付成功', desc: '等待发货' },
    { time: Date.now() - 86400000 * 8, status: '商品已发货', desc: '【北京市】包裹已经发出' },
    { time: Date.now() - 86400000 * 7, status: '运输中', desc: '【上海市】包裹已到达中转站' },
    { time: Date.now() - 86400000 * 6, status: '运输中', desc: '【广州市】包裹正在派送中' },
    { time: Date.now() - 86400000 * 5, status: '已签收', desc: '包裹已由本人签收' }
  ]
};

/**
 * 根据订单ID获取订单详情
 * @function getOrderById
 * @param {Number|String} orderId - 订单ID
 * @returns {Object|null} 订单详情对象或null
 */
export const getOrderById = (orderId) => {
  return orderList.find(order => order.id === Number(orderId)) || null;
};

/**
 * 根据订单ID获取物流信息
 * @function getLogisticsById
 * @param {Number|String} orderId - 订单ID
 * @returns {Array} 物流信息数组
 */
export const getLogisticsById = (orderId) => {
  return logisticsData[orderId] || [];
};

/**
 * Mock: 获取订单列表
 * @async
 * @function mockGetOrderList
 * @param {Object} params - 查询参数
 * @param {String} [params.status] - 订单状态
 * @param {Number} [params.page=1] - 页码
 * @param {Number} [params.pageSize=10] - 每页条数
 * @returns {Promise<Object>} 返回订单列表和分页信息
 */
export const mockGetOrderList = async (params = {}) => {
  const { status, page = 1, pageSize = 10 } = params;
  let filteredOrders = [...orderList];
  
  // 按状态筛选
  if (status && status !== 'all') {
    filteredOrders = filteredOrders.filter(order => order.status === status);
  }
  
  // 按时间排序（从新到旧）
  filteredOrders.sort((a, b) => b.createTime - a.createTime);
  
  // 分页处理
  const paginatedData = mockPagination(filteredOrders, page, pageSize);
  
  return mockApiCall(paginatedData);
};

/**
 * Mock: 获取订单详情
 * @async
 * @function mockGetOrderDetail
 * @param {Number|String} orderId - 订单ID
 * @returns {Promise<Object>} 返回订单详情
 */
export const mockGetOrderDetail = async (orderId) => {
  const order = getOrderById(orderId);
  if (!order) {
    return mockApiCall(null, 404, '订单不存在');
  }
  return mockApiCall(order);
};

/**
 * Mock: 获取物流信息
 * @async
 * @function mockGetLogistics
 * @param {Number|String} orderId - 订单ID
 * @returns {Promise<Object>} 返回物流信息
 */
export const mockGetLogistics = async (orderId) => {
  const logistics = getLogisticsById(orderId);
  return mockApiCall(logistics);
};

/**
 * Mock: 支付订单
 * @async
 * @function mockPayOrder
 * @param {Number|String} orderId - 订单ID
 * @returns {Promise<Object>} 返回支付结果
 */
export const mockPayOrder = async (orderId) => {
  const order = getOrderById(orderId);
  if (!order) {
    return mockApiCall(null, 404, '订单不存在');
  }
  
  if (order.status !== ORDER_STATUS.UNPAID) {
    return mockApiCall(null, 400, '订单状态不正确');
  }
  
  // 更新订单状态
  order.status = ORDER_STATUS.UNDELIVERED;
  
  return mockApiCall({ success: true, order });
};

/**
 * Mock: 确认收货
 * @async
 * @function mockConfirmReceipt
 * @param {Number|String} orderId - 订单ID
 * @returns {Promise<Object>} 返回确认结果
 */
export const mockConfirmReceipt = async (orderId) => {
  const order = getOrderById(orderId);
  if (!order) {
    return mockApiCall(null, 404, '订单不存在');
  }
  
  if (order.status !== ORDER_STATUS.DELIVERED) {
    return mockApiCall(null, 400, '订单状态不正确');
  }
  
  // 更新订单状态
  order.status = ORDER_STATUS.COMPLETED;
  
  return mockApiCall({ success: true, order });
};
