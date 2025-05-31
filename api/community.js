import request from "./request";

export const fetchPosts = async () => {
  return request.get("/community/recommend-post");
};

export const fetchMorePosts = async (lastPostId) => {
  return request.get(`/community/recommend-post?lastPostId=${lastPostId}`);
};
