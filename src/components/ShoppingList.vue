<template>
    <div class="bg-white border-2 border-[#0A0910] rounded-lg overflow-hidden">
        <!-- 补货清单头部 -->
        <div class="p-4 border-b-2 border-[#0A0910] bg-gradient-to-r from-orange-100 to-pink-100">
            <div class="flex items-center justify-between">
                <div class="flex items-center gap-3">
                    <span class="text-2xl">🛒</span>
                    <div>
                        <h3 class="font-bold text-gray-800 text-lg">补货清单</h3>
                        <p class="text-sm text-gray-600">共 {{ shoppingList.length }} 种食材需要补货</p>
                    </div>
                </div>
                
                <div class="flex items-center gap-2">
                    <button
                        v-if="shoppingList.length > 0"
                        @click="clearAll"
                        class="px-3 py-1 bg-gray-500 hover:bg-gray-600 text-white rounded text-xs border-2 border-[#0A0910] transition-colors"
                        title="清空补货清单"
                    >
                        清空
                    </button>
                    <button
                        v-if="shoppingList.length > 0"
                        @click="confirmPurchase"
                        :disabled="selectedCount === 0"
                        class="px-3 py-1 bg-green-500 hover:bg-green-600 text-white rounded text-xs border-2 border-[#0A0910] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        title="确认购买选中的食材"
                    >
                        🛒 我买啦 ({{ selectedCount }})
                    </button>
                </div>
            </div>
        </div>

        <!-- 补货清单内容 -->
        <div v-if="shoppingList.length > 0" class="max-h-64 overflow-y-auto">
            <div 
                v-for="item in shoppingList" 
                :key="item.id"
                class="p-3 border-b border-gray-100 hover:bg-gray-50 transition-colors"
                :class="{ 'bg-blue-50': item.is_selected }"
            >
                <div class="flex items-center gap-3">
                    <!-- 选择框 -->
                    <label class="flex items-center">
                        <input
                            type="checkbox"
                            v-model="item.is_selected"
                            @change="updateItem(item)"
                            class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                        >
                    </label>
                    
                    <!-- 食材信息 -->
                    <div class="flex-1">
                        <div class="font-medium text-gray-900">{{ item.food_name }}</div>
                        <div class="text-xs text-gray-500 mt-1">
                            参考数量：{{ item.reference_quantity }} {{ item.unit }}
                        </div>
                    </div>
                    
                    <!-- 数量控制 -->
                    <div class="flex items-center gap-2">
                        <button
                            @click="decreaseQuantity(item)"
                            :disabled="item.quantity_to_buy <= 1"
                            class="w-6 h-6 bg-gray-200 hover:bg-gray-300 rounded-full flex items-center justify-center text-xs disabled:opacity-50"
                        >
                            -
                        </button>
                        <span class="text-sm font-medium w-8 text-center">{{ item.quantity_to_buy }}</span>
                        <button
                            @click="increaseQuantity(item)"
                            class="w-6 h-6 bg-gray-200 hover:bg-gray-300 rounded-full flex items-center justify-center text-xs"
                        >
                            +
                        </button>
                    </div>
                    
                    <!-- 单位选择 -->
                    <select
                        v-model="item.unit"
                        @change="updateItem(item)"
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
                    
                    <!-- 删除按钮 -->
                    <button
                        @click="removeItem(item)"
                        class="text-red-500 hover:text-red-700 text-sm"
                        title="从补货清单移除"
                    >
                        ✕
                    </button>
                </div>
            </div>
        </div>
        
        <!-- 空状态 -->
        <div v-else class="p-8 text-center text-gray-500">
            <span class="text-4xl">🛒</span>
            <p class="mt-2">补货清单为空</p>
            <p class="text-sm">点击食材卡片上的"补货"按钮添加食材</p>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { FoodService, type ShoppingListItem } from '@/services/foodService'

// 响应式数据
const shoppingList = ref<ShoppingListItem[]>([])

// 计算属性
const selectedCount = computed(() => {
  return shoppingList.value.filter(item => item.is_selected).length
})

// 生命周期
onMounted(() => {
  refresh()
})

// 刷新补货清单
const refresh = () => {
  shoppingList.value = FoodService.getShoppingList()
}

// 更新补货清单项
const updateItem = (item: ShoppingListItem) => {
  FoodService.updateShoppingListItem(item)
  refresh()
}

// 增加数量
const increaseQuantity = (item: ShoppingListItem) => {
  item.quantity_to_buy += 1
  updateItem(item)
}

// 减少数量
const decreaseQuantity = (item: ShoppingListItem) => {
  if (item.quantity_to_buy > 1) {
    item.quantity_to_buy -= 1
    updateItem(item)
  }
}

// 移除补货清单项
const removeItem = (item: ShoppingListItem) => {
  FoodService.removeFromShoppingList(item.id)
  refresh()
}

// 清空补货清单
const clearAll = () => {
  if (confirm('确定要清空补货清单吗？')) {
    FoodService.clearShoppingList()
    refresh()
  }
}

// 确认购买
const confirmPurchase = async () => {
  if (selectedCount.value === 0) {
    alert('请至少选择一种食材进行购买')
    return
  }
  
  if (confirm(`确定要购买选中的 ${selectedCount.value} 种食材吗？`)) {
    try {
      const success = await FoodService.addPurchasedItemsToFoods(shoppingList.value)
      if (success) {
        // 移除已购买的食材
        const purchasedItems = shoppingList.value.filter(item => item.is_selected)
        purchasedItems.forEach(item => {
          FoodService.removeFromShoppingList(item.id)
        })
        
        refresh()
        
        // 触发购买完成事件
        emit('purchase-complete')
        
        alert('购买成功！食材已添加到食材库中')
      } else {
        alert('购买失败，请重试')
      }
    } catch (error) {
      console.error('购买失败:', error)
      alert('购买失败，请重试')
    }
  }
}

// 定义事件
const emit = defineEmits<{
  'purchase-complete': []
}>()

// 暴露刷新方法给父组件
defineExpose({
  refresh
})
</script>