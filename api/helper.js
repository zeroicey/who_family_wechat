/**
 * AI助手相关API
 * 使用 uni.request 调用阿里云 DashScope Qwen 模型（支持流式输出）
 */

// DashScope API配置
const DASHSCOPE_API_URL =
  "https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions";

// 获取 API Key
const getAPIKey = () => {
  // #ifdef H5
  // H5 环境可以使用 import.meta.env 或 process.env
  if (typeof process !== "undefined" && process.env?.DASHSCOPE_API_KEY) {
    console.log("从 process.env 获取 API Key");
    return process.env.DASHSCOPE_API_KEY;
  }
  if (
    typeof import.meta !== "undefined" &&
    import.meta.env?.DASHSCOPE_API_KEY
  ) {
    return import.meta.env.DASHSCOPE_API_KEY;
  }
  // #endif

  // 从本地存储获取（支持所有平台）
  const storageKey = uni.getStorageSync("DASHSCOPE_API_KEY");
  if (storageKey) {
    return storageKey;
  }

  // 默认配置（所有平台通用）
  return "sk-5d79da76752b4fca953dbadcf01cbcad";
};

// 模型配置
const MODEL_CONFIG = {
  model: "qwen-plus", // 可选: qwen-plus, qwen-turbo, qwen-max 等
  defaultMaxTokens: 1000,
  defaultTemperature: 0.7,
};

/**
 * 解析 SSE 数据流
 * @param {string} chunk - 原始数据块
 * @returns {Array} - 解析后的消息数组
 */
const parseSSEChunk = (chunk) => {
  const messages = [];

  // SSE 格式: data: {...}\n\n
  const lines = chunk.split('\n');

  for (const line of lines) {
    if (line.startsWith('data: ')) {
      const data = line.substring(6).trim();

      // 跳过 [DONE] 标记
      if (data === '[DONE]') {
        continue;
      }

      try {
        const parsed = JSON.parse(data);
        messages.push(parsed);
      } catch (e) {
        console.warn('解析 SSE 数据失败:', data, e);
      }
    }
  }

  return messages;
};

/**
 * 发送消息给AI助手（流式响应）
 * @param {string} message 用户消息
 * @param {Function} onChunk - 接收数据块的回调函数 (content: string) => void
 * @param {Function} onComplete - 完成回调函数 (fullContent: string) => void
 * @param {Function} onError - 错误回调函数 (error: Error) => void
 * @returns {Function} - 取消函数
 */
export const sendMessageToAIStream = (message, onChunk, onComplete, onError) => {
  // 存储完整内容和缓冲区
  let fullContent = '';
  let buffer = '';
  let isCompleted = false; // 完成标志，防止重复触发

  // 触发完成的内部函数
  const triggerComplete = () => {
    if (!isCompleted && onComplete) {
      isCompleted = true;
      onComplete(fullContent);
    }
  };

  const requestTask = uni.request({
    url: DASHSCOPE_API_URL,
    method: "POST",
    header: {
      Authorization: `Bearer ${getAPIKey()}`,
      "Content-Type": "application/json",
    },
    data: {
      model: MODEL_CONFIG.model,
      messages: [
        {
          role: "system",
          content:
            "你是一个校园AI助手，名字叫答答Novus，专门为大学生提供帮助。请用简洁、友好的语言回答问题，重点关注校园生活、学习、服务等相关内容。\n\n回答格式要求：\n1. 可以使用 Markdown 格式，包括标题、列表、代码块等\n2. 代码块使用三个反引号包裹并注明语言\n3. 重要内容可以使用粗体或斜体强调\n4. 保持回答简洁明了，避免冗长",
        },
        {
          role: "user",
          content: message,
        },
      ],
      stream: true, // 启用流式输出
      max_tokens: MODEL_CONFIG.defaultMaxTokens,
      temperature: MODEL_CONFIG.defaultTemperature,
      top_p: 0.7,
      frequency_penalty: 0.5,
    },
    timeout: 60000, // 流式响应可能需要更长时间
    enableChunked: true, // 启用分块传输（部分平台支持）
    success: (res) => {
      // 请求成功完成（作为兜底）
      console.log('流式请求完成', res);
      triggerComplete();
    },
    fail: (err) => {
      console.error("AI API 调用失败:", err);
      if (onError) {
        onError(err);
      }
    },
  });

  // 监听响应头（检查是否支持）
  if (requestTask.onHeadersReceived) {
    try {
      requestTask.onHeadersReceived(() => {
        // 可以在这里检查响应头
      });
    } catch (e) {
      console.warn('onHeadersReceived 不支持:', e);
    }
  }

  // 监听数据块（仅部分平台支持）
  // #ifdef MP-WEIXIN || H5
  if (requestTask.onChunkReceived) {
    try {
      requestTask.onChunkReceived((res) => {
        try {
          // 兼容不同平台的响应格式
          let chunk = '';
          if (res.data) {
            // 微信小程序等平台
            if (typeof TextDecoder !== 'undefined') {
              chunk = new TextDecoder().decode(res.data);
            } else {
              // 降级处理：假设 res.data 是字符串
              chunk = String.fromCharCode.apply(null, new Uint8Array(res.data));
            }
          } else if (res.data === undefined && res.statusCode !== undefined) {
            // 某些平台的特殊格式
            return;
          }

          if (!chunk) return;

          buffer += chunk;

          // 按双换行符分割 SSE 消息
          const messages = buffer.split('\n\n');
          buffer = messages.pop() || ''; // 保留最后一个不完整的消息

          for (const msg of messages) {
            // 检查是否是 [DONE] 标记
            if (msg.includes('data: [DONE]')) {
              triggerComplete();
              return;
            }

            const parsed = parseSSEChunk(msg);

            for (const item of parsed) {
              if (item.choices && item.choices[0]?.delta?.content) {
                const content = item.choices[0].delta.content;
                fullContent += content;

                if (onChunk) {
                  onChunk(content, fullContent);
                }
              }
            }
          }
        } catch (e) {
          console.error('处理数据块失败:', e);
        }
      });
    } catch (e) {
      console.warn('onChunkReceived 设置失败:', e);
    }
  } else {
    console.warn('当前平台不支持 onChunkReceived，将使用非流式响应');
  }
  // #endif

  // 返回取消函数
  return () => {
    requestTask.abort();
  };
};

/**
 * 发送消息给AI助手（非流式，保留向后兼容）
 * @param {string} message 用户消息
 * @returns {Promise} AI回复结果
 */
export const sendMessageToAI = async (message) => {
  try {
    const response = await new Promise((resolve, reject) => {
      uni.request({
        url: DASHSCOPE_API_URL,
        method: "POST",
        header: {
          Authorization: `Bearer ${getAPIKey()}`,
          "Content-Type": "application/json",
        },
        data: {
          model: MODEL_CONFIG.model,
          messages: [
            {
              role: "system",
              content:
                "你是一个校园AI助手，名字叫答答Novus，专门为大学生提供帮助。请用简洁、友好的语言回答问题，重点关注校园生活、学习、服务等相关内容。\n\n回答格式要求：\n1. 可以使用 Markdown 格式，包括标题、列表、代码块等\n2. 代码块使用三个反引号包裹并注明语言\n3. 重要内容可以使用粗体或斜体强调\n4. 保持回答简洁明了，避免冗长",
            },
            {
              role: "user",
              content: message,
            },
          ],
          stream: false,
          max_tokens: MODEL_CONFIG.defaultMaxTokens,
          temperature: MODEL_CONFIG.defaultTemperature,
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
        url: DASHSCOPE_API_URL,
        method: "POST",
        header: {
          Authorization: `Bearer ${getAPIKey()}`,
          "Content-Type": "application/json",
        },
        data: {
          model: MODEL_CONFIG.model,
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
        url: DASHSCOPE_API_URL,
        method: "POST",
        header: {
          Authorization: `Bearer ${getAPIKey()}`,
          "Content-Type": "application/json",
        },
        data: {
          model: MODEL_CONFIG.model,
          messages: [
            {
              role: "user",
              content: "你好",
            },
          ],
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

/**
 * 设置 API Key（供调用方使用）
 * @param {string} apiKey DashScope API Key
 */
export const setAPIKey = (apiKey) => {
  uni.setStorageSync("DASHSCOPE_API_KEY", apiKey);
};

/**
 * 获取当前 API Key（供调用方使用）
 * @returns {string} 当前 API Key
 */
export const getAPIKeyForDisplay = () => {
  return getAPIKey();
};
