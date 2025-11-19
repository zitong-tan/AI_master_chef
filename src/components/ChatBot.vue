<template>
    <div class="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
        <!-- 轮播文字提示 -->
        <div v-if="!isOpen" class="bg-white border-2 border-[#0A0910] rounded-lg px-4 py-2 shadow-lg max-w-xs">
            <p class="text-sm font-medium text-gray-800">{{ currentCarousel }}</p>
            <p class="text-xs text-gray-500 mt-1">💡 点击我来使用AI助手</p>
        </div>

        <!-- 机器人按钮 -->
        <button
            v-if="!isOpen"
            @click="toggleChat"
            class="w-32 h-32 rounded-full shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 flex items-center justify-center border-4 border-white overflow-hidden bg-cover bg-center"
            style="background-image: url('/miku.png')"
            :title="currentCarousel"
        >
            <div class="absolute inset-0 bg-black/20 hover:bg-black/10 transition-colors"></div>
        </button>

        <!-- 聊天窗口 -->
        <div
            v-if="isOpen"
            class="fixed bottom-6 right-6 w-96 h-[600px] bg-white rounded-2xl shadow-2xl border-2 border-[#0A0910] flex flex-col overflow-hidden animate-fade-in-up"
        >
            <!-- 头部 -->
            <div class="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-4 flex items-center justify-between">
                <div class="flex items-center gap-2">
                    <img src="/miku111.png" alt="AI助手" class="w-10 h-10 rounded-full object-cover border-2 border-white" />
                    <div>
                        <h3 class="font-bold text-lg">AI美食助手</h3>
                        <p class="text-xs text-blue-100">{{ currentCarousel }}</p>
                    </div>
                </div>
                <button @click="toggleChat" class="text-white hover:bg-white/20 p-2 rounded-lg transition-colors">
                    ✕
                </button>
            </div>

            <!-- 消息区域 -->
            <div ref="messagesContainer" class="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
                <div v-if="messages.length === 0" class="flex flex-col items-center justify-center h-full text-center">
                    <div class="text-4xl mb-2">👋</div>
                    <p class="text-gray-600 font-medium">你好！我是AI美食助手</p>
                    <p class="text-sm text-gray-500 mt-2">有什么我可以帮助你的吗？</p>
                </div>

                <div v-for="(msg, index) in messages" :key="index" :class="['flex', msg.role === 'user' ? 'justify-end' : 'justify-start']">
                    <div
                        :class="[
                            'max-w-xs px-4 py-2 rounded-lg',
                            msg.role === 'user'
                                ? 'bg-blue-500 text-white rounded-br-none'
                                : 'bg-gray-200 text-gray-800 rounded-bl-none'
                        ]"
                    >
                        <p class="text-sm whitespace-pre-wrap break-words">{{ msg.content }}</p>
                    </div>
                </div>

                <!-- 加载状态 -->
                <div v-if="isLoading" class="flex justify-start">
                    <div class="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg rounded-bl-none">
                        <div class="flex gap-1">
                            <div class="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                            <div class="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style="animation-delay: 0.1s"></div>
                            <div class="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style="animation-delay: 0.2s"></div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- 输入区域 -->
            <div class="border-t border-gray-200 p-4 bg-white">
                <div class="flex gap-2">
                    <input
                        v-model="userInput"
                        @keyup.enter="sendMessage"
                        :disabled="isLoading"
                        placeholder="输入你的问题..."
                        class="flex-1 px-3 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 disabled:bg-gray-100 text-sm"
                    />
                    <button
                        @click="sendMessage"
                        :disabled="isLoading || !userInput.trim()"
                        class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-400 transition-colors font-medium text-sm"
                    >
                        发送
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick, computed } from 'vue'
import { chatWithBot, reviewRecipe } from '@/services/chatbotService'

interface Message {
    role: 'user' | 'assistant'
    content: string
}

interface RecipeReview {
    recipeName: string
    ingredients: string[]
    cookingTime: number
    difficulty: string
}

const isOpen = ref(false)
const isLoading = ref(false)
const userInput = ref('')
const messages = ref<Message[]>([])
const messagesContainer = ref<HTMLElement>()
const carouselIndex = ref(0)
const pendingReview = ref<RecipeReview | null>(null)

const carouselTexts = [
    '我喜欢西红柿炒鸡蛋，你也喜欢吗？',
    '今天吃什么呢？让我帮你想想',
    '美食让生活更美好 🍽️',
    '有什么食材吗？我来帮你设计菜谱',
    '烹饪是一种艺术，让我们一起创作',
    '想学做菜吗？我可以教你'
]

const currentCarousel = computed(() => carouselTexts[carouselIndex.value])

// 轮播文字
onMounted(() => {
    setInterval(() => {
        carouselIndex.value = (carouselIndex.value + 1) % carouselTexts.length
    }, 3000)

    // 监听菜谱生成事件
    window.addEventListener('recipeGenerated', handleRecipeGenerated as EventListener)
})

// 处理菜谱生成事件
const handleRecipeGenerated = async (event: any) => {
    const recipe = event.detail
    if (recipe) {
        pendingReview.value = {
            recipeName: recipe.name,
            ingredients: recipe.ingredients,
            cookingTime: recipe.cookingTime,
            difficulty: recipe.difficulty
        }

        // 自动打开聊天窗口
        isOpen.value = true
        await nextTick()

        // 生成菜谱点评
        await generateRecipeReview()
    }
}

// 生成菜谱点评
const generateRecipeReview = async () => {
    if (!pendingReview.value) return

    isLoading.value = true
    try {
        const review = await reviewRecipe(
            pendingReview.value.recipeName,
            pendingReview.value.ingredients,
            pendingReview.value.cookingTime,
            pendingReview.value.difficulty
        )

        // 添加AI点评消息
        messages.value.push({
            role: 'assistant',
            content: `🍽️ 对《${pendingReview.value.recipeName}》的点评：\n\n${review}`
        })

        pendingReview.value = null
    } catch (error) {
        console.error('生成菜谱点评失败:', error)
        messages.value.push({
            role: 'assistant',
            content: '抱歉，我暂时无法对这道菜进行点评。请稍后重试。'
        })
    } finally {
        isLoading.value = false
        await scrollToBottom()
    }
}

// 自动滚动到底部
const scrollToBottom = async () => {
    await nextTick()
    if (messagesContainer.value) {
        messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
    }
}

const toggleChat = () => {
    isOpen.value = !isOpen.value
}

const sendMessage = async () => {
    if (!userInput.value.trim() || isLoading.value) return

    const userMessage = userInput.value.trim()
    userInput.value = ''

    // 添加用户消息
    messages.value.push({
        role: 'user',
        content: userMessage
    })

    await scrollToBottom()

    // 调用AI服务
    isLoading.value = true
    try {
        const response = await chatWithBot(userMessage)
        messages.value.push({
            role: 'assistant',
            content: response
        })
    } catch (error) {
        console.error('聊天失败:', error)
        messages.value.push({
            role: 'assistant',
            content: '抱歉，我暂时无法回答。请稍后重试。'
        })
    } finally {
        isLoading.value = false
        await scrollToBottom()
    }
}
</script>

<style scoped>
@keyframes fade-in-up {
    from {
        opacity: 0;
        transform: translateY(20px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.animate-fade-in-up {
    animation: fade-in-up 0.3s ease-out;
}
</style>
