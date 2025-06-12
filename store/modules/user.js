import {
  wechatLogin,
  getAvatarUrl,
  updateUserInfo,
  updateUserAvatar,
  fetchPosts,
  fetchMorePosts,
  deletePost,
} from "@/api/user";

import { likePost, unlikePost } from "@/api/community";

const state = {
  posts: [],
  userInfo: uni.getStorageSync("userInfo") || {},
  avatarUrl: uni.getStorageSync("avatarUrl") || "",
  token: uni.getStorageSync("token") || "",
  isLogin: !!uni.getStorageSync("token"),
  loginLoading: false,
};

const getters = {
  // 获取用户信息
  get_user_info: (state) => state.userInfo,
  // 判断用户是否登录
  is_logged_in: (state) => state.isLogin,
  // 登录加载状态
  login_loading: (state) => state.loginLoading,
  // 获取是否登录
  is_login: (state) => state.isLogin,
  // 获取头像
  get_user_avatar_url: (state) => state.avatarUrl,

  get_posts: (state) => state.posts,

  add_posts(state, posts) {
    state.posts = [...state.posts, ...posts];
  },
};

const mutations = {
  set_posts(state, posts) {
    state.posts = posts;
  },

  add_posts(state, posts) {
    state.posts = [...state.posts, ...posts];
  },

  delete_post(state, postId) {
    state.posts = state.posts.filter((post) => post.id !== postId);
  },
  // 设置用户信息
  set_user_info(state, userInfo) {
    state.userInfo = userInfo;
    uni.setStorageSync("userInfo", userInfo);
  },

  // 设置用户头像
  set_user_avatar(state, avatarUrl) {
    state.avatarUrl = avatarUrl;
    uni.setStorageSync("avatarUrl", avatarUrl);
  },

  // 设置token
  set_token(state, token) {
    state.token = token;
    state.isLogin = !!token;
    uni.setStorageSync("token", token);
  },

  // 退出登录
  logout(state) {
    state.userInfo = {};
    state.token = "";
    state.isLogin = false;
    uni.removeStorageSync("userInfo");
    uni.removeStorageSync("token");
  },

  // 设置登录加载状态
  set_login_loading(state, loading) {
    state.loginLoading = loading;
  },

  like_post(state, postId) {
    const post = state.posts.find((post) => post.id === postId);
    if (post) {
      post.likeCount++;
      post.isLike = 1;
    }
  },

  unlike_post(state, postId) {
    const post = state.posts.find((post) => post.id === postId);
    if (post) {
      post.likeCount--;
      post.isLike = 0;
    }
  },
};

const actions = {
  // 微信登录
  async wechat_login({ commit }) {
    try {
      console.log("[用户模块] 开始微信登录");
      commit("set_login_loading", true);

      // 调用API登录接口
      const loginRes = await wechatLogin();
      const { token, userInfo } = loginRes.data;
      commit("set_token", token);
      commit("set_user_info", userInfo);

      const avatarRes = await getAvatarUrl(userInfo.avaterId, userInfo.name);
      commit("set_user_avatar", avatarRes.data.data);

      console.log("[用户模块] 微信登录成功");
    } catch (error) {
      console.error("[用户模块] 微信登录异常", error);
      return Promise.reject(error);
    } finally {
      commit("set_login_loading", false);
    }
  },

  async update_user_info({ commit }, userInfo) {
    try {
      console.log("[用户模块] 更新用户信息");

      const res = await updateUserInfo(userInfo);

      if (res.code !== 200) {
        console.error("[用户模块] 更新用户信息失败", res);
        return Promise.reject(res);
      }
      commit("set_user_info", userInfo);

      console.log("[用户模块] 更新用户信息成功");
    } catch (error) {
      console.error("[用户模块] 更新用户信息异常", error);
      return Promise.reject(error);
    }
  },

  async update_user_avatar({ commit }, avatarBase64) {
    try {
      console.log("[用户模块] 更新用户头像");

      const res = await updateUserAvatar(avatarBase64);

      if (res.code !== 200) {
        console.error("[用户模块] 更新用户头像失败", res);
        return Promise.reject(res);
      }

      const avatarUrl = await getAvatarUrl(res.data.avatarId);

      commit("set_user_info", {
        ...state.userInfo,
        avaterId: res.data.avatarId,
      });
      commit("set_user_avatar", avatarUrl.data.data);

      console.log("[用户模块] 更新用户头像成功");
    } catch (error) {
      console.error("[用户模块] 更新用户头像异常", error);
      return Promise.reject(error);
    }
  },
  async fetch_first_posts({ commit }) {
    try {
      console.log("[我的模块] 开始获取帖子");

      // 调用API获取帖子列表
      const postsRes = await fetchPosts();

      commit("set_posts", postsRes.data);

      // console.log("[社区模块] 获取帖子成功", postsRes.data);
      console.log("[我的模块] 获取帖子成功");
    } catch (error) {
      console.error("[我的模块] 获取帖子失败", error);
      return Promise.reject(error);
    }
  },

  async fetch_more_posts({ commit, state }) {
    try {
      console.log("[我的模块] 开始获取更多帖子");

      // 调用API获取帖子列表
      if (state.posts.length > 0) {
        const postsRes = await fetchMorePosts(
          state.posts[state.posts.length - 1].id
        );
        commit("add_posts", postsRes.data);
      }

      // console.log("[社区模块] 获取帖子成功", postsRes.data);
      console.log("[我的模块] 获取更多帖子成功");
    } catch (error) {
      console.error("[我的模块] 获取更多帖子失败", error);
      return Promise.reject(error);
    }
  },

  async delete_post({ commit }, postId) {
    try {
      console.log("[社区模块] 开始删除帖子");
      // 调用API删除帖子
      commit("delete_post", postId);
      await deletePost(postId);

      console.log("[社区模块] 删除帖子成功");
    } catch (error) {
      console.error("[社区模块] 删除帖子失败", error);
      return Promise.reject(error);
    }
  },

  async like_post({ commit }, postId) {
    try {
      console.log("[社区模块] 开始点赞帖子");
      // 调用API点赞帖子
      await likePost(postId);

      commit("like_post", postId);

      console.log("[社区模块] 点赞帖子成功");
    } catch (error) {
      console.error("[社区模块] 点赞帖子失败", error);
      return Promise.reject(error);
    }
  },
  async unlike_post({ commit }, postId) {
    try {
      console.log("[社区模块] 开始取消点赞帖子");
      // 调用API取消点赞帖子
      await unlikePost(postId);

      commit("unlike_post", postId);

      console.log("[社区模块] 取消点赞帖子成功");
    } catch (error) {
      console.error("[社区模块] 取消点赞帖子失败", error);
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
