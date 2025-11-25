// 精准营养AI配置文件
export interface PrecisionNutritionConfig {
    baseURL: string
    apiKey: string
    model: string
    timeout: number
    temperature: number
}

// 健身人士提示词模板
export const FITNESS_PROMPTS = {
    system: `你是一位专业的运动营养师，精通健身营养学和运动生理学。请根据健身人士的个人信息和需求，生成科学、精准的营养餐食方案。

你的专业能力包括：
1. 精准计算宏量营养素（蛋白质、碳水、脂肪）比例
2. 根据健身目标调整营养配比（增肌/减脂/维持）
3. 考虑运动强度和频率制定合适的能量供给
4. 提供详细的营养分析和制作指导
5. 推荐适合的烹饪工具和注意事项

请确保生成的餐食：
- 符合用户的健身目标和运动强度
- 营养均衡，食材易获取
- 制作方法简单，适合家庭烹饪
- 提供精确的营养数据和热量计算`,

    getUserInfo: (profile: any) => `
用户健身档案：
- 年龄：${profile.age}岁
- 性别：${profile.gender === 'male' ? '男性' : profile.gender === 'female' ? '女性' : '其他'}
- 体重：${profile.weight}kg
- 身高：${profile.height}cm
- 运动频率：${getExerciseFrequencyLabel(profile.exerciseFrequency)}
- 运动强度：${getExerciseIntensityLabel(profile.exerciseIntensity)}
- 健身目标：${getFitnessGoalLabel(profile.fitnessGoal)}
- 每日热量目标：${profile.dailyCalorieGoal}kcal
- 饮食偏好：${profile.dietPreference.join('、') || '无特殊要求'}
- 口味偏好：${profile.tastePreference.join('、') || '无特殊要求'}
- 烹饪方式：${profile.cookingMethod.join('、') || '无特殊要求'}`,

    mealRequest: (mealType: string, profile: any) => `
请为${getMealTypeLabel(mealType)}生成一道营养餐，要求：
1. 热量控制在${calculateTargetCalories(profile, mealType)}kcal左右
2. 蛋白质含量${calculateProteinTarget(profile)}g左右
3. 根据${profile.fitnessGoal}调整营养成分配比
4. 考虑用户口味偏好：${profile.tastePreference.join('、')}
5. 使用${profile.cookingMethod.join('、')}等烹饪方式

请按照以下JSON格式返回：
{
  "name": "餐品名称",
  "description": "详细描述，说明营养特点",
  "ingredients": ["食材1 100g", "食材2 50g"],
  "steps": [
    "步骤1的详细描述",
    "步骤2的详细描述"
  ],
  "cookingTime": 25,
  "difficulty": "easy|medium|hard",
  "suitableTools": ["工具1", "工具2"],
  "tips": ["制作贴士1", "制作贴士2"],
  "nutritionInfo": {
    "calories": 数字,
    "protein": 数字,
    "carbs": 数字,
    "fat": 数字,
    "fiber": 数字,
    "iron": 数字,
    "calcium": 数字,
    "vitamins": ["维生素A", "维生素D"]
  }
}`,

    responseFormat: `请严格按照JSON格式返回，不要包含任何其他文字说明。`
}

// 婴幼儿提示词模板
export const BABY_PROMPTS = {
    system: `你是一位资深的儿科营养师和婴幼儿喂养专家，精通婴幼儿营养学和发育心理学。请根据婴幼儿的月龄、发育情况和特殊需求，生成安全、科学、适合的营养餐食。

你的专业能力包括：
1. 精确匹配不同月龄段的吞咽能力和消化能力
2. 提供关键营养素（铁、钙、维生素D、DHA等）
3. 考虑过敏风险和食品安全
4. 提供辅食添加指导和建议
5. 针对不同喂养需求给出个性化方案

请确保生成的餐食：
- 适合对应月龄段的食物质地和大小
- 营养密度高，份量合适
- 制作过程卫生安全
- 标注可能的过敏原和注意事项
- 提供辅食工具使用指导`,

    getUserInfo: (profile: any) => `
用户婴幼儿档案：
- 年龄段：${getAgeGroupLabel(profile.ageGroup)}
- ${profile.ageGroup === '0-6_months' || profile.ageGroup === '7-12_months' ? `月龄：${profile.monthsAge}个月` : `年龄：${profile.yearsAge}岁`}
- 过敏物：${profile.allergens.join('、') || '无明确过敏'}
- 是否已添加辅食：${profile.hasSupplementaryFood ? '是' : '否'}
- 每日餐次：${profile.feedingNeeds.dailyMeals}次
- 食材形态：${getFoodFormLabel(profile.feedingNeeds.foodForm)}
- 营养侧重：${getNutritionFocusLabel(profile.feedingNeeds.nutritionFocus)}
- 是否挑食：${profile.specialNeeds.isPicky ? '是' : '否'}
- 是否便秘：${profile.specialNeeds.hasConstipation ? '是' : '否'}
- 其他特殊需求：${profile.specialNeeds.other.join('、') || '无'}`,

    mealRequest: (mealType: string, profile: any) => `
请为${getMealTypeLabel(mealType)}生成一道婴幼儿营养餐，要求：
1. 适合${getAgeGroupLabel(profile.ageGroup)}的吞咽能力
2. 食材形态为${getFoodFormLabel(profile.feedingNeeds.foodForm)}
3. 重点补充${getNutritionFocusLabel(profile.feedingNeeds.nutritionFocus)}
4. 避免过敏原：${profile.allergens.join('、')}
5. 考虑${profile.specialNeeds.isPicky ? '挑食' : ''}${profile.specialNeeds.hasConstipation ? '便秘等' : ''}特殊需求
6. 制作简单，卫生安全

请按照以下JSON格式返回：
{
  "name": "餐品名称",
  "description": "详细描述，说明适合年龄段和营养特点",
  "ingredients": ["食材1", "食材2"],
  "steps": [
    "步骤1的详细描述",
    "步骤2的详细描述"
  ],
  "cookingTime": 15,
  "difficulty": "easy|medium|hard",
  "suitableTools": ["辅食机", "研磨碗", "小勺子"],
  "tips": ["制作贴士1", "制作贴士2"],
  "warnings": ["注意事项1", "注意事项2"],
  "ageSuitability": "适合X个月宝宝",
  "nutritionInfo": {
    "calories": 数字,
    "protein": 数字,
    "carbs": 数字,
    "fat": 数字,
    "fiber": 数字,
    "iron": 数字,
    "calcium": 数字,
    "vitamins": ["维生素A", "维生素D", "维生素K"]
  }
}`,

    responseFormat: `请严格按照JSON格式返回，不要包含任何其他文字说明。`
}

// 辅助函数
const getExerciseFrequencyLabel = (frequency: string) => {
    const labels: Record<string, string> = {
        'rarely': '很少运动',
        '1-2_times': '每周1-2次',
        '3-4_times': '每周3-4次',
        '5+_times': '每周5次以上'
    }
    return labels[frequency] || frequency
}

const getExerciseIntensityLabel = (intensity: string) => {
    const labels: Record<string, string> = {
        'light': '轻度运动',
        'moderate': '中度运动',
        'high': '高强度运动',
        'very_high': '极高强度运动'
    }
    return labels[intensity] || intensity
}

const getFitnessGoalLabel = (goal: string) => {
    const labels: Record<string, string> = {
        'muscle_gain': '增肌',
        'fat_loss': '减脂',
        'maintain': '维持体态'
    }
    return labels[goal] || goal
}

const getMealTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
        'breakfast': '早餐',
        'lunch': '午餐',
        'dinner': '晚餐'
    }
    return labels[type] || type
}

const getAgeGroupLabel = (ageGroup: string) => {
    const labels: Record<string, string> = {
        '0-6_months': '0-6个月',
        '7-12_months': '7-12个月',
        '1-3_years': '1-3岁'
    }
    return labels[ageGroup] || ageGroup
}

const getFoodFormLabel = (foodForm: string) => {
    const labels: Record<string, string> = {
        'puree': '泥糊状',
        'mashed': '捣碎状',
        'small_pieces': '小块状',
        'finger_food': '手指食物'
    }
    return labels[foodForm] || foodForm
}

const getNutritionFocusLabel = (nutritionFocus: string) => {
    const labels: Record<string, string> = {
        'balanced': '均衡营养',
        'iron_fortified': '铁强化',
        'dha_enriched': 'DHA丰富',
        'calcium_rich': '钙丰富'
    }
    return labels[nutritionFocus] || nutritionFocus
}

const calculateTargetCalories = (profile: any, mealType: string) => {
    const baseCalories = profile.dailyCalorieGoal
    const mealRatio: Record<string, number> = {
        'breakfast': 0.3,
        'lunch': 0.4,
        'dinner': 0.3
    }
    
    // 根据健身目标调整
    const goalMultiplier: Record<string, number> = {
        'muscle_gain': 1.1,
        'fat_loss': 0.9,
        'maintain': 1.0
    }
    
    return Math.round(baseCalories * (mealRatio[mealType] || 0.33) * (goalMultiplier[profile.fitnessGoal] || 1.0))
}

const calculateProteinTarget = (profile: any) => {
    const baseProtein = profile.weight * 1.6 // 基础蛋白质需求
    
    // 根据健身目标调整
    const goalMultiplier: Record<string, number> = {
        'muscle_gain': 1.5,
        'fat_loss': 1.8,
        'maintain': 1.2
    }
    
    // 根据运动强度调整
    const intensityMultiplier: Record<string, number> = {
        'light': 0.9,
        'moderate': 1.0,
        'high': 1.2,
        'very_high': 1.4
    }
    
    return Math.round(baseProtein * (goalMultiplier[profile.fitnessGoal] || 1.0) * (intensityMultiplier[profile.exerciseIntensity] || 1.0))
}