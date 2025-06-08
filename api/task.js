import request from "./request";

export const fetchAllTasks = async () => {
  return request.get("/checkin/todos");
};

export const addTask = async (task) => {
  return request.post("/checkin/addTodo", task);
};

export const markTaskDone = async (id) => {
  return request.put(`/checkin/done`, { id });
};

export const markTaskTodo = async (id) => {
  return request.put(`/checkin/todo`, { id });
};

export const deleteTask = async (id) => {
  return request.delete(`/checkin/todo`, { id });
};
