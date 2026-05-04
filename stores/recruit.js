import { defineStore } from "pinia";
import {
  fetchRecruits,
  fetchMoreRecruits,
  fetchRecruitById,
  fetchRecruitTypes,
  collectRecruit,
  uncollectRecruit,
} from "@/api/recruit.js";
import { deliveryJob } from "@/api/recruit";

export const useRecruitStore = defineStore("recruit", {
  state: () => ({
    recruits: [],
    recruitTypes: [],
    recruitClasses: [],
  }),

  getters: {
    get_recruits: (state) => state.recruits,
    get_recruit_types: (state) => state.recruitTypes,
    get_recruit_classes: (state) => state.recruitClasses,
  },

  actions: {
    set_recruits(recruits) {
      this.recruits = recruits;
    },

    add_recruits(recruits) {
      this.recruits = this.recruits.concat(recruits);
    },

    set_recruit_types(recruitTypes) {
      this.recruitTypes = recruitTypes;
      this.recruitClasses = [
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

    collect_recruit_local(recruitId) {
      this.recruits = this.recruits.map((recruit) => {
        if (recruit.id === +recruitId) {
          recruit.isCollect = 1;
        }
        return recruit;
      });
    },

    uncollect_recruit_local(recruitId) {
      this.recruits = this.recruits.map((recruit) => {
        if (recruit.id === +recruitId) {
          recruit.isCollect = 0;
        }
        return recruit;
      });
    },

    delivery_job_local(recruitId) {
      this.recruits = this.recruits.map((recruit) => {
        if (recruit.id === +recruitId) {
          recruit.isDeliver = 1;
        }
        return recruit;
      });
    },

    async fetch_first_recruits() {
      try {
        console.log("[招聘模块] 开始获取招聘");
        const recruitsRes = await fetchRecruits();
        this.set_recruits(recruitsRes.data);
        console.log("[招聘模块] 获取招聘成功", recruitsRes.data);
        console.log("[招聘模块] 获取招聘成功");
      } catch (error) {
        console.error("[招聘模块] 获取招聘失败", error);
        return Promise.reject(error);
      }
    },

    async fetch_more_recruits() {
      try {
        console.log("[招聘模块] 开始获取更多招聘");
        if (this.recruits.length > 0) {
          const recruitsRes = await fetchMoreRecruits(
            this.recruits[this.recruits.length - 1].id
          );
          this.add_recruits(recruitsRes.data);
        }
        console.log("[招聘模块] 获取更多招聘成功");
      } catch (error) {
        console.error("[招聘模块] 获取更多招聘失败", error);
        return Promise.reject(error);
      }
    },

    async fetch_recruit_by_id(recruitId) {
      try {
        console.log("[招聘模块] 开始获取招聘详情");
        const recruitRes = await fetchRecruitById(recruitId);
        console.log("[招聘模块] 获取招聘详情成功", recruitRes.data);
        console.log("[招聘模块] 获取招聘详情成功");
        return recruitRes.data;
      } catch (error) {
        console.error("[招聘模块] 获取招聘详情失败", error);
        return Promise.reject(error);
      }
    },

    async fetch_recruit_types() {
      try {
        console.log("[招聘模块] 开始获取招聘类型");
        const recruitTypesRes = await fetchRecruitTypes();
        this.set_recruit_types(recruitTypesRes.data);
        console.log("[招聘模块] 获取招聘类型成功");
      } catch (error) {
        console.error("[招聘模块] 获取招聘类型失败", error);
        return Promise.reject(error);
      }
    },

    async collect_recruit(recruitId) {
      try {
        console.log("[招聘模块] 开始收藏招聘");
        await collectRecruit(recruitId);
        console.log(recruitId);
        this.collect_recruit_local(recruitId);
        console.log("[招聘模块] 收藏招聘成功");
      } catch (error) {
        console.error("[招聘模块] 收藏招聘失败", error);
        return Promise.reject(error);
      }
    },

    async uncollect_recruit(recruitId) {
      try {
        console.log("[招聘模块] 开始取消收藏招聘");
        await uncollectRecruit(recruitId);
        this.uncollect_recruit_local(recruitId);
        console.log("[招聘模块] 取消收藏招聘成功");
      } catch (error) {
        console.error("[招聘模块] 取消收藏招聘失败", error);
        return Promise.reject(error);
      }
    },

    async delivery_job(recruitId) {
      try {
        console.log("[招聘模块] 开始投递招聘");
        await deliveryJob(recruitId);
        this.delivery_job_local(recruitId);
        console.log("[招聘模块] 投递招聘成功");
      } catch (error) {
        console.error("[招聘模块] 投递招聘失败", error);
        return Promise.reject(error);
      }
    },
  },
});

export default useRecruitStore;
