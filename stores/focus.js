import { defineStore } from "pinia";
import { recordFocusTime, fetchTodayFocusTime } from "@/api/focus";

export const useFocusStore = defineStore("focus", {
  state: () => ({
    todayFocusTime: 0,
    isFocusing: false,
    focusStartTime: 0,
    focusEndTime: 0,
  }),

  getters: {
    get_today_focus_time: (state) => state.todayFocusTime,
    get_is_focusing: (state) => state.isFocusing,
    get_focus_start_time: (state) => state.focusStartTime,
    get_focus_end_time: (state) => state.focusEndTime,
  },

  actions: {
    set_today_focus_time(time) {
      this.todayFocusTime = time;
    },

    set_is_focusing(isFocusing) {
      this.isFocusing = isFocusing;
    },

    set_focus_start_time(time) {
      this.focusStartTime = time;
    },

    set_focus_end_time(time) {
      this.focusEndTime = time;
    },

    async begin_focus() {
      this.set_is_focusing(true);
      this.set_focus_start_time(Date.now());
      console.log("[专注模块] 开始专注");
    },

    async end_focus() {
      try {
        this.set_is_focusing(false);
        this.set_focus_end_time(Date.now());
        const focusDurationMs = this.focusEndTime - this.focusStartTime;

        let focusMinutes = Math.ceil(focusDurationMs / (1000 * 60));
        if (focusDurationMs > 0 && focusMinutes === 0) {
          focusMinutes = 1;
        }

        if (focusMinutes < 10) {
          console.warn("[专注模块] 专注时间不足10分钟，不予记录。");
          return Promise.reject(new Error("专注时间太少，至少需要10分钟哦"));
        }

        await recordFocusTime(focusMinutes);
        const todayFocusTime = await fetchTodayFocusTime();
        this.set_today_focus_time(todayFocusTime.data.todayMinutes);
        console.log(`[专注模块] 结束专注，本次专注时长: ${focusMinutes}分钟`);
      } catch (error) {
        console.error("[专注模块] 结束专注失败", error);
        return Promise.reject(error);
      }
    },

    async cancel_focus() {
      this.set_is_focusing(false);
      this.set_focus_start_time(0);
      this.set_focus_end_time(0);
      console.log("[专注模块] 取消专注");
    },

    async fetch_today_focus_time() {
      try {
        const todayFocusTime = await fetchTodayFocusTime();
        this.set_today_focus_time(todayFocusTime.data.todayMinutes);
        console.log("[专注模块] 今日专注时间获取成功");
      } catch (error) {
        console.error("[专注模块] 今日专注时间获取失败", error);
        return Promise.reject(error);
      }
    },
  },
});

export default useFocusStore;
