import { getRandomAvatarUrl } from "@/utils/randomData";
import request from "./request";

export const fetchPosts = async () => {
  return request.get("/community/self-post");
};

export const fetchMorePosts = async (lastPostId) => {
  return request.get(`/community/self-post?lastPostId=${lastPostId}`);
};

export const wechatLogin = async () => {
  const res = await uni.login({
    provider: "weixin", //使用微信登录
  });

  const random_name = await getRandomName();

  const code = res.code;
  return request.post("/login/wechat-login", {
    code,
    userInfo: {
      nickName: random_name,
      gender: "男",
    },
  });
};

export const updateUserInfo = async (userInfo) => {
  return request.put("/user/userInfo", userInfo);
};

export const getRandomName = async () => {
  // GET https://api.mir6.com/api/sjname
  return new Promise((resolve, reject) => {
    uni.request({
      url: "https://api.mir6.com/api/sjname", // 请求的接口地址
      method: "GET", // 请求方式
      dataType: "text", // <--- Add this line
      header: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "X-Requested-With": "XMLHttpRequest",
      },
      sslVerify: true, // 验证 SSL 证书
      success: ({ data, statusCode, header }) => {
        if (statusCode === 200) {
          // 通常接口成功会返回 data 对象，其中可能包含需要的名称信息
          // 假设返回的数据结构是 { code: 0, name: 'xxx' } 或直接是名称字符串
          // 请根据实际返回的接口文档调整这里的解析逻辑
          resolve(data); // 或者 reject(new Error('Unexpected data structure'));
        } else {
          reject(new Error(`Request failed with status code ${statusCode}`));
        }
      },
      fail: (error) => {
        reject(error);
      },
    });
  });
};

export const getAvatarUrl = async (id, name) => {
  if (id == 1) {
    return {
      data: {
        data: getRandomAvatarUrl(name),
      },
    };
  }
  return request.get(`/user/avater?id=${id}`);
};

export const updateUserAvatar = async (avatarBase64) => {
  return request.put("/user/avatar", {
    avatar: "data:image/png;base64," + avatarBase64,
  });
};

export const deletePost = async (postId) => {
  return request.delete("/community/post", { id: postId });
};
