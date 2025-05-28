import { fetchPosts } from "../../api/community";

const state = {
  posts: [],
  postsLoading: false,
};

const getters = {
  getPosts: (state) => state.posts,
  getPostsLoading: (state) => state.postsLoading,
};

const mutations = {
  set_posts(state, posts) {
    state.posts = posts;
  },

  add_posts(state, posts) {
    state.posts = [...state.posts, ...posts];
  },

  set_posts_loading(state, loading) {
    state.postsLoading = loading;
  },
};

const actions = {
  async get_first_posts({ commit }) {
    try {
      console.log("[社区模块] 开始获取帖子");
      commit("set_posts_loading", true);

      // 调用API获取帖子列表
      const postsRes = await fetchPosts();

      commit("set_posts", postsRes.data);

      // console.log("[社区模块] 获取帖子成功", postsRes.data);
      console.log("[社区模块] 获取帖子成功");
    } catch (error) {
      console.error("[社区模块] 获取帖子失败", error);
      return Promise.reject(error);
    } finally {
      commit("set_posts_loading", false);
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
