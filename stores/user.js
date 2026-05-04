import { defineStore } from "pinia";
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

export const useUserStore = defineStore("user", {
  state: () => ({
    posts: [],
    userInfo: uni.getStorageSync("userInfo") || {},
    avatarUrl: uni.getStorageSync("avatarUrl") || "",
    token: uni.getStorageSync("token") || "",
    isLogin: !!uni.getStorageSync("token"),
    loginLoading: false,
  }),

  getters: {
    get_user_info: (state) => state.userInfo,
    is_logged_in: (state) => state.isLogin,
    login_loading: (state) => state.loginLoading,
    is_login: (state) => state.isLogin,
    get_user_avatar_url: (state) => state.avatarUrl,
    get_posts: (state) => state.posts,
  },

  actions: {
    set_posts(posts) {
      this.posts = posts;
    },

    add_posts(posts) {
      this.posts = [...this.posts, ...posts];
    },

    delete_post_local(postId) {
      this.posts = this.posts.filter((post) => post.id !== postId);
    },

    set_user_info(userInfo) {
      this.userInfo = userInfo;
      uni.setStorageSync("userInfo", userInfo);
    },

    set_user_avatar(avatarUrl) {
      this.avatarUrl = avatarUrl;
      uni.setStorageSync("avatarUrl", avatarUrl);
    },

    set_token(token) {
      this.token = token;
      this.isLogin = !!token;
      uni.setStorageSync("token", token);
    },

    logout() {
      this.userInfo = {};
      this.token = "";
      this.isLogin = false;
      uni.removeStorageSync("userInfo");
      uni.removeStorageSync("token");
    },

    set_login_loading(loading) {
      this.loginLoading = loading;
    },

    like_post_local(postId) {
      const post = this.posts.find((item) => item.id === postId);
      if (post) {
        post.likeCount++;
        post.isLike = 1;
      }
    },

    unlike_post_local(postId) {
      const post = this.posts.find((item) => item.id === postId);
      if (post) {
        post.likeCount--;
        post.isLike = 0;
      }
    },

    async wechat_login() {
      try {
        console.log("[用户模块] 开始微信登录");
        this.set_login_loading(true);

        const loginRes = await wechatLogin();
        const { token, userInfo } = loginRes.data;
        this.set_token(token);
        this.set_user_info(userInfo);

        const avatarRes = await getAvatarUrl(userInfo.avaterId, userInfo.name);
        this.set_user_avatar(avatarRes.data.data);

        console.log("[用户模块] 微信登录成功");
      } catch (error) {
        console.error("[用户模块] 微信登录异常", error);
        return Promise.reject(error);
      } finally {
        this.set_login_loading(false);
      }
    },

    async update_user_info(userInfo) {
      try {
        console.log("[用户模块] 更新用户信息");

        const res = await updateUserInfo(userInfo);
        if (res.code !== 200) {
          console.error("[用户模块] 更新用户信息失败", res);
          return Promise.reject(res);
        }

        this.set_user_info(userInfo);
        console.log("[用户模块] 更新用户信息成功");
      } catch (error) {
        console.error("[用户模块] 更新用户信息异常", error);
        return Promise.reject(error);
      }
    },

    async update_user_avatar(avatarBase64) {
      try {
        console.log("[用户模块] 更新用户头像");

        const res = await updateUserAvatar(avatarBase64);
        if (res.code !== 200) {
          console.error("[用户模块] 更新用户头像失败", res);
          return Promise.reject(res);
        }

        const avatarUrl = await getAvatarUrl(res.data.avatarId);
        this.set_user_info({
          ...this.userInfo,
          avaterId: res.data.avatarId,
        });
        this.set_user_avatar(avatarUrl.data.data);

        console.log("[用户模块] 更新用户头像成功");
      } catch (error) {
        console.error("[用户模块] 更新用户头像异常", error);
        return Promise.reject(error);
      }
    },

    async fetch_first_posts() {
      try {
        console.log("[我的模块] 开始获取帖子");
        const postsRes = await fetchPosts();
        this.set_posts(postsRes.data);
        console.log("[我的模块] 获取帖子成功");
      } catch (error) {
        console.error("[我的模块] 获取帖子失败", error);
        return Promise.reject(error);
      }
    },

    async fetch_more_posts() {
      try {
        console.log("[我的模块] 开始获取更多帖子");
        if (this.posts.length > 0) {
          const postsRes = await fetchMorePosts(
            this.posts[this.posts.length - 1].id
          );
          this.add_posts(postsRes.data);
        }
        console.log("[我的模块] 获取更多帖子成功");
      } catch (error) {
        console.error("[我的模块] 获取更多帖子失败", error);
        return Promise.reject(error);
      }
    },

    async delete_post(postId) {
      try {
        console.log("[社区模块] 开始删除帖子");
        this.delete_post_local(postId);
        await deletePost(postId);
        console.log("[社区模块] 删除帖子成功");
      } catch (error) {
        console.error("[社区模块] 删除帖子失败", error);
        return Promise.reject(error);
      }
    },

    async like_post(postId) {
      try {
        console.log("[社区模块] 开始点赞帖子");
        await likePost(postId);
        this.like_post_local(postId);
        console.log("[社区模块] 点赞帖子成功");
      } catch (error) {
        console.error("[社区模块] 点赞帖子失败", error);
        return Promise.reject(error);
      }
    },

    async unlike_post(postId) {
      try {
        console.log("[社区模块] 开始取消点赞帖子");
        await unlikePost(postId);
        this.unlike_post_local(postId);
        console.log("[社区模块] 取消点赞帖子成功");
      } catch (error) {
        console.error("[社区模块] 取消点赞帖子失败", error);
        return Promise.reject(error);
      }
    },
  },
});

export default useUserStore;
