<template>
    <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" @click.self="$emit('close')">
        <div class="bg-white rounded-lg border-2 border-[#0A0910] max-w-md w-full max-h-[90vh] overflow-y-auto">
            <!-- 弹窗头部 -->
            <div class="border-b-2 border-black p-4 bg-gradient-to-r from-green-100 to-blue-100">
                <div class="flex items-center justify-between">
                    <h3 class="text-lg font-bold">{{ modalTitle }}</h3>
                    <button @click="$emit('close')" class="text-gray-500 hover:text-gray-700 transition-colors">
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                        </svg>
                    </button>
                </div>
            </div>

            <!-- 弹窗内容 -->
            <div class="p-4">
                <!-- 错误消息 -->
                <div v-if="errorMessage" class="mb-4 p-3 bg-red-100 border border-red-300 rounded-lg text-red-700 text-sm">
                    {{ errorMessage }}
                </div>

                <!-- 成功消息 -->
                <div v-if="successMessage" class="mb-4 p-3 bg-green-100 border border-green-300 rounded-lg text-green-700 text-sm">
                    {{ successMessage }}
                </div>

                <!-- 表单 -->
                <div class="space-y-4">
                    <!-- 食材名称 -->
                    <div>
                        <label for="foodName" class="block text-sm font-medium text-gray-700 mb-1">
                            <span class="text-red-500">*</span> 食材名称
                        </label>
                        <input
                            id="foodName"
                            v-model="formData.food_name"
                            type="text"
                            class="w-full px-3 py-2 border-2 border-[#0A0910] rounded-lg focus:outline-none focus:border-green-500 transition-colors"
                            placeholder="请输入食材名称"
                            @input="handleFoodNameInput"
                        />
                        <div v-if="suggestions.length > 0" class="mt-1 text-xs text-blue-600">
                          哇！居然是{{ suggestions.join('、') }}，系统将自动推荐保质期
                        </div>
                    </div>

                    <!-- 数量和单位 -->
                    <div class="grid grid-cols-2 gap-3">
                        <div>
                            <label for="quantity" class="block text-sm font-medium text-gray-700 mb-1">
                                <span class="text-red-500">*</span> 数量
                            </label>
                            <input
                                id="quantity"
                                v-model="formData.quantity"
                                type="number"
                                min="1"
                                class="w-full px-3 py-2 border-2 border-[#0A0910] rounded-lg focus:outline-none focus:border-green-500 transition-colors"
                                placeholder="数量"
                            />
                        </div>
                        <div>
                            <label for="unit" class="block text-sm font-medium text-gray-700 mb-1">
                                <span class="text-red-500">*</span> 单位
                            </label>
                            <select
                                id="unit"
                                v-model="formData.unit"
                                class="w-full px-3 py-2 border-2 border-[#0A0910] rounded-lg focus:outline-none focus:border-green-500 transition-colors"
                            >
                                <option value="个">个</option>
                                <option value="克">克</option>
                                <option value="千克">千克</option>
                                <option value="毫升">毫升</option>
                                <option value="升">升</option>
                                <option value="包">包</option>
                                <option value="瓶">瓶</option>
                                <option value="袋">袋</option>
                                <option value="盒">盒</option>
                                <option value="份">份</option>
                                <option value="根">根</option>
                                <option value="把">把</option>
                                <option value="片">片</option>
                                <option value="块">块</option>
                            </select>
                        </div>
                    </div>

                    <!-- 保质期 -->
                    <div>
                        <label for="expirationDate" class="block text-sm font-medium text-gray-700 mb-1">
                            <span class="text-red-500">*</span> 保质期
                        </label>
                        <div class="flex gap-2">
                            <input
                                id="expirationDate"
                                v-model="formData.expiration_date"
                                type="date"
                                :min="today"
                                class="flex-1 px-3 py-2 border-2 border-[#0A0910] rounded-lg focus:outline-none focus:border-green-500 transition-colors"
                            />
                            <button
                                @click="autoFillExpiration"
                                class="px-3 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm border-2 border-[#0A0910] transition-colors"
                                title="根据食材名称自动填写保质期"
                            >
                                自动填充
                            </button>
                        </div>
                        <div v-if="autoExpirationDays" class="mt-1 text-xs text-green-600">
                            小小推荐：该食材保质期通常为 {{ autoExpirationDays }} 天，不过还要以实际状态为准哦！
                        </div>
                    </div>

                    <!-- 储藏建议 -->
                    <div>
                        <label for="storageSuggestion" class="block text-sm font-medium text-gray-700 mb-1">
                            储藏建议
                        </label>
                        <textarea
                            id="storageSuggestion"
                            v-model="formData.storage_suggestion"
                            rows="3"
                            class="w-full px-3 py-2 border-2 border-[#0A0910] rounded-lg focus:outline-none focus:border-green-500 transition-colors resize-none"
                            placeholder="请输入储藏建议（可选）"
                        ></textarea>
                        <div class="mt-1 flex gap-2">
                            <button
                                @click="autoFillStorageSuggestion"
                                class="px-2 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded text-xs border border-blue-600 transition-colors"
                                title="根据食材名称自动生成储藏建议"
                            >
                                自动生成
                            </button>
                            <button
                                @click="clearStorageSuggestion"
                                class="px-2 py-1 bg-gray-500 hover:bg-gray-600 text-white rounded text-xs border border-gray-600 transition-colors"
                            >
                                清空
                            </button>
                        </div>
                    </div>

                    <!-- 预览信息 -->
                    <div v-if="showPreview" class="p-3 bg-gray-50 rounded-lg border border-gray-200">
                        <h4 class="text-sm font-medium text-gray-700 mb-2">预览信息</h4>
                        <div class="text-xs text-gray-600 space-y-1">
                            <div>食材：{{ formData.food_name }}（{{ formData.quantity }} {{ formData.unit }}）</div>
                            <div>保质期：{{ formatPreviewDate(formData.expiration_date) }}</div>
                            <div v-if="formData.storage_suggestion">储藏建议：{{ formData.storage_suggestion }}</div>
                        </div>
                    </div>

                    <!-- 操作按钮 -->
                    <div class="flex gap-2 pt-4">
                        <button
                            @click="$emit('close')"
                            class="flex-1 px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg font-medium border-2 border-[#0A0910] transition-all duration-200"
                        >
                            取消
                        </button>
                        <button
                            @click="handleSave"
                            :disabled="!isFormValid || isLoading"
                            class="flex-1 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium border-2 border-[#0A0910] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {{ isLoading ? '保存中...' : '保存' }}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { FoodService, type Food, type FoodInput } from '@/services/foodService'

interface Props {
  food?: Food | null
}

interface Emits {
  (e: 'close'): void
  (e: 'save', foodData: FoodInput): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

// 响应式数据
const formData = ref<FoodInput>({
  food_name: '',
  quantity: 1,
  unit: '个',
  expiration_date: '',
  storage_suggestion: ''
})

const isLoading = ref(false)
const errorMessage = ref('')
const successMessage = ref('')
const autoExpirationDays = ref<number | null>(null)
const suggestions = ref<string[]>([])

// 计算属性
const modalTitle = computed(() => props.food ? '编辑食材' : '添加食材')

const isFormValid = computed(() => {
  return formData.value.food_name.trim() && 
         formData.value.quantity > 0 && 
         formData.value.expiration_date
})

const showPreview = computed(() => {
  return formData.value.food_name.trim() && formData.value.expiration_date
})

const today = computed(() => {
  return new Date().toISOString().split('T')[0]
})

// 常见食材关键词
const commonFoods = [
  '鸡蛋', '牛奶', '牛肉', '猪肉', '鸡肉', '鱼肉', '虾', '蟹', '贝类',
  '白菜', '青菜', '菠菜', '芹菜', '胡萝卜', '土豆', '西红柿', '黄瓜', '蘑菇',
  '苹果', '香蕉', '橙子', '葡萄', '草莓', '西瓜', '哈密瓜', '菠萝',
  '米饭', '面条', '面包', '馒头', '面粉', '大米', '玉米',
  '酱油', '醋', '盐', '糖', '油', '料酒', '味精'
]

// 监听食材名称变化
const handleFoodNameInput = () => {
  const input = formData.value.food_name.toLowerCase()
  suggestions.value = commonFoods.filter(food => 
    food.toLowerCase().includes(input) && input.length >= 2
  )

  // 如果有匹配的食材，自动填充保质期和储藏建议
  if (suggestions.value.length > 0 && !props.food) {
    autoFillExpiration()
    autoFillStorageSuggestion()
  }
}

// 自动填充保质期
const autoFillExpiration = () => {
  if (!formData.value.food_name.trim()) return

  const days = FoodService.getDefaultExpiration(formData.value.food_name)
  autoExpirationDays.value = days
  
  const expirationDate = FoodService.calculateExpirationDate(days)
  formData.value.expiration_date = expirationDate
}

// 自动填充储藏建议
const autoFillStorageSuggestion = () => {
  if (!formData.value.food_name.trim()) return

  const suggestion = FoodService.getStorageSuggestion(formData.value.food_name)
  formData.value.storage_suggestion = suggestion
}

// 清空储藏建议
const clearStorageSuggestion = () => {
  formData.value.storage_suggestion = ''
}

// 格式化预览日期
const formatPreviewDate = (dateString: string) => {
  const date = new Date(dateString)
  const now = new Date()
  const diffTime = date.getTime() - now.getTime()
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  
  if (diffDays === 0) {
    return '今天过期'
  } else if (diffDays === 1) {
    return '明天过期'
  } else if (diffDays > 0) {
    return `还有 ${diffDays} 天过期`
  } else {
    return `已过期 ${Math.abs(diffDays)} 天`
  }
}

// 处理保存
const handleSave = async () => {
  if (!isFormValid.value) return

  isLoading.value = true
  errorMessage.value = ''
  successMessage.value = ''

  try {
    // 验证保质期
    const expirationDate = new Date(formData.value.expiration_date)
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    if (expirationDate < today) {
      errorMessage.value = '保质期不能是过去日期'
      isLoading.value = false
      return
    }

    // 调用父组件保存方法
    emit('save', formData.value)
    
    successMessage.value = props.food ? '食材更新成功' : '食材添加成功'
    
    // 延迟关闭弹窗，让用户看到成功消息
    setTimeout(() => {
      emit('close')
    }, 1000)

  } catch (error) {
    errorMessage.value = '保存失败，请重试'
    console.error('保存食材失败:', error)
  } finally {
    isLoading.value = false
  }
}

// 清空消息
const clearMessages = () => {
  errorMessage.value = ''
  successMessage.value = ''
}

// 初始化表单数据
const initFormData = () => {
  if (props.food) {
    // 编辑模式：填充现有数据
    formData.value = {
      food_name: props.food.food_name,
      quantity: props.food.quantity,
      unit: props.food.unit,
      expiration_date: props.food.expiration_date,
      storage_suggestion: props.food.storage_suggestion || ''
    }
  } else {
    // 添加模式：设置默认值
    formData.value = {
      food_name: '',
      quantity: 1,
      unit: '个',
      expiration_date: FoodService.calculateExpirationDate(7), // 默认7天
      storage_suggestion: ''
    }
  }
  
  clearMessages()
}

// 监听props变化
watch(() => props.food, (newFood) => {
  initFormData()
}, { immediate: true })

// 组件挂载时初始化
onMounted(() => {
  initFormData()
})
</script>

<style scoped>
/* 动画效果 */
.fixed {
  animation: fadeIn 0.2s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.bg-white {
  animation: slideUp 0.3s ease-out;
}

@keyframes slideUp {
  from {
    transform: translateY(20px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

/* 滚动条样式 */
.max-h-\[90vh\]::-webkit-scrollbar {
  width: 6px;
}

.max-h-\[90vh\]::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

.max-h-\[90vh\]::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

.max-h-\[90vh\]::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}
</style>