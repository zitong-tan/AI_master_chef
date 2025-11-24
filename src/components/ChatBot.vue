<template>
    <!-- 桌面端机器人 -->
    <div 
        ref="chatbotContainer"
        class="hidden md:block fixed z-50 flex flex-col items-end gap-3"
        :style="containerStyle"
    >
        <!-- 轮播文字提示 -->
        <div v-if="!isOpen" class="bg-white/95 backdrop-blur-sm rounded-xl px-4 py-2 shadow-lg w-64 pointer-events-none">
            <p class="text-sm font-medium text-gray-800 text-center">{{ currentCarousel }}</p>
            <p class="text-xs text-gray-500 mt-1 text-center">◉ 点击我来使用AI助手</p>
        </div>

        <!-- 机器人按钮 -->
        <button
            v-if="!isOpen"
            ref="botButton"
            @mousedown="startDrag"
            @click="handleBotClick"
            :class="[
                'w-32 h-32 rounded-full shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 flex items-center justify-center border-4 border-white overflow-hidden bg-cover bg-center relative',
                isDragging ? 'cursor-grabbing scale-110' : 'cursor-move'
            ]"
            style="background-image: url('/miku.png')"
            :title="currentCarousel"
        >
            <div class="absolute inset-0 bg-black/20 hover:bg-black/10 transition-colors"></div>
            <div class="drag-hint">拖动我到任意位置</div>
        </button>

        <!-- 聊天窗口 -->
        <div
            v-if="isOpen"
            ref="chatWindow"
            class="w-96 h-[600px] bg-white rounded-2xl shadow-2xl border-2 border-[#0A0910] flex flex-col overflow-hidden animate-fade-in-up"
            :style="chatWindowStyle"
        >
            <!-- 头部 -->
            <div 
                @mousedown="startDragWindow"
                :class="[
                    'bg-gradient-to-r from-blue-500 to-purple-600 text-white p-4 flex items-center justify-between relative',
                    isDragging ? 'cursor-grabbing' : 'cursor-move'
                ]"
            >
                <div class="flex items-center gap-2">
                    <img src="/miku111.png" alt="AI助手" class="w-10 h-10 rounded-full object-cover border-2 border-white" />
                    <div>
                        <h3 class="font-bold text-lg">AI美食助手</h3>
                        <p class="text-xs text-blue-100">{{ currentCarousel }}</p>
                    </div>
                </div>
                <button @click.stop="toggleChat" class="text-white hover:bg-white/20 p-2 rounded-lg transition-colors z-10">
                    ✕
                </button>
                <div class="drag-hint">拖动窗口到任意位置</div>
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
                    <div class="bg-gray-200 text-gray-800 px-4 py-3 rounded-lg rounded-bl-none max-w-[75%]">
                        <div class="flex items-center gap-2 mb-2">
                            <div class="flex gap-1">
                                <div class="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                                <div class="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style="animation-delay: 0.1s"></div>
                                <div class="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style="animation-delay: 0.2s"></div>
                            </div>
                        </div>
                        <p class="text-sm text-gray-700">{{ loadingText }}</p>
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

    <!-- 移动端聊天窗口 -->
    <div
        v-if="isOpen && isMobile"
        class="md:hidden fixed inset-x-8 bottom-20 top-32 bg-white rounded-2xl shadow-2xl border-2 border-[#0A0910] flex flex-col overflow-hidden animate-fade-in-up z-50"
    >
        <!-- 头部 -->
        <div class="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-2 flex items-center justify-between">
            <div class="flex items-center gap-1.5">
                <img src="/miku111.png" alt="AI助手" class="w-6 h-6 rounded-full object-cover border border-white" />
                <div>
                    <h3 class="font-bold text-base">AI美食助手</h3>
                    <p class="text-xs text-blue-100 hidden">{{ currentCarousel }}</p>
                </div>
            </div>
            <button @click="toggleChat" class="text-white hover:bg-white/20 p-1.5 rounded-lg transition-colors text-base">
                ✕
            </button>
        </div>

        <!-- 消息区域 -->
        <div ref="messagesContainer" class="flex-1 overflow-y-auto p-2 space-y-2 bg-gray-50">
            <div v-if="messages.length === 0" class="flex flex-col items-center justify-center h-full text-center">
                <div class="text-2xl mb-1">👋</div>
                <p class="text-gray-600 font-medium text-sm">你好！我是AI美食助手</p>
                <p class="text-xs text-gray-400 mt-1">有什么我可以帮助你的吗？</p>
            </div>

            <div v-for="(msg, index) in messages" :key="index" :class="['flex', msg.role === 'user' ? 'justify-end' : 'justify-start']">
                <div
                    :class="[
                        'max-w-[75%] px-2 py-1.5 rounded-lg',
                        msg.role === 'user'
                            ? 'bg-blue-500 text-white rounded-br-none'
                            : 'bg-gray-200 text-gray-800 rounded-bl-none'
                    ]"
                >
                    <p class="text-sm whitespace-pre-wrap break-words leading-normal">{{ msg.content }}</p>
                </div>
            </div>

            <!-- 加载状态 -->
            <div v-if="isLoading" class="flex justify-start">
                <div class="bg-gray-200 text-gray-800 px-2 py-2 rounded-lg rounded-bl-none max-w-[75%]">
                    <div class="flex items-center gap-1 mb-1">
                        <div class="flex gap-0.5">
                            <div class="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce"></div>
                            <div class="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce" style="animation-delay: 0.1s"></div>
                            <div class="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce" style="animation-delay: 0.2s"></div>
                        </div>
                    </div>
                    <p class="text-xs text-gray-700">{{ loadingText }}</p>
                </div>
            </div>
        </div>

        <!-- 输入区域 -->
        <div class="border-t border-gray-200 p-2 bg-white">
            <div class="flex gap-1.5">
                <input
                    v-model="userInput"
                    @keyup.enter="sendMessage"
                    :disabled="isLoading"
                    placeholder="输入..."
                    class="flex-1 px-2 py-1.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 disabled:bg-gray-100"
                />
                <button
                    @click="sendMessage"
                    :disabled="isLoading || !userInput.trim()"
                    class="px-2 py-1.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-400 transition-colors font-medium text-sm"
                >
                    发送
                </button>
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
const isMobile = ref(false)
const loadingText = ref('正在思考中...')

// 拖动相关
const chatbotContainer = ref<HTMLElement>()
const botButton = ref<HTMLElement>()
const chatWindow = ref<HTMLElement>()
const isDragging = ref(false)
const hasMoved = ref(false)
const position = ref({ x: 0, y: 0 })
const dragOffset = ref({ x: 0, y: 0 })
const dragStartPos = ref({ x: 0, y: 0 })

// 计算容器样式
const containerStyle = computed(() => {
    if (position.value.x === 0 && position.value.y === 0) {
        return {
            bottom: '1.5rem',
            right: '1.5rem'
        }
    }
    return {
        left: `${position.value.x}px`,
        top: `${position.value.y}px`,
        bottom: 'auto',
        right: 'auto'
    }
})

// 聊天窗口样式
const chatWindowStyle = computed(() => {
    return {}
})

const carouselTexts = [
    '我喜欢西红柿炒鸡蛋，你也喜欢吗？',
    '今天吃什么呢？让我帮你想想',
    '美食让生活更美好 ◈',
    '有什么食材吗？我来帮你设计菜谱',
    '烹饪是一种艺术，让我们一起创作',
    '想学做菜吗？我可以教你'
]

const currentCarousel = computed(() => carouselTexts[carouselIndex.value])

// 拖动功能
const startDrag = (e: MouseEvent) => {
    if (e.button !== 0) return // 只响应左键
    
    isDragging.value = true
    hasMoved.value = false
    
    // 记录起始位置
    dragStartPos.value = {
        x: e.clientX,
        y: e.clientY
    }
    
    const rect = chatbotContainer.value?.getBoundingClientRect()
    
    if (rect) {
        dragOffset.value = {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
        }
    }
    
    document.addEventListener('mousemove', onDrag)
    document.addEventListener('mouseup', stopDrag)
    e.preventDefault()
    e.stopPropagation()
}

const startDragWindow = (e: MouseEvent) => {
    if (e.button !== 0) return
    
    isDragging.value = true
    hasMoved.value = false
    
    // 记录起始位置
    dragStartPos.value = {
        x: e.clientX,
        y: e.clientY
    }
    
    const rect = chatbotContainer.value?.getBoundingClientRect()
    
    if (rect) {
        dragOffset.value = {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
        }
    }
    
    document.addEventListener('mousemove', onDrag)
    document.addEventListener('mouseup', stopDrag)
    e.preventDefault()
    e.stopPropagation()
}

const onDrag = (e: MouseEvent) => {
    if (!isDragging.value) return
    
    // 计算移动距离
    const deltaX = Math.abs(e.clientX - dragStartPos.value.x)
    const deltaY = Math.abs(e.clientY - dragStartPos.value.y)
    
    // 如果移动距离超过5px，认为是拖动而不是点击
    if (deltaX > 5 || deltaY > 5) {
        hasMoved.value = true
    }
    
    if (hasMoved.value) {
        const newX = e.clientX - dragOffset.value.x
        const newY = e.clientY - dragOffset.value.y
        
        // 边界检测
        const maxX = window.innerWidth - (isOpen.value ? 384 : 128) // 384px = w-96, 128px = w-32
        const maxY = window.innerHeight - (isOpen.value ? 600 : 128)
        
        position.value = {
            x: Math.max(0, Math.min(newX, maxX)),
            y: Math.max(0, Math.min(newY, maxY))
        }
    }
}

const stopDrag = () => {
    isDragging.value = false
    document.removeEventListener('mousemove', onDrag)
    document.removeEventListener('mouseup', stopDrag)
    
    // 重置移动标记（延迟重置，避免影响click事件）
    setTimeout(() => {
        hasMoved.value = false
    }, 10)
}

// 轮播文字
onMounted(() => {
    setInterval(() => {
        carouselIndex.value = (carouselIndex.value + 1) % carouselTexts.length
    }, 3000)

    // 监听菜谱生成事件（新生成菜谱自动分析）
    window.addEventListener('recipeGenerated', handleRecipeGenerated as EventListener)
    
    // 监听询问大师事件（按钮触发）
    window.addEventListener('askMasterAboutRecipe', handleRecipeGenerated as EventListener)
    
    // 监听移动端导航栏的机器人按钮点击事件
    window.addEventListener('toggleChatBot', handleToggleChatBot as EventListener)
    
    // 监听移动端导航栏的机器人关闭事件
    window.addEventListener('closeChatBot', handleCloseChatBot as EventListener)
    
    // 检测移动端
    checkMobile()
    window.addEventListener('resize', checkMobile)
})

// 检测移动端
const checkMobile = () => {
    isMobile.value = window.innerWidth < 768
}

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

// 处理移动端导航栏机器人按钮点击事件
const handleToggleChatBot = () => {
    if (isMobile.value) {
        toggleChat()
    }
}

// 处理移动端导航栏机器人关闭事件
const handleCloseChatBot = () => {
    if (isMobile.value && isOpen.value) {
        isOpen.value = false
    }
}

// 生成菜谱点评
const generateRecipeReview = async () => {
    if (!pendingReview.value) return

    isLoading.value = true
    loadingText.value = '大师正在认真分析哦！请耐心等待一下~'
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
            content: `◈ 对《${pendingReview.value.recipeName}》的点评：\n\n${review}`
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

// 处理机器人按钮点击
const handleBotClick = (e: MouseEvent) => {
    // 如果刚刚拖动过，不触发点击
    if (hasMoved.value) {
        e.preventDefault()
        e.stopPropagation()
        return
    }
    
    toggleChat()
}

const toggleChat = () => {
    isOpen.value = !isOpen.value
    
    // 如果打开窗口，确保位置在可见范围内
    if (isOpen.value) {
        nextTick(() => {
            adjustPosition()
        })
    }
}

// 调整位置确保窗口完全可见
const adjustPosition = () => {
    if (position.value.x === 0 && position.value.y === 0) return
    
    const windowWidth = 384 // w-96
    const windowHeight = 600
    const maxX = window.innerWidth - windowWidth
    const maxY = window.innerHeight - windowHeight
    
    if (position.value.x > maxX || position.value.y > maxY) {
        position.value = {
            x: Math.min(position.value.x, maxX),
            y: Math.min(position.value.y, maxY)
        }
    }
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
    loadingText.value = '正在思考中...'
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

/* 拖动时的样式 */
.dragging {
    cursor: grabbing !important;
    user-select: none;
    opacity: 0.9;
}

.dragging * {
    cursor: grabbing !important;
}

/* 拖动提示 */
.drag-hint {
    position: absolute;
    top: -30px;
    left: 50%;
    transform: translateX(-50%);
    background: rgba(0, 0, 0, 0.8);
    color: white;
    padding: 4px 12px;
    border-radius: 8px;
    font-size: 12px;
    white-space: nowrap;
    pointer-events: none;
    opacity: 0;
    transition: opacity 0.3s;
}

.cursor-move:hover .drag-hint {
    opacity: 1;
}
</style>
