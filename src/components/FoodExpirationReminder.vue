<template>
  <Teleport to="body">
    <!-- 过期提醒弹窗 -->
    <TransitionGroup name="reminder" tag="div" class="fixed top-4 right-4 z-50 space-y-2">
      <div
        v-for="reminder in reminders"
        :key="reminder.id"
        class="reminder-item max-w-sm p-4 rounded-lg shadow-lg border-2 backdrop-blur-sm"
        :class="reminder.type === 'expired' 
          ? 'bg-red-50 border-red-300 text-red-800' 
          : 'bg-yellow-50 border-yellow-300 text-yellow-800'"
      >
        <div class="flex items-start gap-3">
          <!-- 图标 -->
          <div class="flex-shrink-0 mt-0.5">
            <span class="text-2xl">{{ reminder.type === 'expired' ? '◔' : '◑' }}</span>
          </div>
          
          <!-- 内容 -->
          <div class="flex-1 min-w-0">
            <p class="text-sm font-medium leading-tight">
              {{ reminder.message }}
            </p>
            <button
              @click="goToMyFoods"
              class="text-xs mt-1 font-semibold underline hover:no-underline transition-all"
              :class="reminder.type === 'expired' 
                ? 'text-red-700 hover:text-red-900' 
                : 'text-yellow-700 hover:text-yellow-900'"
            >
              点我去处理哦！
            </button>
            <p class="text-xs mt-1 opacity-75">
              {{ reminder.foodName }} · {{ reminder.expirationDate }}
            </p>
          </div>
          
          <!-- 关闭按钮 -->
          <button
            @click="dismissReminder(reminder.id)"
            class="flex-shrink-0 p-1 rounded-full hover:bg-black/10 transition-colors"
          >
            <span class="text-sm">×</span>
          </button>
        </div>
      </div>
    </TransitionGroup>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { FoodService, type Food } from '@/services/foodService'

interface Reminder {
  id: string
  type: 'expiring-soon' | 'expired'
  foodName: string
  expirationDate: string
  message: string
}

const router = useRouter()
const reminders = ref<Reminder[]>([])

// 跳转到我的食材页面
const goToMyFoods = () => {
  router.push('/my-foods')
}

// 检查食材过期情况
const checkFoodExpiration = async () => {
  try {
    const foods = await FoodService.getFoods()
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    const newReminders: Reminder[] = []
    const seenFoods = new Set<string>()
    
    foods.forEach(food => {
      const foodKey = `${food.id}-${food.food_name}`
      if (seenFoods.has(foodKey)) return
      seenFoods.add(foodKey)
      
      const expirationDate = new Date(food.expiration_date)
      expirationDate.setHours(0, 0, 0, 0)
      
      const daysUntilExpiration = Math.ceil((expirationDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
      
      // 已经过期
      if (daysUntilExpiration < 0) {
        newReminders.push({
          id: `expired-${food.id}`,
          type: 'expired',
          foodName: food.food_name,
          expirationDate: food.expiration_date,
          message: `您的【${food.food_name}】已经过期啦，记得把它扔掉哦！`
        })
      }
      // 还有两天过期
      else if (daysUntilExpiration === 2) {
        newReminders.push({
          id: `expiring-2days-${food.id}`,
          type: 'expiring-soon',
          foodName: food.food_name,
          expirationDate: food.expiration_date,
          message: `您的【${food.food_name}】还有两天就要过期啦，记得吃掉它哦！`
        })
      }
      // 还有一天过期
      else if (daysUntilExpiration === 1) {
        newReminders.push({
          id: `expiring-1day-${food.id}`,
          type: 'expiring-soon',
          foodName: food.food_name,
          expirationDate: food.expiration_date,
          message: `您的【${food.food_name}】还有一天就要过期啦，记得吃掉它哦！`
        })
      }
      // 还有三天过期
      else if (daysUntilExpiration === 3) {
        newReminders.push({
          id: `expiring-3days-${food.id}`,
          type: 'expiring-soon',
          foodName: food.food_name,
          expirationDate: food.expiration_date,
          message: `您的【${food.food_name}】还有三天就要过期啦，记得吃掉它哦！`
        })
      }
    })
    
    // 只显示新的提醒
    const existingReminderIds = new Set(reminders.value.map(r => r.id))
    const newUniqueReminders = newReminders.filter(r => !existingReminderIds.has(r.id))
    
    if (newUniqueReminders.length > 0) {
      // 限制同时显示的提醒数量，避免界面过于拥挤
      const maxReminders = 3
      reminders.value = [...reminders.value, ...newUniqueReminders].slice(-maxReminders)
      
      // 自动移除提醒
      newUniqueReminders.forEach(reminder => {
        setTimeout(() => {
          dismissReminder(reminder.id)
        }, 8000) // 8秒后自动移除
      })
    }
  } catch (error) {
    console.error('检查食材过期情况失败:', error)
  }
}

// 移除提醒
const dismissReminder = (reminderId: string) => {
  const index = reminders.value.findIndex(r => r.id === reminderId)
  if (index > -1) {
    reminders.value.splice(index, 1)
  }
}

// 清空所有提醒
const clearAllReminders = () => {
  reminders.value = []
}

let checkInterval: NodeJS.Timeout | null = null

onMounted(() => {
  // 组件挂载时立即检查一次
  checkFoodExpiration()
  
  // 每分钟检查一次（避免频繁检查）
  checkInterval = setInterval(() => {
    checkFoodExpiration()
  }, 60000)
})

onUnmounted(() => {
  if (checkInterval) {
    clearInterval(checkInterval)
  }
})

// 暴露方法给父组件
defineExpose({
  checkFoodExpiration,
  clearAllReminders
})
</script>

<style scoped>
/* 进入和离开动画 */
.reminder-enter-active {
  transition: all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
}

.reminder-leave-active {
  transition: all 0.3s ease-in;
}

.reminder-enter-from {
  opacity: 0;
  transform: translateX(100%);
}

.reminder-leave-to {
  opacity: 0;
  transform: translateX(100%);
}

/* 列表动画 */
.reminder-move {
  transition: transform 0.3s ease;
}

/* 提醒项样式 */
.reminder-item {
  animation: slideInRight 0.3s ease-out;
  min-width: 280px;
  max-width: 400px;
}

/* 脉冲动画效果 */
.reminder-item {
  animation: slideInPulse 0.5s ease-out;
}

@keyframes slideInPulse {
  0% {
    opacity: 0;
    transform: translateX(100%) scale(0.8);
  }
  50% {
    opacity: 1;
    transform: translateX(-10px) scale(1.02);
  }
  100% {
    opacity: 1;
    transform: translateX(0) scale(1);
  }
}

/* 悬停效果 */
.reminder-item:hover {
  transform: translateX(-2px);
  box-shadow: 0 8px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1);
}

/* 响应式设计 */
@media (max-width: 640px) {
  .reminder-item {
    max-width: calc(100vw - 2rem);
    min-width: calc(100vw - 2rem);
  }
}
</style>