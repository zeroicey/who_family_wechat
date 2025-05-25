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
  getUserInfo: (state) => state.userInfo,
  // 判断用户是否登录
  isLoggedIn: (state) => state.isLogin,
  // 获取用户头像
  getUserAvatar: (state) => (state.userInfo ? state.userInfo.avatar : ""),
  // 获取用户名称
  getUserName: (state) => (state.userInfo ? state.userInfo.name : ""),
  // 获取用户学校
  getUserSchool: (state) => (state.userInfo ? state.userInfo.school : ""),
  // 获取用户专业
  getUserMajor: (state) => (state.userInfo ? state.userInfo.major : ""),
  // 获取用户年级
  getUserGrade: (state) => (state.userInfo ? state.userInfo.grade : ""),
  // 登录加载状态
  loginLoading: (state) => state.loginLoading,

  // 获取是否登录
  isLogin: (state) => state.isLogin,

  // 获取头像
  getUserAvatarUrl: (state) => state.avatarUrl,
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
  async wechatLogin({ commit }) {
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
