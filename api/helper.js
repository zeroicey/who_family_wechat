/**
 * AI助手相关API
 */

// SiliconFlow API配置
const SILICONFLOW_API_URL = 'https://api.siliconflow.cn/v1/chat/completions'
const SILICONFLOW_TOKEN = 'sk-xmddxeqqcaeatgxwkbukioyqnoxhpaubhaojmlmfmxxwjosg'

/**
 * 发送消息给AI助手
 * @param {string} message 用户消息
 * @returns {Promise} AI回复
 */
export const sendMessageToAI = async (message) => {
  try {
    // 使用uni.request发起请求
    const response = await new Promise((resolve, reject) => {
      uni.request({
        url: SILICONFLOW_API_URL,
        method: 'POST',
        header: {
          'Authorization': `Bearer ${SILICONFLOW_TOKEN}`,
          'Content-Type': 'application/json'
        },
        data: {
          model: "Qwen/QwQ-32B",
          messages: [
            {
              role: "system",
              content: "你是一个校园AI助手，专门为大学生提供帮助。请用简洁、友好的语言回答问题，重点关注校园生活、学习、服务等相关内容。"
            },
            {
              role: "user",
              content: message
            }
          ],
          stream: false,
          max_tokens: 1000,
          temperature: 0.7,
          top_p: 0.7,
          frequency_penalty: 0.5
        },
        timeout: 30000, // 30秒超时
        success: (res) => {
          resolve(res)
        },
        fail: (err) => {
          reject(err)
        }
      })
    })
    
    // 检查响应状态
    if (response.statusCode !== 200) {
      throw new Error(`HTTP error! status: ${response.statusCode}`)
    }
    
    const data = response.data
    
    // 检查响应格式
    if (data.choices && data.choices.length > 0) {
      // 获取AI回复内容并清理前后空行和空格
      const rawContent = data.choices[0].message.content || '';
      const cleanedContent = rawContent.trim();
      
      return {
        success: true,
        message: cleanedContent,
        usage: data.usage
      }
    } else {
      throw new Error('Invalid response format')
    }
    
  } catch (error) {
    console.error('AI API调用失败:', error)
    
    // 返回错误信息
    return {
      success: false,
      message: '抱歉，AI助手暂时无法回复，请稍后再试。',
      error: error.message
    }
  }
}

/**
 * 获取AI助手状态
 * @returns {Promise} 服务状态
 */
export const getAIStatus = async () => {
  try {
    // 使用uni.request发送简单的状态检查请求
    const response = await new Promise((resolve, reject) => {
      uni.request({
        url: SILICONFLOW_API_URL,
        method: 'POST',
        header: {
          'Authorization': `Bearer ${SILICONFLOW_TOKEN}`,
          'Content-Type': 'application/json'
        },
        data: {
          model: "Qwen/QwQ-32B",
          messages: [
            {
              role: "user",
              content: "你好"
            }
          ],
          stream: false,
          max_tokens: 10
        },
        timeout: 10000, // 10秒超时
        success: (res) => {
          resolve(res)
        },
        fail: (err) => {
          reject(err)
        }
      })
    })
    
    if (response.statusCode === 200) {
      return {
        online: true,
        message: 'AI服务正常'
      }
    } else {
      return {
        online: false,
        message: 'AI服务异常'
      }
    }
  } catch (error) {
    console.error('AI状态检查失败:', error)
    return {
      online: false,
      message: 'AI服务连接失败'
    }
  }
}