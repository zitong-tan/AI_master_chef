import axios from 'axios'
import type { FitnessProfile, BabyProfile, GeneratedMeal, NutritionMealRequest, MealType } from '@/types'
import { FITNESS_PROMPTS, BABY_PROMPTS } from '@/config/precisionNutrition'
import { getTextGenerationConfig } from '@/utils/apiConfig'

// 创建动态axios实例
const createAiClient = () => {
    const config = getTextGenerationConfig()
    return axios.create({
        baseURL: config.baseUrl,
        timeout: config.timeout,
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${config.apiKey}`
        }
    })
}

/**
 * 生成健身人士营养餐
 * @param request 营养餐请求
 * @returns Promise<GeneratedMeal[]>
 */
export const generateFitnessMeals = async (request: NutritionMealRequest): Promise<GeneratedMeal[]> => {
    try {
        const aiClient = createAiClient()
        const apiConfig = getTextGenerationConfig()
        const profile = request.profile as FitnessProfile

        // 为每个餐次生成餐食
        const mealPromises = request.mealTypes.map(async (mealType, index) => {
            const prompt = `${FITNESS_PROMPTS.system}

${FITNESS_PROMPTS.getUserInfo(profile)}

${FITNESS_PROMPTS.mealRequest(mealType, profile)}

${FITNESS_PROMPTS.responseFormat}`

            const response = await aiClient.post('/chat/completions', {
                model: apiConfig.model,
                messages: [
                    {
                        role: 'system',
                        content: FITNESS_PROMPTS.system
                    },
                    {
                        role: 'user',
                        content: prompt
                    }
                ],
                temperature: apiConfig.temperature,
                stream: false
            })

            // 解析AI响应
            const aiResponse = response.data.choices[0].message.content
            let cleanResponse = aiResponse.trim()

            // 清理响应内容，提取JSON部分
            if (cleanResponse.startsWith('```json')) {
                cleanResponse = cleanResponse.replace(/```json\s*/, '').replace(/```\s*$/, '')
            } else if (cleanResponse.startsWith('```')) {
                cleanResponse = cleanResponse.replace(/```\s*/, '').replace(/```\s*$/, '')
            }

            const mealData = JSON.parse(cleanResponse)
            
            // 构建完整的GeneratedMeal对象
            return {
                id: `fitness-${Date.now()}-${index}`,
                type: mealType,
                name: mealData.name || `${getMealTypeLabel(mealType)}营养餐`,
                description: mealData.description || '专为健身人士设计的营养餐',
                ingredients: mealData.ingredients || ['鸡胸肉', '糙米', '蔬菜'],
                steps: mealData.steps || ['准备食材', '烹饪制作'],
                nutritionInfo: mealData.nutritionInfo || {
                    calories: 350,
                    protein: 30,
                    carbs: 40,
                    fat: 10,
                    fiber: 5
                },
                cookingTime: mealData.cookingTime || 25,
                difficulty: mealData.difficulty || 'medium',
                suitableTools: mealData.suitableTools || ['炒锅', '蒸锅'],
                tips: mealData.tips || ['注意火候控制', '营养均衡搭配']
            }
        })

        const meals = await Promise.all(mealPromises)
        return meals

    } catch (error) {
        console.error('生成健身营养餐失败:', error)
        throw new Error('AI营养师暂时无法为您制定餐食，请稍后重试')
    }
}

/**
 * 生成婴幼儿营养餐
 * @param request 营养餐请求
 * @returns Promise<GeneratedMeal[]>
 */
export const generateBabyMeals = async (request: NutritionMealRequest): Promise<GeneratedMeal[]> => {
    try {
        const aiClient = createAiClient()
        const apiConfig = getTextGenerationConfig()
        const profile = request.profile as BabyProfile

        // 为每个餐次生成餐食
        const mealPromises = request.mealTypes.map(async (mealType, index) => {
            const prompt = `${BABY_PROMPTS.system}

${BABY_PROMPTS.getUserInfo(profile)}

${BABY_PROMPTS.mealRequest(mealType, profile)}

${BABY_PROMPTS.responseFormat}`

            const response = await aiClient.post('/chat/completions', {
                model: apiConfig.model,
                messages: [
                    {
                        role: 'system',
                        content: BABY_PROMPTS.system
                    },
                    {
                        role: 'user',
                        content: prompt
                    }
                ],
                temperature: apiConfig.temperature,
                stream: false
            })

            // 解析AI响应
            const aiResponse = response.data.choices[0].message.content
            let cleanResponse = aiResponse.trim()

            // 清理响应内容，提取JSON部分
            if (cleanResponse.startsWith('```json')) {
                cleanResponse = cleanResponse.replace(/```json\s*/, '').replace(/```\s*$/, '')
            } else if (cleanResponse.startsWith('```')) {
                cleanResponse = cleanResponse.replace(/```\s*/, '').replace(/```\s*$/, '')
            }

            const mealData = JSON.parse(cleanResponse)
            
            // 构建完整的GeneratedMeal对象
            return {
                id: `baby-${Date.now()}-${index}`,
                type: mealType,
                name: mealData.name || `${getMealTypeLabel(mealType)}营养餐`,
                description: mealData.description || '专为婴幼儿设计的营养餐',
                ingredients: mealData.ingredients || ['婴儿米粉', '蔬菜泥', '蛋黄'],
                steps: mealData.steps || ['准备食材', '制作糊状'],
                nutritionInfo: mealData.nutritionInfo || {
                    calories: 150,
                    protein: 4,
                    carbs: 20,
                    fat: 3,
                    fiber: 1,
                    iron: 1.5,
                    calcium: 30,
                    vitamins: ['A', 'D']
                },
                cookingTime: mealData.cookingTime || 15,
                difficulty: mealData.difficulty || 'easy',
                suitableTools: mealData.suitableTools || ['辅食机', '研磨碗'],
                tips: mealData.tips || ['温度适中', '卫生安全'],
                warnings: mealData.warnings || ['注意过敏反应'],
                ageSuitability: mealData.ageSuitability || '适合婴幼儿'
            }
        })

        const meals = await Promise.all(mealPromises)
        return meals

    } catch (error) {
        console.error('生成婴幼儿营养餐失败:', error)
        throw new Error('AI营养师暂时无法为您制定餐食，请稍后重试')
    }
}

/**
 * 根据用户配置生成营养餐
 * @param request 营养餐请求
 * @returns Promise<GeneratedMeal[]>
 */
export const generateNutritionMeals = async (request: NutritionMealRequest): Promise<GeneratedMeal[]> => {
    if (request.mode === 'fitness') {
        return await generateFitnessMeals(request)
    } else if (request.mode === 'baby') {
        return await generateBabyMeals(request)
    } else {
        throw new Error('不支持的模式类型')
    }
}

/**
 * 测试AI服务连接
 * @returns Promise<boolean>
 */
export const testPrecisionNutritionAI = async (): Promise<boolean> => {
    try {
        const aiClient = createAiClient()
        const apiConfig = getTextGenerationConfig()

        const response = await aiClient.post('/chat/completions', {
            model: apiConfig.model,
            messages: [
                {
                    role: 'user',
                    content: '你好，请确认你能正常工作。'
                }
            ],
            max_tokens: 10
        })

        return response.status === 200
    } catch (error) {
        console.error('精准营养AI服务连接测试失败:', error)
        return false
    }
}

// 辅助函数
const getMealTypeLabel = (type: MealType): string => {
    const labels = {
        'breakfast': '早餐',
        'lunch': '午餐',
        'dinner': '晚餐'
    }
    return labels[type] || type
}