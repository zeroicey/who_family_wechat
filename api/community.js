import request from "./request";

export const fetchPosts = async () => {
  return request.get("/community/recommend-post");
};
