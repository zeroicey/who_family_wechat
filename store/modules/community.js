import {
  fetchMorePosts,
  fetchPosts,
  fetchPostById,
  fetchFirstCommentsByPostId,
} from "../../api/community";

const state = {
  posts: [],
  postsLoading: false,
};

const getters = {
  get_posts: (state) => state.posts,
  get_posts_loading: (state) => state.postsLoading,
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
  async fetch_first_posts({ commit }) {
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

  async fetch_more_posts({ commit, state }) {
    try {
      console.log("[社区模块] 开始获取更多帖子");
      commit("set_posts_loading", true);

      // 调用API获取帖子列表
      if (state.posts.length > 0) {
        const postsRes = await fetchMorePosts(
          state.posts[state.posts.length - 1].id
        );
        commit("add_posts", postsRes.data);
      }

      // console.log("[社区模块] 获取帖子成功", postsRes.data);
      console.log("[社区模块] 获取更多帖子成功");
    } catch (error) {
      console.error("[社区模块] 获取更多帖子失败", error);
      return Promise.reject(error);
    } finally {
      commit("set_posts_loading", false);
    }
  },

  async fetch_post_by_id({ commit }, postId) {
    try {
      console.log("[社区模块] 开始获取帖子详情");
      // 调用API获取帖子详情
      const postRes = await fetchPostById(postId);

      console.log("[社区模块] 获取帖子详情成功", postRes.data);
      console.log("[社区模块] 获取帖子详情成功");
      return postRes.data;
    } catch (error) {
      console.error("[社区模块] 获取帖子详情失败", error);
      return Promise.reject(error);
    }
  },

  async fetch_first_comments_by_post_id({ commit }, postId) {
    try {
      console.log("[社区模块] 开始获取帖子评论");
      // 调用API获取帖子评论
      const commentsRes = await fetchFirstCommentsByPostId(postId);

      console.log("[社区模块] 获取帖子评论成功", commentsRes.data);
      console.log("[社区模块] 获取帖子评论成功");
      return commentsRes.data;
    } catch (error) {
      console.error("[社区模块] 获取帖子评论失败", error);
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
