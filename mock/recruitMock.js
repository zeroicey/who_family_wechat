/**
 * 招聘模块模拟API接口
 * @module mock/recruitMock
 * @author 互成一家团队
 * @description 招聘模块相关接口的模拟实现
 */

import { recruitList, recruitTypes, userApplications, userFavorites } from './recruit';
import { mockSuccess, mockError } from './utils';

/**
 * 获取招聘岗位列表
 * @function getRecruitList
 * @description 模拟获取招聘岗位列表API
 * @param {Object} params - 查询参数
 * @param {Number} [params.page=1] - 页码
 * @param {Number} [params.size=10] - 每页条数
 * @param {Number} [params.type] - 岗位类型ID
 * @param {String} [params.keyword] - 搜索关键词
 * @param {String} [params.sort] - 排序方式
 * @returns {Promise} Promise对象
 */
export const getRecruitList = (params = {}) => {
  const { page = 1, size = 10, type, keyword, sort } = params;
  
  // 筛选数据
  let result = [...recruitList];
  
  // 按类型筛选
  if (type) {
    result = result.filter(item => item.type === Number(type));
  }
  
  // 按关键词搜索
  if (keyword) {
    const lowerKeyword = keyword.toLowerCase();
    result = result.filter(item => 
      item.title.toLowerCase().includes(lowerKeyword) || 
      item.organization.toLowerCase().includes(lowerKeyword) ||
      item.description.toLowerCase().includes(lowerKeyword)
    );
  }
  
  // 排序
  if (sort) {
    switch (sort) {
      case 'latest':
        result.sort((a, b) => b.createTime - a.createTime);
        break;
      case 'deadline':
        result.sort((a, b) => a.deadline - b.deadline);
        break;
      case 'popular':
        result.sort((a, b) => b.applied - a.applied);
        break;
      default:
        break;
    }
  }
  
  // 计算总数
  const total = result.length;
  
  // 分页
  const start = (page - 1) * size;
  const end = page * size;
  result = result.slice(start, end);
  
  return mockSuccess({
    total,
    list: result
  });
};

/**
 * 获取招聘岗位详情
 * @function getRecruitDetail
 * @description 模拟获取招聘岗位详情API
 * @param {Number} id - 岗位ID
 * @returns {Promise} Promise对象
 */
export const getRecruitDetail = (id) => {
  const recruit = recruitList.find(item => item.id === Number(id));
  
  if (recruit) {
    return mockSuccess(recruit);
  }
  
  return mockError('岗位不存在', 404);
};

/**
 * 获取用户投递记录
 * @function getUserApplications
 * @description 模拟获取用户投递记录API
 * @returns {Promise} Promise对象
 */
export const getUserApplications = () => {
  return mockSuccess({
    total: userApplications.length,
    list: userApplications
  });
};

/**
 * 获取用户收藏的岗位
 * @function getUserFavorites
 * @description 模拟获取用户收藏的岗位API
 * @returns {Promise} Promise对象
 */
export const getUserFavorites = () => {
  // 为收藏项添加岗位信息
  const favoriteList = userFavorites.map(fav => {
    const recruit = recruitList.find(item => item.id === fav.recruitId);
    return {
      ...fav,
      recruitInfo: recruit
    };
  });
  
  return mockSuccess({
    total: favoriteList.length,
    list: favoriteList
  });
};

/**
 * 投递简历
 * @function submitApplication
 * @description 模拟投递简历API
 * @param {Object} data - 简历数据
 * @returns {Promise} Promise对象
 */
export const submitApplication = (data) => {
  // 在实际应用中，这里会保存数据
  return mockSuccess(null, '投递成功');
};

/**
 * 收藏/取消收藏岗位
 * @function toggleFavorite
 * @description 模拟收藏/取消收藏岗位API
 * @param {Number} id - 岗位ID
 * @param {Boolean} isFavorite - 是否已收藏
 * @returns {Promise} Promise对象
 */
export const toggleFavorite = (id, isFavorite) => {
  // 在实际应用中，这里会更新数据
  return mockSuccess(null, isFavorite ? '取消收藏成功' : '收藏成功');
};
