/**
 * 反馈相关的模拟数据
 */

// 反馈类型
export const feedbackTypes = [
  { 
    label: '功能问题', 
    value: 'function',
    icon: '/static/images/common/icon-function.png',
    activeIcon: '/static/images/common/icon-function-active.png'
  },
  { 
    label: '体验建议', 
    value: 'experience',
    icon: '/static/images/common/icon-experience.png',
    activeIcon: '/static/images/common/icon-experience-active.png'
  },
  { 
    label: '内容优化', 
    value: 'content',
    icon: '/static/images/common/icon-content.png',
    activeIcon: '/static/images/common/icon-content-active.png'
  },
  { 
    label: '其他', 
    value: 'others',
    icon: '/static/images/common/icon-others.png',
    activeIcon: '/static/images/common/icon-others-active.png'
  }
];

// 模拟提交反馈接口
export const mockSubmitFeedback = (data) => {
  console.log('提交的反馈数据：', data);
  
  // 模拟网络延迟
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        code: 200,
        message: '提交成功',
        data: {
          feedbackId: 'fb_' + Date.now(),
          submitTime: new Date().toISOString(),
          status: 'pending' // 待处理状态
        }
      });
    }, 1500);
  });
};

// 模拟上传图片接口
export const mockUploadImage = (file) => {
  console.log('上传的图片文件：', file);
  
  // 模拟网络延迟
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        code: 200,
        message: '上传成功',
        data: {
          imageUrl: file, // 实际场景中这里应该是上传后的图片URL
          size: Math.floor(Math.random() * 1000000) + 50000, // 模拟文件大小
          uploadTime: new Date().toISOString()
        }
      });
    }, 800);
  });
};

// 模拟反馈历史数据
export const mockFeedbackHistory = [
  {
    id: 'fb_001',
    type: 'function',
    typeName: '功能问题',
    content: '登录功能有时候会出现卡顿现象，希望能优化一下',
    images: ['/static/images/common/placeholder.png'],
    contact: '13800138000',
    submitTime: '2023-11-05T15:30:22.000Z',
    status: 'replied', // 已回复
    reply: {
      content: '您好，感谢您的反馈。我们已经优化了登录功能，请更新到最新版本体验。',
      time: '2023-11-06T10:15:43.000Z'
    }
  },
  {
    id: 'fb_002',
    type: 'experience',
    typeName: '体验建议',
    content: '希望能增加深色模式，晚上使用更护眼',
    images: [],
    contact: '',
    submitTime: '2023-10-28T09:45:12.000Z',
    status: 'processing', // 处理中
    reply: null
  },
  {
    id: 'fb_003',
    type: 'content',
    typeName: '内容优化',
    content: '首页文章内容希望能更新得更频繁一些',
    images: ['/static/images/common/placeholder.png', '/static/images/common/placeholder.png'],
    contact: 'user@example.com',
    submitTime: '2023-10-15T14:22:37.000Z',
    status: 'pending', // 待处理
    reply: null
  }
];

// 模拟获取反馈历史
export const mockGetFeedbackHistory = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        code: 200,
        message: '获取成功',
        data: {
          list: mockFeedbackHistory,
          total: mockFeedbackHistory.length
        }
      });
    }, 1000);
  });
};
