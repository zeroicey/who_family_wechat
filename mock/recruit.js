/**
 * 招聘模块模拟数据
 */

// 招聘岗位类型
export const recruitTypes = [
  { id: 1, name: '社团招新' },
  { id: 2, name: '活动招募' },
  { id: 3, name: '志愿者岗位' }
];

// 招聘岗位列表
export const recruitList = [
  {
    id: 1,
    type: 1, // 社团招新
    title: '计算机协会招新',
    organization: '计算机协会',
    description: '计算机协会是一个专注于计算机技术交流和学习的学生组织，欢迎对编程、人工智能、网络安全等领域感兴趣的同学加入。',
    requirements: '1. 对计算机技术有浓厚兴趣；\n2. 有一定的编程基础；\n3. 有团队合作精神；\n4. 有责任心，能够按时完成任务。',
    benefits: '1. 提供专业技能培训；\n2. 参与校内外技术竞赛机会；\n3. 获得行业实习推荐；\n4. 结交志同道合的朋友。',
    deadline: Date.now() + 86400000 * 7, // 7天后截止
    positions: 10,
    applied: 5,
    location: '信息学院楼102室',
    contact: '张老师 (13900001111)',
    logo: '/static/images/recruit/computer_club.png',
    isHot: true,
    isRecommended: true,
    createTime: Date.now() - 86400000 * 2
  },
  {
    id: 2,
    type: 1, // 社团招新
    title: '摄影协会招新',
    organization: '摄影协会',
    description: '摄影协会致力于培养学生的摄影技能和艺术鉴赏能力，定期组织摄影活动、作品展览和技术交流。',
    requirements: '1. 热爱摄影艺术；\n2. 有基本的摄影设备（手机摄影也可）；\n3. 愿意参与协会组织的活动；\n4. 有创新精神和团队合作意识。',
    benefits: '1. 专业摄影技能指导；\n2. 校内外摄影比赛机会；\n3. 作品展示平台；\n4. 摄影设备优惠。',
    deadline: Date.now() + 86400000 * 10, // 10天后截止
    positions: 15,
    applied: 8,
    location: '艺术楼203室',
    contact: '李老师 (13800002222)',
    logo: '/static/images/recruit/photo_club.png',
    isHot: false,
    isRecommended: true,
    createTime: Date.now() - 86400000 * 3
  },
  {
    id: 3,
    type: 2, // 活动招募
    title: '校园歌手大赛志愿者',
    organization: '校团委',
    description: '第十届校园歌手大赛即将举行，现招募活动志愿者，负责活动现场秩序维护、选手引导、观众服务等工作。',
    requirements: '1. 有责任心，做事认真细致；\n2. 有良好的沟通能力和服务意识；\n3. 能够在活动期间（5月15日-5月20日）全程参与；\n4. 有志愿服务经验者优先。',
    benefits: '1. 获得校级志愿服务证书；\n2. 志愿服务时长认证；\n3. 近距离接触校园明星；\n4. 活动纪念品。',
    deadline: Date.now() + 86400000 * 5, // 5天后截止
    positions: 20,
    applied: 12,
    location: '大学生活动中心',
    contact: '王老师 (13700003333)',
    logo: '/static/images/recruit/singing_contest.png',
    isHot: true,
    isRecommended: false,
    createTime: Date.now() - 86400000 * 1
  },
  {
    id: 4,
    type: 2, // 活动招募
    title: '创新创业大赛组织者',
    organization: '创新创业学院',
    description: '2025年校园创新创业大赛筹备组招募成员，负责大赛前期宣传、参赛团队对接、赛事组织等工作。',
    requirements: '1. 对创新创业有浓厚兴趣；\n2. 有较强的组织协调能力；\n3. 能够承担一定的工作压力；\n4. 有相关活动组织经验者优先。',
    benefits: '1. 接触优秀创业项目和团队；\n2. 获得创新创业学院推荐信；\n3. 优先参与创业孵化项目；\n4. 活动补贴。',
    deadline: Date.now() + 86400000 * 8, // 8天后截止
    positions: 8,
    applied: 3,
    location: '创新创业学院办公室',
    contact: '赵老师 (13600004444)',
    logo: '/static/images/recruit/innovation_contest.png',
    isHot: false,
    isRecommended: true,
    createTime: Date.now() - 86400000 * 4
  },
  {
    id: 5,
    type: 3, // 志愿者岗位
    title: '校园导览志愿者',
    organization: '招生办公室',
    description: '招募校园导览志愿者，负责接待参观学校的高中生及家长，介绍校园环境、专业设置、学生生活等内容。',
    requirements: '1. 熟悉校园环境和各学院情况；\n2. 普通话标准，表达能力强；\n3. 形象气质佳，有亲和力；\n4. 能够在招生季期间（6月-8月）参与服务。',
    benefits: '1. 志愿服务证书和时长认证；\n2. 招生办推荐信；\n3. 志愿者服装一套；\n4. 餐饮补贴。',
    deadline: Date.now() + 86400000 * 15, // 15天后截止
    positions: 30,
    applied: 18,
    location: '招生办公室',
    contact: '钱老师 (13500005555)',
    logo: '/static/images/recruit/campus_guide.png',
    isHot: true,
    isRecommended: true,
    createTime: Date.now() - 86400000 * 5
  },
  {
    id: 6,
    type: 3, // 志愿者岗位
    title: '图书馆志愿者',
    organization: '图书馆',
    description: '图书馆招募志愿者，协助图书整理、读者咨询、活动组织等工作，为校园阅读环境建设贡献力量。',
    requirements: '1. 热爱阅读，了解图书分类方法；\n2. 工作认真细致，有耐心；\n3. 每周能保证4小时以上的服务时间；\n4. 有图书管理经验者优先。',
    benefits: '1. 图书馆志愿者证书；\n2. 优先借阅新书权限；\n3. 图书馆学习空间预约特权；\n4. 志愿服务学分。',
    deadline: Date.now() + 86400000 * 12, // 12天后截止
    positions: 15,
    applied: 7,
    location: '图书馆办公室',
    contact: '孙老师 (13400006666)',
    logo: '/static/images/recruit/library.png',
    isHot: false,
    isRecommended: false,
    createTime: Date.now() - 86400000 * 6
  }
];

// 用户投递记录
export const userApplications = [
  {
    id: 1,
    recruitId: 3,
    userId: 1,
    status: 'pending', // pending-待审核, viewed-已查看, interview-待面试, accepted-已录用, rejected-已拒绝
    createTime: Date.now() - 86400000 * 2,
    resume: {
      name: 'zeroicey',
      gender: '男',
      phone: '13800138000',
      email: 'test@example.com',
      school: '广东东软学院',
      major: '计算机科学与技术',
      grade: '大三',
      skills: '编程、设计、项目管理',
      experience: '曾参与校园APP开发，担任过学生会技术部部长',
      awards: '校级编程大赛二等奖，优秀学生干部',
      selfIntroduction: '我是一名热爱技术的计算机专业学生，擅长前端和移动端开发，希望能够加入贵组织，贡献自己的力量。'
    },
    feedback: ''
  },
  {
    id: 2,
    recruitId: 5,
    userId: 1,
    status: 'viewed', // 已查看
    createTime: Date.now() - 86400000 * 5,
    resume: {
      name: 'zeroicey',
      gender: '男',
      phone: '13800138000',
      email: 'test@example.com',
      school: '广东东软学院',
      major: '计算机科学与技术',
      grade: '大三',
      skills: '沟通能力强，熟悉校园环境，有志愿服务经验',
      experience: '担任过校园开放日志愿者，有丰富的接待经验',
      awards: '优秀志愿者称号',
      selfIntroduction: '我热爱志愿服务工作，希望能够通过校园导览向更多人展示我们学校的风采。'
    },
    feedback: '简历已查看，请等待面试通知'
  }
];

// 用户收藏的岗位
export const userFavorites = [
  {
    id: 1,
    userId: 1,
    recruitId: 1,
    createTime: Date.now() - 86400000 * 3
  },
  {
    id: 2,
    userId: 1,
    recruitId: 5,
    createTime: Date.now() - 86400000 * 1
  }
];

// 招聘相关API响应
export const recruitResponse = {
  // 获取招聘列表响应
  getRecruitList: {
    code: 200,
    message: '获取成功',
    data: {
      total: recruitList.length,
      list: recruitList
    }
  },
  
  // 获取招聘详情响应
  getRecruitDetail: (id) => {
    const recruit = recruitList.find(item => item.id === id);
    return {
      code: recruit ? 200 : 404,
      message: recruit ? '获取成功' : '岗位不存在',
      data: recruit || null
    };
  },
  
  // 获取用户投递记录响应
  getUserApplications: {
    code: 200,
    message: '获取成功',
    data: {
      total: userApplications.length,
      list: userApplications
    }
  },
  
  // 获取用户收藏响应
  getUserFavorites: {
    code: 200,
    message: '获取成功',
    data: {
      total: userFavorites.length,
      list: userFavorites.map(fav => {
        const recruit = recruitList.find(item => item.id === fav.recruitId);
        return {
          ...fav,
          recruitInfo: recruit
        };
      })
    }
  },
  
  // 投递简历响应
  submitApplication: {
    code: 200,
    message: '投递成功',
    data: null
  },
  
  // 收藏/取消收藏响应
  toggleFavorite: {
    code: 200,
    message: '操作成功',
    data: null
  }
};
