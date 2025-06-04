/**
 * 社区模块Mock数据
 * @module mock/community
 * @author 互成一家
 * @description 社区相关的模拟数据和模拟接口
 */
import { mockApiCall, mockPagination, filterData } from './utils';

/**
 * 动态标签枚举
 * @enum {String}
 */
export const POST_TAGS = {
  /** 全部 */
  ALL: 'all',
  /** 已关注 */
  FOLLOWED: 'followed',
  /** 招募类 */
  RECRUIT: 'recruit',
  /** 吐槽类 */
  COMPLAINT: 'complaint',
  /** 拼车类 */
  CARPOOL: 'carpool'
};

/**
 * 标签数据
 * @type {Array.<Object>}
 */
export const tagList = [
  {
    id: 'all',
    name: '全部'
  },
  {
    id: 'followed',
    name: '已关注'
  },
  {
    id: 'recruit',
    name: '招募类'
  },
  {
    id: 'complaint',
    name: '吐槽类'
  },
  {
    id: 'carpool',
    name: '拼车类'
  },
  {
    id: 'study',
    name: '学习交流'
  },
  {
    id: 'activity',
    name: '活动通知'
  },
  {
    id: 'job',
    name: '实习就业'
  },
  {
    id: 'secondhand',
    name: '闲置交易'
  },
  {
    id: 'question',
    name: '问题求助'
  },
  {
    id: 'share',
    name: '经验分享'
  },
  {
    id: 'news',
    name: '校园新闻'
  }
];

/**
 * 用户数据
 * @type {Array.<Object>}
 */
export const userList = [
  {
    id: 1,
    nickname: '校园达人',
    avatar: 'https://picsum.photos/seed/user1/100/100',
    bio: '热爱校园生活，分享校园趣事',
    followersCount: 235,
    followingCount: 86,
    postsCount: 47,
    isFollowed: false
  },
  {
    id: 2,
    nickname: '学习小助手',
    avatar: 'https://picsum.photos/seed/user2/100/100',
    bio: '专注学习方法分享，一起进步',
    followersCount: 189,
    followingCount: 42,
    postsCount: 31,
    isFollowed: true
  },
  {
    id: 3,
    nickname: '校园摄影师',
    avatar: 'https://picsum.photos/seed/user3/100/100',
    bio: '用镜头记录校园的美好瞬间',
    followersCount: 312,
    followingCount: 95,
    postsCount: 68,
    isFollowed: false
  },
  {
    id: 4,
    nickname: '美食探店家',
    avatar: 'https://picsum.photos/seed/user4/100/100',
    bio: '探索校园周边美食，分享美食攻略',
    followersCount: 278,
    followingCount: 124,
    postsCount: 53,
    isFollowed: false
  },
  {
    id: 5,
    nickname: '考研人',
    avatar: 'https://picsum.photos/seed/user5/100/100',
    bio: '考研路上，分享考研经验与心得',
    followersCount: 156,
    followingCount: 37,
    postsCount: 25,
    isFollowed: true
  }
];

/**
 * 动态数据
 * @type {Array.<Object>}
 */
export const postList = [
  {
    id: 1,
    userId: 1,
    nickname: '校园达人',
    avatar: 'https://picsum.photos/seed/user1/100/100',
    content: '今天在图书馆学习了一天，感觉效率超高！分享一下我的学习方法：番茄工作法 + 思维导图，真的很有效！大家有什么好的学习方法也可以分享一下~',
    images: [
      'https://picsum.photos/seed/post1/800/600'
    ],
    tag: 'all',
    isAnonymous: false,
    likesCount: 45,
    commentsCount: 12,
    isLiked: false,
    createTime: Date.now() - 86400000 * 1
  },
  {
    id: 2,
    userId: 2,
    nickname: '学习小助手',
    avatar: 'https://picsum.photos/seed/user2/100/100',
    content: '【招募】寻找志愿者！本周六有一个社区服务活动，需要10名志愿者帮忙组织。活动内容是陪伴社区老人聊天、打扫卫生等。有兴趣的同学请在评论区留言，我会私信联系你们！',
    images: [
      'https://picsum.photos/seed/post2/800/600',
      'https://picsum.photos/seed/post3/800/600'
    ],
    tag: 'recruit',
    isAnonymous: false,
    likesCount: 67,
    commentsCount: 23,
    isLiked: true,
    createTime: Date.now() - 86400000 * 2
  },
  {
    id: 3,
    userId: null,
    nickname: '匿名用户',
    avatar: 'https://picsum.photos/seed/anonymous/100/100',
    content: '吐槽一下学校食堂的饭菜，最近感觉越来越难吃了，而且价格还涨了！大家有同感吗？希望学校能够重视一下食堂问题，提高饭菜质量...',
    images: [],
    tag: 'complaint',
    isAnonymous: true,
    likesCount: 89,
    commentsCount: 34,
    isLiked: false,
    createTime: Date.now() - 86400000 * 3
  },
  {
    id: 4,
    userId: 3,
    nickname: '校园摄影师',
    avatar: 'https://picsum.photos/seed/user3/100/100',
    content: '分享一组校园春景照片，趁着好天气拍的。最喜欢第三张樱花大道的照片，你们喜欢哪一张呢？',
    images: [
      'https://picsum.photos/seed/post4/800/600',
      'https://picsum.photos/seed/post5/800/600',
      'https://picsum.photos/seed/post6/800/600',
      'https://picsum.photos/seed/post7/800/600'
    ],
    tag: 'all',
    isAnonymous: false,
    likesCount: 125,
    commentsCount: 28,
    isLiked: true,
    createTime: Date.now() - 86400000 * 4
  },
  {
    id: 5,
    userId: 4,
    nickname: '美食探店家',
    avatar: 'https://picsum.photos/seed/user4/100/100',
    content: '【拼车】明天下午2点从学校到火车站，有3个空位，有需要的同学可以评论，一起拼车省钱！',
    images: [
      'https://picsum.photos/seed/post8/800/600'
    ],
    tag: 'carpool',
    isAnonymous: false,
    likesCount: 32,
    commentsCount: 15,
    isLiked: false,
    createTime: Date.now() - 86400000 * 5
  },
  {
    id: 6,
    userId: 5,
    nickname: '考研人',
    avatar: 'https://picsum.photos/seed/user5/100/100',
    content: '考研复习进入倒计时，分享一下我的复习计划和资料。政治和英语是重点，数学需要每天刷题保持手感。专业课要注意老师划的重点。希望能帮到同样在考研的同学们！',
    images: [
      'https://picsum.photos/seed/post9/800/600',
      'https://picsum.photos/seed/post10/800/600'
    ],
    tag: 'all',
    isAnonymous: false,
    likesCount: 76,
    commentsCount: 19,
    isLiked: true,
    createTime: Date.now() - 86400000 * 6
  }
];

/**
 * 评论数据
 * @type {Object.<number, Array.<Object>>}
 */
export const commentList = {
  1: [
    {
      id: 1,
      postId: 1,
      userId: 2,
      nickname: '学习小助手',
      avatar: 'https://picsum.photos/seed/user2/100/100',
      content: '番茄工作法真的很有效，我也在用！',
      createTime: Date.now() - 86400000 * 0.5
    },
    {
      id: 2,
      postId: 1,
      userId: 3,
      nickname: '校园摄影师',
      avatar: 'https://picsum.photos/seed/user3/100/100',
      content: '思维导图对整理知识点很有帮助，推荐一个软件：XMind',
      createTime: Date.now() - 86400000 * 0.6
    }
  ],
  2: [
    {
      id: 3,
      postId: 2,
      userId: 1,
      nickname: '校园达人',
      avatar: 'https://picsum.photos/seed/user1/100/100',
      content: '我有兴趣参加！请问具体在哪里集合？',
      createTime: Date.now() - 86400000 * 1.5
    },
    {
      id: 4,
      postId: 2,
      userId: 4,
      nickname: '美食探店家',
      avatar: 'https://picsum.photos/seed/user4/100/100',
      content: '我和我室友都想参加，算两个人！',
      createTime: Date.now() - 86400000 * 1.6
    }
  ],
  3: [
    {
      id: 5,
      postId: 3,
      userId: 5,
      nickname: '考研人',
      avatar: 'https://picsum.photos/seed/user5/100/100',
      content: '强烈同意！最近食堂菜量也变少了...',
      createTime: Date.now() - 86400000 * 2.5
    },
    {
      id: 6,
      postId: 3,
      userId: null,
      nickname: '匿名用户',
      avatar: 'https://picsum.photos/seed/anonymous/100/100',
      content: '建议向学校反映一下，我们可以联名写建议书',
      createTime: Date.now() - 86400000 * 2.6
    }
  ]
};

/**
 * 根据用户ID获取用户信息
 * @function getUserById
 * @param {Number|String} userId - 用户ID
 * @returns {Object|null} 用户信息对象或null
 */
export const getUserById = (userId) => {
  return userList.find(user => user.id === Number(userId)) || null;
};

/**
 * 根据动态ID获取动态详情
 * @function getPostById
 * @param {Number|String} postId - 动态ID
 * @returns {Object|null} 动态详情对象或null
 */
export const getPostById = (postId) => {
  return postList.find(post => post.id === Number(postId)) || null;
};

/**
 * 根据标签获取动态列表
 * @function getPostsByTag
 * @param {String} tag - 标签ID
 * @returns {Array} 动态列表数组
 */
export const getPostsByTag = (tag) => {
  if (!tag || tag === 'all') {
    return [...postList];
  }
  return postList.filter(post => post.tag === tag);
};

/**
 * 根据用户ID获取该用户的动态列表
 * @function getPostsByUserId
 * @param {Number|String} userId - 用户ID
 * @returns {Array} 动态列表数组
 */
export const getPostsByUserId = (userId) => {
  return postList.filter(post => post.userId === Number(userId) && !post.isAnonymous);
};

/**
 * 根据动态ID获取评论列表
 * @function getCommentsByPostId
 * @param {Number|String} postId - 动态ID
 * @returns {Array} 评论列表数组
 */
export const getCommentsByPostId = (postId) => {
  return commentList[postId] || [];
};

/**
 * Mock: 获取标签列表
 * @async
 * @function mockGetTagList
 * @returns {Promise<Object>} 返回标签列表
 */
export const mockGetTagList = async () => {
  return mockApiCall(tagList);
};

/**
 * Mock: 获取动态列表
 * @async
 * @function mockGetPostList
 * @param {Object} params - 查询参数
 * @param {String} [params.tag='all'] - 标签ID
 * @param {Boolean} [params.followed=false] - 是否只看关注的用户
 * @param {Number} [params.page=1] - 页码
 * @param {Number} [params.pageSize=10] - 每页条数
 * @returns {Promise<Object>} 返回动态列表和分页信息
 */
export const mockGetPostList = async (params = {}) => {
  const { tag = 'all', followed = false, page = 1, pageSize = 10 } = params;
  
  let filteredPosts = getPostsByTag(tag);
  
  // 如果只看关注的用户
  if (followed) {
    const followedUserIds = userList.filter(user => user.isFollowed).map(user => user.id);
    filteredPosts = filteredPosts.filter(post => followedUserIds.includes(post.userId));
  }
  
  // 按时间排序（从新到旧）
  filteredPosts.sort((a, b) => b.createTime - a.createTime);
  
  // 分页处理
  const paginatedData = mockPagination(filteredPosts, page, pageSize);
  
  return mockApiCall(paginatedData);
};

/**
 * Mock: 获取动态详情
 * @async
 * @function mockGetPostDetail
 * @param {Number|String} postId - 动态ID
 * @returns {Promise<Object>} 返回动态详情
 */
export const mockGetPostDetail = async (postId) => {
  const post = getPostById(postId);
  if (!post) {
    return mockApiCall(null, 404, '动态不存在');
  }
  return mockApiCall(post);
};

/**
 * Mock: 获取评论列表
 * @async
 * @function mockGetCommentList
 * @param {Object} params - 查询参数
 * @param {Number|String} params.postId - 动态ID
 * @param {Number} [params.page=1] - 页码
 * @param {Number} [params.pageSize=10] - 每页条数
 * @returns {Promise<Object>} 返回评论列表和分页信息
 */
export const mockGetCommentList = async (params = {}) => {
  const { postId, page = 1, pageSize = 10 } = params;
  
  const comments = getCommentsByPostId(postId);
  
  // 按时间排序（从新到旧）
  comments.sort((a, b) => b.createTime - a.createTime);
  
  // 分页处理
  const paginatedData = mockPagination(comments, page, pageSize);
  
  return mockApiCall(paginatedData);
};

/**
 * Mock: 获取用户信息
 * @async
 * @function mockGetUserInfo
 * @param {Number|String} userId - 用户ID
 * @returns {Promise<Object>} 返回用户信息
 */
export const mockGetUserInfo = async (userId) => {
  const user = getUserById(userId);
  if (!user) {
    return mockApiCall(null, 404, '用户不存在');
  }
  return mockApiCall(user);
};

/**
 * Mock: 获取用户动态列表
 * @async
 * @function mockGetUserPosts
 * @param {Object} params - 查询参数
 * @param {Number|String} params.userId - 用户ID
 * @param {Number} [params.page=1] - 页码
 * @param {Number} [params.pageSize=10] - 每页条数
 * @returns {Promise<Object>} 返回用户动态列表和分页信息
 */
export const mockGetUserPosts = async (params = {}) => {
  const { userId, page = 1, pageSize = 10 } = params;
  
  const posts = getPostsByUserId(userId);
  
  // 按时间排序（从新到旧）
  posts.sort((a, b) => b.createTime - a.createTime);
  
  // 分页处理
  const paginatedData = mockPagination(posts, page, pageSize);
  
  return mockApiCall(paginatedData);
};

/**
 * Mock: 发布动态
 * @async
 * @function mockCreatePost
 * @param {Object} postData - 动态数据
 * @param {String} postData.content - 动态内容
 * @param {Array} [postData.images=[]] - 图片列表
 * @param {String} [postData.tag='all'] - 标签ID
 * @param {Boolean} [postData.isAnonymous=false] - 是否匿名
 * @returns {Promise<Object>} 返回发布结果
 */
export const mockCreatePost = async (postData) => {
  const { content, images = [], tag = 'all', isAnonymous = false } = postData;
  
  if (!content || content.trim() === '') {
    return mockApiCall(null, 400, '动态内容不能为空');
  }
  
  // 创建新动态
  const newPost = {
    id: Date.now(),
    userId: isAnonymous ? null : 1, // 假设当前用户ID为1
    nickname: isAnonymous ? '匿名用户' : '校园达人', // 假设当前用户昵称
    avatar: isAnonymous ? 'https://picsum.photos/seed/anonymous/100/100' : 'https://picsum.photos/seed/user1/100/100', // 假设当前用户头像
    content,
    images,
    tag,
    isAnonymous,
    likesCount: 0,
    commentsCount: 0,
    isLiked: false,
    createTime: Date.now()
  };
  
  // 添加到动态列表
  postList.unshift(newPost);
  
  return mockApiCall({ success: true, post: newPost });
};

/**
 * Mock: 删除动态
 * @async
 * @function mockDeletePost
 * @param {Number|String} postId - 动态ID
 * @returns {Promise<Object>} 返回删除结果
 */
export const mockDeletePost = async (postId) => {
  const index = postList.findIndex(post => post.id === Number(postId));
  if (index === -1) {
    return mockApiCall(null, 404, '动态不存在');
  }
  
  // 删除动态
  postList.splice(index, 1);
  
  // 删除相关评论
  delete commentList[postId];
  
  return mockApiCall({ success: true });
};

/**
 * Mock: 点赞/取消点赞动态
 * @async
 * @function mockLikePost
 * @param {Object} params - 参数
 * @param {Number|String} params.postId - 动态ID
 * @param {Boolean} params.isLike - 是否点赞
 * @returns {Promise<Object>} 返回操作结果
 */
export const mockLikePost = async (params = {}) => {
  const { postId, isLike } = params;
  
  const post = getPostById(postId);
  if (!post) {
    return mockApiCall(null, 404, '动态不存在');
  }
  
  // 更新点赞状态
  post.isLiked = isLike;
  post.likesCount = isLike ? post.likesCount + 1 : Math.max(0, post.likesCount - 1);
  
  return mockApiCall({ success: true, post });
};

/**
 * Mock: 发表评论
 * @async
 * @function mockCreateComment
 * @param {Object} commentData - 评论数据
 * @param {Number|String} commentData.postId - 动态ID
 * @param {String} commentData.content - 评论内容
 * @param {Boolean} [commentData.isAnonymous=false] - 是否匿名
 * @returns {Promise<Object>} 返回发表结果
 */
export const mockCreateComment = async (commentData) => {
  const { postId, content, isAnonymous = false } = commentData;
  
  const post = getPostById(postId);
  if (!post) {
    return mockApiCall(null, 404, '动态不存在');
  }
  
  if (!content || content.trim() === '') {
    return mockApiCall(null, 400, '评论内容不能为空');
  }
  
  // 创建新评论
  const newComment = {
    id: Date.now(),
    postId: Number(postId),
    userId: isAnonymous ? null : 1, // 假设当前用户ID为1
    nickname: isAnonymous ? '匿名用户' : '校园达人', // 假设当前用户昵称
    avatar: isAnonymous ? 'https://picsum.photos/seed/anonymous/100/100' : 'https://picsum.photos/seed/user1/100/100', // 假设当前用户头像
    content,
    createTime: Date.now()
  };
  
  // 添加到评论列表
  if (!commentList[postId]) {
    commentList[postId] = [];
  }
  commentList[postId].unshift(newComment);
  
  // 更新动态评论数
  post.commentsCount += 1;
  
  return mockApiCall({ success: true, comment: newComment });
};

/**
 * Mock: 申请添加好友
 * @async
 * @function mockAddFriend
 * @param {Object} params - 参数
 * @param {Number|String} params.userId - 用户ID
 * @param {String} [params.message=''] - 申请消息
 * @returns {Promise<Object>} 返回申请结果
 */
export const mockAddFriend = async (params = {}) => {
  const { userId, message = '' } = params;
  
  const user = getUserById(userId);
  if (!user) {
    return mockApiCall(null, 404, '用户不存在');
  }
  
  return mockApiCall({ 
    success: true, 
    message: `已向${user.nickname}发送好友申请` 
  });
};

/**
 * Mock: 关注/取消关注用户
 * @async
 * @function mockFollowUser
 * @param {Object} params - 参数
 * @param {Number|String} params.userId - 用户ID
 * @param {Boolean} params.isFollow - 是否关注
 * @returns {Promise<Object>} 返回操作结果
 */
export const mockFollowUser = async (params = {}) => {
  const { userId, isFollow } = params;
  
  const user = getUserById(userId);
  if (!user) {
    return mockApiCall(null, 404, '用户不存在');
  }
  
  // 更新关注状态
  user.isFollowed = isFollow;
  user.followersCount = isFollow ? user.followersCount + 1 : Math.max(0, user.followersCount - 1);
  
  return mockApiCall({ success: true, user });
};
