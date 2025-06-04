// 主页模块
import {
  getBanners,
  getModules,
  getCommunityPosts,
  getActivities,
  getServiceList,
  getClubList,
  getToolList,
} from "@/api/home";

const state = {
  banners: [],
  modules: [],
  communityPosts: {
    list: [],
    total: 0,
    page: 1,
    size: 5,
    loading: false,
  },
  // 服务列表
  serviceList: [],
  // 社团活动列表
  clubList: [],
  // 工具列表
  toolList: [],
  activities: {
    list: [],
    total: 0,
    page: 1,
    size: 5,
    loading: false,
  },
  loading: {
    banners: false,
    modules: false,
  },
};

const getters = {
  // 获取轮播图数据
  getBanners: (state) => state.banners,
  // 获取功能模块数据
  getModules: (state) => state.modules,
  // 获取服务列表
  getServiceList: (state) => state.serviceList,
  // 获取社团活动列表
  getClubList: (state) => state.clubList,
  // 获取工具列表
  getToolList: (state) => state.toolList,
  // 获取社区动态数据
  getCommunityPosts: (state) => state.communityPosts.list,
  // 获取社区动态分页信息
  getCommunityPostsPage: (state) => ({
    total: state.communityPosts.total,
    page: state.communityPosts.page,
    size: state.communityPosts.size,
  }),
  // 获取校园活动数据
  getActivities: (state) => state.activities.list,
  // 获取校园活动分页信息
  getActivitiesPage: (state) => ({
    total: state.activities.total,
    page: state.activities.page,
    size: state.activities.size,
  }),
  // 获取加载状态
  getLoadingStatus: (state) => state.loading,
  // 社区动态加载状态
  getCommunityPostsLoading: (state) => state.communityPosts.loading,
  // 校园活动加载状态
  getActivitiesLoading: (state) => state.activities.loading,
};

const mutations = {
  // 设置轮播图数据
  SET_BANNERS(state, banners) {
    state.banners = banners;
  },

  // 设置功能模块数据
  SET_MODULES(state, modules) {
    state.modules = modules;
  },

  // 设置社区动态数据
  SET_COMMUNITY_POSTS(state, { list, total, page, size }) {
    state.communityPosts.list = list;
    state.communityPosts.total = total;
    state.communityPosts.page = page;
    state.communityPosts.size = size;
  },

  // 设置校园活动数据
  SET_ACTIVITIES(state, { list, total, page, size }) {
    state.activities.list = list;
    state.activities.total = total;
    state.activities.page = page;
    state.activities.size = size;
  },

  // 设置轮播图加载状态
  SET_BANNERS_LOADING(state, status) {
    state.loading.banners = status;
  },

  // 设置功能模块加载状态
  SET_MODULES_LOADING(state, status) {
    state.loading.modules = status;
  },

  // 设置社区动态加载状态
  SET_COMMUNITY_POSTS_LOADING(state, status) {
    state.communityPosts.loading = status;
  },

  // 设置校园活动加载状态
  SET_ACTIVITIES_LOADING(state, status) {
    state.activities.loading = status;
  },

  // 设置服务列表
  SET_SERVICE_LIST(state, serviceList) {
    state.serviceList = serviceList;
  },

  // 设置社团活动列表
  SET_CLUB_LIST(state, clubList) {
    state.clubList = clubList;
  },

  // 设置工具列表
  SET_TOOL_LIST(state, toolList) {
    state.toolList = toolList;
  },
};

const actions = {
  // 获取主页所有数据
  async getHomeData({ dispatch }) {
    try {
      await Promise.all([
        dispatch("fetchBanners"),
        dispatch("fetchModules"),
        dispatch("fetchCommunityPosts"),
        dispatch("fetchActivities"),
        dispatch("fetchServiceList"),
        dispatch("fetchClubList"),
        dispatch("fetchToolList"),
      ]);
      return Promise.resolve();
    } catch (error) {
      return Promise.reject(error);
    }
  },

  // 获取轮播图数据
  async fetchBanners({ commit }) {
    try {
      commit("SET_BANNERS_LOADING", true);
      const res = await getBanners();
      if (res.code === 200) {
        commit("SET_BANNERS", res.data);
        return Promise.resolve(res.data);
      } else {
        return Promise.reject(res.message || "获取轮播图失败");
      }
    } catch (error) {
      return Promise.reject(error);
    } finally {
      commit("SET_BANNERS_LOADING", false);
    }
  },

  // 获取功能模块数据
  async fetchModules({ commit }) {
    try {
      commit("SET_MODULES_LOADING", true);
      const res = await getModules();
      if (res.code === 200) {
        commit("SET_MODULES", res.data);
        return Promise.resolve(res.data);
      } else {
        return Promise.reject(res.message || "获取功能模块失败");
      }
    } catch (error) {
      return Promise.reject(error);
    } finally {
      commit("SET_MODULES_LOADING", false);
    }
  },

  // 获取社区动态数据
  async fetchCommunityPosts({ commit, state }, params = {}) {
    try {
      commit("SET_COMMUNITY_POSTS_LOADING", true);
      const page = params.page || state.communityPosts.page;
      const size = params.size || state.communityPosts.size;

      const res = await getCommunityPosts({ page, size });
      if (res.code === 200) {
        commit("SET_COMMUNITY_POSTS", {
          list: res.data.list,
          total: res.data.total,
          page: res.data.page,
          size: res.data.size,
        });
        return Promise.resolve(res.data);
      } else {
        return Promise.reject(res.message || "获取社区动态失败");
      }
    } catch (error) {
      return Promise.reject(error);
    } finally {
      commit("SET_COMMUNITY_POSTS_LOADING", false);
    }
  },

  // 获取校园活动数据
  async fetchActivities({ commit, state }, params = {}) {
    try {
      commit("SET_ACTIVITIES_LOADING", true);
      const page = params.page || state.activities.page;
      const size = params.size || state.activities.size;

      const res = await getActivities({ page, size });
      if (res.code === 200) {
        commit("SET_ACTIVITIES", {
          list: res.data.list,
          total: res.data.total,
          page: res.data.page,
          size: res.data.size,
        });
        return Promise.resolve(res.data);
      } else {
        return Promise.reject(res.message || "获取校园活动失败");
      }
    } catch (error) {
      return Promise.reject(error);
    } finally {
      commit("SET_ACTIVITIES_LOADING", false);
    }
  },

  // 加载更多社区动态
  async loadMoreCommunityPosts({ dispatch, state }) {
    if (state.communityPosts.list.length >= state.communityPosts.total) {
      return Promise.resolve({ hasMore: false });
    }

    const nextPage = state.communityPosts.page + 1;
    await dispatch("fetchCommunityPosts", { page: nextPage });

    return Promise.resolve({
      hasMore: state.communityPosts.list.length < state.communityPosts.total,
    });
  },

  // 加载更多校园活动
  async loadMoreActivities({ dispatch, state }) {
    if (state.activities.list.length >= state.activities.total) {
      return Promise.resolve({ hasMore: false });
    }

    const nextPage = state.activities.page + 1;
    await dispatch("fetchActivities", { page: nextPage });

    return Promise.resolve({
      hasMore: state.activities.list.length < state.activities.total,
    });
  },

  // 获取服务列表数据
  async fetchServiceList({ commit }) {
    try {
      const res = await getServiceList();
      if (res.code === 200) {
        commit("SET_SERVICE_LIST", res.data);
        return Promise.resolve(res.data);
      } else {
        return Promise.reject(res.message || "获取服务列表失败");
      }
    } catch (error) {
      return Promise.reject(error);
    }
  },

  // 获取社团活动列表数据
  async fetchClubList({ commit }) {
    try {
      const res = await getClubList();
      if (res.code === 200) {
        commit("SET_CLUB_LIST", res.data);
        return Promise.resolve(res.data);
      } else {
        return Promise.reject(res.message || "获取社团活动失败");
      }
    } catch (error) {
      return Promise.reject(error);
    }
  },

  // 获取工具列表数据
  async fetchToolList({ commit }) {
    try {
      const res = await getToolList();
      if (res.code === 200) {
        commit("SET_TOOL_LIST", res.data);
        return Promise.resolve(res.data);
      } else {
        return Promise.reject(res.message || "获取工具列表失败");
      }
    } catch (error) {
      return Promise.reject(error);
    }
  },
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
};
