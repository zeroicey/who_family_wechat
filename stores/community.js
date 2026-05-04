import { defineStore } from "pinia";
import {
  fetchPostTypes,
  fetchMorePosts,
  fetchPosts,
  fetchPostById,
  fetchFirstComments,
  publishPost,
  publishPreparePost,
  markImageUploaded,
  uploadImage,
  likePost,
  unlikePost,
  addFirstComment,
  addSecondComment,
  deleteFirstComment,
  deleteSecondComment,
  fetchSecondComments,
  fetchSecondMoreComments,
  fetchFirstMoreComments,
} from "@/api/community";
import { getAvatarUrl } from "@/api/user";

export const useCommunityStore = defineStore("community", {
  state: () => ({
    posts: [],
    postClasses: [],
    postTypes: [],
    postAvatars: {},
  }),

  getters: {
    get_posts: (state) => state.posts,
    get_post_types: (state) => state.postTypes,
    get_post_avatars: (state) => state.postAvatars,
    get_post_classes: (state) => state.postClasses,
  },

  actions: {
    set_posts(posts) {
      this.posts = posts;
    },

    add_posts(posts) {
      this.posts = [...this.posts, ...posts];
    },

    set_post_types(postTypes) {
      this.postTypes = postTypes;
      this.postClasses = [{ id: -1, name: "推荐" }, ...postTypes];
    },

    set_post_avatar({ avatarId, avatarUrl }) {
      this.postAvatars = {
        ...this.postAvatars,
        [avatarId]: avatarUrl,
      };
    },

    like_post_local(postId) {
      const post = this.posts.find((item) => item.id === postId);
      if (post) {
        post.likeCount++;
        post.isLike = 1;
      }
    },

    unlike_post_local(postId) {
      const post = this.posts.find((item) => item.id === postId);
      if (post) {
        post.likeCount--;
        post.isLike = 0;
      }
    },

    async fetch_first_posts() {
      try {
        console.log("[社区模块] 开始获取帖子");
        const postsRes = await fetchPosts();
        this.set_posts(postsRes.data);
        console.log("[社区模块] 获取帖子成功");
      } catch (error) {
        console.error("[社区模块] 获取帖子失败", error);
        return Promise.reject(error);
      }
    },

    async fetch_more_posts() {
      try {
        console.log("[社区模块] 开始获取更多帖子");
        if (this.posts.length > 0) {
          const postsRes = await fetchMorePosts(
            this.posts[this.posts.length - 1].id
          );
          this.add_posts(postsRes.data);
        }
        console.log("[社区模块] 获取更多帖子成功");
      } catch (error) {
        console.error("[社区模块] 获取更多帖子失败", error);
        return Promise.reject(error);
      }
    },

    async fetch_post_by_id(postId) {
      try {
        console.log("[社区模块] 开始获取帖子详情");
        const postRes = await fetchPostById(postId);
        console.log("[社区模块] 获取帖子详情成功");
        return postRes.data;
      } catch (error) {
        console.error("[社区模块] 获取帖子详情失败", error);
        return Promise.reject(error);
      }
    },

    async fetch_first_comments({ postId, comments }) {
      try {
        console.log("[社区模块] 开始获取帖子评论");
        const commentsRes = await fetchFirstComments(postId);
        return [...comments, ...commentsRes.data];
      } catch (error) {
        console.error("[社区模块] 获取帖子评论失败", error);
        return Promise.reject(error);
      }
    },

    async fetch_first_more_comments({ postId, lastCommentId }) {
      try {
        console.log("[社区模块] 开始获取更多帖子评论");
        const commentsRes = await fetchFirstMoreComments(postId, lastCommentId);
        return commentsRes.data;
      } catch (error) {
        console.error("[社区模块] 获取更多帖子评论失败", error);
        return Promise.reject(error);
      }
    },

    async fetch_second_comments({ commentId, comments }) {
      try {
        console.log(`[社区模块] 开始获取二级评论${commentId}回复`);
        const commentsRes = await fetchSecondComments(commentId);
        return comments.map((comment) => {
          if (comment.id === commentId) {
            comment.replyList = commentsRes.data;
          }
          return comment;
        });
      } catch (error) {
        console.error(`[社区模块] 获取评论${commentId}回复失败`, error);
        return Promise.reject(error);
      }
    },

    async fetch_second_more_comments({ commentId, lastCommentId, comments }) {
      try {
        console.log(`[社区模块] 开始获取更多二级评论${commentId}回复`);
        const commentsRes = await fetchSecondMoreComments(
          commentId,
          lastCommentId
        );
        return comments.map((comment) => {
          if (comment.id === commentId) {
            comment.replyList = [
              ...(comment.replyList || []),
              ...commentsRes.data,
            ];
            comment.replyCount = (comment.replyCount || 0) + 1;
          }
          return comment;
        });
      } catch (error) {
        console.error(`[社区模块] 获取更多评论${commentId}回复失败`, error);
        return Promise.reject(error);
      }
    },

    async delete_first_comment({ comments, commentId }) {
      try {
        console.log(`[社区模块] 开始删除一级评论${commentId}`);
        await deleteFirstComment(commentId);
        return comments.filter((comment) => comment.id !== commentId);
      } catch (error) {
        console.error(`[社区模块] 删除一级评论${commentId}失败`, error);
        return Promise.reject(error);
      }
    },

    async delete_second_comment({ comments, commentId, replyId }) {
      try {
        console.log(`[社区模块] 开始删除二级评论${replyId}`);
        await deleteSecondComment(replyId);
        return comments.map((comment) => {
          if (comment.id === commentId) {
            comment.replyList = (comment.replyList || []).filter(
              (reply) => reply.id !== replyId
            );
          }
          return comment;
        });
      } catch (error) {
        console.error(`[社区模块] 删除二级评论${replyId}失败`, error);
        return Promise.reject(error);
      }
    },

    async add_first_comment({ postId, content, comments, userData }) {
      try {
        console.log("[社区模块] 开始添加一级评论");
        const commentData = {
          postId,
          content,
          uid: userData.uid,
          username: userData.username,
          avatarId: userData.avatarId,
          createTime: userData.createTime,
        };
        const commentRes = await addFirstComment(commentData);
        return [
          {
            id: commentRes.data,
            uid: userData.uid,
            username: userData.username,
            avatarId: userData.avatarId,
            content,
            createTime: userData.createTime,
            replyCount: 0,
          },
          ...comments,
        ];
      } catch (error) {
        console.error("[社区模块] 添加一级评论失败", error);
        return Promise.reject(error);
      }
    },

    async add_second_comment({ commentId, content, comments, userData }) {
      try {
        console.log("[社区模块] 开始添加二级评论");
        const replyData = {
          commentId,
          content,
          uid: userData.uid,
          username: userData.username,
          avatarId: userData.avatarId,
          createTime: userData.createTime,
        };
        const commentRes = await addSecondComment(replyData);
        return comments.map((comment) => {
          if (comment.id === commentId) {
            comment.replyList = [
              {
                id: commentRes.data,
                uid: userData.uid,
                username: userData.username,
                avatarId: userData.avatarId,
                content,
                createTime: userData.createTime,
              },
              ...(comment.replyList || []),
            ];
            comment.replyCount = (comment.replyCount || 0) + 1;
          }
          return comment;
        });
      } catch (error) {
        console.error("[社区模块] 添加二级评论失败", error);
        return Promise.reject(error);
      }
    },

    async publish_post_only_text(post) {
      try {
        console.log("[社区模块] 开始预发布帖子");
        const preparePostRes = await publishPreparePost(post);
        console.log("[社区模块] 预发布帖子成功");
        console.log("[社区模块] 开始发布帖子");
        const postRes = await publishPost(preparePostRes.data.communityId);
        console.log("[社区模块] 发布帖子成功");
        return postRes.data;
      } catch (error) {
        console.error("[社区模块] 发布帖子失败", error);
        return Promise.reject(error);
      }
    },

    async publish_post_with_image({ postData: post, imagePaths }) {
      try {
        console.log("[社区模块] 开始预发布帖子");
        const preparePostRes = await publishPreparePost(post);
        console.log("[社区模块] 预发布帖子成功");
        console.log("[社区模块] 开始上传图片");

        for (let i = 0; i < preparePostRes.data.communityImageList.length; i++) {
          await uploadImage(
            preparePostRes.data.communityImageList[i].url,
            imagePaths[i]
          );
          await markImageUploaded(preparePostRes.data.communityImageList[i].id);
        }

        console.log("[社区模块] 上传图片成功");
        console.log("[社区模块] 开始发布帖子");
        const postRes = await publishPost(preparePostRes.data.communityId);
        console.log("[社区模块] 发布帖子成功");
        return postRes.data;
      } catch (error) {
        console.error("[社区模块] 发布帖子失败", error);
        return Promise.reject(error);
      }
    },

    async fetch_post_types() {
      try {
        console.log("[社区模块] 开始获取帖子类型");
        const postTypesRes = await fetchPostTypes();
        this.set_post_types(postTypesRes.data);
        console.log("[社区模块] 获取帖子类型成功");
      } catch (error) {
        console.error("[社区模块] 获取帖子类型失败", error);
        return Promise.reject(error);
      }
    },

    async fetch_post_user_avatar({ avatarId, name }) {
      try {
        if (this.postAvatars[avatarId]) {
          console.log("[社区模块] 从缓存获取用户头像成功");
          return this.postAvatars[avatarId];
        }

        console.log("[社区模块] 开始获取用户头像");
        const avatarRes = await getAvatarUrl(avatarId, name);
        const avatarUrl = avatarRes.data.data;
        this.set_post_avatar({ avatarId, avatarUrl });
        console.log("[社区模块] 获取用户头像成功");
        return avatarUrl;
      } catch (error) {
        console.error("[社区模块] 获取用户头像失败", error);
        return Promise.reject(error);
      }
    },

    async like_post(postId) {
      try {
        console.log("[社区模块] 开始点赞帖子");
        await likePost(postId);
        this.like_post_local(postId);
        console.log("[社区模块] 点赞帖子成功");
      } catch (error) {
        console.error("[社区模块] 点赞帖子失败", error);
        return Promise.reject(error);
      }
    },

    async unlike_post(postId) {
      try {
        console.log("[社区模块] 开始取消点赞帖子");
        await unlikePost(postId);
        this.unlike_post_local(postId);
        console.log("[社区模块] 取消点赞帖子成功");
      } catch (error) {
        console.error("[社区模块] 取消点赞帖子失败", error);
        return Promise.reject(error);
      }
    },
  },
});

export default useCommunityStore;
