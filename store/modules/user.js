import { wechatLogin } from "../../api/user";

const state = {
  userInfo: {},
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
};

const mutations = {
  // 设置用户信息
  set_user_info(state, userInfo) {
    state.userInfo = userInfo;
    uni.setStorageSync("userInfo", userInfo);
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
      const res = await wechatLogin();
      console.log("[用户模块] 微信登录返回", res);
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
