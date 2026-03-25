import { sendMessageToAIStream, getAIStatus } from "@/api/helper";

const state = {
  // 聊天消息列表
  messageList: [
    {
      type: "ai",
      content:
        "👋 你好！我是校园AI助手，很高兴为你服务！\n\n我可以帮助你解决各种校园生活问题，比如：\n\n• 📚 学习相关问题\n\n• 🏫 校园生活指导\n\n• 📋 各类手续办理\n\n• 🎯 社团活动咨询\n\n• 💡 生活小贴士\n\n有什么问题尽管问我吧～",
      timestamp: Date.now(),
      showPresetQuestions: true, // 标记显示预设问题
    },
  ],
  // 预设问题列表
  presetQuestions: [
    {
      id: 1,
      title: "💙 如何克服想家情绪？",
      content:
        "刚上大学总是想家，晚上经常想哭，怎么调节这种情绪？有什么好的方法适应大学生活吗？",
    },
    {
      id: 2,
      title: "🤝 怎样和室友友好相处？",
      content:
        "和室友生活习惯不同，有时会有小摩擦，怎么处理室友关系？如何建立良好的宿舍氛围？",
    },
    {
      id: 3,
      title: "😔 不想上学怎么办？",
      content:
        "最近对学习失去兴趣，不想去上课，感觉很迷茫，这种状态该如何调整？",
    },
    {
      id: 4,
      title: "👥 如何交到真心朋友？",
      content:
        "在大学里感觉很孤单，不知道怎么交朋友，怎样才能找到志同道合的人？",
    },
    {
      id: 5,
      title: "📱 如何控制手机依赖？",
      content: "总是忍不住刷手机，影响学习和睡眠，怎么戒掉手机瘾，提高自控力？",
    },
    {
      id: 6,
      title: "⚖️ 怎样平衡学习和社交？",
      content:
        "想要好好学习，但也想参加社团活动交朋友，如何在学业和社交之间找到平衡？",
    },
  ],
  // AI回复加载状态
  isAIReplying: false,
  // AI服务状态
  aiStatus: {
    online: true,
    message: "服务正常",
  },
  // 输入框内容
  inputValue: "",
  // 当前流式请求的取消函数
  currentStreamCancel: null,
};

const getters = {
  // 获取消息列表
  get_message_list: (state) => state.messageList,
  // 获取AI回复状态
  is_ai_replying: (state) => state.isAIReplying,
  // 获取AI服务状态
  get_ai_status: (state) => state.aiStatus,
  // 获取输入框内容
  get_input_value: (state) => state.inputValue,
  // 获取预设问题列表
  get_preset_questions: (state) => state.presetQuestions,
};

const mutations = {
  // 添加消息
  add_message(state, message) {
    const newMessage = { ...message, timestamp: Date.now() };
    state.messageList.push(newMessage);
  },

  // 设置消息列表
  set_message_list(state, messageList) {
    state.messageList = messageList;
  },

  // 设置AI回复状态
  set_ai_replying(state, status) {
    state.isAIReplying = status;
  },

  // 设置AI服务状态
  set_ai_status(state, status) {
    state.aiStatus = status;
  },

  // 设置输入框内容
  set_input_value(state, value) {
    state.inputValue = value;
  },

  // 清空消息列表
  clear_messages(state) {
    state.messageList = [
      {
        type: "ai",
        content:
          "👋 你好！我是校园AI助手，很高兴为你服务！\n\n我可以帮助你解决各种校园生活问题，比如：\n\n• 📚 学习相关问题\n\n• 🏫 校园生活指导\n\n• 📋 各类手续办理\n\n• 🎯 社团活动咨询\n\n• 💡 生活小贴士\n\n有什么问题尽管问我吧～",
        timestamp: Date.now(),
        showPresetQuestions: true, // 标记显示预设问题
      },
    ];
  },

  // 添加AI消息（流式模式）
  add_ai_message_stream(state) {
    const newMessage = {
      type: "ai",
      content: "", // 初始内容为空，通过流式更新
      timestamp: Date.now(),
      isTyping: true, // 正在流式输出
    };
    state.messageList.push(newMessage);
  },

  // 更新流式消息内容
  update_stream_content(state, { index, content, fullContent }) {
    if (state.messageList[index]) {
      state.messageList[index].content = content;
      state.messageList[index].fullContent = fullContent;
    }
  },

  // 完成流式输出
  finish_stream(state, index) {
    if (state.messageList[index]) {
      state.messageList[index].isTyping = false;
    }
  },

  // 设置当前流式请求的取消函数
  set_stream_cancel(state, cancelFn) {
    state.currentStreamCancel = cancelFn;
  },

  // 取消当前流式请求
  cancel_stream(state) {
    if (state.currentStreamCancel) {
      state.currentStreamCancel();
      state.currentStreamCancel = null;
    }
  },
};

const actions = {
  // 发送用户消息并获取AI回复（真正的流式响应）
  async send_message({ commit, state }, userMessage) {
    try {
      // 如果有正在进行的请求，先取消
      if (state.currentStreamCancel) {
        commit("cancel_stream");
      }

      // 添加用户消息
      commit("add_message", {
        type: "user",
        content: userMessage,
      });

      // 立即添加AI消息（流式模式）
      commit("add_ai_message_stream");
      const messageIndex = state.messageList.length - 1;

      // 设置AI回复状态为加载中
      commit("set_ai_replying", true);

      // 调用流式AI API
      const cancelFn = sendMessageToAIStream(
        userMessage,
        // onChunk - 接收每个数据块
        (chunk, fullContent) => {
          commit("update_stream_content", {
            index: messageIndex,
            content: fullContent,
            fullContent: fullContent,
          });
        },
        // onComplete - 流式输出完成
        (fullContent) => {
          commit("finish_stream", messageIndex);
          commit("set_ai_replying", false);
          commit("set_stream_cancel", null);
        },
        // onError - 发生错误
        (error) => {
          console.error("流式AI调用失败:", error);

          // 检查是否是主动取消
          if (error.errMsg && error.errMsg.includes("abort")) {
            // 主动取消，不显示错误
            commit("finish_stream", messageIndex);
          } else {
            // 其他错误，显示错误信息
            commit("update_stream_content", {
              index: messageIndex,
              content: "抱歉，AI助手暂时无法回复，请稍后再试。",
              fullContent: "抱歉，AI助手暂时无法回复，请稍后再试。",
            });
            commit("finish_stream", messageIndex);
          }

          commit("set_ai_replying", false);
          commit("set_stream_cancel", null);
        },
      );

      // 保存取消函数
      commit("set_stream_cancel", cancelFn);
    } catch (error) {
      console.error("发送消息失败:", error);

      // 添加错误消息
      commit("add_message", {
        type: "ai",
        content: "网络连接异常，请检查网络后重试。",
      });

      commit("set_ai_replying", false);
      commit("set_stream_cancel", null);
    }
  },

  // 检查AI服务状态
  async check_ai_status({ commit }) {
    try {
      const status = await getAIStatus();
      commit("set_ai_status", status);
      return status;
    } catch (error) {
      console.error("检查AI状态失败:", error);
      commit("set_ai_status", {
        online: false,
        message: "服务异常",
      });
      return {
        online: false,
        message: "服务异常",
      };
    }
  },

  // 更新输入框内容
  update_input_value({ commit }, value) {
    commit("set_input_value", value);
  },

  // 清空聊天记录
  clear_chat_history({ commit, state }) {
    // 取消当前请求
    if (state.currentStreamCancel) {
      commit("cancel_stream");
    }
    commit("clear_messages");
  },

  // 停止AI回复
  stop_ai_reply({ commit, state }) {
    if (state.currentStreamCancel) {
      commit("cancel_stream");
      commit("set_ai_replying", false);

      // 如果有正在输出的消息，标记为完成
      const lastMessage = state.messageList[state.messageList.length - 1];
      if (lastMessage && lastMessage.type === "ai" && lastMessage.isTyping) {
        commit("finish_stream", state.messageList.length - 1);
      }
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
