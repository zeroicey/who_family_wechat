/**
 * AI助手相关API
 */

// SiliconFlow API配置
const SILICONFLOW_API_URL = "https://api.siliconflow.cn/v1/chat/completions";
const SILICONFLOW_TOKEN = "sk-uwhfpshscmbwwixmqeedlcgxujahfjpgkfsanrpectylkrvg";

/**
 * 发送消息给AI助手
 * @param {string} message 用户消息
 * @returns {Promise} AI回复结果
 */
export const sendMessageToAI = async (message) => {
  try {
    const response = await new Promise((resolve, reject) => {
      uni.request({
        url: SILICONFLOW_API_URL,
        method: "POST",
        header: {
          Authorization: `Bearer ${SILICONFLOW_TOKEN}`,
          "Content-Type": "application/json",
        },
        data: {
          model: "Qwen/QwQ-32B",
          messages: [
            {
              role: "system",
              content:
                "你是一个校园AI助手，名字叫答答Novus，专门为大学生提供帮助。请用简洁、友好的语言回答问题，重点关注校园生活、学习、服务等相关内容。请直接返回原文本，不要返回markdown。",
            },
            {
              role: "user",
              content: message,
            },
          ],
          stream: false,
          max_tokens: 1000,
          temperature: 0.7,
          top_p: 0.7,
          frequency_penalty: 0.5,
        },
        timeout: 30000,
        success: (res) => {
          resolve(res);
        },
        fail: (err) => {
          reject(err);
        },
      });
    });

    // 检查响应状态
    if (response.statusCode !== 200) {
      throw new Error(`HTTP error! status: ${response.statusCode}`);
    }

    const data = response.data;

    // 检查响应格式
    if (data.choices && data.choices.length > 0) {
      // 获取AI回复内容并清理前后空行和空格
      const rawContent = data.choices[0].message.content || "";
      const cleanedContent = rawContent.trim();

      return {
        success: true,
        message: cleanedContent,
        usage: data.usage,
      };
    } else {
      throw new Error("Invalid response format");
    }
  } catch (error) {
    console.error("AI API调用失败:", error);

    // 返回错误信息
    return {
      success: false,
      message: "抱歉，AI助手暂时无法回复，请稍后再试。",
      error: error.message,
    };
  }
};

/**
 * AI优化帖子内容
 * @param {string} title 原标题
 * @param {string} content 原内容
 * @returns {Promise} 优化后的标题和内容
 */
export const optimizePost = async (title, content) => {
  try {
    const response = await new Promise((resolve, reject) => {
      uni.request({
        url: SILICONFLOW_API_URL,
        method: "POST",
        header: {
          Authorization: `Bearer ${SILICONFLOW_TOKEN}`,
          "Content-Type": "application/json",
        },
        data: {
          model: "Qwen/QwQ-32B",
          messages: [
            {
              role: "system",
              content:
                "你是一个专业的内容编辑助手。请帮用户优化社区帖子的标题和内容，使其更加吸引人、表达更清晰、语气更友好。优化后的内容应该保持原意，但更加生动有趣。\n\n请严格按照以下JSON格式返回结果，不要包含任何其他内容：\n{\"title\":\"优化后的标题\",\"content\":\"优化后的内容\"}\n\n标题要简洁有力，控制在30字以内。内容要保持原意，让表达更流畅自然。",
            },
            {
              role: "user",
              content: `请帮我优化这篇帖子：\n\n标题：${title}\n\n内容：${content}`,
            },
          ],
          stream: false,
          max_tokens: 2000,
          temperature: 0.8,
          top_p: 0.9,
        },
        timeout: 30000,
        success: (res) => {
          resolve(res);
        },
        fail: (err) => {
          reject(err);
        },
      });
    });

    if (response.statusCode !== 200) {
      throw new Error(`HTTP error! status: ${response.statusCode}`);
    }

    const data = response.data;
    if (data.choices && data.choices.length > 0) {
      const rawContent = data.choices[0].message.content.trim();
      // 尝试解析JSON
      const jsonMatch = rawContent.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const result = JSON.parse(jsonMatch[0]);
        return {
          success: true,
          title: result.title || title,
          content: result.content || content,
        };
      }
      // 如果解析失败，返回原始内容作为content
      return {
        success: true,
        title: title,
        content: rawContent,
      };
    } else {
      throw new Error("Invalid response format");
    }
  } catch (error) {
    console.error("AI优化失败:", error);
    return {
      success: false,
      title: title,
      content: content,
      error: error.message,
    };
  }
};

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
        method: "POST",
        header: {
          Authorization: `Bearer ${SILICONFLOW_TOKEN}`,
          "Content-Type": "application/json",
        },
        data: {
          model: "Qwen/QwQ-32B",
          messages: [
            {
              role: "user",
              content: "你好",
            },
          ],
          stream: false,
          max_tokens: 10,
        },
        timeout: 10000, // 10秒超时
        success: (res) => {
          resolve(res);
        },
        fail: (err) => {
          reject(err);
        },
      });
    });

    if (response.statusCode === 200) {
      return {
        online: true,
        message: "AI服务正常",
      };
    } else {
      return {
        online: false,
        message: "AI服务异常",
      };
    }
  } catch (error) {
    console.error("AI状态检查失败:", error);
    return {
      online: false,
      message: "AI服务连接失败",
    };
  }
};
