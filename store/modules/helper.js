import { sendMessageToAI, getAIStatus } from "@/api/helper";

const state = {
  // 聊天消息列表
  messageList: [
    { 
      type: 'ai', 
      content: '👋 你好！我是校园AI助手，很高兴为你服务！\n\n我可以帮助你解决各种校园生活问题，比如：\n• 📚 学习相关问题\n• 🏫 校园生活指导\n• 📋 各类手续办理\n• 🎯 社团活动咨询\n• 💡 生活小贴士\n\n有什么问题尽管问我吧～', 
      timestamp: Date.now(),
      showPresetQuestions: true // 标记显示预设问题
    }
  ],
  // 预设问题列表
  presetQuestions: [
    {
      id: 1,
      title: '💙 如何克服想家情绪？',
      content: '刚上大学总是想家，晚上经常想哭，怎么调节这种情绪？有什么好的方法适应大学生活吗？'
    },
    {
      id: 2,
      title: '🤝 怎样和室友友好相处？',
      content: '和室友生活习惯不同，有时会有小摩擦，怎么处理室友关系？如何建立良好的宿舍氛围？'
    },
    {
      id: 3,
      title: '😔 不想上学怎么办？',
      content: '最近对学习失去兴趣，不想去上课，感觉很迷茫，这种状态该如何调整？'
    },
    {
      id: 4,
      title: '👥 如何交到真心朋友？',
      content: '在大学里感觉很孤单，不知道怎么交朋友，怎样才能找到志同道合的人？'
    },
    {
      id: 5,
      title: '📱 如何控制手机依赖？',
      content: '总是忍不住刷手机，影响学习和睡眠，怎么戒掉手机瘾，提高自控力？'
    },
    {
      id: 6,
      title: '⚖️ 怎样平衡学习和社交？',
      content: '想要好好学习，但也想参加社团活动交朋友，如何在学业和社交之间找到平衡？'
    }
  ],
  // AI回复加载状态
  isAIReplying: false,
  // AI服务状态
  aiStatus: {
    online: true,
    message: '服务正常'
  },
  // 输入框内容
  inputValue: ''
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
  get_preset_questions: (state) => state.presetQuestions
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
        type: 'ai', 
        content: '👋 你好！我是校园AI助手，很高兴为你服务！\n\n我可以帮助你解决各种校园生活问题，比如：\n• 📚 学习相关问题\n• 🏫 校园生活指导\n• 📋 各类手续办理\n• 🎯 社团活动咨询\n• 💡 生活小贴士\n\n有什么问题尽管问我吧～', 
        timestamp: Date.now(),
        showPresetQuestions: true // 标记显示预设问题
      }
    ];
  },

  // 添加AI消息（带打字机效果）
  add_ai_message_with_typewriter(state, content) {
    const newMessage = { 
      type: 'ai', 
      content: '', 
      fullContent: content, // 完整内容
      timestamp: Date.now(),
      isTyping: true // 正在打字
    };
    state.messageList.push(newMessage);
  },

  // 更新打字机效果的显示内容
  update_typewriter_content(state, { index, content }) {
    if (state.messageList[index]) {
      state.messageList[index].content = content;
    }
  },

  // 完成打字机效果
  finish_typewriter(state, index) {
    if (state.messageList[index]) {
      state.messageList[index].isTyping = false;
    }
  }
};

const actions = {
  // 发送用户消息并获取AI回复（带打字机效果）
  async send_message({ commit, state }, userMessage) {
    try {
      // 添加用户消息
      commit('add_message', {
        type: 'user',
        content: userMessage
      });
      
      // 立即添加AI思考状态消息
      commit('add_ai_message_with_typewriter', '');
      const messageIndex = state.messageList.length - 1;
      
      // 设置AI回复状态为加载中
      commit('set_ai_replying', true);
      
      // 调用AI API
      const result = await sendMessageToAI(userMessage);
      
      if (result.success && result.message) {
        // 开始打字机动画
        await this.dispatch('helper/start_typewriter_effect', {
          messageIndex,
          fullContent: result.message
        });
      } else {
        // 更新为错误消息
        commit('update_typewriter_content', {
          index: messageIndex,
          content: result.message || '抱歉，我现在无法回复，请稍后再试。'
        });
        commit('finish_typewriter', messageIndex);
      }
    } catch (error) {
      console.error('发送消息失败:', error);
      
      // 如果已经添加了AI消息，更新为错误内容
      const messageIndex = state.messageList.length - 1;
      if (state.messageList[messageIndex] && state.messageList[messageIndex].type === 'ai') {
        commit('update_typewriter_content', {
          index: messageIndex,
          content: '网络连接异常，请检查网络后重试。'
        });
        commit('finish_typewriter', messageIndex);
      } else {
        // 否则添加新的错误消息
        commit('add_message', {
          type: 'ai',
          content: '网络连接异常，请检查网络后重试。'
        });
      }
    } finally {
      // 重置AI回复状态
      commit('set_ai_replying', false);
    }
  },

  // 打字机效果
  async start_typewriter_effect({ commit }, { messageIndex, fullContent }) {
    const typingSpeed = 50; // 打字速度（毫秒）
    let currentIndex = 0;
    
    return new Promise((resolve) => {
      const typeNextChar = () => {
        if (currentIndex <= fullContent.length) {
          const displayContent = fullContent.substring(0, currentIndex);
          commit('update_typewriter_content', {
            index: messageIndex,
            content: displayContent
          });
          
          currentIndex++;
          
          if (currentIndex <= fullContent.length) {
            setTimeout(typeNextChar, typingSpeed);
          } else {
            // 打字完成
            commit('finish_typewriter', messageIndex);
            resolve();
          }
        }
      };
      
      // 开始打字
      setTimeout(typeNextChar, 300); // 延迟300ms开始
    });
  },
  
  // 检查AI服务状态
  async check_ai_status({ commit }) {
    try {
      const status = await getAIStatus();
      commit('set_ai_status', status);
      return status;
    } catch (error) {
      console.error('检查AI状态失败:', error);
      commit('set_ai_status', {
        online: false,
        message: '服务异常'
      });
      return {
        online: false,
        message: '服务异常'
      };
    }
  },

  // 更新输入框内容
  update_input_value({ commit }, value) {
    commit('set_input_value', value);
  },

  // 清空聊天记录
  clear_chat_history({ commit }) {
    commit('clear_messages');
  }
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
};