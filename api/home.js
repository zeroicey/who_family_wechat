/**
 * 主页相关API接口
 * @module api/home
 * @author 互成一家团队
 * @description 主页模块相关接口请求函数
 */
import request from './request';
import { USE_MOCK } from './config';
import { 
  banners, 
  modules, 
  communityPosts, 
  activities, 
  todoData, 
  checkinData, 
  focusData, 
  noticeList, 
  clubList, 
  toolList, 
  serviceList 
} from '../mock/home';

/**
 * 获取轮播图数据
 * @function getBanners
 * @description 获取首页轮播图列表
 * @returns {Promise} 返回Promise对象，包含Banner数组
 * @see {@link /openapi/home.yaml#components.schemas.Banner} Banner数据结构
 */
export const getBanners = () => {
  if (USE_MOCK) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          code: 200,
          message: '获取成功',
          data: banners
        });
      }, 300);
    });
  }
  return request.get('/home/banners');
};

/**
 * 获取功能模块数据
 * @function getModules
 * @description 获取首页功能模块列表
 * @returns {Promise} 返回Promise对象，包含Module数组
 * @see {@link /openapi/home.yaml#components.schemas.Module} Module数据结构
 */
export const getModules = () => {
  if (USE_MOCK) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          code: 200,
          message: '获取成功',
          data: modules
        });
      }, 300);
    });
  }
  return request.get('/home/modules');
};

/**
 * 获取社区动态数据
 * @function getCommunityPosts
 * @description 获取社区动态列表，支持分页
 * @param {Object} params - 查询参数
 * @param {Number} [params.page=1] - 页码，默认为1
 * @param {Number} [params.size=5] - 每页条数，默认为5
 * @returns {Promise} 返回Promise对象，包含社区动态数据以及分页信息
 * @see {@link /openapi/home.yaml#components.schemas.CommunityPost} CommunityPost数据结构
 */
export const getCommunityPosts = (params = { page: 1, size: 5 }) => {
  if (USE_MOCK) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const { page, size } = params;
        const start = (page - 1) * size;
        const end = start + size;
        const data = communityPosts.slice(start, end);
        
        resolve({
          code: 200,
          message: '获取成功',
          data: {
            list: data,
            total: communityPosts.length,
            page,
            size
          }
        });
      }, 300);
    });
  }
  return request.get('/home/community', params);
};

/**
 * 获取校园活动数据
 * @function getActivities
 * @description 获取校园活动列表，支持分页
 * @param {Object} params - 查询参数
 * @param {Number} [params.page=1] - 页码，默认为1
 * @param {Number} [params.size=5] - 每页条数，默认为5
 * @returns {Promise} 返回Promise对象，包含校园活动数据以及分页信息
 * @see {@link /openapi/home.yaml#components.schemas.Activity} Activity数据结构
 */
export const getActivities = (params = { page: 1, size: 5 }) => {
  if (USE_MOCK) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const { page, size } = params;
        const start = (page - 1) * size;
        const end = start + size;
        const data = activities.slice(start, end);
        
        resolve({
          code: 200,
          message: '获取成功',
          data: {
            list: data,
            total: activities.length,
            page,
            size
          }
        });
      }, 300);
    });
  }
  return request.get('/home/activities', params);
};

/**
 * 获取待办事项数据
 * @function getTodoData
 * @description 获取用户待办事项数据
 * @returns {Promise} 返回Promise对象，包含TodoData数据
 * @see {@link /openapi/home.yaml#components.schemas.TodoData} TodoData数据结构
 */
export const getTodoData = () => {
  if (USE_MOCK) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          code: 200,
          message: '获取成功',
          data: todoData
        });
      }, 300);
    });
  }
  return request.get('/home/todo');
};

/**
 * 获取打卡数据
 * @function getCheckinData
 * @description 获取用户打卡数据
 * @returns {Promise} 返回Promise对象，包含CheckinData数据
 * @see {@link /openapi/home.yaml#components.schemas.CheckinData} CheckinData数据结构
 */
export const getCheckinData = () => {
  if (USE_MOCK) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          code: 200,
          message: '获取成功',
          data: checkinData
        });
      }, 300);
    });
  }
  return request.get('/home/checkin');
};

/**
 * 获取专注数据
 * @function getFocusData
 * @description 获取用户专注数据
 * @returns {Promise} 返回Promise对象，包含FocusData数据
 * @see {@link /openapi/home.yaml#components.schemas.FocusData} FocusData数据结构
 */
export const getFocusData = () => {
  if (USE_MOCK) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          code: 200,
          message: '获取成功',
          data: focusData
        });
      }, 300);
    });
  }
  return request.get('/home/focus');
};

/**
 * 获取通知列表
 * @function getNoticeList
 * @description 获取校园通知列表
 * @returns {Promise} 返回Promise对象，包含Notice数组
 * @see {@link /openapi/home.yaml#components.schemas.Notice} Notice数据结构
 */
export const getNoticeList = () => {
  if (USE_MOCK) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          code: 200,
          message: '获取成功',
          data: noticeList
        });
      }, 300);
    });
  }
  return request.get('/home/notices');
};

/**
 * 获取社团活动列表
 * @function getClubList
 * @description 获取社团活动列表
 * @returns {Promise} 返回Promise对象，包含ClubActivity数组
 * @see {@link /openapi/home.yaml#components.schemas.ClubActivity} ClubActivity数据结构
 */
export const getClubList = () => {
  if (USE_MOCK) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          code: 200,
          message: '获取成功',
          data: clubList
        });
      }, 300);
    });
  }
  return request.get('/home/clubs');
};

/**
 * 获取工具列表
 * @function getToolList
 * @description 获取热门工具列表
 * @returns {Promise} 返回Promise对象，包含ToolItem数组
 * @see {@link /openapi/home.yaml#components.schemas.ToolItem} ToolItem数据结构
 */
export const getToolList = () => {
  if (USE_MOCK) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          code: 200,
          message: '获取成功',
          data: toolList
        });
      }, 300);
    });
  }
  return request.get('/home/tools');
};

/**
 * 获取服务列表
 * @function getServiceList
 * @description 获取推荐服务列表
 * @returns {Promise} 返回Promise对象，包含ServiceItem数组
 * @see {@link /openapi/home.yaml#components.schemas.ServiceItem} ServiceItem数据结构
 */
export const getServiceList = () => {
  if (USE_MOCK) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          code: 200,
          message: '获取成功',
          data: serviceList
        });
      }, 300);
    });
  }
  return request.get('/home/services');
};
