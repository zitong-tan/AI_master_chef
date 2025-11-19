<template>
    <div class="min-h-screen bg-blue-400 px-2 md:px-4 py-6 pb-20 md:pb-6">
        <!-- 全局导航 -->
        <GlobalNavigation />

        <div class="max-w-7xl mx-auto">
            <!-- 页面标题 -->
            <div class="mb-6">
                <div class="bg-green-500 text-white px-4 py-2 rounded-t-lg border-2 border-[#0A0910] border-b-0 inline-block">
                    <span class="font-bold">我的食材</span>
                </div>
                <div class="bg-white border-2 border-[#0A0910] rounded-lg rounded-tl-none p-4 md:p-6">
                    <div class="flex items-center justify-between">
                        <div class="flex items-center gap-3">
                            <div class="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center">
                                <span class="text-white text-2xl">🥬</span>
                            </div>
                            <div>
                                <h1 class="text-md font-bold text-gray-800">食材管理</h1>
                                <p class="text-gray-600 text-xs">共管理了 {{ foods.length }} 种食材</p>
                            </div>
                        </div>

                        <!-- 操作按钮 -->
                        <div class="flex items-center gap-2">
                            <button
                                @click="showAddFood = true"
                                class="flex items-center gap-1 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg text-sm font-medium border-2 border-[#0A0910] transition-all duration-200 hover:scale-105"
                            >
                                <span>➕</span>
                                <span>添加食材</span>
                            </button>
                            <button
                                v-if="foods.length > 0"
                                @click="clearExpired"
                                class="px-3 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg text-sm font-medium border-2 border-[#0A0910] transition-all duration-200 hover:scale-105"
                            >
                                🗑️ 清理过期
                            </button>
                            <button
                                v-if="foods.length > 0"
                                @click="showClearConfirm = true"
                                class="px-3 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg text-sm font-medium border-2 border-[#0A0910] transition-all duration-200 hover:scale-105"
                            >
                                🗑️ 清空全部
                            </button>
                        </div>
                    </div>

        <!-- 统计信息 -->
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6 mt-4">
            <div class="bg-gradient-to-r from-green-100 to-emerald-100 p-4 rounded-lg border-2 border-[#0A0910]">
                <div class="flex items-center gap-2">
                    <span class="text-2xl">📊</span>
                    <div>
                        <div class="text-lg font-bold text-gray-800">{{ stats.total }}</div>
                        <div class="text-sm text-gray-600">总食材数</div>
                    </div>
                </div>
            </div>

            <div class="bg-gradient-to-r from-yellow-100 to-orange-100 p-4 rounded-lg border-2 border-[#0A0910]">
                <div class="flex items-center gap-2">
                    <span class="text-2xl">⏰</span>
                    <div>
                        <div class="text-lg font-bold text-gray-800">{{ stats.expiringSoon }}</div>
                        <div class="text-sm text-gray-600">即将过期</div>
                    </div>
                </div>
            </div>

            <div class="bg-gradient-to-r from-red-100 to-pink-100 p-4 rounded-lg border-2 border-[#0A0910]">
                <div class="flex items-center gap-2">
                    <span class="text-2xl">⚠️</span>
                    <div>
                        <div class="text-lg font-bold text-gray-800">{{ stats.expired }}</div>
                        <div class="text-sm text-gray-600">已过期</div>
                    </div>
                </div>
            </div>

            <div class="bg-gradient-to-r from-blue-100 to-cyan-100 p-4 rounded-lg border-2 border-[#0A0910]">
                <div class="flex items-center gap-2">
                    <span class="text-2xl">📅</span>
                    <div>
                        <div class="text-lg font-bold text-gray-800">{{ stats.newestAdded }}</div>
                        <div class="text-sm text-gray-600">最近添加</div>
                    </div>
                </div>
            </div>
        </div>

        <!-- 补货清单 - 常驻显示 -->
        <div class="mb-6">
            <ShoppingList 
                ref="shoppingListRef"
                @refresh="refreshFoods"
                @purchase-complete="handlePurchaseComplete"
            />
        </div>
                </div>
            </div>

            <!-- 搜索和筛选 -->
            <div v-if="foods.length > 0" class="mb-6">
                <div class="bg-white border-2 border-[#0A0910] rounded-lg p-4">
                    <div class="flex flex-col md:flex-row gap-4">
                        <!-- 搜索框 -->
                        <div class="flex-1">
                            <input
                                v-model="searchQuery"
                                placeholder="搜索食材名称..."
                                class="w-full p-3 border-2 border-[#0A0910] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
                            />
                        </div>

                        <!-- 保质期筛选 -->
                        <div class="md:w-48">
                            <select v-model="expirationFilter" class="w-full p-3 border-2 border-[#0A0910] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-400">
                                <option value="">全部食材</option>
                                <option value="fresh">新鲜食材</option>
                                <option value="expiring-soon">即将过期</option>
                                <option value="expired">已过期</option>
                            </select>
                        </div>

                        <!-- 排序 -->
                        <div class="md:w-48">
                            <select v-model="sortBy" class="w-full p-3 border-2 border-[#0A0910] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-400">
                                <option value="expiration-asc">保质期临近</option>
                                <option value="expiration-desc">保质期长远</option>
                                <option value="name-asc">名称 A-Z</option>
                                <option value="name-desc">名称 Z-A</option>
                                <option value="date-desc">最新添加</option>
                                <option value="date-asc">最早添加</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>

            <!-- 食材卡片列表 -->
            <div v-if="filteredFoods.length > 0" class="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                <div
                    v-for="food in filteredFoods"
                    :key="food.id"
                    class="bg-white border-2 border-[#0A0910] rounded-lg overflow-hidden hover:shadow-lg transition-all duration-200"
                    :class="getFoodCardClass(food)"
                >
                    <!-- 食材卡片头部 -->
                    <div class="p-4 border-b-2 border-[#0A0910] bg-gradient-to-r from-green-100 to-blue-100">
                        <div class="flex items-center justify-between">
                            <div class="flex items-center gap-2">
                                <span class="text-2xl">{{ getFoodIcon(food.food_name) }}</span>
                                <div>
                                    <h3 class="font-bold text-gray-800 text-lg">{{ food.food_name }}</h3>
                                    <p class="text-sm text-gray-600">{{ food.quantity }} {{ food.unit }}</p>
                                </div>
                            </div>
                            <div class="flex items-center gap-2">
                                <button @click="editFood(food)" class="text-blue-500 hover:text-blue-600 text-sm" title="编辑">✏️</button>
                                <button @click="confirmRemoveFood(food.id)" class="text-red-500 hover:text-red-600 text-sm" title="删除">🗑️</button>
                            </div>
                        </div>
                    </div>

                    <!-- 食材详细信息 -->
                    <div class="p-4">
                        <!-- 保质期信息 -->
                        <div class="mb-3">
                            <div class="flex items-center justify-between text-sm">
                                <span class="text-gray-600">保质期：</span>
                                <span :class="getExpirationTextClass(food)" class="font-medium">
                                    {{ getDaysRemaining(food.expiration_date) }}
                                </span>
                            </div>
                            <div class="mt-1">
                                <div class="h-2 bg-gray-200 rounded-full">
                                    <div 
                                        class="h-full rounded-full transition-all duration-500"
                                        :class="getProgressBarClass(food)"
                                        :style="{ width: getExpirationProgress(food.expiration_date) + '%' }"
                                    ></div>
                                </div>
                            </div>
                        </div>

                        <!-- 储藏建议 -->
                        <div v-if="food.storage_suggestion" class="mb-3">
                            <div class="flex items-start gap-2 text-sm">
                                <span class="text-gray-600">储藏建议：</span>
                                <span class="text-gray-700 flex-1">{{ food.storage_suggestion }}</span>
                            </div>
                        </div>

                        <!-- 添加时间 -->
                        <div class="text-xs text-gray-500">
                            添加于：{{ formatDate(food.created_at) }}
                        </div>
                    </div>

                    <!-- 操作按钮 -->
                    <div class="p-3 bg-gray-50 border-t border-gray-200">
                        <div class="flex gap-2">
                            <button 
                                @click="openUseFoodModal(food)"
                                class="flex-1 px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white text-xs rounded border border-blue-600 transition-colors"
                            >
                                🍽️ 使用
                            </button>
                            <button 
                                @click="addToShoppingList(food)"
                                class="flex-1 px-3 py-1 bg-green-500 hover:bg-green-600 text-white text-xs rounded border border-green-600 transition-colors"
                            >
                                补货
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <!-- 空状态 -->
            <div v-else-if="foods.length === 0" class="text-center py-6">
                <div class="bg-white border-2 border-[#0A0910] rounded-lg p-8">
                    <div class="text-6xl mb-4">🥬</div>
                    <h3 class="text-xl font-bold text-gray-800 mb-2">还没有添加任何食材</h3>
                    <p class="text-gray-600 mb-6">开始管理您的食材库存，避免浪费！</p>
                    <button
                        @click="showAddFood = true"
                        class="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white rounded-lg font-bold border-2 border-[#0A0910] transition-all duration-200 hover:scale-105"
                    >
                        <span>➕</span>
                        <span>添加第一个食材</span>
                    </button>
                </div>
            </div>

            <!-- 搜索无结果 -->
            <div v-else class="text-center py-16">
                <div class="bg-white border-2 border-[#0A0910] rounded-lg p-8">
                    <div class="text-4xl mb-4">🔍</div>
                    <h3 class="text-xl font-bold text-gray-800 mb-2">没有找到匹配的食材</h3>
                    <p class="text-gray-600 mb-4">试试调整搜索条件或筛选选项</p>
                    <button
                        @click="clearFilters"
                        class="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium border-2 border-[#0A0910] transition-all duration-200"
                    >
                        清除筛选条件
                    </button>
                </div>
            </div>
        </div>

        <!-- 添加/编辑食材弹窗 -->
        <FoodModal 
            v-if="showAddFood || editingFood"
            :food="editingFood"
            @close="closeModal"
            @save="saveFood"
        />

        <!-- 清空确认弹窗 -->
        <ConfirmModal
            v-if="showClearConfirm"
            title="确认清空食材"
            message="确定要清空所有食材吗？此操作不可恢复。"
            @confirm="clearAllFoods"
            @cancel="showClearConfirm = false"
        />

        <!-- 单个删除确认弹窗 -->
        <ConfirmModal v-if="removingFoodId" title="确认删除食材" message="确定要删除这个食材吗？" @confirm="removeFood" @cancel="removingFoodId = null" />
        
        <!-- 食材使用弹窗 -->
        <FoodUseModal 
            :show="showUseFoodModal"
            :food="usingFood"
            @close="closeUseFoodModal"
            @success="handleUseFoodSuccess"
        />

        <!-- 底部 -->
        <GlobalFooter />
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import GlobalNavigation from '@/components/GlobalNavigation.vue'
import GlobalFooter from '@/components/GlobalFooter.vue'
import ConfirmModal from '@/components/ConfirmModal.vue'
import FoodModal from '@/components/FoodModal.vue'
import ShoppingList from '@/components/ShoppingList.vue'
import FoodUseModal from '@/components/FoodUseModal.vue'
import { FoodService, type Food, type FoodInput } from '@/services/foodService'

// 响应式数据
const foods = ref<Food[]>([])
const searchQuery = ref('')
const expirationFilter = ref('')
const sortBy = ref('expiration-asc')
const showAddFood = ref(false)
const editingFood = ref<Food | null>(null)
const showClearConfirm = ref(false)
const removingFoodId = ref<number | null>(null)
const shoppingListRef = ref<InstanceType<typeof ShoppingList> | null>(null)
const showUseFoodModal = ref(false)
const usingFood = ref<Food | null>(null)



// 统计信息
const stats = computed(() => {
    const now = new Date()
    const sevenDaysLater = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)
    
    const total = foods.value.length
    const expiringSoon = foods.value.filter(food => {
        const expiration = new Date(food.expiration_date)
        return expiration > now && expiration <= sevenDaysLater
    }).length
    
    const expired = foods.value.filter(food => {
        const expiration = new Date(food.expiration_date)
        return expiration <= now
    }).length
    
    const newestAdded = foods.value.length > 0 
        ? foods.value.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())[0].food_name
        : '无'
    
    return { total, expiringSoon, expired, newestAdded }
})

// 筛选后的食材列表
const filteredFoods = computed(() => {
    let filtered = [...foods.value]

    // 搜索筛选
    if (searchQuery.value.trim()) {
        const query = searchQuery.value.toLowerCase()
        filtered = filtered.filter(
            food => food.food_name.toLowerCase().includes(query)
        )
    }

    // 保质期筛选
    if (expirationFilter.value) {
        const now = new Date()
        const sevenDaysLater = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)
        
        filtered = filtered.filter(food => {
            const expiration = new Date(food.expiration_date)
            switch (expirationFilter.value) {
                case 'fresh':
                    return expiration > sevenDaysLater
                case 'expiring-soon':
                    return expiration > now && expiration <= sevenDaysLater
                case 'expired':
                    return expiration <= now
                default:
                    return true
            }
        })
    }

    // 排序
    filtered.sort((a, b) => {
        switch (sortBy.value) {
            case 'expiration-asc':
                return new Date(a.expiration_date).getTime() - new Date(b.expiration_date).getTime()
            case 'expiration-desc':
                return new Date(b.expiration_date).getTime() - new Date(a.expiration_date).getTime()
            case 'name-asc':
                return a.food_name.localeCompare(b.food_name)
            case 'name-desc':
                return b.food_name.localeCompare(a.food_name)
            case 'date-desc':
                return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
            case 'date-asc':
                return new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
            default:
                return 0
        }
    })

    return filtered
})

// 获取食材图标
const getFoodIcon = (foodName: string) => {
    const icons: Record<string, string> = {
        '鸡蛋': '🥚', '牛奶': '🥛', '牛肉': '🥩', '猪肉': '🥩', '鸡肉': '🍗',
        '鱼': '🐟', '虾': '🦐', '蔬菜': '🥬', '水果': '🍎', '米饭': '🍚',
        '面条': '🍜', '面包': '🍞', '奶酪': '🧀', '黄油': '🧈', '油': '🫒',
        '酱油': '🧂', '盐': '🧂', '糖': '🍬', '面粉': '🌾', '土豆': '🥔',
        '胡萝卜': '🥕', '西红柿': '🍅', '黄瓜': '🥒', '蘑菇': '🍄', '洋葱': '🧅',
        '大蒜': '🧄', '辣椒': '🌶️', '香蕉': '🍌', '苹果': '🍎', '橙子': '🍊',
        '草莓': '🍓', '葡萄': '🍇', '西瓜': '🍉', '菠萝': '🍍', '桃子': '🍑'
    }
    
    for (const [key, icon] of Object.entries(icons)) {
        if (foodName.includes(key)) {
            return icon
        }
    }
    
    return '🥬'
}

// 获取剩余天数
const getDaysRemaining = (expirationDate: string) => {
    const now = new Date()
    const expiration = new Date(expirationDate)
    const diffTime = expiration.getTime() - now.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    
    if (diffDays < 0) {
        return `已过期 ${Math.abs(diffDays)} 天`
    } else if (diffDays === 0) {
        return '今天过期'
    } else if (diffDays === 1) {
        return '明天过期'
    } else {
        return `还有 ${diffDays} 天过期`
    }
}

// 获取保质期进度
const getExpirationProgress = (expirationDate: string) => {
    const now = new Date()
    const expiration = new Date(expirationDate)
    const added = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000) // 假设食材添加后30天过期
    const totalDays = expiration.getTime() - added.getTime()
    const passedDays = now.getTime() - added.getTime()
    
    if (totalDays <= 0) return 100
    const progress = Math.min(100, Math.max(0, (passedDays / totalDays) * 100))
    return Math.round(progress)
}

// 获取卡片样式类
const getFoodCardClass = (food: Food) => {
    const now = new Date()
    const expiration = new Date(food.expiration_date)
    const sevenDaysLater = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)
    
    if (expiration <= now) {
        return 'border-red-500 bg-red-50'
    } else if (expiration <= sevenDaysLater) {
        return 'border-yellow-500 bg-yellow-50'
    }
    return ''
}

// 获取保质期文本样式类
const getExpirationTextClass = (food: Food) => {
    const now = new Date()
    const expiration = new Date(food.expiration_date)
    const sevenDaysLater = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)
    
    if (expiration <= now) {
        return 'text-red-600'
    } else if (expiration <= sevenDaysLater) {
        return 'text-yellow-600'
    }
    return 'text-green-600'
}

// 获取进度条样式类
const getProgressBarClass = (food: Food) => {
    const now = new Date()
    const expiration = new Date(food.expiration_date)
    const sevenDaysLater = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)
    
    if (expiration <= now) {
        return 'bg-red-500'
    } else if (expiration <= sevenDaysLater) {
        return 'bg-yellow-500'
    }
    return 'bg-green-500'
}

// 格式化日期
const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('zh-CN', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    })
}

// 刷新食材列表
const refreshFoods = async () => {
    foods.value = await FoodService.getFoods()
}

// 添加/编辑食材
const editFood = (food: Food) => {
    editingFood.value = food
}

const closeModal = () => {
    showAddFood.value = false
    editingFood.value = null
}

const saveFood = async (foodData: FoodInput) => {
    const success = editingFood.value 
        ? await FoodService.updateFood(editingFood.value.id, foodData)
        : await FoodService.addFood(foodData)
    
    if (success) {
        refreshFoods()
        showToast(editingFood.value ? '食材已更新' : '食材添加成功', 'success')
    } else {
        showToast(editingFood.value ? '更新失败' : '添加失败', 'error')
    }
    closeModal()
}

// 删除食材
const confirmRemoveFood = (foodId: number) => {
    removingFoodId.value = foodId
}

const removeFood = async () => {
    if (!removingFoodId.value) return

    const success = await FoodService.removeFood(removingFoodId.value)
    if (success) {
        refreshFoods()
        showToast('食材已删除', 'info')
    } else {
        showToast('删除失败', 'error')
    }
    removingFoodId.value = null
}

// 打开使用食材弹窗
const openUseFoodModal = (food: Food) => {
    usingFood.value = food
    showUseFoodModal.value = true
}

// 关闭使用食材弹窗
const closeUseFoodModal = () => {
    showUseFoodModal.value = false
    usingFood.value = null
}

// 处理使用食材成功
const handleUseFoodSuccess = () => {
    showToast('食材使用成功！', 'success')
    refreshFoods()
}

// 使用食材（保留原函数作为备用）
const useFood = (food: Food) => {
    openUseFoodModal(food)
}

// 添加到补货清单
const addToShoppingList = (food: Food) => {
  const success = FoodService.addToShoppingList(food)
  if (success) {
    showToast(`已将 ${food.food_name} 添加到补货清单`, 'success')
    // 刷新补货清单组件
    shoppingListRef.value?.refresh()
  } else {
    showToast(`添加 ${food.food_name} 到补货清单失败`, 'error')
  }
}

// 清理过期食材
const clearExpired = async () => {
    const success = await FoodService.clearExpiredFoods()
    if (success) {
        refreshFoods()
        showToast('已清理过期食材', 'info')
    } else {
        showToast('清理失败', 'error')
    }
}

// 清空所有食材
const clearAllFoods = async () => {
    const success = await FoodService.clearAllFoods()
    if (success) {
        refreshFoods()
        showToast('已清空所有食材', 'info')
    } else {
        showToast('清空失败', 'error')
    }
    showClearConfirm.value = false
}

// 清除筛选条件
const clearFilters = () => {
    searchQuery.value = ''
    expirationFilter.value = ''
    sortBy.value = 'expiration-asc'
}

// 处理购买完成
const handlePurchaseComplete = () => {
  showToast('购买完成！补货清单已清空', 'success')
}

// 简单的提示功能
const showToast = (message: string, type: 'success' | 'error' | 'warning' | 'info') => {
    const toast = document.createElement('div')
    toast.className = `fixed top-4 right-4 px-4 py-2 rounded-lg text-white text-sm font-medium z-50 transition-all duration-300 transform translate-x-full`

    const styles = {
        success: 'bg-green-500',
        error: 'bg-red-500',
        warning: 'bg-yellow-500',
        info: 'bg-blue-500'
    }

    toast.className += ` ${styles[type]}`
    toast.textContent = message

    document.body.appendChild(toast)

    setTimeout(() => {
        toast.style.transform = 'translateX(0)'
    }, 10)

    setTimeout(() => {
        toast.style.transform = 'translateX(full)'
        setTimeout(() => {
            document.body.removeChild(toast)
        }, 300)
    }, 2000)
}

// 初始化
onMounted(() => {
    refreshFoods()
})
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

.hover\:scale-\[1\.02\]:hover {
    transform: scale(1.02);
}

/* 响应式调整 */
@media (max-width: 640px) {
    .grid-cols-1 {
        gap: 1rem;
    }
}
</style>