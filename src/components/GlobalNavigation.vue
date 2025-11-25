<template>
    <nav class="bg-white border-2 border-[#0A0910] max-w-7xl mx-auto rounded-lg mb-4 shadow-lg relative z-50">
        <div class="px-4 py-6 md:px-6">
            <!-- 桌面端导航 -->
            <div class="hidden md:flex items-center justify-between">
                <!-- Logo区域 -->
                <router-link to="/" class="flex items-center gap-3 transition-transform duration-200" @click="rotateLogo">
                    <div
                        class="w-24 h-12 bg-gradient-to-br from-red-400 to-blue-500 rounded-lg flex items-center justify-center border-2 border-[#0A0910]"
                        :class="{ 'rotate-logo': isLogoRotating }"
                    >
                        <span class="text-white text-xl font-bold">吃什么</span>
                    </div>
                    <div>
                        <div class="text-2xl font-black text-dark-800 tracking-wider">
                            {{ pageTitle }}
                        </div>
                        <div class="text-xs text-gray-600 font-medium">{{ pageSubtitle }}</div>
                    </div>
                </router-link>

                <!-- 导航菜单 -->
                <div class="flex items-center gap-2">
                    <!-- 设置按钮 -->
                    <SettingsButton class="hidden" />
                    <!-- 主要功能 -->
                    <router-link
                        to="/"
                        class="flex items-center gap-1 px-3 py-2 rounded-lg font-bold border-2 border-[#0A0910] transition-all duration-200 transform hover:scale-105 text-sm"
                        :class="$route.path === '/' ? 'bg-blue-400 text-gray-800' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'"
                    >
                        <span>⌂</span>
                        <span>主页</span>
                    </router-link>
                    
                    <!-- 登录/用户状态按钮 -->
                    <div v-if="!isLoggedIn" class="flex items-center gap-2">
                        <button
                            @click="showLoginModal = true"
                            class="flex items-center gap-1 px-3 py-2 rounded-lg font-bold border-2 border-[#0A0910] transition-all duration-200 transform hover:scale-105 text-sm bg-green-500 text-white hover:bg-green-600"
                        >
                            <span>◉</span>
                            <span>登录</span>
                        </button>
                    </div>
                    
                    <!-- 用户已登录状态 -->
                    <div v-else class="flex items-center gap-2">
                        <div class="flex items-center gap-1 px-3 py-2 rounded-lg font-bold border-2 border-[#0A0910] bg-blue-100 text-blue-800 text-sm">
                            <span>◉</span>
                            <span>{{ currentUserName }}</span>
                        </div>
                    </div>
                    <router-link
                        to="/today-eat"
                        class="flex items-center gap-1 px-3 py-2 rounded-lg font-bold border-2 border-[#0A0910] transition-all duration-200 transform hover:scale-105 text-sm"
                        :class="$route.path === '/today-eat' ? 'bg-blue-400 text-gray-800' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'"
                    >
                        <span>⚄</span>
                        <span>美食盲盒</span>
                    </router-link>
                    <router-link
                        to="/table-design"
                        class="hidden flex items-center gap-1 px-3 py-2 rounded-lg font-bold border-2 border-[#0A0910] transition-all duration-200 transform hover:scale-105 text-sm"
                        :class="$route.path === '/table-design' ? 'bg-blue-400 text-gray-800' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'"
                    >
                        <span>◈</span>
                        <span>满汉全席</span>
                    </router-link>
                    <router-link
                        to="/fortune-cooking"
                        class=" flex items-center gap-1 px-3 py-2 rounded-lg font-bold border-2 border-[#0A0910] transition-all duration-200 transform hover:scale-105 text-sm"
                        :class="$route.path === '/fortune-cooking' ? 'bg-blue-400 text-gray-800' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'"
                    >
                        <span>◉</span>
                        <span>玄学厨房</span>
                    </router-link>
                    <router-link
                        to="/community"
                        class="flex items-center gap-1 px-3 py-2 rounded-lg font-bold border-2 border-[#0A0910] transition-all duration-200 transform hover:scale-105 text-sm"
                        :class="$route.path === '/community' ? 'bg-blue-400 text-gray-800' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'"
                    >
                        <span>◎</span>
                        <span>美食社区</span>
                    </router-link>
                    <router-link
                        to="/sauce-design"
                        class="flex items-center gap-1 px-3 py-2 rounded-lg font-bold border-2 border-[#0A0910] transition-all duration-200 transform hover:scale-105 text-sm"
                        :class="$route.path === '/sauce-design' ? 'bg-blue-400 text-gray-800' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'"
                    >
                        <span>◈</span>
                        <span>酱料大师</span>
                    </router-link>
                    <router-link
                        to="/precision-nutrition"
                        class="flex items-center gap-1 px-3 py-2 rounded-lg font-bold border-2 border-[#0A0910] transition-all duration-200 transform hover:scale-105 text-sm"
                        :class="$route.path === '/precision-nutrition' ? 'bg-blue-400 text-gray-800' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'"
                    >
                        <span>⚖️</span>
                        <span>精准营养</span>
                    </router-link>

                    <!-- 更多菜单下拉 -->
                    <div class="relative z-[100]" @mouseleave="handleMouseLeave">
                        <button
                            @mouseenter="handleMouseEnter"
                            @click="showMoreMenu = !showMoreMenu"
                            :class="[
                                'flex items-center gap-1 px-3 py-2 rounded-lg font-bold border-2 border-[#0A0910] transition-all duration-200 transform hover:scale-105 text-sm',
                                isMoreMenuActive ? 'bg-blue-400 text-gray-800' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            ]"
                        >
                            <span>⋯</span>
                            <span>更多</span>
                        </button>

                        <!-- 下拉菜单 -->
                        <div
                            v-if="showMoreMenu"
                            @mouseenter="handleMouseEnter"
                            class="absolute right-0 top-full mt-0.5 w-48 bg-white border-2 border-[#0A0910] rounded-lg shadow-lg z-[9999] overflow-hidden"
                        >
                            <router-link
                                to="/favorites"
                                @click="showMoreMenu = false"
                                class="flex items-center gap-2 px-4 py-3 text-sm font-bold transition-colors duration-200 hover:bg-gray-100"
                                :class="$route.path === '/favorites' ? 'bg-blue-100 text-gray-800' : 'text-gray-700'"
                            >
                                <span>♥</span>
                                <span>我的收藏</span>
                            </router-link>
                            <router-link
                                to="/my-foods"
                                @click="showMoreMenu = false"
                                class="flex items-center gap-2 px-4 py-3 text-sm font-bold transition-colors duration-200 hover:bg-gray-100"
                                :class="$route.path === '/my-foods' ? 'bg-blue-100 text-gray-800' : 'text-gray-700'"
                            >
                                <span>◆</span>
                                <span>我的食材</span>
                            </router-link>
                            <router-link
                                to="/gallery"
                                @click="showMoreMenu = false"
                                class="flex items-center gap-2 px-4 py-3 text-sm font-bold transition-colors duration-200 hover:bg-gray-100"
                                :class="$route.path === '/gallery' ? 'bg-blue-100 text-gray-800' : 'text-gray-700'"
                            >
                                <span>◫</span>
                                <span>美食图鉴</span>
                            </router-link>
                            <router-link
                                to="/about"
                                @click="showMoreMenu = false"
                                class="flex items-center gap-2 px-4 py-3 text-sm font-bold transition-colors duration-200 hover:bg-gray-100"
                                :class="$route.path === '/about' ? 'bg-blue-100 text-gray-800' : 'text-gray-700'"
                            >
                                <span>◐</span>
                                <span>关于我们</span>
                            </router-link>
                            
                            <!-- 退出登录按钮 -->
                            <div v-if="isLoggedIn" class="border-t border-gray-200">
                                <button
                                    @click="handleLogout"
                                    class="flex items-center gap-2 px-4 py-3 text-sm font-bold w-full text-left transition-colors duration-200 hover:bg-red-100 text-red-600"
                                >
                                    <span>⊗</span>
                                    <span>退出登录</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- 移动端导航 -->
            <div class="md:hidden">
                <!-- 顶部Logo和登录状态 -->
                <div class="flex items-center justify-between">
                    <router-link to="/" class="flex items-center gap-2" @click="rotateLogo">
                        <div
                            class="w-10 h-10 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-lg flex items-center justify-center border-2 border-[#0A0910]"
                            :class="{ 'rotate-logo': isLogoRotating }"
                        >
                            <span class="text-white text-lg font-bold">饭</span>
                        </div>
                        <div>
                            <div class="text-lg font-black text-dark-800 tracking-wider">
                                {{ pageTitle }}
                            </div>
                            <div class="text-xs text-gray-600 font-medium">{{ pageSubtitle }}</div>
                        </div>
                    </router-link>
                    <div class="flex items-center gap-2">
                        <!-- 移动端登录/用户状态 -->
                        <div v-if="!isLoggedIn">
                            <button
                                @click="showLoginModal = true"
                                class="p-2 bg-green-500 text-white rounded-lg border-2 border-[#0A0910] transition-colors hover:bg-green-600"
                            >
                                <span class="text-sm font-bold">登录</span>
                            </button>
                        </div>
                        <div v-else class="flex items-center gap-1">
                            <div class="px-2 py-1 rounded-lg bg-blue-100 text-blue-800 border-2 border-[#0A0910] text-xs font-bold">
                                <span>◉</span>
                                <span>{{ currentUserName }}</span>
                            </div>
                            <button
                                @click="handleLogout"
                                class="p-2 bg-red-500 text-white rounded-lg border-2 border-[#0A0910] transition-colors hover:bg-red-600"
                            >
                                <span class="text-sm font-bold">退出</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </nav>
    
    <!-- 登录弹窗 -->
    <LoginModal 
        v-model:show="showLoginModal"
        @loginSuccess="handleLoginSuccess"
    />
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import SettingsButton from './SettingsButton.vue'
import LoginModal from './LoginModal.vue'
import { AuthService } from '@/services/authService'

const showMoreMenu = ref(false)
const showLoginModal = ref(false)
const isLogoRotating = ref(false)
let hideMenuTimer: NodeJS.Timeout | null = null

// 用户状态
const isLoggedIn = ref(false)
const currentUserName = ref('')

// 初始化用户状态
const initUserState = () => {
  isLoggedIn.value = AuthService.isLoggedIn()
  currentUserName.value = AuthService.getCurrentUserName() || ''
}

// 处理登录成功
const handleLoginSuccess = () => {
  initUserState()
}

// 处理退出登录
const handleLogout = () => {
  AuthService.logout()
  initUserState()
  showMoreMenu.value = false
}

// 组件挂载时初始化用户状态
onMounted(() => {
  initUserState()
})

const rotateLogo = () => {
    isLogoRotating.value = true
    setTimeout(() => {
        isLogoRotating.value = false
    }, 500)
}
const route = useRoute()

// 根据当前路由显示不同的页面标题
const pageTitle = computed(() => {
    switch (route.path) {
        case '/':
            return 'AI美食大师'
        case '/today-eat':
            return '今日吃啥'
        case '/table-design':
            return '一桌好菜师'
        case '/how-to-cook':
            return '菜谱指南'
        case '/sauce-design':
            return '酱料设计大师'
        case '/precision-nutrition':
            return '精准营养'
        case '/fortune-cooking':
            return '玄学厨房'
        case '/community':
            return '美食社区'
        case '/favorites':
            return '我的收藏'
        case '/my-foods':
            return '我的食材'
        case '/gallery':
            return '美食图鉴'
        case '/about':
            return '关于AI美食大师'
        default:
            return 'AI美食大师'
    }
})

const pageSubtitle = computed(() => {
    switch (route.path) {
        case '/':
            return '灶间有AI，顿顿米其林！'
        case '/today-eat':
            return "盲盒美食：'人间美味或黑暗料理'"
        case '/table-design':
            return '让每顿饭，都有剧本！'
        case '/how-to-cook':
            return 'AI大师手把手教学！'
        case '/sauce-design':
            return '专业酱料制作，调味灵魂升华！'
        case '/precision-nutrition':
            return '科学营养配比，精准健康生活！'
        case '/fortune-cooking':
            return '星辰指引美食，占卜预见美味！'
        case '/community':
            return '分享美味，发现更多精彩！'
        case '/favorites':
            return '珍藏美味，随时回味！'
        case '/my-foods':
            return '智能管理食材，新鲜每一天！'
        case '/gallery':
            return '每一帧都是厨艺的封神时刻！'
        case '/about':
            return '算法烹万物，一键即封神！'
        default:
            return 'LEGENDARY STATUS FROM A SINGLE MEAL!'
    }
})

// 检查更多菜单中的页面是否处于活跃状态
const isMoreMenuActive = computed(() => {
    return ['/favorites', '/my-foods', '/gallery', '/about'].includes(route.path)
})

// 处理鼠标进入事件
const handleMouseEnter = () => {
    if (hideMenuTimer) {
        clearTimeout(hideMenuTimer)
        hideMenuTimer = null
    }
    showMoreMenu.value = true
}

// 处理鼠标离开事件
const handleMouseLeave = () => {
    hideMenuTimer = setTimeout(() => {
        showMoreMenu.value = false
    }, 150) // 150ms延迟，给用户足够时间移动鼠标
}
</script>

<style scoped>
/* Logo旋转动画 */
@keyframes rotate {
    0% {
        transform: rotate(0deg);
    }
    100% {
        transform: rotate(360deg);
    }
}

.rotate-logo {
    animation: rotate 0.5s ease-out;
}

/* 移动端菜单展开动画 */
@keyframes slideDown {
    from {
        opacity: 0;
        transform: translateY(-10px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.flex {
    animation: slideDown 0.3s ease-out;
}

/* 下拉菜单动画 */
@keyframes dropDown {
    from {
        opacity: 0;
        transform: translateY(-10px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.absolute {
    animation: dropDown 0.2s ease-out;
}

/* 隐藏滚动条 */
.scrollbar-hide {
    -ms-overflow-style: none;
    scrollbar-width: none;
}

.scrollbar-hide::-webkit-scrollbar {
    display: none;
}
</style>
