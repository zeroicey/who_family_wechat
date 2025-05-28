import { wechatLogin, getAvatarUrl } from "../../api/user";

const state = {
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
};

const mutations = {
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

      console.log("[用户模块] 微信登录成功，获取用户信息", userInfo);

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
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
};
