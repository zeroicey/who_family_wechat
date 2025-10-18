import { sendMessageToAI, getAIStatus } from "@/api/helper";

const state = {
  // 聊天消息列表
  messageList: [
    { type: 'ai', content: '我是校助手，有什么问题？', timestamp: Date.now() }
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
  get_input_value: (state) => state.inputValue
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
      { type: 'ai', content: '我是校助手，有什么问题？', timestamp: Date.now() }
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
      
      // 设置AI回复状态为加载中
      commit('set_ai_replying', true);
      
      // 调用AI API
      const result = await sendMessageToAI(userMessage);
      
      if (result.success && result.message) {
        // 添加AI消息并开始打字机效果
        commit('add_ai_message_with_typewriter', result.message);
        const messageIndex = state.messageList.length - 1;
        
        // 开始打字机动画
        await this.dispatch('helper/start_typewriter_effect', {
          messageIndex,
          fullContent: result.message
        });
      } else {
        // 添加错误消息
        commit('add_message', {
          type: 'ai',
          content: '抱歉，我暂时无法回复，请稍后再试。'
        });
      }
      
      return {
        success: result.success,
        message: result.message
      };
      
    } catch (error) {
      console.error('发送消息失败:', error);
      
      // 添加错误消息
      commit('add_message', {
        type: 'ai',
        content: '抱歉，我暂时无法回复，请稍后再试。'
      });
      
      return {
        success: false,
        message: '发送失败'
      };
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