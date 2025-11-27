<template>
    <!-- 移动端底部导航栏 -->
    <div data-mobile-nav class="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t-2 border-[#0A0910] z-40">
        <!-- 底部主导航 -->
        <div class="flex items-center justify-between py-2 px-4">
            <router-link
                to="/"
                class="flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-all duration-200 text-xs"
                :class="$route.path === '/' ? 'text-blue-600' : 'text-gray-600'"
            >
                <span class="text-xl">🏠️</span>
                <span class="font-medium">主页</span>
            </router-link>
            
            <!-- 操作台 -->
            <div class="relative">
                <button
                    @click="showControlPanel = !showControlPanel; showMyPanel = false; closeChatBot()"
                    class="flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-all duration-200 text-xs"
                    :class="showControlPanel ? 'text-blue-600' : 'text-gray-600'"
                >
                    <span class="text-xl">🍚</span>
                    <span class="font-medium">操作台</span>
                </button>
                
                <!-- 向上展开的操作台菜单 -->
                <div
                    v-if="showControlPanel"
                    class="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-56 bg-white border-2 border-[#0A0910] rounded-lg shadow-lg overflow-hidden"
                >
                    <div class="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-3 text-center font-bold">
                        操作台
                    </div>
                    <div class="p-2 space-y-1">
                        <router-link
                            to="/today-eat"
                            @click="showControlPanel = false"
                            class="flex items-center gap-3 p-3 rounded-lg hover:bg-blue-50 transition-colors"
                            :class="$route.path === '/today-eat' ? 'bg-blue-100 text-blue-700' : 'text-gray-700'"
                        >
                            <span class="text-xl flex items-center justify-center w-6 h-6">🎲</span>
                            <div>
                                <div class="font-bold">美食盲盒</div>
                                <div class="text-xs text-gray-500">随机美食推荐</div>
                            </div>
                        </router-link>
                        <router-link
                            to="/sauce-design"
                            @click="showControlPanel = false"
                            class="flex items-center gap-3 p-3 rounded-lg hover:bg-blue-50 transition-colors"
                            :class="$route.path === '/sauce-design' ? 'bg-blue-100 text-blue-700' : 'text-gray-700'"
                        >
                            <span class="text-xl flex items-center justify-center w-6 h-6">🍝</span>
                            <div>
                                <div class="font-bold">酱料大师</div>
                                <div class="text-xs text-gray-500">专业酱料制作</div>
                            </div>
                        </router-link>
                        <router-link
                            to="/fortune-cooking"
                            @click="showControlPanel = false"
                            class="flex items-center gap-3 p-3 rounded-lg hover:bg-blue-50 transition-colors"
                            :class="$route.path === '/fortune-cooking' ? 'bg-blue-100 text-blue-700' : 'text-gray-700'"
                        >
                            <span class="text-xl flex items-center justify-center w-6 h-6">⭐️</span>
                            <div>
                                <div class="font-bold">玄学厨房</div>
                                <div class="text-xs text-gray-500">星辰指引美食</div>
                            </div>
                        </router-link>
                        <router-link
                            to="/precision-nutrition"
                            @click="showControlPanel = false"
                            class="flex items-center gap-3 p-3 rounded-lg hover:bg-blue-50 transition-colors"
                            :class="$route.path === '/precision-nutrition' ? 'bg-blue-100 text-blue-700' : 'text-gray-700'"
                        >
                            <span class="text-xl flex items-center justify-center w-6 h-6">⚖️</span>
                            <div>
                                <div class="font-bold">精准营养</div>
                                <div class="text-xs text-gray-500">健身人士和婴幼儿的餐食</div>
                            </div>
                        </router-link>
                    </div>
                </div>
            </div>
            
            <!-- AI机器人 -->
            <button
                @click="toggleChatBot"
                class="flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-all duration-200 text-xs text-gray-600 hover:text-blue-600"
            >
                <div class="w-6 h-6 rounded-full overflow-hidden bg-cover bg-center border border-gray-300" style="background-image: url('/miku.png')"></div>
                <span class="font-medium">AI助手</span>
            </button>
            
            <!-- 我的 -->
            <div class="relative">
                <button
                    @click="showMyPanel = !showMyPanel; showControlPanel = false; closeChatBot()"
                    class="flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-all duration-200 text-xs"
                    :class="showMyPanel ? 'text-blue-600' : 'text-gray-600'"
                >
                    <span class="text-xl">😋</span>
                    <span class="font-medium">我的</span>
                </button>
                
                <!-- 向上展开的我的菜单 -->
                <div
                    v-if="showMyPanel"
                    class="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-56 bg-white border-2 border-[#0A0910] rounded-lg shadow-lg overflow-hidden"
                >
                    <div class="bg-gradient-to-r from-green-500 to-teal-600 text-white p-3 text-center font-bold">
                        我的
                    </div>
                    <div class="p-2 space-y-1">
                        <router-link
                            to="/favorites"
                            @click="showMyPanel = false"
                            class="flex items-center gap-3 p-3 rounded-lg hover:bg-green-50 transition-colors"
                            :class="$route.path === '/favorites' ? 'bg-green-100 text-green-700' : 'text-gray-700'"
                        >
                            <span class="text-xl flex items-center justify-center w-6 h-6">❤</span>
                            <div>
                                <div class="font-bold">我的收藏</div>
                                <div class="text-xs text-gray-500">珍藏美味</div>
                            </div>
                        </router-link>
                        <router-link
                            to="/my-foods"
                            @click="showMyPanel = false"
                            class="flex items-center gap-3 p-3 rounded-lg hover:bg-green-50 transition-colors"
                            :class="$route.path === '/my-foods' ? 'bg-green-100 text-green-700' : 'text-gray-700'"
                        >
                            <span class="text-xl flex items-center justify-center w-6 h-6">🥬</span>
                            <div>
                                <div class="font-bold">我的食材</div>
                                <div class="text-xs text-gray-500">智能管理食材</div>
                            </div>
                        </router-link>
                        <router-link
                            to="/gallery"
                            @click="showMyPanel = false"
                            class="flex items-center gap-3 p-3 rounded-lg hover:bg-green-50 transition-colors"
                            :class="$route.path === '/gallery' ? 'bg-green-100 text-green-700' : 'text-gray-700'"
                        >
                            <span class="text-xl flex items-center justify-center w-6 h-6">📔</span>
                            <div>
                                <div class="font-bold">美食图鉴</div>
                                <div class="text-xs text-gray-500">厨艺封神时刻</div>
                            </div>
                        </router-link>
                        <router-link
                            to="/about"
                            @click="showMyPanel = false"
                            class="flex items-center gap-3 p-3 rounded-lg hover:bg-green-50 transition-colors"
                            :class="$route.path === '/about' ? 'bg-green-100 text-green-700' : 'text-gray-700'"
                        >
                            <span class="text-xl flex items-center justify-center w-6 h-6">🔖</span>
                            <div>
                                <div class="font-bold">关于我们</div>
                                <div class="text-xs text-gray-500">了解更多</div>
                            </div>
                        </router-link>
                    </div>
                </div>
            </div>
            
            <router-link
                to="/community"
                class="flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-all duration-200 text-xs"
                :class="$route.path === '/community' ? 'text-blue-600' : 'text-gray-600'"
            >
                <span class="text-xl">🍔</span>
                <span class="font-medium">美食社区</span>
            </router-link>
        </div>
    </div>
    
    <!-- 移动端内容底部占位 -->
    <div class="md:hidden h-16"></div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const showControlPanel = ref(false)
const showMyPanel = ref(false)

// 监听路由变化，关闭展开的菜单
watch(() => route.path, () => {
    showControlPanel.value = false
    showMyPanel.value = false
})

// 点击其他地方关闭展开的菜单
onMounted(() => {
    const handleClickOutside = (event: Event) => {
        const target = event.target as HTMLElement
        // 只检查是否在底部导航栏的相对定位容器内
        const mobileNav = target.closest('[data-mobile-nav]')
        if (!mobileNav) {
            showControlPanel.value = false
            showMyPanel.value = false
        }
    }
    
    document.addEventListener('click', handleClickOutside)
    
    return () => {
        document.removeEventListener('click', handleClickOutside)
    }
})

// 切换AI聊天机器人
const toggleChatBot = () => {
    // 关闭展开的菜单
    showControlPanel.value = false
    showMyPanel.value = false
    
    // 触发全局事件，由ChatBot组件监听
    window.dispatchEvent(new CustomEvent('toggleChatBot'))
}

// 关闭AI聊天机器人
const closeChatBot = () => {
    // 触发关闭事件
    window.dispatchEvent(new CustomEvent('closeChatBot'))
}
</script>

<style scoped>
/* 展开菜单动画 */
@keyframes slideUp {
    from {
        opacity: 0;
        transform: translateX(-50%) translateY(20px);
    }
    to {
        opacity: 1;
        transform: translateX(-50%) translateY(0);
    }
}

.absolute {
    animation: slideUp 0.3s ease-out;
}

/* 防止内容被底部导航遮挡 */
.h-16 {
    height: 4rem; /* 64px */
}
</style>