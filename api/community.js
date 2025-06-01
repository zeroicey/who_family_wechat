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
  return request.get(`/community/post-comment?id=${postId}`);
};

export const publishPreparePost = async (post) => {
  return request.post("/community/prepare-post", post);
};

export const publishPost = async (postId) => {
  return request.post("/community/finalize-post", { id: postId });
};

export const fetchPostTypes = async () => {
  return request.get("/community/postTypes");
};

export const uploadImage = async (requestUrl, imagePath) => {
  uni.uploadFile({
    url: requestUrl,
    fileType: "image",
    filePath: imagePath,
    name: "file",
    success: ({ data, statusCode }) => {
      console.log("图片上传成功", data, statusCode);
    },
    fail: (error) => {
      console.log("图片上传失败", error);
    },
  });
};

export const markImageUploaded = async (imageId) => {
  return request.post("/community/img-uploaded", { id: imageId });
};
