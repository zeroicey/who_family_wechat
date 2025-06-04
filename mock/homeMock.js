/**
 * 主页模块Mock函数
 * @module mock/homeMock
 * @author 互成一家团队
 * @description 主页相关的模拟API实现
 */
import { mockApiCall, mockPagination } from './utils';
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
} from './home';

/**
 * Mock: 获取轮播图数据
 * @async
 * @function mockGetBanners
 * @returns {Promise<Object>} 返回轮播图数据
 */
export const mockGetBanners = async () => {
  return mockApiCall(banners);
};

/**
 * Mock: 获取功能模块数据
 * @async
 * @function mockGetModules
 * @returns {Promise<Object>} 返回功能模块数据
 */
export const mockGetModules = async () => {
  return mockApiCall(modules);
};

/**
 * Mock: 获取社区动态数据
 * @async
 * @function mockGetCommunityPosts
 * @param {Object} params - 查询参数
 * @param {Number} [params.page=1] - 页码
 * @param {Number} [params.size=5] - 每页条数
 * @returns {Promise<Object>} 返回社区动态数据以及分页信息
 */
export const mockGetCommunityPosts = async (params = { page: 1, size: 5 }) => {
  const { page, size } = params;
  const paginatedData = mockPagination(communityPosts, page, size);
  return mockApiCall(paginatedData);
};

/**
 * Mock: 获取校园活动数据
 * @async
 * @function mockGetActivities
 * @param {Object} params - 查询参数
 * @param {Number} [params.page=1] - 页码
 * @param {Number} [params.size=5] - 每页条数
 * @returns {Promise<Object>} 返回校园活动数据以及分页信息
 */
export const mockGetActivities = async (params = { page: 1, size: 5 }) => {
  const { page, size } = params;
  const paginatedData = mockPagination(activities, page, size);
  return mockApiCall(paginatedData);
};

/**
 * Mock: 获取待办事项数据
 * @async
 * @function mockGetTodoData
 * @returns {Promise<Object>} 返回待办事项数据
 */
export const mockGetTodoData = async () => {
  return mockApiCall(todoData);
};

/**
 * Mock: 获取打卡数据
 * @async
 * @function mockGetCheckinData
 * @returns {Promise<Object>} 返回打卡数据
 */
export const mockGetCheckinData = async () => {
  return mockApiCall(checkinData);
};

/**
 * Mock: 获取专注数据
 * @async
 * @function mockGetFocusData
 * @returns {Promise<Object>} 返回专注数据
 */
export const mockGetFocusData = async () => {
  return mockApiCall(focusData);
};

/**
 * Mock: 获取通知列表
 * @async
 * @function mockGetNoticeList
 * @returns {Promise<Object>} 返回通知列表数据
 */
export const mockGetNoticeList = async () => {
  return mockApiCall(noticeList);
};

/**
 * Mock: 获取社团活动列表
 * @async
 * @function mockGetClubList
 * @returns {Promise<Object>} 返回社团活动列表数据
 */
export const mockGetClubList = async () => {
  return mockApiCall(clubList);
};

/**
 * Mock: 获取工具列表
 * @async
 * @function mockGetToolList
 * @returns {Promise<Object>} 返回工具列表数据
 */
export const mockGetToolList = async () => {
  return mockApiCall(toolList);
};

/**
 * Mock: 获取服务列表
 * @async
 * @function mockGetServiceList
 * @returns {Promise<Object>} 返回服务列表数据
 */
export const mockGetServiceList = async () => {
  return mockApiCall(serviceList);
};
