<template>
    <div class="baby-module space-y-6">
        <!-- 个性化信息采集 -->
        <div class="bg-white border-2 border-[#0A0910] rounded-lg p-6">
            <h3 class="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <span class="text-2xl">👶</span>
                婴幼儿个性化信息
            </h3>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <!-- 基本信息 -->
                <div class="space-y-4">
                    <h4 class="font-bold text-gray-700 mb-3">基本信息</h4>
                    
                    <!-- 年龄段选择 -->
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">年龄段</label>
                        <select
                            v-model="profile.ageGroup"
                            @change="handleAgeGroupChange"
                            class="w-full px-3 py-2 border-2 border-[#0A0910] rounded-lg focus:outline-none focus:border-pink-500"
                        >
                            <option value="">请选择</option>
                            <option value="0-6_months">0-6个月 辅食</option>
                            <option value="7-12_months">7-12个月 断乳餐</option>
                            <option value="1-3_years">1-3岁 营养餐</option>
                        </select>
                    </div>

                    <!-- 具体年龄 -->
                    <div v-if="profile.ageGroup === '0-6_months' || profile.ageGroup === '7-12_months'">
                        <label class="block text-sm font-medium text-gray-700 mb-1">月龄 (个月)</label>
                        <input
                            v-model.number="profile.monthsAge"
                            type="number"
                            :min="getMinAge()"
                            :max="getMaxAge()"
                            class="w-full px-3 py-2 border-2 border-[#0A0910] rounded-lg focus:outline-none focus:border-pink-500"
                            placeholder="请输入月龄"
                        />
                    </div>

                    <div v-if="profile.ageGroup === '1-3_years'">
                        <label class="block text-sm font-medium text-gray-700 mb-1">年龄 (岁)</label>
                        <input
                            v-model.number="profile.yearsAge"
                            type="number"
                            min="1"
                            max="3"
                            class="w-full px-3 py-2 border-2 border-[#0A0910] rounded-lg focus:outline-none focus:border-pink-500"
                            placeholder="请输入年龄"
                        />
                    </div>

                    <!-- 过敏物 -->
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">过敏物（可多选）</label>
                        <div class="space-y-2">
                            <label v-for="allergen in allergenOptions" :key="allergen.value" class="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    :value="allergen.value"
                                    v-model="profile.allergens"
                                    class="w-4 h-4 text-pink-600 border-2 border-[#0A0910] rounded focus:outline-none focus:border-pink-500"
                                />
                                <span class="text-sm">{{ allergen.label }}</span>
                            </label>
                        </div>
                    </div>

                    <!-- 是否已添加辅食 -->
                    <div v-if="profile.ageGroup === '0-6_months' || profile.ageGroup === '7-12_months'">
                        <label class="block text-sm font-medium text-gray-700 mb-1">是否已添加辅食</label>
                        <div class="flex gap-4">
                            <label class="flex items-center gap-2">
                                <input
                                    type="radio"
                                    :value="true"
                                    v-model="profile.hasSupplementaryFood"
                                    class="w-4 h-4 text-pink-600 border-2 border-[#0A0910] rounded focus:outline-none focus:border-pink-500"
                                />
                                <span class="text-sm">是</span>
                            </label>
                            <label class="flex items-center gap-2">
                                <input
                                    type="radio"
                                    :value="false"
                                    v-model="profile.hasSupplementaryFood"
                                    class="w-4 h-4 text-pink-600 border-2 border-[#0A0910] rounded focus:outline-none focus:border-pink-500"
                                />
                                <span class="text-sm">否</span>
                            </label>
                        </div>
                    </div>
                </div>

                <!-- 喂养需求 -->
                <div class="space-y-4">
                    <h4 class="font-bold text-gray-700 mb-3">喂养需求</h4>
                    
                    <!-- 每日餐次 -->
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">每日餐次</label>
                        <select
                            v-model="profile.feedingNeeds.dailyMeals"
                            class="w-full px-3 py-2 border-2 border-[#0A0910] rounded-lg focus:outline-none focus:border-pink-500"
                        >
                            <option value="">请选择</option>
                            <option value="3">3餐</option>
                            <option value="4">4餐</option>
                            <option value="5">5餐</option>
                            <option value="6">6餐</option>
                        </select>
                    </div>

                    <!-- 食材形态 -->
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">食材形态</label>
                        <select
                            v-model="profile.feedingNeeds.foodForm"
                            class="w-full px-3 py-2 border-2 border-[#0A0910] rounded-lg focus:outline-none focus:border-pink-500"
                        >
                            <option value="">请选择</option>
                            <option value="puree">泥糊状</option>
                            <option value="mashed">捣碎状</option>
                            <option value="small_pieces">小块状</option>
                            <option value="finger_food">手指食物</option>
                        </select>
                    </div>

                    <!-- 营养侧重 -->
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">营养侧重</label>
                        <select
                            v-model="profile.feedingNeeds.nutritionFocus"
                            class="w-full px-3 py-2 border-2 border-[#0A0910] rounded-lg focus:outline-none focus:border-pink-500"
                        >
                            <option value="">请选择</option>
                            <option value="balanced">均衡营养</option>
                            <option value="iron_fortified">铁强化</option>
                            <option value="dha_enriched">DHA丰富</option>
                            <option value="calcium_rich">钙丰富</option>
                        </select>
                    </div>
                </div>
            </div>

            <!-- 特殊需求 -->
            <div class="space-y-4 mt-6">
                <h4 class="font-bold text-gray-700 mb-3">特殊需求</h4>
                
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <!-- 是否挑食 -->
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">是否挑食</label>
                        <div class="flex gap-4">
                            <label class="flex items-center gap-2">
                                <input
                                    type="radio"
                                    :value="true"
                                    v-model="profile.specialNeeds.isPicky"
                                    class="w-4 h-4 text-pink-600 border-2 border-[#0A0910] rounded focus:outline-none focus:border-pink-500"
                                />
                                <span class="text-sm">是</span>
                            </label>
                            <label class="flex items-center gap-2">
                                <input
                                    type="radio"
                                    :value="false"
                                    v-model="profile.specialNeeds.isPicky"
                                    class="w-4 h-4 text-pink-600 border-2 border-[#0A0910] rounded focus:outline-none focus:border-pink-500"
                                />
                                <span class="text-sm">否</span>
                            </label>
                        </div>
                    </div>

                    <!-- 是否便秘 -->
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">便秘等问题</label>
                        <div class="flex gap-4">
                            <label class="flex items-center gap-2">
                                <input
                                    type="radio"
                                    :value="true"
                                    v-model="profile.specialNeeds.hasConstipation"
                                    class="w-4 h-4 text-pink-600 border-2 border-[#0A0910] rounded focus:outline-none focus:border-pink-500"
                                />
                                <span class="text-sm">是</span>
                            </label>
                            <label class="flex items-center gap-2">
                                <input
                                    type="radio"
                                    :value="false"
                                    v-model="profile.specialNeeds.hasConstipation"
                                    class="w-4 h-4 text-pink-600 border-2 border-[#0A0910] rounded focus:outline-none focus:border-pink-500"
                                />
                                <span class="text-sm">否</span>
                            </label>
                        </div>
                    </div>
                </div>

                <!-- 其他特殊需求 -->
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">其他特殊需求</label>
                    <textarea
                        v-model="otherNeedsText"
                        @input="handleOtherNeeds"
                        class="w-full px-3 py-2 border-2 border-[#0A0910] rounded-lg focus:outline-none focus:border-pink-500"
                        rows="3"
                        placeholder="请输入其他特殊需求，如腹泻、过敏等"
                    ></textarea>
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
                        class="w-5 h-5 text-pink-600 border-2 border-[#0A0910] rounded focus:outline-none focus:border-pink-500"
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
                class="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 text-white px-8 py-4 rounded-lg font-bold border-2 border-[#0A0910] transition-all duration-200 transform hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed text-lg"
            >
                <span v-if="isLoading" class="flex items-center gap-2">
                    <div class="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    正在生成中...
                </span>
                <span v-else class="flex items-center gap-2">
                    <span>🍼️</span>
                    生成营养餐
                </span>
            </button>
        </div>

        <!-- 生成结果 -->
        <div v-if="generatedMeals.length > 0" class="space-y-6">
            <div v-for="meal in generatedMeals" :key="meal.id" class="bg-white border-2 border-[#0A0910] rounded-lg overflow-hidden">
                <!-- 餐食头部 -->
                <div class="bg-pink-100 border-b-2 border-[#0A0910] p-4">
                    <div class="flex items-center justify-between">
                        <div>
                            <h4 class="text-lg font-bold text-gray-800">{{ meal.name }}</h4>
                            <p class="text-sm text-gray-600">{{ getMealTypeLabel(meal.type) }} - {{ meal.ageSuitability }}</p>
                        </div>
                        <div class="text-right">
                            <span class="text-sm text-gray-500">⏱️ {{ meal.cookingTime }}分钟</span>
                            <span class="ml-2 text-sm text-gray-500">📊 {{ getDifficultyLabel(meal.difficulty) }}</span>
                        </div>
                    </div>
                </div>

                <div class="p-6">
                    <p class="text-gray-700 mb-4">{{ meal.description }}</p>

                    <!-- 过敏警告 -->
                    <div v-if="meal.warnings && meal.warnings.length > 0" class="mb-4">
                        <div class="bg-red-50 border-2 border-red-200 rounded-lg p-4">
                            <h5 class="font-bold text-red-800 mb-2 flex items-center gap-2">
                                <span>⚠️</span>
                                注意事项
                            </h5>
                            <ul class="space-y-1">
                                <li v-for="warning in meal.warnings" :key="warning" class="flex items-start gap-2">
                                    <span class="text-red-600 mt-1">•</span>
                                    <span class="text-red-700">{{ warning }}</span>
                                </li>
                            </ul>
                        </div>
                    </div>

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
                                <div class="flex-shrink-0 w-6 h-6 bg-pink-500 text-white rounded-full flex items-center justify-center font-bold text-sm">
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
                                <div v-if="meal.nutritionInfo.vitamins && meal.nutritionInfo.vitamins.length > 0">
                                    <strong>维生素:</strong> {{ meal.nutritionInfo.vitamins.join(', ') }}
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- 工具使用 -->
                    <div v-if="meal.suitableTools && meal.suitableTools.length > 0" class="mb-6">
                        <h5 class="font-bold text-gray-800 mb-2">🔧 所需工具</h5>
                        <div class="bg-pink-50 border-2 border-pink-200 rounded-lg p-4">
                            <div class="flex flex-wrap gap-2">
                                <span v-for="tool in meal.suitableTools" :key="tool" class="bg-pink-100 text-pink-800 px-3 py-1 rounded-full text-sm font-medium border-2 border-[#0A0910]">
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
import type { BabyProfile, GeneratedMeal, MealType } from '@/types'
import { generateNutritionMeals } from '@/services/precisionNutritionService'

const emit = defineEmits<{
    mealGenerated: [meal: GeneratedMeal]
}>()

// 婴幼儿档案
const profile = ref<BabyProfile>({
    ageGroup: '',
    monthsAge: 0,
    yearsAge: 0,
    allergens: [],
    hasSupplementaryFood: false,
    feedingNeeds: {
        dailyMeals: 3,
        foodForm: 'puree',
        nutritionFocus: 'balanced'
    },
    specialNeeds: {
        isPicky: false,
        hasConstipation: false,
        other: []
    }
})

// 选中的餐次
const selectedMeals = ref<MealType[]>(['breakfast', 'lunch', 'dinner'])

// 生成的餐食
const generatedMeals = ref<GeneratedMeal[]>([])
const isLoading = ref(false)
const otherNeedsText = ref('')

// 选项数据
const allergenOptions = [
    { value: 'milk', label: '牛奶' },
    { value: 'eggs', label: '鸡蛋' },
    { value: 'peanuts', label: '花生' },
    { value: 'tree_nuts', label: '坚果类' },
    { value: 'soy', label: '大豆' },
    { value: 'wheat', label: '小麦' },
    { value: 'fish', label: '鱼类' },
    { value: 'shellfish', label: '贝类' }
]

const mealOptions = [
    { value: 'breakfast', label: '早餐', time: '(6:00-9:00)' },
    { value: 'lunch', label: '午餐', time: '(11:00-14:00)' },
    { value: 'dinner', label: '晚餐', time: '(17:00-20:00)' }
]

// 年龄段变化处理
const handleAgeGroupChange = () => {
    // 重置年龄字段
    profile.value.monthsAge = 0
    profile.value.yearsAge = 0
}

// 获取最小年龄
const getMinAge = () => {
    switch (profile.value.ageGroup) {
        case '0-6_months': return 0
        case '7-12_months': return 7
        case '1-3_years': return 1
        default: return 0
    }
}

// 获取最大年龄
const getMaxAge = () => {
    switch (profile.value.ageGroup) {
        case '0-6_months': return 6
        case '7-12_months': return 12
        case '1-3_years': return 3
        default: return 0
    }
}

// 处理其他特殊需求
const handleOtherNeeds = (event: Event) => {
    const target = event.target as HTMLTextAreaElement
    profile.value.specialNeeds.other = target.value.split(/[，,、]/).filter(item => item.trim())
}

// 表单验证
const isFormValid = computed(() => {
    const hasValidAge = profile.value.ageGroup && 
        (((profile.value.ageGroup === '0-6_months' || profile.value.ageGroup === '7-12_months') && (profile.value.monthsAge ?? 0) > 0) ||
        (profile.value.ageGroup === '1-3_years' && (profile.value.yearsAge ?? 0) > 0))

    return hasValidAge &&
           profile.value.feedingNeeds.dailyMeals > 0 &&
           profile.value.feedingNeeds.foodForm &&
           profile.value.feedingNeeds.nutritionFocus &&
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
            mode: 'baby'
        })

        generatedMeals.value = meals
        
        // 发送事件给父组件
        meals.forEach(meal => {
            emit('mealGenerated', meal)
        })
        
    } catch (error) {
        console.error('生成婴幼儿餐失败:', error)
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

// 获取适合年龄说明
const getAgeSuitability = () => {
    switch (profile.value.ageGroup) {
        case '0-6_months':
            return `适合${profile.value.monthsAge ?? 0}个月宝宝`
        case '7-12_months':
            return `适合${profile.value.monthsAge ?? 0}个月宝宝`
        case '1-3_years':
            return `适合${profile.value.yearsAge ?? 0}岁宝宝`
        default:
            return '适合婴幼儿'
    }
}
</script>

<style scoped>
.baby-module {
    @apply max-w-4xl mx-auto;
}

/* 复选框和单选框样式 */
input[type="checkbox"]:checked,
input[type="radio"]:checked {
    @apply bg-pink-600 text-pink-600 border-pink-600;
}

input[type="checkbox"]:checked::before,
input[type="radio"]:checked::before {
    content: '✓';
    @apply text-white text-xs;
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
        @apply grid-cols-1;
        gap: 1rem;
    }
}
</style>