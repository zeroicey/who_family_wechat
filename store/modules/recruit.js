import {
  fetchRecruits,
  fetchMoreRecruits,
  fetchRecruitById,
  fetchRecruitTypes,
  collectRecruit,
  uncollectRecruit,
} from "@/api/recruit.js";

const state = {
  recruits: [],
  recruitTypes: [],
  recruitClasses: [],
};

const getters = {
  get_recruits: (state) => state.recruits,
  get_recruit_types: (state) => state.recruitTypes,
  get_recruit_classes: (state) => state.recruitClasses,
};

const mutations = {
  set_recruits(state, recruits) {
    state.recruits = recruits;
  },

  add_recruits(state, recruits) {
    state.recruits = state.recruits.concat(recruits);
  },

  set_recruit_types(state, recruitTypes) {
    state.recruitTypes = recruitTypes;
    state.recruitClasses = [
      {
        id: -1,
        name: "所有",
      },
      {
        id: -2,
        name: "已收藏",
      },
      ...recruitTypes,
    ];
  },

  collect_recruit(state, recruitId) {
    const recruit = state.recruits.find((recruit) => recruit.id === recruitId);
    recruit.isCollected = true;
  },
  uncollect_recruit(state, recruitId) {
    const recruit = state.recruits.find((recruit) => recruit.id === recruitId);
    recruit.isCollected = false;
  },
};

const actions = {
  async fetch_first_recruits({ commit }) {
    try {
      console.log("[招聘模块] 开始获取招聘");

      // 调用API获取招聘列表
      const recruitsRes = await fetchRecruits();

      commit("set_recruits", recruitsRes.data);

      console.log("[招聘模块] 获取招聘成功", recruitsRes.data);
      console.log("[招聘模块] 获取招聘成功");
    } catch (error) {
      console.error("[招聘模块] 获取招聘失败", error);
      return Promise.reject(error);
    }
  },

  async fetch_more_recruits({ commit, state }) {
    try {
      console.log("[招聘模块] 开始获取更多招聘");

      // 调用API获取招聘列表
      if (state.recruits.length > 0) {
        const recruitsRes = await fetchMoreRecruits(
          state.recruits[state.recruits.length - 1].id
        );
        commit("add_recruits", recruitsRes.data);
      }
      // console.log("[招聘模块] 获取招聘成功", recruitsRes.data);
      console.log("[招聘模块] 获取更多招聘成功");
    } catch (error) {
      console.error("[招聘模块] 获取更多招聘失败", error);
      return Promise.reject(error);
    }
  },

  async fetch_recruit_by_id({ commit }, recruitId) {
    try {
      console.log("[招聘模块] 开始获取招聘详情");

      // 调用API获取招聘详情
      const recruitRes = await fetchRecruitById(recruitId);

      // console.log("[招聘模块] 获取招聘详情成功", recruitRes.data);
      console.log("[招聘模块] 获取招聘详情成功");
      return recruitRes.data;
    } catch (error) {
      console.error("[招聘模块] 获取招聘详情失败", error);
      return Promise.reject(error);
    }
  },

  async fetch_recruit_types({ commit }) {
    try {
      console.log("[招聘模块] 开始获取招聘类型");

      // 调用API获取招聘类型
      const recruitTypesRes = await fetchRecruitTypes();

      commit("set_recruit_types", recruitTypesRes.data);

      // console.log("[招聘模块] 获取招聘类型成功", recruitTypesRes.data);
      console.log("[招聘模块] 获取招聘类型成功");
    } catch (error) {
      console.error("[招聘模块] 获取招聘类型失败", error);
      return Promise.reject(error);
    }
  },

  async collect_recruit({ commit }, recruitId) {
    try {
      console.log("[招聘模块] 开始收藏招聘");

      // 调用API收藏招聘
      await collectRecruit(recruitId);

      commit("collect_recruit", recruitId);

      // console.log("[招聘模块] 收藏招聘成功");
      console.log("[招聘模块] 收藏招聘成功");
    } catch (error) {
      console.error("[招聘模块] 收藏招聘失败", error);
      return Promise.reject(error);
    }
  },

  async uncollect_recruit({ commit }, recruitId) {
    try {
      console.log("[招聘模块] 开始取消收藏招聘");

      // 调用API取消收藏招聘
      await uncollectRecruit(recruitId);

      commit("uncollect_recruit", recruitId);

      // console.log("[招聘模块] 取消收藏招聘成功");
      console.log("[招聘模块] 取消收藏招聘成功");
    } catch (error) {
      console.error("[招聘模块] 取消收藏招聘失败", error);
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
