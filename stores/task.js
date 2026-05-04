import { defineStore } from "pinia";
import {
  fetchAllTasks,
  addTask,
  deleteTask,
  markTaskDone,
  markTaskTodo,
} from "@/api/task";

export const useTaskStore = defineStore("task", {
  state: () => ({
    tasks: [],
  }),

  getters: {
    get_tasks: (state) => state.tasks,
    get_todo_task_num: (state) => {
      return state.tasks.filter((task) => task.status === "待完成").length;
    },
    get_done_task_num: (state) => {
      return state.tasks.filter((task) => task.status === "已完成").length;
    },
  },

  actions: {
    set_tasks(tasks) {
      this.tasks = tasks;
    },

    add_task_local(task) {
      this.tasks.unshift(task);
    },

    delete_task_local(taskId) {
      this.tasks = this.tasks.filter((task) => task.id !== taskId);
    },

    mark_task_done_local(taskId) {
      const task = this.tasks.find((item) => item.id === taskId);
      if (task) {
        task.status = "已完成";
      }
    },

    mark_task_todo_local(taskId) {
      const task = this.tasks.find((item) => item.id === taskId);
      if (task) {
        task.status = "待完成";
      }
    },

    async fetch_all_tasks() {
      try {
        const tasks = await fetchAllTasks();
        console.log(tasks.data);
        this.set_tasks(tasks.data);
        console.log("[任务模块] 所有任务获取成功");
      } catch (error) {
        console.error("[任务模块] 所有任务获取失败", error);
        return Promise.reject(error);
      }
    },

    async add_task(task) {
      try {
        const taskRes = await addTask(task);
        this.add_task_local({
          id: taskRes.data,
          status: "待完成",
          title: task.title,
        });
        console.log("[任务模块] 任务添加成功");
      } catch (error) {
        console.error("[任务模块] 任务添加失败", error);
        return Promise.reject(error);
      }
    },

    async delete_task(taskId) {
      try {
        await deleteTask(taskId);
        this.delete_task_local(taskId);
        console.log("[任务模块] 任务删除成功");
      } catch (error) {
        console.error("[任务模块] 任务删除失败", error);
        return Promise.reject(error);
      }
    },

    async mark_task_done(taskId) {
      try {
        await markTaskDone(taskId);
        this.mark_task_done_local(taskId);
        console.log("[任务模块] 任务标记完成成功");
      } catch (error) {
        console.error("[任务模块] 任务标记完成失败", error);
        return Promise.reject(error);
      }
    },

    async mark_task_todo(taskId) {
      try {
        await markTaskTodo(taskId);
        this.mark_task_todo_local(taskId);
        console.log("[任务模块] 任务标记未完成成功");
      } catch (error) {
        console.error("[任务模块] 任务标记未完成失败", error);
        return Promise.reject(error);
      }
    },
  },
});

export default useTaskStore;
