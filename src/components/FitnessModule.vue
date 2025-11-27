<template>
    <div class="fitness-module space-y-6">
        <!-- 个性化信息采集 -->
        <div class="bg-white border-2 border-[#0A0910] rounded-lg p-6">
            <h3 class="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <span class="text-2xl">💪</span>
                填写您的信息哦！
            </h3>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <!-- 基本信息 -->
                <div class="space-y-4">
                    <h4 class="font-bold text-gray-700 mb-3">基本信息</h4>
                    
                    <!-- 年龄 -->
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">年龄</label>
                        <input
                            v-model.number="profile.age"
                            type="number"
                            min="16"
                            max="100"
                            class="w-full px-3 py-2 border-2 border-[#0A0910] rounded-lg focus:outline-none focus:border-blue-500"
                            placeholder="请输入年龄"
                        />
                    </div>

                    <!-- 性别 -->
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">性别</label>
                        <select
                            v-model="profile.gender"
                            class="w-full px-3 py-2 border-2 border-[#0A0910] rounded-lg focus:outline-none focus:border-blue-500"
                        >
                            <option value="">请选择</option>
                            <option value="male">男性</option>
                            <option value="female">女性</option>
                            <option value="other">其他</option>
                        </select>
                    </div>

                    <!-- 体重 -->
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">体重 (kg)</label>
                        <input
                            v-model.number="profile.weight"
                            type="number"
                            min="30"
                            max="200"
                            step="0.1"
                            class="w-full px-3 py-2 border-2 border-[#0A0910] rounded-lg focus:outline-none focus:border-blue-500"
                            placeholder="请输入体重"
                        />
                    </div>

                    <!-- 身高 -->
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">身高 (cm)</label>
                        <input
                            v-model.number="profile.height"
                            type="number"
                            min="100"
                            max="250"
                            class="w-full px-3 py-2 border-2 border-[#0A0910] rounded-lg focus:outline-none focus:border-blue-500"
                            placeholder="请输入身高"
                        />
                    </div>
                </div>

                <!-- 运动信息 -->
                <div class="space-y-4">
                    <h4 class="font-bold text-gray-700 mb-3">运动信息</h4>
                    
                    <!-- 运动频率 -->
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">运动频率</label>
                        <select
                            v-model="profile.exerciseFrequency"
                            class="w-full px-3 py-2 border-2 border-[#0A0910] rounded-lg focus:outline-none focus:border-blue-500"
                        >
                            <option value="">请选择</option>
                            <option value="rarely">很少运动</option>
                            <option value="1-2_times">每周1-2次</option>
                            <option value="3-4_times">每周3-4次</option>
                            <option value="5+_times">每周5次以上</option>
                        </select>
                    </div>

                    <!-- 运动强度 -->
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">运动强度</label>
                        <select
                            v-model="profile.exerciseIntensity"
                            class="w-full px-3 py-2 border-2 border-[#0A0910] rounded-lg focus:outline-none focus:border-blue-500"
                        >
                            <option value="">请选择</option>
                            <option value="light">轻度运动</option>
                            <option value="moderate">中度运动</option>
                            <option value="high">高强度运动</option>
                            <option value="very_high">极高强度运动</option>
                        </select>
                    </div>

                    <!-- 健身目标 -->
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">细分场景标签</label>
                        <select
                            v-model="profile.fitnessGoal"
                            class="w-full px-3 py-2 border-2 border-[#0A0910] rounded-lg focus:outline-none focus:border-blue-500"
                        >
                            <option value="">请选择</option>
                            <option value="muscle_gain">增肌</option>
                            <option value="fat_loss">减脂</option>
                            <option value="maintain">维持体态</option>
                        </select>
                    </div>

                    <!-- 每日热量目标 -->
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">每日热量目标 (kcal)</label>
                        <input
                            v-model.number="profile.dailyCalorieGoal"
                            type="number"
                            min="1200"
                            max="5000"
                            step="50"
                            class="w-full px-3 py-2 border-2 border-[#0A0910] rounded-lg focus:outline-none focus:border-blue-500"
                            placeholder="请输入每日热量目标"
                        />
                    </div>
                </div>
            </div>

            <!-- 饮食偏好 -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                <div class="space-y-4">
                    <h4 class="font-bold text-gray-700 mb-3">饮食偏好</h4>
                    
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">饮食偏好（可多选也可不选哦）</label>
                        <div class="space-y-2">
                            <label v-for="pref in dietOptions" :key="pref.value" class="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    :value="pref.value"
                                    v-model="profile.dietPreference"
                                    class="w-4 h-4 text-blue-600 border-2 border-[#0A0910] rounded focus:outline-none focus:border-blue-500"
                                />
                                <span class="text-sm">{{ pref.label }}</span>
                            </label>
                        </div>
                    </div>
                </div>

                <div class="space-y-4">
                    <h4 class="font-bold text-gray-700 mb-3">口味与烹饪</h4>
                    
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">偏好口味（可多选也可不选哦）</label>
                        <div class="space-y-2">
                            <label v-for="taste in tasteOptions" :key="taste.value" class="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    :value="taste.value"
                                    v-model="profile.tastePreference"
                                    class="w-4 h-4 text-blue-600 border-2 border-[#0A0910] rounded focus:outline-none focus:border-blue-500"
                                />
                                <span class="text-sm">{{ taste.label }}</span>
                            </label>
                        </div>
                    </div>

                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">烹饪方式（可多选也可不选哦）</label>
                        <div class="space-y-2">
                            <label v-for="method in cookingOptions" :key="method.value" class="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    :value="method.value"
                                    v-model="profile.cookingMethod"
                                    class="w-4 h-4 text-blue-600 border-2 border-[#0A0910] rounded focus:outline-none focus:border-blue-500"
                                />
                                <span class="text-sm">{{ method.label }}</span>
                            </label>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- 餐次选择 -->
        <div class="bg-white border-2 border-[#0A0910] rounded-lg p-6">
            <h3 class="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <span class="text-2xl">🍽️</span>
                选择餐次
            </h3>
            
            <div class="flex flex-wrap gap-4">
                <label v-for="meal in mealOptions" :key="meal.value" class="flex items-center gap-2 cursor-pointer">
                    <input
                        type="checkbox"
                        :value="meal.value"
                        v-model="selectedMeals"
                        class="w-5 h-5 text-blue-600 border-2 border-[#0A0910] rounded focus:outline-none focus:border-blue-500"
                    />
                    <div>
                        <span class="font-medium text-gray-800">{{ meal.label }}</span>
                        <span class="text-sm text-gray-500">{{ meal.time }}</span>
                    </div>
                </label>
            </div>
        </div>

        <!-- 生成按钮 -->
        <div class="text-center">
            <button
                @click="generateMeals"
                :disabled="!isFormValid || isLoading"
                class="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 text-white px-8 py-4 rounded-lg font-bold border-2 border-[#0A0910] transition-all duration-200 transform hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed text-lg"
            >
                <span v-if="isLoading" class="flex items-center gap-2">
                    <div class="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    正在生成中...
                </span>
                <span v-else class="flex items-center gap-2">
                    <span>✨</span>
                    生成营养餐
                </span>
            </button>
        </div>

        <!-- 生成结果 -->
        <div v-if="generatedMeals.length > 0" class="space-y-6">
            <div v-for="meal in generatedMeals" :key="meal.id" class="bg-white border-2 border-[#0A0910] rounded-lg overflow-hidden">
                <!-- 餐食头部 -->
                <div class="bg-blue-100 border-b-2 border-[#0A0910] p-4">
                    <div class="flex items-center justify-between">
                        <div>
                            <h4 class="text-lg font-bold text-gray-800">{{ meal.name }}</h4>
                            <p class="text-sm text-gray-600">{{ getMealTypeLabel(meal.type) }}</p>
                        </div>
                        <div class="text-right">
                            <span class="text-sm text-gray-500">⏱️ {{ meal.cookingTime }}分钟</span>
                            <span class="ml-2 text-sm text-gray-500">📊 {{ getDifficultyLabel(meal.difficulty) }}</span>
                        </div>
                    </div>
                </div>

                <div class="p-6">
                    <p class="text-gray-700 mb-4">{{ meal.description }}</p>

                    <!-- 食材 -->
                    <div class="mb-6">
                        <h5 class="font-bold text-gray-800 mb-2">🥬 食材</h5>
                        <div class="flex flex-wrap gap-2">
                            <span v-for="ingredient in meal.ingredients" :key="ingredient" class="bg-yellow-400 text-dark-800 px-3 py-1 rounded-full text-sm font-medium border-2 border-[#0A0910]">
                                {{ ingredient }}
                            </span>
                        </div>
                    </div>

                    <!-- 制作步骤 -->
                    <div class="mb-6">
                        <h5 class="font-bold text-gray-800 mb-2">📝 制作步骤</h5>
                        <div class="space-y-3">
                            <div v-for="(step, index) in meal.steps" :key="index" class="flex gap-3 p-3 bg-gray-50 rounded border-2 border-gray-200">
                                <div class="flex-shrink-0 w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold text-sm">
                                    {{ index + 1 }}
                                </div>
                                <p class="text-gray-700">{{ step }}</p>
                            </div>
                        </div>
                    </div>

                    <!-- 营养分析 -->
                    <div class="mb-6">
                        <h5 class="font-bold text-gray-800 mb-2">📊 营养分析</h5>
                        <div class="bg-green-50 border-2 border-green-200 rounded-lg p-4">
                            <div class="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                <div><strong>热量:</strong> {{ meal.nutritionInfo.calories }} kcal</div>
                                <div><strong>蛋白质:</strong> {{ meal.nutritionInfo.protein }}g</div>
                                <div><strong>碳水:</strong> {{ meal.nutritionInfo.carbs }}g</div>
                                <div><strong>脂肪:</strong> {{ meal.nutritionInfo.fat }}g</div>
                                <div><strong>纤维:</strong> {{ meal.nutritionInfo.fiber }}g</div>
                                <div v-if="meal.nutritionInfo.iron"><strong>铁:</strong> {{ meal.nutritionInfo.iron }}mg</div>
                                <div v-if="meal.nutritionInfo.calcium"><strong>钙:</strong> {{ meal.nutritionInfo.calcium }}mg</div>
                            </div>
                        </div>
                    </div>

                    <!-- 工具使用 -->
                    <div v-if="meal.suitableTools && meal.suitableTools.length > 0" class="mb-6">
                        <h5 class="font-bold text-gray-800 mb-2">🔧 所需工具</h5>
                        <div class="bg-blue-50 border-2 border-blue-200 rounded-lg p-4">
                            <div class="flex flex-wrap gap-2">
                                <span v-for="tool in meal.suitableTools" :key="tool" class="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium border-2 border-[#0A0910]">
                                    {{ tool }}
                                </span>
                            </div>
                        </div>
                    </div>

                    <!-- 制作贴士 -->
                    <div v-if="meal.tips && meal.tips.length > 0">
                        <h5 class="font-bold text-gray-800 mb-2">💡 制作贴士</h5>
                        <div class="bg-yellow-50 border-2 border-yellow-200 rounded-lg p-4">
                            <ul class="space-y-2">
                                <li v-for="tip in meal.tips" :key="tip" class="flex items-start gap-2">
                                    <span class="text-yellow-600 mt-1">•</span>
                                    <span class="text-gray-700">{{ tip }}</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import type { FitnessProfile, GeneratedMeal, MealType } from '@/types'
import { generateNutritionMeals } from '@/services/precisionNutritionService'

const emit = defineEmits<{
    mealGenerated: [meal: GeneratedMeal]
}>()

// 健身档案
const profile = ref<FitnessProfile>({
    age: 0,
    gender: 'male',
    weight: 70,
    height: 170,
    exerciseFrequency: '3-4_times',
    exerciseIntensity: 'moderate',
    dietPreference: [],
    tastePreference: [],
    cookingMethod: [],
    dailyCalorieGoal: 2000,
    fitnessGoal: 'maintain'
})

// 选中的餐次
const selectedMeals = ref<MealType[]>(['breakfast', 'lunch', 'dinner'])

// 生成的餐食
const generatedMeals = ref<GeneratedMeal[]>([])
const isLoading = ref(false)

// 选项数据
const dietOptions = [
    { value: 'balanced', label: '均衡饮食' },
    { value: 'high_protein', label: '高蛋白饮食' },
    { value: 'low_carb', label: '低碳水饮食' },
    { value: 'low_fat', label: '低脂饮食' },
    { value: 'vegetarian', label: '素食主义' },
    { value: 'keto', label: '生酮饮食' }
]

const tasteOptions = [
    { value: 'sweet', label: '甜味' },
    { value: 'sour', label: '酸味' },
    { value: 'spicy', label: '辣味' },
    { value: 'salty', label: '咸味' },
    { value: 'light', label: '清淡' },
    { value: 'rich', label: '浓郁' }
]

const cookingOptions = [
    { value: 'steaming', label: '蒸煮' },
    { value: 'boiling', label: '水煮' },
    { value: 'stir_frying', label: '爆炒' },
    { value: 'baking', label: '烘烤' },
    { value: 'grilling', label: '烧烤' },
    { value: 'salad', label: '凉拌' }
]

const mealOptions = [
    { value: 'breakfast', label: '早餐', time: '(6:00-9:00)' },
    { value: 'lunch', label: '午餐', time: '(11:00-14:00)' },
    { value: 'dinner', label: '晚餐', time: '(17:00-20:00)' }
]

// 表单验证
const isFormValid = computed(() => {
    return profile.value.age > 0 &&
           profile.value.gender &&
           profile.value.weight > 0 &&
           profile.value.height > 0 &&
           profile.value.exerciseFrequency &&
           profile.value.exerciseIntensity &&
           profile.value.fitnessGoal &&
           profile.value.dailyCalorieGoal > 0 &&
           selectedMeals.value.length > 0
})

// 生成餐食
const generateMeals = async () => {
    if (!isFormValid.value) return

    isLoading.value = true
    
    try {
        // 调用真实的AI服务
        const meals = await generateNutritionMeals({
            profile: profile.value,
            mealTypes: selectedMeals.value,
            mode: 'fitness'
        })

        generatedMeals.value = meals
        
        // 发送事件给父组件
        meals.forEach(meal => {
            emit('mealGenerated', meal)
        })
        
    } catch (error) {
        console.error('生成健身餐失败:', error)
        alert('生成营养餐失败，请检查网络连接或稍后重试')
    } finally {
        isLoading.value = false
    }
}

// 获取餐次标签
const getMealTypeLabel = (type: MealType) => {
    const labels: Record<string, string> = {
        breakfast: '早餐',
        lunch: '午餐', 
        dinner: '晚餐'
    }
    return labels[type] || type
}

// 获取难度标签
const getDifficultyLabel = (difficulty: string) => {
    const labels: Record<string, string> = {
        easy: '简单',
        medium: '中等',
        hard: '困难'
    }
    return labels[difficulty] || difficulty
}
</script>

<style scoped>
.fitness-module {
    max-width: 56rem;
    margin-left: auto;
    margin-right: auto;
}

/* 复选框样式 */
input[type="checkbox"]:checked {
    background-color: rgb(37 99 235);
    color: rgb(37 99 235);
    border-color: rgb(37 99 235);
}

/* 移除重复的对号显示 */
input[type="checkbox"]:checked::before {
    content: '';
}

/* 加载动画 */
@keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
}

.animate-spin {
    animation: spin 1s linear infinite;
}

/* 响应式调整 */
@media (max-width: 768px) {
    .grid {
        grid-template-columns: repeat(1, minmax(0, 1fr));
        gap: 1rem;
    }
}
</style>