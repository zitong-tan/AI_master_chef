// 菜系类型
export interface CuisineType {
    id: string
    name: string
    description: string
    avatar: string
    specialty: string
    prompt: string
}

// 食材类型
export interface Ingredient {
    id: string
    name: string
    category: string
}

// 菜谱类型
export interface Recipe {
    id: string
    name: string
    cuisine: string
    ingredients: string[]
    steps: RecipeStep[]
    cookingTime: number
    difficulty: 'easy' | 'medium' | 'hard'
    tips: string[]
    nutritionAnalysis?: NutritionAnalysis // 营养分析
    winePairing?: WinePairing // 酒水搭配
    image?: string // 菜品图片URL（自动生成）
}

// 制作步骤
export interface RecipeStep {
    step: number
    description: string
    time?: number
    temperature?: string
    image?: string
}

// 营养信息
export interface NutritionInfo {
    calories: number // 卡路里
    protein: number // 蛋白质 (g)
    carbs: number // 碳水化合物 (g)
    fat: number // 脂肪 (g)
    fiber: number // 膳食纤维 (g)
    sodium: number // 钠 (mg)
    sugar: number // 糖 (g)
    vitaminC?: number // 维生素C (mg)
    calcium?: number // 钙 (mg)
    iron?: number // 铁 (mg)
}

// 营养分析
export interface NutritionAnalysis {
    nutrition: NutritionInfo
    healthScore: number // 健康评分 (1-10)
    balanceAdvice: string[] // 营养均衡建议
    dietaryTags: string[] // 饮食标签，如"低脂"、"高蛋白"等
    servingSize: string // 建议份量
}

// 饮品搭配（原酒水搭配）
export interface WinePairing {
    name: string // 饮品名称
    type: 'red_wine' | 'white_wine' | 'beer' | 'sake' | 'tea' | 'cocktail' | 'spirits' | 'non_alcoholic' | 'soft_drink' | 'juice' | 'dairy' | 'other' // 饮品类型
    reason: string // 搭配理由
    servingTemperature: string // 饮用温度
    glassType?: string // 推荐杯子
    alcoholContent?: string // 酒精度
    flavor: string // 口感描述
    origin?: string // 品牌或产地
}

// 收藏菜谱类型
export interface FavoriteRecipe {
    id: string
    recipe: Recipe
    favoriteDate: string // 收藏日期
    notes?: string // 用户备注
}

// AI响应类型
export interface AIResponse {
    success: boolean
    data: Recipe
    message?: string
}

// 酱料分类类型
export type SauceCategory = 'spicy' | 'garlic' | 'sweet' | 'complex' | 'regional' | 'fusion'

// 酱料制作步骤
export interface SauceStep {
    step: number
    description: string
    time?: number
    temperature?: string
    technique?: string
}

// 酱料保存信息
export interface StorageInfo {
    method: string
    duration: string
    temperature: string
}

// 酱料配方类型
export interface SauceRecipe {
    id: string
    name: string
    category: SauceCategory
    ingredients: string[]
    steps: SauceStep[]
    makingTime: number
    difficulty: 'easy' | 'medium' | 'hard'
    tips: string[]
    storage: StorageInfo
    pairings: string[]
    tags: string[]
    spiceLevel?: number
    sweetLevel?: number
    saltLevel?: number
    sourLevel?: number
    description?: string
}

// 酱料偏好配置
export interface SaucePreference {
    spiceLevel: number // 1-5
    sweetLevel: number // 1-5
    saltLevel: number // 1-5
    sourLevel: number // 1-5
    useCase: string[] // ['noodles', 'dipping', 'cooking', 'bbq', 'hotpot']
    availableIngredients: string[]
}

// 自定义酱料创作请求
export interface CustomSauceRequest {
    baseType: 'oil' | 'water' | 'paste' | 'granular'
    flavorDirection: 'spicy' | 'sweet' | 'sour' | 'umami' | 'aromatic'
    specialIngredients: string[]
    expectedTexture: string
    intendedUse: string
    customRequirements?: string
}

// 酱料分类配置
export interface SauceCategoryConfig {
    id: SauceCategory
    name: string
    description: string
    icon: string
    color: string
    examples: string[]
}

// 收藏酱料类型
export interface FavoriteSauce {
    id: string
    sauce: SauceRecipe
    favoriteDate: string
    notes?: string
}

// 占卜类型
export type FortuneType = 'daily' | 'mood' | 'couple' | 'number'

// 占卜请求参数
export interface DailyFortuneParams {
    zodiac: string // 星座
    animal: string // 生肖
    date: string
}

export interface MoodFortuneParams {
    moods: string[] // 心情状态数组
    intensity: number // 情绪强度 1-5
}

export interface PersonInfo {
    zodiac: string
    animal: string
    personality: string[]
}

export interface CoupleFortuneParams {
    user1: PersonInfo
    user2: PersonInfo
}

export interface NumberFortuneParams {
    number: number // 1-99
    isRandom: boolean
}

// 占卜结果
export interface FortuneResult {
    id: string
    type: FortuneType
    date: string
    dishName: string
    reason: string
    luckyIndex: number // 1-10
    description: string
    tips: string[]
    difficulty: 'easy' | 'medium' | 'hard'
    cookingTime: number
    mysticalMessage: string // 神秘话语
    ingredients?: string[]
    steps?: string[]
}

// 占卜师角色
export interface FortuneTeller {
    name: string
    avatar: string
    greetings: string[]
    phrases: {
        [key in FortuneType]: {
            opening: string[]
            closing: string[]
            processing: string[]
        }
    }
    mysticalWords: string[]
}

// 星座配置
export interface ZodiacConfig {
    id: string
    name: string
    symbol: string
    element: string // 火、土、风、水
    traits: string[]
    luckyColors: string[]
    dates: string
}

// 生肖配置
export interface AnimalConfig {
    id: string
    name: string
    symbol: string
    element: string // 金、木、水、火、土
    traits: string[]
    luckyNumbers: number[]
    years: number[]
}

// 心情配置
export interface MoodConfig {
    id: string
    name: string
    emoji: string
    color: string
    cookingStyle: string[]
    description: string
}

// 占卜历史存储
export interface FortuneStorage {
    history: FortuneResult[]
    userPreferences: {
        defaultZodiac?: string
        defaultAnimal?: string
        favoriteFortuneType?: FortuneType
    }
    feedback: {
        [fortuneId: string]: 'accurate' | 'inaccurate'
    }
}

// ==================== 精准营养相关类型 ====================

// 健身人士配置
export interface FitnessProfile {
    age: number // 年龄
    gender: 'male' | 'female' | 'other' // 性别
    weight: number // 体重 (kg)
    height: number // 身高 (cm)
    exerciseFrequency: 'rarely' | '1-2_times' | '3-4_times' | '5+_times' // 运动频率
    exerciseIntensity: 'light' | 'moderate' | 'high' | 'very_high' // 运动强度
    dietPreference: string[] // 饮食偏好
    tastePreference: string[] // 偏好口味
    cookingMethod: string[] // 烹饪方式
    dailyCalorieGoal: number // 每日热量目标 (kcal)
    fitnessGoal: 'muscle_gain' | 'fat_loss' | 'maintain' // 健身目标：增肌、减脂、维持体态
}

// 婴幼儿配置
export interface BabyProfile {
    ageGroup: '' | '0-6_months' | '7-12_months' | '1-3_years' // 月龄/年龄段
    monthsAge?: number // 具体月龄 (0-36个月)
    yearsAge?: number // 具体年龄 (1-3岁)
    allergens: string[] // 过敏物
    hasSupplementaryFood: boolean // 是否已添加辅食
    feedingNeeds: {
        dailyMeals: number // 每日餐次
        foodForm: '' | 'puree' | 'mashed' | 'small_pieces' | 'finger_food' // 食材形态
        nutritionFocus: '' | 'balanced' | 'iron_fortified' | 'dha_enriched' | 'calcium_rich' // 营养侧重
    }
    specialNeeds: {
        isPicky: boolean // 是否挑食
        hasConstipation: boolean // 是否便秘
        other: string[] // 其他特殊需求
    }
}

// 餐次类型
export type MealType = 'breakfast' | 'lunch' | 'dinner'

// 生成的餐食
export interface GeneratedMeal {
    id: string
    type: MealType
    name: string
    description: string
    ingredients: string[]
    steps: string[]
    nutritionInfo: {
        calories: number
        protein: number
        carbs: number
        fat: number
        fiber: number
        iron?: number
        calcium?: number
        vitamins?: string[]
    }
    cookingTime: number // 分钟
    difficulty: 'easy' | 'medium' | 'hard'
    suitableTools?: string[] // 所需工具
    tips: string[] // 制作贴士
    warnings?: string[] // 注意事项（婴幼儿）
    ageSuitability?: string // 适合年龄说明（婴幼儿）
}

// 营养餐生成请求
export interface NutritionMealRequest {
    profile: FitnessProfile | BabyProfile
    mealTypes: MealType[]
    mode: 'fitness' | 'baby'
    specialRequirements?: string[] // 特殊要求
}
