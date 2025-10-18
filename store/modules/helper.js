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
    state.messageList.push({
      ...message,
      timestamp: Date.now()
    });
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
  }
};

const actions = {
  // 发送用户消息并获取AI回复
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
      
      // 添加AI回复消息
      commit('add_message', {
        type: 'ai',
        content: result.message
      });
      
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
  
  // 检查AI服务状态
  async check_ai_status({ commit }) {
    try {
      const status = await getAIStatus();
      commit('set_ai_status', status);
      return status;
    } catch (error) {
      console.error('检查AI状态失败:', error);
      const errorStatus = {
        online: false,
        message: '服务连接失败'
      };
      commit('set_ai_status', errorStatus);
      return errorStatus;
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