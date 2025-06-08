import { recordFocusTime, fetchTodayFocusTime } from "@/api/focus";

const state = {
  todayFocusTime: 0,
  isFocusing: false,
  focusStartTime: 0,
  focusEndTime: 0,
};

const getters = {
  get_today_focus_time: (state) => state.todayFocusTime,
  get_is_focusing: (state) => state.isFocusing,
  get_focus_start_time: (state) => state.focusStartTime,
  get_focus_end_time: (state) => state.focusEndTime,
};

const mutations = {
  set_today_focus_time(state, time) {
    state.todayFocusTime = time;
  },
  set_is_focusing(state, isFocusing) {
    state.isFocusing = isFocusing;
  },
  set_focus_start_time(state, time) {
    state.focusStartTime = time;
  },
  set_focus_end_time(state, time) {
    state.focusEndTime = time;
  },
};

const actions = {
  async begin_focus({ commit }) {
    commit("set_is_focusing", true);
    commit("set_focus_start_time", Date.now());
    console.log("[专注模块] 开始专注");
  },

  async end_focus({ commit, state }) {
    try {
      commit("set_is_focusing", false);
      commit("set_focus_end_time", Date.now());
      const focusDurationMs = state.focusEndTime - state.focusStartTime;

      // 计算专注分钟数，不足1分钟按1分钟算，向上取整
      let focusMinutes = Math.ceil(focusDurationMs / (1000 * 60));
      if (focusDurationMs > 0 && focusMinutes === 0) {
        // 确保即使只有几秒也算1分钟
        focusMinutes = 1;
      }

      // 如果专注时间少于10分钟，则提示用户并返回错误
      if (focusMinutes < 10) {
        console.warn("[专注模块] 专注时间不足10分钟，不予记录。");
        // 可以选择通过 uni.showToast 提示用户，或者直接 reject
        // 为了保持 action 的一致性，这里选择 reject
        return Promise.reject(new Error("专注时间太少，至少需要10分钟哦"));
      }

      await recordFocusTime(focusMinutes); // 传递分钟数
      const todayFocusTime = await fetchTodayFocusTime();
      commit("set_today_focus_time", todayFocusTime);
      console.log(`[专注模块] 结束专注，本次专注时长: ${focusMinutes}分钟`);
    } catch (error) {
      console.error("[专注模块] 结束专注失败", error);
      return Promise.reject(error);
    }
  },

  async cancel_focus({ commit }) {
    commit("set_is_focusing", false);
    commit("set_focus_start_time", 0);
    commit("set_focus_end_time", 0);
    console.log("[专注模块] 取消专注");
  },

  async fetch_today_focus_time({ commit }) {
    try {
      const todayFocusTime = await fetchTodayFocusTime();
      commit("set_today_focus_time", todayFocusTime.data.todayMinutes);
      console.log("[专注模块] 今日专注时间获取成功");
    } catch (error) {
      console.error("[专注模块] 今日专注时间获取失败", error);
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
