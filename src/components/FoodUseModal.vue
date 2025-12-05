<template>
    <div v-if="show" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div class="bg-white rounded-lg border-2 border-[#0A0910] max-w-md w-full">
            <!-- 弹窗头部 -->
            <div class="p-4 border-b-2 border-[#0A0910] bg-gradient-to-r from-green-100 to-emerald-100">
                <div class="flex items-center justify-between">
                    <h3 class="text-lg font-bold text-gray-800">使用食材</h3>
                    <button
                        @click="closeModal"
                        class="text-gray-500 hover:text-gray-700 text-xl leading-none"
                    >
                        ✕
                    </button>
                </div>
            </div>

            <!-- 弹窗内容 -->
            <div class="p-6">
                <div class="text-center mb-6">
                    <div class="text-2xl mb-2">◈</div>
                    <h4 class="font-medium text-gray-900 text-lg">{{ food?.food_name }}</h4>
                    <p class="text-sm text-gray-500 mt-1">
                        当前库存：{{ food?.quantity }} {{ food?.unit }}
                    </p>
                </div>

                <!-- 使用数量选择 -->
                <div class="mb-6">
                    <label class="block text-sm font-medium text-gray-700 mb-3">
                        使用数量：
                    </label>
                    <div class="flex items-center justify-center gap-3">
                        <button
                            @click="decreaseQuantity"
                            :disabled="useQuantity <= 1"
                            class="w-8 h-8 bg-gray-200 hover:bg-gray-300 rounded-full flex items-center justify-center text-sm disabled:opacity-50"
                        >
                            -
                        </button>
                        <div class="flex items-center gap-2">
                            <input
                                v-model.number="useQuantity"
                                type="number"
                                :min="1"
                                :max="food?.quantity || 0"
                                class="w-20 text-center border border-gray-300 rounded px-2 py-1"
                            />
                            <select
                                v-model="useUnit"
                                class="text-sm border border-gray-300 rounded px-2 py-1"
                            >
                                <option value="个">个</option>
                                <option value="克">克</option>
                                <option value="千克">千克</option>
                                <option value="毫升">毫升</option>
                                <option value="升">升</option>
                                <option value="包">包</option>
                                <option value="袋">袋</option>
                                <option value="盒">盒</option>
                            </select>
                        </div>
                        <button
                            @click="increaseQuantity"
                            :disabled="useQuantity >= (food?.quantity || 0)"
                            class="w-8 h-8 bg-gray-200 hover:bg-gray-300 rounded-full flex items-center justify-center text-sm"
                        >
                            +
                        </button>
                    </div>
                    <p class="text-xs text-gray-500 text-center mt-2">
                        剩余库存：{{ Math.max(0, (food?.quantity || 0) - useQuantity) }} {{ food?.unit }}
                    </p>
                </div>

                <!-- 按钮组 -->
                <div class="flex gap-3">
                    <button
                        @click="useFood"
                        :disabled="useQuantity <= 0 || useQuantity > (food?.quantity || 0)"
                        class="flex-1 bg-green-500 hover:bg-green-600 disabled:bg-gray-300 text-white px-4 py-3 rounded-lg border-2 border-[#0A0910] transition-colors disabled:cursor-not-allowed"
                    >
                        ◈ 吃！
                    </button>
                    <button
                        @click="useAllFood"
                        class="flex-1 bg-red-500 hover:bg-red-600 text-white px-4 py-3 rounded-lg border-2 border-[#0A0910] transition-colors"
                    >
                        😋 我全吃了
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { FoodService, type Food } from '@/services/foodService'

// Props
interface Props {
  show: boolean
  food: Food | null
}

const props = defineProps<Props>()

// Emits
interface Emits {
  (e: 'close'): void
  (e: 'success'): void
}

const emit = defineEmits<Emits>()

// 响应式数据
const useQuantity = ref(1)
const useUnit = ref('个')

// 监听食材变化，重置表单
watch(() => props.food, (newFood) => {
  if (newFood) {
    useQuantity.value = Math.min(1, newFood.quantity)
    useUnit.value = newFood.unit
  }
}, { immediate: true })

// 增加使用数量
const increaseQuantity = () => {
  if (props.food && useQuantity.value < props.food.quantity) {
    useQuantity.value += 1
  }
}

// 减少使用数量
const decreaseQuantity = () => {
  if (useQuantity.value > 1) {
    useQuantity.value -= 1
  }
}

// 关闭弹窗
const closeModal = () => {
  emit('close')
}

// 使用食材
const useFood = async () => {
  if (!props.food) return

  if (useQuantity.value <= 0) {
    alert('请输入有效的使用数量')
    return
  }

  if (useQuantity.value > props.food.quantity) {
    alert('使用数量不能超过库存数量')
    return
  }

  try {
    const success = await FoodService.useFood(props.food.id, useQuantity.value, useUnit.value)
    if (success) {
      emit('success')
      emit('close')
    } else {
      alert('使用食材失败，请重试')
    }
  } catch (error) {
    console.error('使用食材失败:', error)
    alert('使用食材失败，请重试')
  }
}

// 使用全部食材
const useAllFood = async () => {
  if (!props.food) return

  try {
    const success = await FoodService.useAllFood(props.food.id)
    if (success) {
      emit('success')
      emit('close')
    } else {
      alert('使用食材失败，请重试')
    }
  } catch (error) {
    console.error('使用食材失败:', error)
    alert('使用食材失败，请重试')
  }
}
</script>