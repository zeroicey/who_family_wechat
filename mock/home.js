/**
 * 主页模块Mock数据
 * @module mock/home
 * @author 互成一家团队
 * @description 主页相关的模拟数据
 */
import { mockApiCall, mockPagination } from "./utils";

/**
 * 轮播图数据
 * @type {Array.<Object>}
 * @see {@link /openapi/home.yaml#components.schemas.Banner} Banner数据结构
 */
export const banners = [
  {
    id: 1,
    imageUrl:
      "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=800&auto=format&fit=crop",
    linkUrl: "/pages/community/index",
    title: "校园社区动态",
    description: "了解最新校园活动与社区资讯",
  },
  {
    id: 2,
    imageUrl:
      "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=800&auto=format&fit=crop",
    linkUrl: "/pages/club/index",
    title: "社团活动招新",
    description: "丰富多彩的社团等你加入",
  },
  {
    id: 3,
    imageUrl:
      "https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=80&w=800&auto=format&fit=crop",
    linkUrl: "/pages/service/index",
    title: "校园互助服务",
    description: "便捷的校园生活服务平台",
  },
  {
    id: 4,
    imageUrl: "/static/images/banner.jpg",
    linkUrl: "/pages/learning/index",
    title: "学习资源共享",
    description: "优质学习资源一站获取",
  },
];

/**
 * 待办事项数据
 * @type {Object}
 * @see {@link /openapi/home.yaml#components.schemas.TodoData} TodoData数据结构
 */
export const todoData = {
  total: 10,
  completed: 5,
  unfinished: 5,
  list: [
    {
      id: 1,
      title: "完成高等数学作业",
      deadline: Date.now() + 86400000,
      completed: false,
    },
    {
      id: 2,
      title: "准备英语四级考试",
      deadline: Date.now() + 86400000 * 3,
      completed: false,
    },
    {
      id: 3,
      title: "提交课程设计报告",
      deadline: Date.now() + 86400000 * 2,
      completed: false,
    },
  ],
};

/**
 * 打卡数据
 * @type {Object}
 * @see {@link /openapi/home.yaml#components.schemas.CheckinData} CheckinData数据结构
 */
export const checkinData = {
  continuousDays: 7,
  todayChecked: false,
  totalDays: 30,
  checkinTime: null,
  checkinHistory: [
    { date: "2025-04-24", checked: true },
    { date: "2025-04-23", checked: true },
    { date: "2025-04-22", checked: true },
    { date: "2025-04-21", checked: true },
    { date: "2025-04-20", checked: true },
    { date: "2025-04-19", checked: true },
    { date: "2025-04-18", checked: true },
  ],
};

/**
 * 专注数据
 * @type {Object}
 * @see {@link /openapi/home.yaml#components.schemas.FocusData} FocusData数据结构
 */
export const focusData = {
  weeklyHours: 12.5,
  todayMinutes: 0,
  totalHours: 120,
  focusHistory: [
    { date: "2025-04-24", minutes: 120 },
    { date: "2025-04-23", minutes: 90 },
    { date: "2025-04-22", minutes: 150 },
    { date: "2025-04-21", minutes: 180 },
    { date: "2025-04-20", minutes: 60 },
    { date: "2025-04-19", minutes: 120 },
    { date: "2025-04-18", minutes: 30 },
  ],
};

/**
 * 通知列表
 * @type {Array.<Object>}
 * @see {@link /openapi/home.yaml#components.schemas.Notice} Notice数据结构
 */
export const noticeList = [
  {
    id: 1,
    title: "关于2025年五一假期安排的通知",
    type: "important",
    publishTime: Date.now() - 86400000, // 1天前
  },
  {
    id: 2,
    title: "2025年春季学期期末考试安排",
    type: "normal",
    publishTime: Date.now() - 86400000 * 2, // 2天前
  },
  {
    id: 3,
    title: "图书馆五一假期开放时间调整",
    type: "normal",
    publishTime: Date.now() - 86400000 * 3, // 3天前
  },
];

/**
 * 功能模块数据
 * @type {Array.<Object>}
 * @see {@link /openapi/home.yaml#components.schemas.Module} Module数据结构
 */
export const modules = [
  { id: 1, name: "学习互助", icon: "icon-study", url: "/pages/study/index" },
  {
    id: 2,
    name: "校园活动",
    icon: "icon-activity",
    url: "/pages/activity/index",
  },
  {
    id: 3,
    name: "资源共享",
    icon: "icon-resource",
    url: "/pages/resource/index",
  },
  { id: 4, name: "职业发展", icon: "icon-career", url: "/pages/career/index" },
  { id: 5, name: "生活服务", icon: "icon-life", url: "/pages/life/index" },
  { id: 6, name: "失物招领", icon: "icon-lost", url: "/pages/lost/index" },
  { id: 7, name: "校园交易", icon: "icon-trade", url: "/pages/trade/index" },
  { id: 8, name: "更多服务", icon: "icon-more", url: "/pages/more/index" },
];

/**
 * 推荐服务数据
 * @type {Array.<Object>}
 * @see {@link /openapi/home.yaml#components.schemas.ServiceItem} ServiceItem数据结构
 */
export const serviceList = [
  {
    id: 1,
    title: "代拿快递服务",
    description: "解决快递取件烦恶，让你的包裹及时送达",
    imageUrl:
      "https://images.unsplash.com/photo-1586769852836-bc069f19e1b6?q=80&w=800&auto=format&fit=crop",
    price: "¥3起",
    rating: 4.8,
    orders: 1580,
    url: "/pages/service/express",
  },
  {
    id: 2,
    title: "远程打印服务",
    description: "随时随地打印文件，无需奔波实验室",
    imageUrl:
      "https://images.unsplash.com/photo-1571498664957-fde9cd210eb8?q=80&w=800&auto=format&fit=crop",
    price: "¥0.2/页",
    rating: 4.9,
    orders: 2350,
    url: "/pages/service/print",
  },
  {
    id: 3,
    title: "学习辅导服务",
    description: "专业辅导毕设与课程，助力学业进步",
    imageUrl:
      "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?q=80&w=800&auto=format&fit=crop",
    price: "¥50起/小时",
    rating: 4.7,
    orders: 960,
    url: "/pages/service/tutor",
  },
  {
    id: 4,
    title: "校园跑腿服务",
    description: "食堂代购、物品传递、校内各种跑腿服务",
    imageUrl:
      "https://images.unsplash.com/photo-1498837167922-ddd27525d352?q=80&w=800&auto=format&fit=crop",
    price: "¥5起",
    rating: 4.6,
    orders: 2100,
    url: "/pages/service/errand",
  },
  {
    id: 5,
    title: "学生搬家服务",
    description: "毕业季、开学季宿舍搬家服务",
    imageUrl:
      "https://images.unsplash.com/photo-1600518464441-9306b008de05?q=80&w=800&auto=format&fit=crop",
    price: "¥30起",
    rating: 4.5,
    orders: 650,
    url: "/pages/service/moving",
  },
];

/**
 * 社团活动列表数据
 * @type {Array.<Object>}
 * @see {@link /openapi/home.yaml#components.schemas.ClubActivity} ClubActivity数据结构
 */
export const clubList = [
  {
    id: 1,
    title: "学生会干部招新",
    organizer: "学生会",
    viewCount: 12560,
    imageUrl:
      "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?q=80&w=800&auto=format&fit=crop",
    location: "学生活动中心",
    time: Date.now() + 86400000 * 3,
    description:
      "招募热情、有责任心的同学加入学生会大家庭，一起为校园建设贡献力量！",
    status: "招募中",
    url: "/pages/club/detail?id=1",
  },
  {
    id: 2,
    title: "校园文化节志愿者招募",
    organizer: "校团委",
    viewCount: 8976,
    imageUrl:
      "https://images.unsplash.com/photo-1511632765486-a01980e01a18?q=80&w=800&auto=format&fit=crop",
    location: "校园广场",
    time: Date.now() + 86400000 * 5,
    description: "诚邀广大同学参与校园文化节志愿服务，共同创造美好校园生活！",
    status: "招募中",
    url: "/pages/volunteer/detail?id=2",
  },
  {
    id: 3,
    title: "计算机协会编程大赛",
    organizer: "计算机协会",
    viewCount: 15230,
    imageUrl:
      "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?q=80&w=800&auto=format&fit=crop",
    location: "计算机学院实验室",
    time: Date.now() + 86400000 * 7,
    description: "提升编程能力，展示技术实力，丰厚奖金等你来拿！",
    status: "报名中",
    url: "/pages/activity/detail?id=3",
  },
  {
    id: 4,
    title: "文学社朗诵比赛",
    organizer: "文学社",
    viewCount: 7630,
    imageUrl:
      "https://images.unsplash.com/photo-1544928147-79a2dbc1f445?q=80&w=800&auto=format&fit=crop",
    location: "图书馆报告厅",
    time: Date.now() + 86400000 * 6,
    description: "用声音传递文学的力量，展现朗诵的艺术魅力",
    status: "报名中",
    url: "/pages/activity/detail?id=4",
  },
  {
    id: 5,
    title: "篮球协会新生杯比赛",
    organizer: "篮球协会",
    viewCount: 9870,
    imageUrl:
      "https://images.unsplash.com/photo-1546519638-68e109acd27d?q=80&w=800&auto=format&fit=crop",
    location: "大学体育馆",
    time: Date.now() + 86400000 * 10,
    description: "欢迎新生参与校园篮球赛事，结交新朋友，享受运动乐趣",
    status: "报名中",
    url: "/pages/activity/detail?id=5",
  },
];

/**
 * 热门功能列表数据
 * @type {Array.<Object>}
 * @see {@link /openapi/home.yaml#components.schemas.ToolItem} ToolItem数据结构
 */
export const toolList = [
  {
    id: 1,
    name: "社区动态",
    icon: "#4CAF50", // 纯绿色
    iconText: "community",
    url: "/pages/community/index",
  },
  {
    id: 2,
    name: "计划打卡",
    icon: "#2196F3", // 纯蓝色
    iconText: "calendar",
    url: "/pages/plan/index",
  },
  {
    id: 3,
    name: "专注模式",
    icon: "#FF5722", // 纯橙色
    iconText: "focus",
    url: "/pages/focus/index",
  },
  {
    id: 4,
    name: "快递代拿",
    icon: "#9C27B0", // 纯紫色
    iconText: "express",
    url: "/pages/service/express",
  },
  {
    id: 5,
    name: "学习资源",
    icon: "#3F51B5", // 靛蓝色
    iconText: "study",
    url: "/pages/resource/index",
  },
];

/**
 * 社区动态数据
 * @type {Array.<Object>}
 * @see {@link /openapi/home.yaml#components.schemas.CommunityPost} CommunityPost数据结构
 */
export const communityPosts = [
  {
    id: 1,
    title: "如何高效准备期末考试？",
    cover: "/static/images/recommend1.png",
    type: "article",
    views: 1200,
    likes: 230,
    createTime: Date.now() - 86400000 * 2,
  },
  {
    id: 2,
    title: "校园歌手大赛报名开始啦！",
    cover: "/static/images/recommend2.png",
    type: "activity",
    views: 980,
    likes: 156,
    createTime: Date.now() - 86400000 * 1,
  },
  {
    id: 3,
    title: "实习经验分享：我在字节跳动的日子",
    cover: "/static/images/recommend3.png",
    type: "experience",
    views: 1560,
    likes: 320,
    createTime: Date.now() - 86400000 * 3,
  },
  {
    id: 4,
    title: "考研备考攻略：如何合理规划时间",
    cover: "/static/images/recommend4.png",
    type: "article",
    views: 2100,
    likes: 450,
    createTime: Date.now() - 86400000 * 4,
  },
  {
    id: 5,
    title: "校园美食推荐：隐藏在角落的美味",
    cover: "/static/images/recommend5.png",
    type: "life",
    views: 1800,
    likes: 380,
    createTime: Date.now() - 86400000 * 5,
  },
];

/**
 * 校园活动数据
 * @type {Array.<Object>}
 * @see {@link /openapi/home.yaml#components.schemas.Activity} Activity数据结构
 */
export const activities = [
  {
    id: 1,
    title: "创新创业大赛",
    cover:
      "https://images.unsplash.com/photo-1491438590914-bc09fcaaf77a?q=80&w=800&auto=format&fit=crop",
    location: "大学生活动中心",
    startTime: Date.now() + 86400000 * 5,
    endTime: Date.now() + 86400000 * 5 + 3600000 * 3,
    status: "upcoming",
    description: "邀请知名企业家和投资人，为优秀创业项目提供资金和孵化支持",
    organizer: "创新创业学院",
    participants: 320,
    maxParticipants: 500,
  },
  {
    id: 2,
    title: "校园文化节",
    cover:
      "https://images.unsplash.com/photo-1472653525502-fc569e405a74?q=80&w=800&auto=format&fit=crop",
    location: "校园广场",
    startTime: Date.now() + 86400000 * 2,
    endTime: Date.now() + 86400000 * 4,
    status: "upcoming",
    description: "展示各民族文化、校园文化和社团风采的大型活动",
    organizer: "校团委",
    participants: 560,
    maxParticipants: 1000,
  },
  {
    id: 3,
    title: "就业指导讲座",
    cover:
      "https://images.unsplash.com/photo-1558403194-611308249627?q=80&w=800&auto=format&fit=crop",
    location: "图书馆报告厅",
    startTime: Date.now() + 86400000 * 1,
    endTime: Date.now() + 86400000 * 1 + 3600000 * 2,
    status: "upcoming",
    description: "知名企业HR分享求职技巧和行业发展趋势",
    organizer: "就业指导中心",
    participants: 178,
    maxParticipants: 200,
  },
  {
    id: 4,
    title: "校园马拉松",
    cover:
      "https://images.unsplash.com/photo-1520645521318-f03a712f0e67?q=80&w=800&auto=format&fit=crop",
    location: "校园环道",
    startTime: Date.now() + 86400000 * 10,
    endTime: Date.now() + 86400000 * 10 + 3600000 * 5,
    status: "upcoming",
    description: "倡导健康生活方式，提高校园体育文化氛围",
    organizer: "体育学院",
    participants: 420,
    maxParticipants: 600,
  },
  {
    id: 5,
    title: "社团招新活动",
    cover:
      "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?q=80&w=800&auto=format&fit=crop",
    location: "学生活动中心",
    startTime: Date.now() + 86400000 * 7,
    endTime: Date.now() + 86400000 * 8,
    status: "upcoming",
    description: "百团争锋，各社团展示特色活动和成果，招募新会员",
    organizer: "学生会社团部",
    participants: 780,
    maxParticipants: 1000,
  },
];
