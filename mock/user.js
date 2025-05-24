/**
 * 用户模块模拟数据
 * @module mock/user
 * @description 用于开发环境下的用户模块模拟数据，包含用户信息、登录响应、配置等
 */

/**
 * 用户信息结构
 * @typedef {Object} UserInfo
 * @property {Number} id - 用户ID
 * @property {String} name - 用户姓名
 * @property {String} avatar - 用户头像
 * @property {Number} gender - 用户性别(1:男, 2:女)
 * @property {String} phone - 手机号
 * @property {String} email - 邮箱
 * @property {String} bio - 个人简介
 * @property {String} school - 学校
 * @property {String} major - 专业
 * @property {String} grade - 年级
 * @property {Number} createTime - 创建时间
 * @property {Number} balance - 账户余额
 * @property {Number} points - 积分
 * @property {Number} level - 用户等级
 * @property {Array<Address>} addresses - 地址列表
 * @property {Object} orders - 订单统计
 */

/**
 * 地址结构
 * @typedef {Object} Address
 * @property {Number} id - 地址ID
 * @property {String} name - 收件人姓名
 * @property {String} phone - 收件人电话
 * @property {String} province - 省份
 * @property {String} city - 城市
 * @property {String} district - 区/县
 * @property {String} address - 详细地址
 * @property {Boolean} isDefault - 是否默认地址
 */

/**
 * 登录响应结构
 * @typedef {Object} LoginResponse
 * @property {Number} code - 状态码，200表示成功
 * @property {String} message - 响应消息
 * @property {Object} data - 响应数据
 * @property {String} data.token - 用户令牌
 * @property {UserInfo} data.userInfo - 用户信息
 */

/**
 * 用户信息
 * @type {UserInfo}
 */
export const userInfo = {
  id: 1,
  name: "zeroicey",
  avatar: "/static/images/avatar.png",
  gender: 1, // 1-男，2-女
  phone: "13800138000",
  email: "test@example.com",
  bio: "喜欢编程和寻找创新解决方案，喜欢研究新技术。", // 个人简介
  school: "广东东软学院",
  major: "计算机科学与技术",
  grade: "大三",
  createTime: Date.now() - 86400000 * 30,
  balance: 129.8, // 账户余额
  points: 1250, // 积分
  level: 3, // 用户等级
  addresses: [
    {
      id: 1,
      name: "张三",
      phone: "13800138000",
      province: "北京市",
      city: "北京市",
      district: "海淀区",
      address: "中关村大街1号科技园A座101室",
      isDefault: true,
    },
    {
      id: 2,
      name: "张三",
      phone: "13800138000",
      province: "上海市",
      city: "上海市",
      district: "浦东新区",
      address: "张江高科技园区科苑路88号",
      isDefault: false,
    },
  ],
  orders: {
    all: 12,
    unpaid: 1,
    undelivered: 2,
    delivered: 3,
    completed: 6,
  },
};

/**
 * 登录响应
 * @type {LoginResponse}
 */
export const loginResponse = {
  code: 200,
  message: "登录成功",
  data: {
    token: "mock_token_" + Date.now(),
    userInfo,
  },
};

/**
 * 登出响应
 * @type {Object}
 * @property {Number} code - 状态码，200表示成功
 * @property {String} message - 响应消息
 * @property {null} data - 空数据
 */
export const logoutResponse = {
  code: 200,
  message: "登出成功",
  data: null,
};

/**
 * 用户设置
 * @type {Object}
 * @property {Boolean} notification - 是否开启通知
 * @property {String} theme - 主题设置（light/dark）
 * @property {String} language - 语言设置
 * @property {String} fontsize - 字体大小
 * @property {Object} privacy - 隐私设置
 * @property {Boolean} privacy.showPhone - 是否显示手机号
 * @property {Boolean} privacy.showEmail - 是否显示邮箱
 * @property {Boolean} privacy.showSchool - 是否显示学校
 */
export const userSettings = {
  notification: true,
  theme: "light",
  language: "zh-CN",
  fontsize: "medium",
  privacy: {
    showPhone: true,
    showEmail: false,
    showSchool: true,
  },
};

/**
 * 用户反馈记录
 * @type {Array<Object>}
 * @property {Number} id - 反馈ID
 * @property {String} content - 反馈内容
 * @property {String} type - 反馈类型
 * @property {String} status - 处理状态
 * @property {Number} createTime - 创建时间
 */
export const userFeedbacks = [
  {
    id: 1,
    content: "应用界面非常友好，使用起来很方便",
    type: "功能建议",
    status: "已处理",
    createTime: Date.now() - 86400000 * 5,
  },
  {
    id: 2,
    content: "希望可以增加更多的支付方式",
    type: "功能建议",
    status: "处理中",
    createTime: Date.now() - 86400000 * 2,
  },
];

/**
 * 用户服务列表
 * @type {Array<Object>}
 * @property {Number} id - 服务ID
 * @property {String} name - 服务名称
 * @property {String} icon - 服务图标
 * @property {String} url - 服务跳转链接
 * @property {String} desc - 服务描述
 */
export const userServices = [
  {
    id: 1,
    name: "快速咨询",
    icon: "/static/images/services/consult.png",
    url: "/pages/service/consult",
    desc: "在线咨询专家团队",
  },
  {
    id: 2,
    name: "在线预约",
    icon: "/static/images/services/appointment.png",
    url: "/pages/service/appointment",
    desc: "便捷预约线上服务",
  },
  {
    id: 3,
    name: "学习资料",
    icon: "/static/images/services/materials.png",
    url: "/pages/service/materials",
    desc: "免费高质量学习资料",
  },
  {
    id: 4,
    name: "积分兑换",
    icon: "/static/images/services/points.png",
    url: "/pages/service/points",
    desc: "积分免费兑换好礼",
  },
  {
    id: 5,
    name: "社区活动",
    icon: "/static/images/services/activity.png",
    url: "/pages/service/activity",
    desc: "参与社区线上线下活动",
  },
  {
    id: 6,
    name: "校园招聘",
    icon: "/static/images/services/recruit.png",
    url: "/pages/service/recruit",
    desc: "校园专属招聘信息",
  },
];
