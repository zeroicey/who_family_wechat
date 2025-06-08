import {
  fetchAllTasks,
  addTask,
  deleteTask,
  markTaskDone,
  markTaskTodo,
} from "@/api/task";

const state = {
  tasks: [],
};

const getters = {
  get_tasks: (state) => state.tasks,
  get_todo_task_num: (state) => {
    return state.tasks.filter((task) => task.status === "待完成").length;
  },
  get_done_task_num: (state) => {
    return state.tasks.filter((task) => task.status === "已完成").length;
  },
};

const mutations = {
  set_tasks(state, tasks) {
    state.tasks = tasks;
  },

  add_task(state, task) {
    state.tasks.unshift(task);
  },

  delete_task(state, taskId) {
    state.tasks = state.tasks.filter((task) => task.id !== taskId);
  },

  mark_task_done(state, taskId) {
    const task = state.tasks.find((task) => task.id === taskId);
    if (task) {
      task.status = "已完成";
    }
  },

  mark_task_todo(state, taskId) {
    const task = state.tasks.find((task) => task.id === taskId);
    if (task) {
      task.status = "待完成";
    }
  },
};

const actions = {
  async fetch_all_tasks({ commit }) {
    try {
      const tasks = await fetchAllTasks();
      console.log(tasks.data);
      commit("set_tasks", tasks.data);
      console.log("[任务模块] 所有任务获取成功");
    } catch (error) {
      console.error("[任务模块] 所有任务获取失败", error);
      return Promise.reject(error);
    }
  },

  async add_task({ commit }, task) {
    try {
      const taskRes = await addTask(task);
      commit("add_task", {
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

  async delete_task({ commit }, taskId) {
    try {
      await deleteTask(taskId);
      commit("delete_task", taskId);
      console.log("[任务模块] 任务删除成功");
    } catch (error) {
      console.error("[任务模块] 任务删除失败", error);
      return Promise.reject(error);
    }
  },

  async mark_task_done({ commit }, taskId) {
    try {
      await markTaskDone(taskId);
      commit("mark_task_done", taskId);
      console.log("[任务模块] 任务标记完成成功");
    } catch (error) {
      console.error("[任务模块] 任务标记完成失败", error);
      return Promise.reject(error);
    }
  },

  async mark_task_todo({ commit }, taskId) {
    try {
      await markTaskTodo(taskId);
      commit("mark_task_todo", taskId);
      console.log("[任务模块] 任务标记未完成成功");
    } catch (error) {
      console.error("[任务模块] 任务标记未完成失败", error);
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
