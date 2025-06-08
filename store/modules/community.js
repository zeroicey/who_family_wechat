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
} from "@/api/community";
import { getAvatarUrl } from "@/api/user";

const state = {
  posts: [],
  postClasses: [],
  postTypes: [],
  postAvatars: {},
};

const getters = {
  get_posts: (state) => state.posts,
  get_post_types: (state) => state.postTypes,
  get_post_avatars: (state) => state.postAvatars,
  get_post_classes: (state) => state.postClasses,
};

const mutations = {
  set_posts(state, posts) {
    state.posts = posts;
  },

  add_posts(state, posts) {
    state.posts = [...state.posts, ...posts];
  },

  set_post_types(state, postTypes) {
    state.postTypes = postTypes;
    state.postClasses = [
      {
        id: -1,
        name: "推荐",
      },
      ...postTypes,
    ];
  },

  set_post_avatar(state, { avatarId, avatarUrl }) {
    state.postAvatars = {
      ...state.postAvatars,
      [avatarId]: avatarUrl,
    };
  },

  like_post(state, postId) {
    const post = state.posts.find((post) => post.id === postId);
    if (post) {
      post.likeCount++;
      post.isLike = 1;
    }
  },

  unlike_post(state, postId) {
    const post = state.posts.find((post) => post.id === postId);
    if (post) {
      post.likeCount--;
      post.isLike = 0;
    }
  },
};

const actions = {
  async fetch_first_posts({ commit }) {
    try {
      console.log("[社区模块] 开始获取帖子");

      // 调用API获取帖子列表
      const postsRes = await fetchPosts();

      commit("set_posts", postsRes.data);

      // console.log("[社区模块] 获取帖子成功", postsRes.data);
      console.log("[社区模块] 获取帖子成功");
    } catch (error) {
      console.error("[社区模块] 获取帖子失败", error);
      return Promise.reject(error);
    }
  },

  async fetch_more_posts({ commit, state }) {
    try {
      console.log("[社区模块] 开始获取更多帖子");

      // 调用API获取帖子列表
      if (state.posts.length > 0) {
        const postsRes = await fetchMorePosts(
          state.posts[state.posts.length - 1].id
        );
        commit("add_posts", postsRes.data);
      }

      // console.log("[社区模块] 获取帖子成功", postsRes.data);
      console.log("[社区模块] 获取更多帖子成功");
    } catch (error) {
      console.error("[社区模块] 获取更多帖子失败", error);
      return Promise.reject(error);
    }
  },

  async fetch_post_by_id({ commit }, postId) {
    try {
      console.log("[社区模块] 开始获取帖子详情");
      // 调用API获取帖子详情
      const postRes = await fetchPostById(postId);

      // console.log("[社区模块] 获取帖子详情成功", postRes.data);
      console.log("[社区模块] 获取帖子详情成功");
      return postRes.data;
    } catch (error) {
      console.error("[社区模块] 获取帖子详情失败", error);
      return Promise.reject(error);
    }
  },

  async fetch_first_comments({ commit }, { postId, comments }) {
    try {
      console.log("[社区模块] 开始获取帖子评论");
      // 调用API获取帖子评论
      const commentsRes = await fetchFirstComments(postId);

      comments = [...comments, ...commentsRes.data];

      console.log("[社区模块] 获取帖子评论成功", commentsRes.data);
      console.log("[社区模块] 获取帖子评论成功");
      return comments;
    } catch (error) {
      console.error("[社区模块] 获取帖子评论失败", error);
      return Promise.reject(error);
    }
  },

  async fetch_first_more_comments({ commit }, { postId, lastCommentId }) {
    try {
      console.log("[社区模块] 开始获取更多帖子评论");
      // 调用API获取帖子评论
      const commentsRes = await fetchFirstMoreComments(postId, lastCommentId);

      console.log("[社区模块] 获取更多帖子评论成功", commentsRes.data);
      console.log("[社区模块] 获取更多帖子评论成功");
      return commentsRes.data;
    } catch (error) {
      console.error("[社区模块] 获取更多帖子评论失败", error);
      return Promise.reject(error);
    }
  },

  async fetch_second_comments({ commit }, { commentId, comments }) {
    try {
      console.log(`[社区模块] 开始获取二级评论${commentId}回复`);
      // 调用API获取帖子评论
      const commentsRes = await fetchSecondComments(commentId);

      comments = comments.map((comment) => {
        if (comment.id === commentId) {
          comment.replyList = commentsRes.data;
        }
      });

      console.log(`[社区模块] 获取评论${commentId}回复成功`, commentsRes.data);
      console.log(`[社区模块] 获取评论${commentId}回复成功`);
      return comments;
    } catch (error) {
      console.error(`[社区模块] 获取评论${commentId}回复失败`, error);
      return Promise.reject(error);
    }
  },

  async fetch_second_more_comments(
    { commit },
    { commentId, lastCommentId, comments }
  ) {
    try {
      console.log(`[社区模块] 开始获取更多二级评论${commentId}回复`);
      // 调用API获取帖子评论
      const commentsRes = await fetchSecondMoreComments(
        commentId,
        lastCommentId
      );

      comments = comments.map((comment) => {
        if (comment.id === commentId) {
          comment.replyList = [...comment.replyList, ...commentsRes.data];
        }
      });

      console.log(
        `[社区模块] 获取更多评论${commentId}回复成功`,
        commentsRes.data
      );
      console.log(`[社区模块] 获取更多评论${commentId}回复成功`);
      return commentsRes.data;
    } catch (error) {
      console.error(`[社区模块] 获取更多评论${commentId}回复失败`, error);
      return Promise.reject(error);
    }
  },

  async delete_first_comment({ commit }, { comments, commentId }) {
    try {
      console.log(`[社区模块] 开始删除一级评论${commentId}`);
      // 调用API删除一级评论
      await deleteFirstComment(commentId);

      comments = comments.filter((comment) => comment.id !== commentId);

      console.log(`[社区模块] 删除一级评论${commentId}成功`);
    } catch (error) {
      console.error(`[社区模块] 删除一级评论${commentId}失败`, error);
      return Promise.reject(error);
    }
  },

  async delete_second_comment({ commit }, { comments, commentId, replyId }) {
    try {
      console.log(`[社区模块] 开始删除二级评论${commentId}`);
      // 调用API删除二级评论
      await deleteSecondComment(commentId);

      comments = comments.map((comment) => {
        if (comment.id === commentId) {
          comment.replyList = comment.replyList.filter(
            (reply) => reply.id !== replyId
          );
        }
      });

      console.log(`[社区模块] 删除二级评论${commentId}成功`);
      return comments;
    } catch (error) {
      console.error(`[社区模块] 删除二级评论${commentId}失败`, error);
      return Promise.reject(error);
    }
  },

  async add_first_comment({ commit }, { postId, content, comments }) {
    try {
      console.log(`[社区模块] 开始添加一级评论`);
      // 调用API添加一级评论
      const commentRes = await addFirstComment(postId, content);

      comments = [
        ...comments,
        {
          content,
          id: commentRes.data,
        },
      ];

      console.log(`[社区模块] 添加一级评论成功`, commentRes.data);
      console.log(`[社区模块] 添加一级评论成功`);
      return comments;
    } catch (error) {
      console.error(`[社区模块] 添加一级评论失败`, error);
      return Promise.reject(error);
    }
  },

  async add_second_comment({ commit }, { commentId, content, comments }) {
    try {
      console.log(`[社区模块] 开始添加二级评论`);
      // 调用API添加二级评论
      const commentRes = await addSecondComment(commentId, content);

      comments = comments.map((comment) => {
        if (comment.id === commentId) {
          comment.replyList = [
            ...comment.replyList,
            {
              content,
              id: commentRes.data,
            },
          ];
        }
      });
      console.log(`[社区模块] 添加二级评论成功`, commentRes.data);
      console.log(`[社区模块] 添加二级评论成功`);
      return comments;
    } catch (error) {
      console.error(`[社区模块] 添加二级评论失败`, error);
      return Promise.reject(error);
    }
  },

  async publish_post_only_text({ commit }, post) {
    try {
      console.log("[社区模块] 开始预发布帖子");
      // 调用预发布帖子API
      const preparePostRes = await publishPreparePost(post);

      console.log("[社区模块] 预发布帖子成功", preparePostRes.data);
      console.log("[社区模块] 预发布帖子成功");

      console.log("[社区模块] 开始发布帖子");
      const postRes = await publishPost(preparePostRes.data.communityId);

      console.log("[社区模块] 发布帖子成功", postRes.data);
      console.log("[社区模块] 发布帖子成功");
      return postRes.data;
    } catch (error) {
      console.error("[社区模块] 发布帖子失败", error);
      return Promise.reject(error);
    }
  },

  async publish_post_with_image({ commit }, { postData: post, imagePaths }) {
    try {
      console.log("[社区模块] 开始预发布帖子");
      // 调用预发布帖子API
      const preparePostRes = await publishPreparePost(post);

      console.log("[社区模块] 预发布帖子成功", preparePostRes.data);
      console.log("[社区模块] 预发布帖子成功");

      console.log("[社区模块] 开始上传图片");

      for (let i = 0; i < preparePostRes.data.communityImageList.length; i++) {
        // 上传图片
        await uploadImage(
          preparePostRes.data.communityImageList[i].url,
          imagePaths[i]
        );

        // 标记图片上传成功
        await markImageUploaded(preparePostRes.data.communityImageList[i].id);
      }

      console.log("[社区模块] 上传图片成功");

      console.log("[社区模块] 开始发布帖子");
      const postRes = await publishPost(preparePostRes.data.communityId);

      console.log("[社区模块] 发布帖子成功", postRes.data);
      console.log("[社区模块] 发布帖子成功");
      return postRes.data;
    } catch (error) {
      console.error("[社区模块] 发布帖子失败", error);
      return Promise.reject(error);
    }
  },

  async fetch_post_types({ commit }) {
    try {
      console.log("[社区模块] 开始获取帖子类型");
      // 调用API获取帖子类型
      const postTypesRes = await fetchPostTypes();

      commit("set_post_types", postTypesRes.data);

      console.log("[社区模块] 获取帖子类型成功", postTypesRes.data);
      console.log("[社区模块] 获取帖子类型成功");
    } catch (error) {
      console.error("[社区模块] 获取帖子类型失败", error);
      return Promise.reject(error);
    }
  },

  async fetch_post_user_avatar({ commit, state }, { avatarId, name }) {
    try {
      // 检查缓存中是否存在头像
      if (state.postAvatars[avatarId]) {
        console.log("[社区模块] 从缓存获取用户头像成功");
        return state.postAvatars[avatarId];
      }

      console.log("[社区模块] 开始获取用户头像");
      // 调用API获取用户头像
      const avatarRes = await getAvatarUrl(avatarId, name);

      const avatarUrl = avatarRes.data.data;
      // 将获取到的头像存入缓存
      commit("set_post_avatar", { avatarId, avatarUrl });

      // console.log("[社区模块] 获取用户头像成功", avatarUrl);
      console.log("[社区模块] 获取用户头像成功");
      return avatarUrl;
    } catch (error) {
      console.error("[社区模块] 获取用户头像失败", error);
      return Promise.reject(error);
    }
  },

  async like_post({ commit }, postId) {
    try {
      console.log("[社区模块] 开始点赞帖子");
      // 调用API点赞帖子
      await likePost(postId);

      commit("like_post", postId);

      console.log("[社区模块] 点赞帖子成功");
    } catch (error) {
      console.error("[社区模块] 点赞帖子失败", error);
      return Promise.reject(error);
    }
  },
  async unlike_post({ commit }, postId) {
    try {
      console.log("[社区模块] 开始取消点赞帖子");
      // 调用API取消点赞帖子
      await unlikePost(postId);

      commit("unlike_post", postId);

      console.log("[社区模块] 取消点赞帖子成功");
    } catch (error) {
      console.error("[社区模块] 取消点赞帖子失败", error);
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
