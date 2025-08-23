import request from "./request";
import { checkImg, checkText } from "./check";

export const fetchPosts = async () => {
  return request.get("/community/recommend-post");
};

export const fetchMorePosts = async (lastPostId) => {
  return request.get(`/community/recommend-post?lastPostId=${lastPostId}`);
};

export const fetchPostById = async (postId) => {
  return request.get(`/community/post?id=${postId}`);
};

export const fetchFirstComments = async (postId) => {
  return request.get(`/community/post-comment?id=${postId}`);
};

export const fetchFirstMoreComments = async (postId, lastCommentId) => {
  return request.get(
    `/community/post-comment?id=${postId}&lastCommentId=${lastCommentId}`
  );
};

export const fetchSecondComments = async (commentId) => {
  return request.get(`/community/post-comment-reply?id=${commentId}`);
};

export const fetchSecondMoreComments = async (commentId, lastCommentId) => {
  return request.get(
    `/community/post-comment-reply?id=${commentId}&lastCommentId=${lastCommentId}`
  );
};

export const addFirstComment = async (commentData) => {
  return request.post("/community/post-comment", {
    id: commentData.postId,
    content: commentData.content,
  });
};

export const addSecondComment = async (replyData) => {
  return request.post("/community/post-comment-reply", {
    id: replyData.commentId,
    content: replyData.content,
  });
};

export const deleteFirstComment = async (commentId) => {
  return request.delete("/community/post-comment", {
    id: commentId,
  });
};

export const deleteSecondComment = async (commentId) => {
  return request.delete("/community/post-comment-reply", {
    id: commentId,
  });
};

export const publishPreparePost = async (post) => {
  const checkRes = await checkText(post);
  if (checkRes.code !== 200) {
    return checkRes;
  }
  return request.post("/community/prepare-post", post);
};

export const publishPost = async (postId) => {
  return request.post("/community/finalize-post", { id: postId });
};

export const fetchPostTypes = async () => {
  return request.get("/community/postTypes");
};

export const uploadImage = async (requestUrl, imagePath) => {
  // 先检测图片内容
  const checkResult = await new Promise((resolve, reject) => {
    uni.getFileSystemManager().readFile({
      filePath: imagePath,
      encoding: "base64",
      success: async (res) => {
        try {
          const checkRes = await checkImg("data:image/png;base64," + res.data);
          resolve(checkRes);
        } catch (error) {
          reject(error);
        }
      },
      fail: (error) => {
        reject(new Error("读取文件失败: " + error.errMsg));
      }
    });
  });

  // 如果检测失败，抛出错误，不进行上传
  if (checkResult.code !== 200) {
    throw new Error("图片检测失败，无法上传");
  }

  // 检测通过，进行上传
  return new Promise((resolve, reject) => {
    uni.getFileSystemManager().readFile({
      filePath: imagePath,
      success: (res) => {
        uni.request({
          url: requestUrl,
          method: "PUT",
          data: res.data,
          header: {
            "Content-Type": "application/octet-stream",
          },
          success: ({ data, statusCode, header }) => {
            console.log("图片上传成功", data, statusCode, header);
            resolve({ data, statusCode, header });
          },
          fail: (error) => {
            console.log("图片上传失败", error);
            reject(new Error("图片上传失败: " + error.errMsg));
          },
        });
      },
      fail: (error) => {
        reject(new Error("读取文件失败: " + error.errMsg));
      }
    });
  });
};

export const markImageUploaded = async (imageId) => {
  return request.post("/community/img-uploaded", { id: imageId });
};

export const likePost = async (postId) => {
  return request.post("/community/like-post", { id: postId, like: true });
};

export const unlikePost = async (postId) => {
  return request.post("/community/like-post", { id: postId, like: false });
};
