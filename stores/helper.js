import { defineStore } from "pinia";
import { sendMessageToAIStream, getAIStatus } from "@/api/helper";

const initialAiMessage = () => ({
  type: "ai",
  content:
    "👋 你好！我是校园AI助手，很高兴为你服务！\n\n我可以帮助你解决各种校园生活问题，比如：\n\n• 📚 学习相关问题\n\n• 🏫 校园生活指导\n\n• 📋 各类手续办理\n\n• 🎯 社团活动咨询\n\n• 💡 生活小贴士\n\n有什么问题尽管问我吧～",
  timestamp: Date.now(),
  showPresetQuestions: true,
});

export const useHelperStore = defineStore("helper", {
  state: () => ({
    messageList: [initialAiMessage()],
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
    isAIReplying: false,
    aiStatus: {
      online: true,
      message: "服务正常",
    },
    inputValue: "",
    currentStreamCancel: null,
  }),

  getters: {
    get_message_list: (state) => state.messageList,
    is_ai_replying: (state) => state.isAIReplying,
    get_ai_status: (state) => state.aiStatus,
    get_input_value: (state) => state.inputValue,
    get_preset_questions: (state) => state.presetQuestions,
  },

  actions: {
    add_message(message) {
      const newMessage = { ...message, timestamp: Date.now() };
      this.messageList.push(newMessage);
    },

    set_message_list(messageList) {
      this.messageList = messageList;
    },

    set_ai_replying(status) {
      this.isAIReplying = status;
    },

    set_ai_status(status) {
      this.aiStatus = status;
    },

    set_input_value(value) {
      this.inputValue = value;
    },

    clear_messages() {
      this.messageList = [initialAiMessage()];
    },

    add_ai_message_stream() {
      this.messageList.push({
        type: "ai",
        content: "",
        timestamp: Date.now(),
        isTyping: true,
      });
    },

    update_stream_content({ index, content, fullContent }) {
      if (this.messageList[index]) {
        this.messageList[index].content = content;
        this.messageList[index].fullContent = fullContent;
      }
    },

    finish_stream(index) {
      if (this.messageList[index]) {
        this.messageList[index].isTyping = false;
      }
    },

    set_stream_cancel(cancelFn) {
      this.currentStreamCancel = cancelFn;
    },

    cancel_stream() {
      if (this.currentStreamCancel) {
        this.currentStreamCancel();
        this.currentStreamCancel = null;
      }
    },

    async send_message(userMessage) {
      try {
        if (this.currentStreamCancel) {
          this.cancel_stream();
        }

        this.add_message({
          type: "user",
          content: userMessage,
        });

        this.add_ai_message_stream();
        const messageIndex = this.messageList.length - 1;
        this.set_ai_replying(true);

        const cancelFn = sendMessageToAIStream(
          userMessage,
          (_chunk, fullContent) => {
            this.update_stream_content({
              index: messageIndex,
              content: fullContent,
              fullContent,
            });
          },
          () => {
            this.finish_stream(messageIndex);
            this.set_ai_replying(false);
            this.set_stream_cancel(null);
          },
          (error) => {
            console.error("流式AI调用失败:", error);

            if (error.errMsg && error.errMsg.includes("abort")) {
              this.finish_stream(messageIndex);
            } else {
              this.update_stream_content({
                index: messageIndex,
                content: "抱歉，AI助手暂时无法回复，请稍后再试。",
                fullContent: "抱歉，AI助手暂时无法回复，请稍后再试。",
              });
              this.finish_stream(messageIndex);
            }

            this.set_ai_replying(false);
            this.set_stream_cancel(null);
          }
        );

        this.set_stream_cancel(cancelFn);
      } catch (error) {
        console.error("发送消息失败:", error);
        this.add_message({
          type: "ai",
          content: "网络连接异常，请检查网络后重试。",
        });
        this.set_ai_replying(false);
        this.set_stream_cancel(null);
      }
    },

    async check_ai_status() {
      try {
        const status = await getAIStatus();
        this.set_ai_status(status);
        return status;
      } catch (error) {
        console.error("检查AI状态失败:", error);
        const fallback = {
          online: false,
          message: "服务异常",
        };
        this.set_ai_status(fallback);
        return fallback;
      }
    },

    update_input_value(value) {
      this.set_input_value(value);
    },

    clear_chat_history() {
      if (this.currentStreamCancel) {
        this.cancel_stream();
      }
      this.clear_messages();
    },

    stop_ai_reply() {
      if (this.currentStreamCancel) {
        this.cancel_stream();
        this.set_ai_replying(false);

        const lastMessage = this.messageList[this.messageList.length - 1];
        if (lastMessage && lastMessage.type === "ai" && lastMessage.isTyping) {
          this.finish_stream(this.messageList.length - 1);
        }
      }
    },
  },
});

export default useHelperStore;
