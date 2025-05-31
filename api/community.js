import request from "./request";

export const fetchPosts = async () => {
  return request.get("/community/recommend-post");
};

export const fetchMorePosts = async (lastPostId) => {
  return request.get(`/community/recommend-post?lastPostId=${lastPostId}`);
};

export const fetchPostById = async (postId) => {
  return request.get(`/community/post?id=${postId}`);
};

export const fetchFirstCommentsByPostId = async (postId) => {
  return request.get(`//community/post-comment?id=${postId}`);
};
