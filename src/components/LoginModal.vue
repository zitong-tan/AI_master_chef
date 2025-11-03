<template>
  <div v-if="show" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
    <div class="bg-white rounded-lg shadow-xl w-full max-w-md mx-4 border-2 border-[#0A0910]">
      <!-- 弹窗头部 -->
      <div class="flex justify-between items-center p-4 border-b-2 border-[#0A0910]">
        <h3 class="text-lg font-bold text-gray-800">{{ modalTitle }}</h3>
        <button @click="closeModal" class="text-gray-500 hover:text-gray-700 transition-colors">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>

      <!-- 弹窗内容 -->
      <div class="p-6">
        <!-- 错误消息 -->
        <div v-if="errorMessage" class="mb-4 p-3 bg-red-100 border border-red-300 rounded-lg text-red-700 text-sm">
          {{ errorMessage }}
        </div>

        <!-- 成功消息 -->
        <div v-if="successMessage" class="mb-4 p-3 bg-green-100 border border-green-300 rounded-lg text-green-700 text-sm">
          {{ successMessage }}
        </div>

        <!-- 登录表单 -->
        <div v-if="activeTab === 'login'">
          <div class="space-y-4">
            <div>
              <label for="loginUsername" class="block text-sm font-medium text-gray-700 mb-1">用户名</label>
              <input
                id="loginUsername"
                v-model="loginData.user_name"
                type="text"
                class="w-full px-3 py-2 border-2 border-[#0A0910] rounded-lg focus:outline-none focus:border-blue-500 transition-colors"
                placeholder="请输入用户名"
              />
            </div>
            <div>
              <label for="loginPassword" class="block text-sm font-medium text-gray-700 mb-1">密码</label>
              <input
                id="loginPassword"
                v-model="loginData.password"
                type="password"
                class="w-full px-3 py-2 border-2 border-[#0A0910] rounded-lg focus:outline-none focus:border-blue-500 transition-colors"
                placeholder="请输入密码"
              />
            </div>
            <button
              @click="handleLogin"
              :disabled="isLoading"
              class="w-full bg-blue-500 text-white py-2 px-4 rounded-lg font-bold border-2 border-[#0A0910] hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {{ isLoading ? '登录中...' : '登录' }}
            </button>
          </div>
          <div class="mt-4 text-center">
            <button @click="switchToRegister" class="text-blue-500 hover:text-blue-700 text-sm">
              没有账号？立即注册
            </button>
            <button @click="switchToChangePassword" class="ml-4 text-gray-500 hover:text-gray-700 text-sm">
              忘记密码？
            </button>
          </div>
        </div>

        <!-- 注册表单 -->
        <div v-else-if="activeTab === 'register'">
          <div class="space-y-4">
            <div>
              <label for="registerUsername" class="block text-sm font-medium text-gray-700 mb-1">用户名</label>
              <input
                id="registerUsername"
                v-model="registerData.user_name"
                type="text"
                class="w-full px-3 py-2 border-2 border-[#0A0910] rounded-lg focus:outline-none focus:border-blue-500 transition-colors"
                placeholder="请输入用户名"
              />
            </div>
            <div>
              <label for="registerPassword" class="block text-sm font-medium text-gray-700 mb-1">密码</label>
              <input
                id="registerPassword"
                v-model="registerData.password"
                type="password"
                class="w-full px-3 py-2 border-2 border-[#0A0910] rounded-lg focus:outline-none focus:border-blue-500 transition-colors"
                placeholder="请输入密码"
              />
            </div>
            <div>
              <label for="confirmPassword" class="block text-sm font-medium text-gray-700 mb-1">确认密码</label>
              <input
                id="confirmPassword"
                v-model="registerData.confirmPassword"
                type="password"
                class="w-full px-3 py-2 border-2 border-[#0A0910] rounded-lg focus:outline-none focus:border-blue-500 transition-colors"
                placeholder="请再次输入密码"
              />
            </div>
            <button
              @click="handleRegister"
              :disabled="isLoading"
              class="w-full bg-green-500 text-white py-2 px-4 rounded-lg font-bold border-2 border-[#0A0910] hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {{ isLoading ? '注册中...' : '注册' }}
            </button>
          </div>
          <div class="mt-4 text-center">
            <button @click="switchToLogin" class="text-blue-500 hover:text-blue-700 text-sm">
              已有账号？立即登录
            </button>
          </div>
        </div>

        <!-- 修改密码表单 -->
        <div v-else-if="activeTab === 'changePassword'">
          <div class="space-y-4">
            <div>
              <label for="currentPassword" class="block text-sm font-medium text-gray-700 mb-1">当前密码</label>
              <input
                id="currentPassword"
                v-model="changePasswordData.currentPassword"
                type="password"
                class="w-full px-3 py-2 border-2 border-[#0A0910] rounded-lg focus:outline-none focus:border-blue-500 transition-colors"
                placeholder="请输入当前密码"
              />
            </div>
            <div>
              <label for="newPassword" class="block text-sm font-medium text-gray-700 mb-1">新密码</label>
              <input
                id="newPassword"
                v-model="changePasswordData.newPassword"
                type="password"
                class="w-full px-3 py-2 border-2 border-[#0A0910] rounded-lg focus:outline-none focus:border-blue-500 transition-colors"
                placeholder="请输入新密码"
              />
            </div>
            <div>
              <label for="confirmNewPassword" class="block text-sm font-medium text-gray-700 mb-1">确认新密码</label>
              <input
                id="confirmNewPassword"
                v-model="changePasswordData.confirmPassword"
                type="password"
                class="w-full px-3 py-2 border-2 border-[#0A0910] rounded-lg focus:outline-none focus:border-blue-500 transition-colors"
                placeholder="请再次输入新密码"
              />
            </div>
            <button
              @click="handleChangePassword"
              :disabled="isLoading"
              class="w-full bg-orange-500 text-white py-2 px-4 rounded-lg font-bold border-2 border-[#0A0910] hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {{ isLoading ? '修改中...' : '修改密码' }}
            </button>
          </div>
          <div class="mt-4 text-center">
            <button @click="switchToLogin" class="text-blue-500 hover:text-blue-700 text-sm">
              返回登录
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { AuthService, type LoginData, type RegisterData, type ChangePasswordData } from '@/services/authService'

interface Props {
  show: boolean
}

interface Emits {
  (e: 'update:show', value: boolean): void
  (e: 'loginSuccess'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const activeTab = ref<'login' | 'register' | 'changePassword'>('login')
const isLoading = ref(false)
const errorMessage = ref('')
const successMessage = ref('')

// 表单数据
const loginData = ref<LoginData>({
  user_name: '',
  password: ''
})

const registerData = ref<RegisterData>({
  user_name: '',
  password: '',
  confirmPassword: ''
})

const changePasswordData = ref<ChangePasswordData>({
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
})

// 计算模态框标题
const modalTitle = computed(() => {
  switch (activeTab.value) {
    case 'login':
      return '用户登录'
    case 'register':
      return '用户注册'
    case 'changePassword':
      return '修改密码'
    default:
      return '用户登录'
  }
})

// 关闭模态框
const closeModal = () => {
  emit('update:show', false)
  resetForm()
}

// 重置表单
const resetForm = () => {
  loginData.value = { user_name: '', password: '' }
  registerData.value = { user_name: '', password: '', confirmPassword: '' }
  changePasswordData.value = { currentPassword: '', newPassword: '', confirmPassword: '' }
  errorMessage.value = ''
  successMessage.value = ''
  isLoading.value = false
}

// 切换标签页
const switchToLogin = () => {
  activeTab.value = 'login'
  resetForm()
}

const switchToRegister = () => {
  activeTab.value = 'register'
  resetForm()
}

const switchToChangePassword = () => {
  activeTab.value = 'changePassword'
  resetForm()
}

// 处理登录
const handleLogin = async () => {
  if (!loginData.value.user_name || !loginData.value.password) {
    errorMessage.value = '请输入用户名和密码'
    return
  }

  isLoading.value = true
  errorMessage.value = ''

  const result = await AuthService.login(loginData.value)
  
  if (result.success) {
    successMessage.value = '登录成功！'
    setTimeout(() => {
      emit('loginSuccess')
      closeModal()
    }, 1000)
  } else {
    errorMessage.value = result.error || '登录失败'
  }

  isLoading.value = false
}

// 处理注册
const handleRegister = async () => {
  if (!registerData.value.user_name || !registerData.value.password || !registerData.value.confirmPassword) {
    errorMessage.value = '请填写所有字段'
    return
  }

  isLoading.value = true
  errorMessage.value = ''

  const result = await AuthService.register(registerData.value)
  
  if (result.success) {
    successMessage.value = '注册成功！已自动登录'
    setTimeout(() => {
      emit('loginSuccess')
      closeModal()
    }, 1000)
  } else {
    errorMessage.value = result.error || '注册失败'
  }

  isLoading.value = false
}

// 处理修改密码
const handleChangePassword = async () => {
  if (!changePasswordData.value.currentPassword || !changePasswordData.value.newPassword || !changePasswordData.value.confirmPassword) {
    errorMessage.value = '请填写所有字段'
    return
  }

  isLoading.value = true
  errorMessage.value = ''

  const result = await AuthService.changePassword(changePasswordData.value)
  
  if (result.success) {
    successMessage.value = '密码修改成功！'
    setTimeout(() => {
      switchToLogin()
    }, 1000)
  } else {
    errorMessage.value = result.error || '密码修改失败'
  }

  isLoading.value = false
}

// 监听show属性变化
watch(() => props.show, (newValue) => {
  if (newValue) {
    // 如果用户已登录，显示修改密码页面
    if (AuthService.isLoggedIn()) {
      activeTab.value = 'changePassword'
    } else {
      activeTab.value = 'login'
    }
    resetForm()
  }
})
</script>

<style scoped>
/* 添加一些动画效果 */
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
</style>