import request from "./request";

export const recordFocusTime = async (minutes) => {
  return request.post("/checkin/focus", { minutes });
};

export const fetchTodayFocusTime = async () => {
  return request.get("/checkin/focus/today");
};
