import axios from 'axios'
import { getTextGenerationConfig } from '@/utils/apiConfig'

/**
 * 与AI机器人聊天
 * @param userMessage 用户消息
 * @returns Promise<string> AI的回复
 */
export const chatWithBot = async (userMessage: string): Promise<string> => {
    try {
        const config = getTextGenerationConfig()
        
        const aiClient = axios.create({
            baseURL: config.baseUrl,
            timeout: config.timeout,
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${config.apiKey}`
            }
        })

        // 构建系统提示词
        const systemPrompt = `你是一个友好、热情的AI美食助手。你的职责是：
1. 帮助用户了解美食知识和烹饪技巧
2. 根据用户提供的食材推荐菜谱
3. 回答关于食材、营养、烹饪方法的问题
4. 提供饮食建议和健康提示
5. 用轻松、友好的语气与用户交流

请用中文回答，保持对话自然流畅，适当使用表情符号增加趣味性。`

        const response = await aiClient.post('/chat/completions', {
            model: config.model,
            messages: [
                {
                    role: 'system',
                    content: systemPrompt
                },
                {
                    role: 'user',
                    content: userMessage
                }
            ],
            temperature: 0.7,
            max_tokens: 1000,
            stream: false
        })

        // 提取AI的回复
        const aiResponse = response.data.choices[0].message.content
        return aiResponse.trim()
    } catch (error) {
        console.error('聊天服务错误:', error)
        throw new Error('无法连接到AI服务，请检查配置')
    }
}

/**
 * 生成用户对话的提示词
 * @param userMessage 用户消息
 * @returns Promise<string> 生成的提示词
 */
export const generatePromptFromChat = async (userMessage: string): Promise<string> => {
    try {
        const config = getTextGenerationConfig()
        
        const aiClient = axios.create({
            baseURL: config.baseUrl,
            timeout: config.timeout,
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${config.apiKey}`
            }
        })

        const response = await aiClient.post('/chat/completions', {
            model: config.model,
            messages: [
                {
                    role: 'system',
                    content: `你是一个提示词生成专家。根据用户的对话内容，生成一个清晰、具体的菜谱生成提示词。
提示词应该包含：
1. 用户的主要需求
2. 口味偏好
3. 特殊要求（如健康、快手菜等）
4. 其他相关信息

生成的提示词应该简洁明了，便于AI理解和执行。`
                },
                {
                    role: 'user',
                    content: `请根据以下用户对话生成菜谱提示词：\n${userMessage}`
                }
            ],
            temperature: 0.5,
            max_tokens: 500,
            stream: false
        })

        return response.data.choices[0].message.content.trim()
    } catch (error) {
        console.error('生成提示词失败:', error)
        return userMessage // 如果失败，返回原始消息
    }
}

/**
 * 对生成的菜谱进行点评
 * @param recipeName 菜谱名称
 * @param ingredients 食材列表
 * @param cookingTime 烹饪时间
 * @param difficulty 难度等级
 * @returns Promise<string> AI的点评
 */
export const reviewRecipe = async (
    recipeName: string,
    ingredients: string[],
    cookingTime: number,
    difficulty: string
): Promise<string> => {
    try {
        const config = getTextGenerationConfig()
        
        const aiClient = axios.create({
            baseURL: config.baseUrl,
            timeout: config.timeout,
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${config.apiKey}`
            }
        })

        const ingredientsList = ingredients.join('、')
        const difficultyText = {
            easy: '简单',
            medium: '中等',
            hard: '困难'
        }[difficulty] || difficulty

        const systemPrompt = `你是一位专业的美食评论家和烹饪大师。你的任务是对用户生成的菜谱进行专业、友好的点评。
点评应该包含：
1. 菜谱的创意和特色
2. 食材搭配的合理性
3. 烹饪难度的评价
4. 营养价值的分析
5. 改进建议或烹饪技巧

请用轻松、鼓励的语气进行点评，使用表情符号增加趣味性。`

        const userMessage = `请对以下菜谱进行点评：
菜名：${recipeName}
食材：${ingredientsList}
烹饪时间：${cookingTime}分钟
难度等级：${difficultyText}

请给出专业的点评和建议。`

        const response = await aiClient.post('/chat/completions', {
            model: config.model,
            messages: [
                {
                    role: 'system',
                    content: systemPrompt
                },
                {
                    role: 'user',
                    content: userMessage
                }
            ],
            temperature: 0.7,
            max_tokens: 800,
            stream: false
        })

        // 提取AI的回复
        const aiResponse = response.data.choices[0].message.content
        return aiResponse.trim()
    } catch (error) {
        console.error('菜谱点评失败:', error)
        throw new Error('无法生成菜谱点评，请稍后重试')
    }
}
