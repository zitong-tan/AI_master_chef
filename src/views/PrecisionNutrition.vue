<template>
    <div class="min-h-screen bg-blue-400 px-2 md:px-4 py-6 pb-20 md:pb-6">
        <!-- 全局导航 -->
        <GlobalNavigation />

        <div class="max-w-7xl mx-auto">
            <!-- 页面标题 -->
            <div class="mb-6">
                <div class="bg-green-500 text-white px-4 py-2 rounded-t-lg border-2 border-[#0A0910] border-b-0 inline-block">
                    <span class="font-bold">精准营养</span>
                </div>
                <div class="bg-white border-2 border-[#0A0910] rounded-lg rounded-tl-none p-4 md:p-6">
                    <div class="text-center mb-6">
                        <div class="w-16 h-16 bg-green-500 rounded-lg flex items-center justify-center mx-auto mb-4">
                            <span class="text-white text-2xl">⚖️</span>
                        </div>
                        <h2 class="text-2xl font-bold text-gray-800 mb-2">科学营养配比，精准健康生活</h2>
                        <p class="text-gray-600">针对健身人士和婴幼儿的专业营养餐食推荐</p>
                    </div>

                    <!-- 场景切换按钮 -->
                    <div class="flex justify-center gap-4 mb-8">
                        <button
                            @click="switchMode('fitness')"
                            :class="[
                                'px-6 py-3 rounded-lg font-bold border-2 border-[#0A0910] transition-all duration-200 transform hover:scale-105',
                                currentMode === 'fitness' 
                                    ? 'bg-blue-500 text-white' 
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            ]"
                        >
                            <div class="flex items-center gap-2">
                                <span class="text-xl">💪</span>
                                <span>我在健身</span>
                            </div>
                        </button>
                        <button
                            @click="switchMode('baby')"
                            :class="[
                                'px-6 py-3 rounded-lg font-bold border-2 border-[#0A0910] transition-all duration-200 transform hover:scale-105',
                                currentMode === 'baby' 
                                    ? 'bg-pink-500 text-white' 
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            ]"
                        >
                            <div class="flex items-center gap-2">
                                <span class="text-xl">👶</span>
                                <span>我家有小孩子</span>
                            </div>
                        </button>
                    </div>

                    <!-- 健身人士模块 -->
                    <FitnessModule 
                        v-if="currentMode === 'fitness'"
                        @meal-generated="handleMealGenerated" 
                    />

                    <!-- 婴幼儿模块 -->
                    <BabyModule 
                        v-if="currentMode === 'baby'"
                        @meal-generated="handleMealGenerated" 
                    />
                </div>
            </div>
        </div>

        <!-- 底部 -->
        <GlobalFooter />
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import GlobalNavigation from '@/components/GlobalNavigation.vue'
import GlobalFooter from '@/components/GlobalFooter.vue'
import FitnessModule from '@/components/FitnessModule.vue'
import BabyModule from '@/components/BabyModule.vue'
import type { GeneratedMeal } from '@/types'

// 当前模式：fitness 或 baby
const currentMode = ref<'fitness' | 'baby'>('fitness')

// 切换模式
const switchMode = (mode: 'fitness' | 'baby') => {
    currentMode.value = mode
}

// 处理餐食生成结果
const handleMealGenerated = (meal: GeneratedMeal) => {
    console.log('生成的餐食:', meal)
    // 这里可以添加显示结果或其他逻辑
}
</script>

<style scoped>
/* 动画效果 */
@keyframes fadeIn {
    from {
        opacity: 0;
        transform: translateY(20px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.transform {
    animation: fadeIn 0.3s ease-out;
}

/* 响应式调整 */
@media (max-width: 640px) {
    .flex {
        gap: 1rem;
    }
}
</style>