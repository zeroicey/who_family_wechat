/**
 * 服务模块Mock数据
 * @module mock/service
 * @author 互成一家
 * @description 服务相关的模拟数据和模拟接口
 */
import { mockApiCall, mockPagination, filterData } from './utils';

/**
 * 服务评分枚举
 * @enum {Number}
 */
export const SERVICE_RATING = {
  /** 全部 */
  ALL: 0,
  /** 好评 (4-5星) */
  GOOD: 4,
  /** 中评 (3星) */
  MEDIUM: 3,
  /** 差评 (1-2星) */
  BAD: 1
};

/**
 * 服务分类数据
 * @type {Array.<Object>}
 */
export const serviceCategories = [
  {
    id: 1,
    name: '家政服务',
    icon: '/static/images/services/housekeeping.png',
    count: 28
  },
  {
    id: 2,
    name: '教育培训',
    icon: '/static/images/services/education.png',
    count: 15
  },
  {
    id: 3,
    name: '健康医疗',
    icon: '/static/images/services/healthcare.png',
    count: 12
  },
  {
    id: 4,
    name: '心理咨询',
    icon: '/static/images/services/counseling.png',
    count: 8
  },
  {
    id: 5,
    name: '法律咨询',
    icon: '/static/images/services/legal.png',
    count: 6
  },
  {
    id: 6,
    name: '社区活动',
    icon: '/static/images/services/community.png',
    count: 10
  }
];

/**
 * 服务列表数据
 * @type {Array.<Object>}
 */
export const serviceList = [
  {
    id: 1,
    categoryId: 1, // 家政服务
    name: '居家保洁',
    description: '专业团队提供全屋深度清洁服务，让您的家焕然一新',
    price: 150,
    unit: '次',
    rating: 4.9,
    reviewCount: 120,
    images: [
      'https://picsum.photos/seed/service1/800/600',
      'https://picsum.photos/seed/service2/800/600',
      'https://picsum.photos/seed/service3/800/600'
    ],
    tags: ['专业团队', '全屋清洁', '定期保洁'],
    options: [
      { id: 1, name: '基础保洁', price: 150, description: '三小时基础清洁，适合日常保洁' },
      { id: 2, name: '深度保洁', price: 250, description: '五小时深度清洁，包含油烟机等难清洁区域' },
      { id: 3, name: '除螨除菌', price: 350, description: '专业除螨设备，深度杀菌，适合有老人小孩的家庭' }
    ],
    orderCount: 520,
    createTime: Date.now() - 86400000 * 30
  },
  {
    id: 2,
    categoryId: 1, // 家政服务
    name: '专业擦窗',
    description: '专业工具和技术，让您的窗户明亮如新',
    price: 100,
    unit: '小时',
    rating: 4.8,
    reviewCount: 95,
    images: [
      'https://picsum.photos/seed/service4/800/600',
      'https://picsum.photos/seed/service5/800/600'
    ],
    tags: ['专业工具', '安全保障', '明亮如新'],
    options: [
      { id: 1, name: '普通窗户', price: 100, description: '居家普通窗户清洁' },
      { id: 2, name: '落地窗', price: 150, description: '大面积落地窗清洁' },
      { id: 3, name: '高空窗户', price: 200, description: '三层以上高空窗户清洁，含安全保障' }
    ],
    orderCount: 310,
    createTime: Date.now() - 86400000 * 25
  },
  {
    id: 3,
    categoryId: 2, // 教育培训
    name: '一对一学科辅导',
    description: '针对学生薄弱学科进行专业辅导，提高学习成绩',
    price: 200,
    unit: '小时',
    rating: 4.7,
    reviewCount: 85,
    images: [
      'https://picsum.photos/seed/service6/800/600',
      'https://picsum.photos/seed/service7/800/600'
    ],
    tags: ['专业老师', '一对一', '提高成绩'],
    options: [
      { id: 1, name: '小学课程', price: 150, description: '小学各科目辅导' },
      { id: 2, name: '初中课程', price: 200, description: '初中各科目辅导，包含中考指导' },
      { id: 3, name: '高中课程', price: 250, description: '高中各科目辅导，包含高考指导' }
    ],
    orderCount: 420,
    createTime: Date.now() - 86400000 * 20
  },
  {
    id: 4,
    categoryId: 3, // 健康医疗
    name: '上门康复理疗',
    description: '专业康复师提供上门理疗服务，帮助恢复身体机能',
    price: 300,
    unit: '次',
    rating: 4.9,
    reviewCount: 65,
    images: [
      'https://picsum.photos/seed/service8/800/600',
      'https://picsum.photos/seed/service9/800/600'
    ],
    tags: ['专业康复', '上门服务', '舒缓疼痛'],
    options: [
      { id: 1, name: '颈椎理疗', price: 300, description: '针对颈椎问题的专项理疗' },
      { id: 2, name: '腰椎理疗', price: 320, description: '针对腰椎问题的专项理疗' },
      { id: 3, name: '运动损伤修复', price: 380, description: '针对运动损伤的康复理疗' }
    ],
    orderCount: 180,
    createTime: Date.now() - 86400000 * 15
  }
];

/**
 * 服务评价数据
 * @type {Object.<number, Array.<Object>>}
 */
export const serviceReviews = {
  1: [
    {
      id: 1,
      serviceId: 1,
      username: '用户152****3648',
      avatar: 'https://picsum.photos/seed/user1/100/100',
      rating: 5,
      content: '阿姨很专业，打扫得非常干净！家里焕然一新，特别是厨房的油污清理得很彻底。下次还会预约！',
      images: [
        'https://picsum.photos/seed/review1/300/300',
        'https://picsum.photos/seed/review2/300/300'
      ],
      createTime: Date.now() - 86400000 * 2,
      reply: '感谢您的认可，我们一直致力于提供专业的服务！期待再次为您服务~'
    },
    {
      id: 2,
      serviceId: 1,
      username: '用户186****7925',
      avatar: 'https://picsum.photos/seed/user2/100/100',
      rating: 4,
      content: '整体满意，就是有些角落没有清理到位，希望下次能更仔细一些。',
      images: [],
      createTime: Date.now() - 86400000 * 5,
      reply: '非常抱歉没有做到位，我们会持续改进服务质量。感谢您的反馈！'
    },
    {
      id: 3,
      serviceId: 1,
      username: '用户139****4526',
      avatar: 'https://picsum.photos/seed/user3/100/100',
      rating: 5,
      content: '服务很及时，预约后第二天就上门了。保洁阿姨很有经验，擦玻璃特别干净！',
      images: [
        'https://picsum.photos/seed/review3/300/300'
      ],
      createTime: Date.now() - 86400000 * 7
    },
    {
      id: 4,
      serviceId: 1,
      username: '用户155****2089',
      avatar: 'https://picsum.photos/seed/user4/100/100',
      rating: 5,
      content: '已经第三次预约了，每次都很满意。阿姨很认真负责，清洁工具也很齐全。',
      images: [
        'https://picsum.photos/seed/review4/300/300',
        'https://picsum.photos/seed/review5/300/300',
        'https://picsum.photos/seed/review6/300/300'
      ],
      createTime: Date.now() - 86400000 * 10,
      reply: '感谢您的长期支持，我们会一如既往地为您提供优质服务！'
    },
    {
      id: 5,
      serviceId: 1,
      username: '用户177****3365',
      avatar: 'https://picsum.photos/seed/user5/100/100',
      rating: 3,
      content: '服务一般，时间控制得不是很好，说好的三小时，实际做了两个半小时就走了。',
      images: [],
      createTime: Date.now() - 86400000 * 15,
      reply: '您好，非常抱歉没有做好时间管理。我们已经和服务人员进行了沟通，保证今后严格按照约定时间提供服务。'
    }
  ],
  2: [
    {
      id: 6,
      serviceId: 2,
      username: '用户138****5467',
      avatar: 'https://picsum.photos/seed/user6/100/100',
      rating: 5,
      content: '擦得真干净，连窗框都很细致。家里的落地窗明亮如新！',
      images: [
        'https://picsum.photos/seed/review7/300/300',
        'https://picsum.photos/seed/review8/300/300'
      ],
      createTime: Date.now() - 86400000 * 3
    },
    {
      id: 7,
      serviceId: 2,
      username: '用户159****2036',
      avatar: 'https://picsum.photos/seed/user7/100/100',
      rating: 4,
      content: '师傅很专业，但是有一处高处没擦到，需要我指出来才补擦的。',
      images: [],
      createTime: Date.now() - 86400000 * 6,
      reply: '感谢您的反馈，我们会继续提高服务细节的把控。'
    }
  ],
  3: [
    {
      id: 8,
      serviceId: 3,
      username: '用户136****7892',
      avatar: 'https://picsum.photos/seed/user8/100/100',
      rating: 5,
      content: '老师很专业，孩子成绩提高了，而且也更有学习兴趣了！',
      images: [],
      createTime: Date.now() - 86400000 * 4,
      reply: '感谢您的信任，我们会继续努力提供更好的教学服务。'
    },
    {
      id: 9,
      serviceId: 3,
      username: '用户158****3367',
      avatar: 'https://picsum.photos/seed/user9/100/100',
      rating: 5,
      content: '老师很有耐心，讲解非常清晰，对薄弱点分析得很准确。孩子很喜欢！',
      images: [
        'https://picsum.photos/seed/review9/300/300'
      ],
      createTime: Date.now() - 86400000 * 8
    }
  ],
  4: [
    {
      id: 10,
      serviceId: 4,
      username: '用户135****2546',
      avatar: 'https://picsum.photos/seed/user10/100/100',
      rating: 5,
      content: '理疗师技术很好，肩颈疼痛明显缓解了，会坚持做下去！',
      images: [
        'https://picsum.photos/seed/review10/300/300'
      ],
      createTime: Date.now() - 86400000 * 1,
      reply: '谢谢您的支持，坚持理疗确实会有很好的效果，期待为您继续服务！'
    }
  ]
};

/**
 * 根据服务ID获取服务详情
 * @function getServiceById
 * @param {Number|String} serviceId - 服务ID
 * @returns {Object|null} 服务详情对象或null
 */
export const getServiceById = (serviceId) => {
  return serviceList.find(service => service.id === Number(serviceId)) || null;
};

/**
 * 根据分类ID获取服务列表
 * @function getServicesByCategoryId
 * @param {Number|String} categoryId - 分类ID
 * @returns {Array} 服务列表数组
 */
export const getServicesByCategoryId = (categoryId) => {
  if (!categoryId || categoryId === 'all') {
    return [...serviceList];
  }
  return serviceList.filter(service => service.categoryId === Number(categoryId));
};

/**
 * 根据服务ID获取评价列表
 * @function getReviewsByServiceId
 * @param {Number|String} serviceId - 服务ID
 * @returns {Array} 评价列表数组
 */
export const getReviewsByServiceId = (serviceId) => {
  return serviceReviews[serviceId] || [];
};

/**
 * Mock: 获取服务分类列表
 * @async
 * @function mockGetServiceCategories
 * @returns {Promise<Object>} 返回服务分类列表
 */
export const mockGetServiceCategories = async () => {
  return mockApiCall(serviceCategories);
};

/**
 * Mock: 获取服务列表
 * @async
 * @function mockGetServiceList
 * @param {Object} params - 查询参数
 * @param {Number|String} [params.categoryId] - 分类ID
 * @param {String} [params.keyword] - 搜索关键词
 * @param {Number} [params.page=1] - 页码
 * @param {Number} [params.pageSize=10] - 每页条数
 * @returns {Promise<Object>} 返回服务列表和分页信息
 */
export const mockGetServiceList = async (params = {}) => {
  const { categoryId, keyword, page = 1, pageSize = 10 } = params;
  let filteredServices = getServicesByCategoryId(categoryId);
  
  // 按关键词筛选
  if (keyword) {
    filteredServices = filteredServices.filter(service => 
      service.name.includes(keyword) || 
      service.description.includes(keyword) ||
      service.tags.some(tag => tag.includes(keyword))
    );
  }
  
  // 按评分排序（从高到低）
  filteredServices.sort((a, b) => b.rating - a.rating);
  
  // 分页处理
  const paginatedData = mockPagination(filteredServices, page, pageSize);
  
  return mockApiCall(paginatedData);
};

/**
 * Mock: 获取服务详情
 * @async
 * @function mockGetServiceDetail
 * @param {Number|String} serviceId - 服务ID
 * @returns {Promise<Object>} 返回服务详情
 */
export const mockGetServiceDetail = async (serviceId) => {
  const service = getServiceById(serviceId);
  if (!service) {
    return mockApiCall(null, 404, '服务不存在');
  }
  return mockApiCall(service);
};

/**
 * Mock: 获取服务评价列表
 * @async
 * @function mockGetServiceReviews
 * @param {Object} params - 查询参数
 * @param {Number|String} params.serviceId - 服务ID
 * @param {Number} [params.rating] - 评分筛选：0=全部，4=好评，3=中评，1=差评
 * @param {Boolean} [params.hasImage] - 是否有图片
 * @param {Number} [params.page=1] - 页码
 * @param {Number} [params.pageSize=10] - 每页条数
 * @returns {Promise<Object>} 返回评价列表和分页信息
 */
export const mockGetServiceReviews = async (params = {}) => {
  const { serviceId, rating = 0, hasImage, page = 1, pageSize = 10 } = params;
  let reviews = getReviewsByServiceId(serviceId);
  
  // 按评分筛选
  if (rating > 0) {
    if (rating === SERVICE_RATING.GOOD) {
      reviews = reviews.filter(review => review.rating >= 4);
    } else if (rating === SERVICE_RATING.MEDIUM) {
      reviews = reviews.filter(review => review.rating === 3);
    } else if (rating === SERVICE_RATING.BAD) {
      reviews = reviews.filter(review => review.rating <= 2);
    }
  }
  
  // 是否有图片
  if (hasImage) {
    reviews = reviews.filter(review => review.images && review.images.length > 0);
  }
  
  // 按时间排序（从新到旧）
  reviews.sort((a, b) => b.createTime - a.createTime);
  
  // 分页处理
  const paginatedData = mockPagination(reviews, page, pageSize);
  
  return mockApiCall(paginatedData);
};

/**
 * Mock: 提交服务评价
 * @async
 * @function mockSubmitServiceReview
 * @param {Object} reviewData - 评价数据
 * @param {Number|String} reviewData.serviceId - 服务ID
 * @param {Number} reviewData.rating - 评分(1-5)
 * @param {String} reviewData.content - 评价内容
 * @param {Array} [reviewData.images] - 图片列表
 * @returns {Promise<Object>} 返回提交结果
 */
export const mockSubmitServiceReview = async (reviewData) => {
  const { serviceId, rating, content, images = [] } = reviewData;
  
  const service = getServiceById(serviceId);
  if (!service) {
    return mockApiCall(null, 404, '服务不存在');
  }
  
  if (rating < 1 || rating > 5) {
    return mockApiCall(null, 400, '评分必须在1-5之间');
  }
  
  if (!content || content.trim() === '') {
    return mockApiCall(null, 400, '评价内容不能为空');
  }
  
  // 创建新评价
  const newReview = {
    id: Date.now(),
    serviceId: Number(serviceId),
    username: '用户' + Math.floor(Math.random() * 1000000),
    avatar: 'https://picsum.photos/seed/user' + Math.floor(Math.random() * 100) + '/100/100',
    rating,
    content,
    images,
    createTime: Date.now()
  };
  
  // 添加到评价列表
  if (!serviceReviews[serviceId]) {
    serviceReviews[serviceId] = [];
  }
  serviceReviews[serviceId].unshift(newReview);
  
  // 更新服务评分
  const reviews = serviceReviews[serviceId];
  const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
  service.rating = parseFloat((totalRating / reviews.length).toFixed(1));
  service.reviewCount = reviews.length;
  
  return mockApiCall({ success: true, review: newReview });
};
