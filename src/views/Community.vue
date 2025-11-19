<template>
    <div class="min-h-screen bg-blue-400 px-2 md:px-4 py-6 pb-20 md:pb-6">
        <!-- 全局导航 -->
        <GlobalNavigation />

        <div class="max-w-7xl mx-auto">
            <!-- 页面标题 -->
            <div class="text-center mb-8">
                <h1 class="text-4xl font-bold text-gray-800 mb-2">美食社区</h1>
                <p class="text-lg text-gray-600">分享你的拿手好菜，看看大家都吃了什么</p>
            </div>

            <!-- 上传菜品表单 -->
            <div class="bg-white rounded-xl shadow-lg p-6 mb-8 border-2 border-gray-800">
                <h2 class="text-2xl font-bold text-gray-800 mb-4">分享你的菜品</h2>
                <form @submit.prevent="submitDish" class="space-y-4">
                    <!-- 菜品名称 -->
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">菜品名称</label>
                        <input
                            v-model="newDish.recipe_name"
                            type="text"
                            required
                            class="w-full px-4 py-2 border-2 border-gray-800 rounded-lg focus:outline-none focus:border-blue-500 transition-colors"
                            placeholder="请输入菜品名称"
                        />
                    </div>

                    <!-- 菜系 -->
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">菜系</label>
                        <input
                            v-model="newDish.cuisine"
                            type="text"
                            class="w-full px-4 py-2 border-2 border-gray-800 rounded-lg focus:outline-none focus:border-blue-500 transition-colors"
                            placeholder="如：川菜、粤菜、西餐等"
                        />
                    </div>

                    <!-- 所需食材 -->
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">所需食材</label>
                        <div class="space-y-2">
                            <div v-for="(_, index) in newDish.ingredients" :key="index" class="flex gap-2">
                                <input
                                    v-model="newDish.ingredients[index]"
                                    type="text"
                                    class="flex-1 px-4 py-2 border-2 border-gray-800 rounded-lg focus:outline-none focus:border-blue-500 transition-colors"
                                    placeholder="食材名称和用量"
                                />
                                <button
                                    type="button"
                                    @click="removeIngredient(index)"
                                    class="px-3 py-2 border-2 border-gray-800 bg-red-500 text-white rounded-lg hover:bg-red-500 transition-colors"
                                >
                                    删除
                                </button>
                            </div>
                            <button
                                type="button"
                                @click="addIngredient"
                                class="px-4 py-2 border-2 border-gray-800 bg-pink-400 text-white rounded-lg hover:bg-pink-500 transition-colors"
                            >
                                + 添加食材
                            </button>
                        </div>
                    </div>

                    <!-- 制作步骤 -->
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">制作步骤</label>
                        <div class="space-y-2">
                            <div v-for="(_, index) in newDish.steps" :key="index" class="flex gap-2">
                                <span class="px-4 py-1 border-2 border-gray-800 bg-blue-500 text-white rounded-lg transition-colors flex items-center justify-cente">
                                    {{ index + 1 }}
                                </span>
                                <textarea
                                    v-model="newDish.steps[index]"
                                    rows="2"
                                    class="flex-1 px-4 py-2 border-2 border-gray-800 rounded-lg focus:outline-none focus:border-blue-500 transition-colors"
                                    placeholder="详细描述制作步骤"
                                ></textarea>
                                <button
                                    type="button"
                                    @click="removeStep(index)"
                                    class="px-3 py-2 border-2 border-gray-800 bg-red-500 text-white rounded-lg hover:bg-red-500 transition-colors"
                                >
                                    删除
                                </button>
                            </div>
                            <button
                                type="button"
                                @click="addStep"
                                class="px-4 py-2 border-2 border-gray-800 bg-pink-400 text-white rounded-lg hover:bg-pink-500 transition-colors"
                            >
                                + 添加步骤
                            </button>
                        </div>
                    </div>

                    <!-- 烹饪技巧 -->
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">烹饪技巧</label>
                        <textarea
                            v-model="newDish.cooking_tips"
                            rows="3"
                            class="w-full px-4 py-2 border-2 border-gray-800 rounded-lg focus:outline-none focus:border-blue-500 transition-colors"
                            placeholder="分享你的独家烹饪小技巧"
                        ></textarea>
                    </div>

                    <!-- 难度和时间 -->
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">难度</label>
                            <select
                                v-model="newDish.difficulty"
                                class="w-full px-4 py-2 border-2 border-gray-800 rounded-lg focus:outline-none focus:border-blue-500 transition-colors"
                            >
                                <option value="">请选择烹饪难度</option>
                                <option value="简单">简单</option>
                                <option value="中等">中等</option>
                                <option value="困难">困难</option>
                            </select>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">烹饪时间</label>
                            <input
                                v-model="newDish.cooking_time"
                                type="text"
                                class="w-full px-4 py-2 border-2 border-gray-800 rounded-lg focus:outline-none focus:border-blue-500 transition-colors"
                                placeholder="如：30分钟"
                            />
                        </div>
                    </div>

                    <!-- 个人备注 -->
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">个人备注</label>
                        <textarea
                            v-model="newDish.user_notes"
                            rows="2"
                            class="w-full px-4 py-2 border-2 border-gray-800 rounded-lg focus:outline-none focus:border-blue-500 transition-colors"
                            placeholder="分享这道菜的故事或心得"
                        ></textarea>
                    </div>

                    <!-- 提交按钮 -->
                    <div class="flex justify-end">
                        <button
                            type="submit"
                            :disabled="isSubmitting"
                            class="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-400 transition-colors font-medium"
                        >
                            {{ isSubmitting ? '上传中...' : '分享菜品' }}
                        </button>
                    </div>
                </form>
            </div>

            <!-- 社区菜品展示 -->
            <div>
                <h2 class="text-2xl font-bold text-gray-800 mb-4">社区菜品</h2>
                
                <!-- 加载状态 -->
                <div v-if="isLoading" class="text-center py-8">
                    <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                    <p class="mt-2 text-gray-600">加载中...</p>
                </div>

                <!-- 菜品列表 -->
                <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div
                        v-for="dish in communityDishes"
                        :key="dish.id"
                        class="bg-white rounded-xl shadow-lg overflow-hidden border-2 border-gray-800 hover:shadow-xl transition-shadow"
                    >
                        <div class="p-6">
                            <!-- 菜品标题 -->
                            <div class="flex items-center justify-between mb-3">
                                <h3 class="text-xl font-bold text-gray-800">{{ dish.recipe_name }}</h3>
                                <span v-if="dish.cuisine" class="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                                    {{ dish.cuisine }}
                                </span>
                            </div>

                            <!-- 上传用户信息 -->
                            <div class="flex items-center gap-2 text-sm text-gray-600 mb-2">
                                <span class="w-2 h-2 bg-purple-500 rounded-full"></span>
                                <span>上传者：{{ dish.user_name || '匿名用户' }}</span>
                            </div>

                            <!-- 难度和时间 -->
                            <div class="flex items-center gap-4 text-sm text-gray-600 mb-4">
                                <span v-if="dish.difficulty" class="flex items-center gap-1">
                                    <span class="w-2 h-2 bg-yellow-500 rounded-full"></span>
                                    难度：{{ dish.difficulty }}
                                </span>
                                <span v-if="dish.cooking_time" class="flex items-center gap-1">
                                    <span class="w-2 h-2 bg-green-500 rounded-full"></span>
                                    时间：{{ dish.cooking_time }}
                                </span>
                            </div>

                            <!-- 食材预览 -->
                            <div class="mb-4">
                                <h4 class="font-medium text-gray-700 mb-2">主要食材：</h4>
                                <div class="flex flex-wrap gap-1">
                                    <span
                                        v-for="(ingredient, index) in dish.ingredients.slice(0, 3)"
                                        :key="index"
                                        class="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded"
                                    >
                                        {{ ingredient }}
                                    </span>
                                    <span v-if="dish.ingredients.length > 3" class="px-2 py-1 bg-gray-100 text-gray-500 text-xs rounded">
                                        +{{ dish.ingredients.length - 3 }}更多
                                    </span>
                                </div>
                            </div>

                            <!-- 烹饪技巧预览 -->
                            <div v-if="dish.cooking_tips" class="mb-4">
                                <h4 class="font-medium text-gray-700 mb-2">烹饪技巧：</h4>
                                <p class="text-sm text-gray-600 line-clamp-2">{{ dish.cooking_tips }}</p>
                            </div>

                            <!-- 制作步骤数量 -->
                            <div class="text-sm text-gray-500 mb-4">
                                共 {{ dish.steps.length }} 个制作步骤
                            </div>

                            <!-- 上传时间 -->
                            <div class="flex items-center justify-between text-xs text-gray-500">
                                <span>{{ formatDate(dish.created_at) }}</span>
                                <button
                                    @click="viewDishDetail(dish)"
                                    class="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                                >
                                    查看详情
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- 空状态 -->
                <div v-if="!isLoading && communityDishes.length === 0" class="text-center py-12">
                    <div class="text-6xl mb-4">🍳</div>
                    <h3 class="text-xl font-medium text-gray-600 mb-2">还没有菜品分享</h3>
                    <p class="text-gray-500">成为第一个分享菜品的人吧！</p>
                </div>
            </div>

            <!-- 美食讨论区域 -->
            <div class="mt-12">
                <h2 class="text-2xl font-bold text-gray-800 mb-4">美食讨论</h2>
                
                <!-- 发表评论表单 -->
                <div class="bg-white rounded-xl shadow-lg p-6 mb-6 border-2 border-gray-800">
                    <h3 class="text-lg font-semibold text-gray-800 mb-4">发表你的想法</h3>
                    <form @submit.prevent="submitComment" class="space-y-4">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">评论内容</label>
                            <textarea
                                v-model="newComment.comment_text"
                                rows="3"
                                required
                                class="w-full px-4 py-2 border-2 border-gray-800 rounded-lg focus:outline-none focus:border-blue-500 transition-colors"
                                placeholder="分享你对美食的想法、心得或建议..."
                            ></textarea>
                        </div>
                        <div class="flex justify-end">
                            <button
                                type="submit"
                                :disabled="isSubmittingComment"
                                class="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:bg-gray-400 transition-colors font-medium"
                            >
                                {{ isSubmittingComment ? '发表中...' : '发表评论' }}
                            </button>
                        </div>
                    </form>
                </div>

                <!-- 评论列表 -->
                <div>
                    <h3 class="text-lg font-semibold text-gray-800 mb-4">社区讨论</h3>
                    
                    <!-- 加载状态 -->
                    <div v-if="isLoadingComments" class="text-center py-8">
                        <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
                        <p class="mt-2 text-gray-600">加载评论中...</p>
                    </div>

                    <!-- 评论列表 -->
                    <div v-else class="space-y-4">
                        <div
                            v-for="comment in userComments"
                            :key="comment.id"
                            class="bg-white rounded-xl shadow-md p-4 border border-gray-200"
                        >
                            <div class="flex items-start justify-between mb-2">
                                <div class="flex items-center gap-2">
                                    <span class="w-2 h-2 bg-purple-500 rounded-full"></span>
                                    <span class="font-medium text-gray-800">{{ comment.user_name }}</span>
                                    <span class="text-xs text-gray-500">{{ formatDate(comment.created_at) }}</span>
                                </div>
                                <button
                                    v-if="comment.user_name === currentUserName"
                                    @click="deleteComment(comment.id)"
                                    class="text-red-500 hover:text-red-700 text-sm"
                                >
                                    删除
                                </button>
                            </div>
                            <p class="text-gray-700 whitespace-pre-wrap">{{ comment.comment_text }}</p>
                        </div>
                    </div>

                    <!-- 空评论状态 -->
                    <div v-if="!isLoadingComments && userComments.length === 0" class="text-center py-8">
                        <div class="text-4xl mb-3">💬</div>
                        <h3 class="text-lg font-medium text-gray-600 mb-1">还没有评论</h3>
                        <p class="text-gray-500">成为第一个发表想法的人吧！</p>
                    </div>
                </div>
            </div>
        </div>

        <!-- 菜品详情模态框 -->
        <div v-if="selectedDish" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div class="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div class="p-6">
                    
                    <div class="flex items-center justify-between mb-4">
                        <h2 class="text-2xl font-bold text-gray-800">{{ selectedDish.recipe_name }}</h2>
                        <button @click="selectedDish = null" class="text-gray-400 hover:text-gray-600">
                            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                            </svg>
                        </button>
                    </div>

                    <!-- 菜品信息 -->
                    <div class="grid grid-cols-2 gap-4 mb-6">
                        <div v-if="selectedDish.cuisine" class="text-center p-3 bg-blue-50 rounded-lg">
                            <div class="text-sm text-blue-600">菜系</div>
                            <div class="font-medium">{{ selectedDish.cuisine }}</div>
                        </div>
                        <div v-if="selectedDish.difficulty" class="text-center p-3 bg-yellow-50 rounded-lg">
                            <div class="text-sm text-yellow-600">难度</div>
                            <div class="font-medium">{{ selectedDish.difficulty }}</div>
                        </div>
                        <div v-if="selectedDish.cooking_time" class="text-center p-3 bg-green-50 rounded-lg">
                            <div class="text-sm text-green-600">烹饪时间</div>
                            <div class="font-medium">{{ selectedDish.cooking_time }}</div>
                        </div>
                        <div class="text-center p-3 bg-gray-50 rounded-lg">
                            <div class="text-sm text-gray-600">上传时间</div>
                            <div class="font-medium">{{ formatDate(selectedDish.created_at) }}</div>
                        </div>
                    </div>

                    <!-- 食材 -->
                    <div class="mb-6">
                        <h3 class="text-lg font-semibold text-gray-800 mb-3">所需食材</h3>
                        <ul class="grid grid-cols-1 md:grid-cols-2 gap-2">
                            <li v-for="(ingredient, index) in selectedDish.ingredients" :key="index" class="flex items-center gap-2 p-2 bg-gray-50 rounded">
                                <span class="w-2 h-2 bg-blue-500 rounded-full"></span>
                                <span>{{ ingredient }}</span>
                            </li>
                        </ul>
                    </div>

                    <!-- 制作步骤 -->
                    <div class="mb-6">
                        <h3 class="text-lg font-semibold text-gray-800 mb-3">制作步骤</h3>
                        <ol class="space-y-3">
                            <li v-for="(step, index) in selectedDish.steps" :key="index" class="flex gap-3">
                                <span class="flex-shrink-0 w-6 h-6 bg-blue-500 text-white rounded-full text-sm flex items-center justify-center">
                                    {{ index + 1 }}
                                </span>
                                <span class="text-gray-700">{{ step }}</span>
                            </li>
                        </ol>
                    </div>

                    <!-- 烹饪技巧 -->
                    <div v-if="selectedDish.cooking_tips" class="mb-6">
                        <h3 class="text-lg font-semibold text-gray-800 mb-3">烹饪技巧</h3>
                        <p class="text-gray-700 bg-yellow-50 p-4 rounded-lg">{{ selectedDish.cooking_tips }}</p>
                    </div>

                    <!-- 个人备注 -->
                    <div v-if="selectedDish.user_notes" class="mb-6">
                        <h3 class="text-lg font-semibold text-gray-800 mb-3">个人备注</h3>
                        <p class="text-gray-700 bg-green-50 p-4 rounded-lg">{{ selectedDish.user_notes }}</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { communityService, type UserComment } from '../services/communityService'
import { AuthService } from '../services/authService'
import GlobalNavigation from '../components/GlobalNavigation.vue'

interface UserDish {
    id: string
    recipe_id: string
    recipe_name: string
    cuisine: string | null
    ingredients: string[]
    steps: string[]
    cooking_tips: string | null
    difficulty: string | null
    cooking_time: string | null
    user_notes: string | null
    user_name: string | null
    created_at: string
    updated_at: string
}

const newDish = ref({
    recipe_name: '',
    cuisine: '',
    ingredients: [''],
    steps: [''],
    cooking_tips: '',
    difficulty: '',
    cooking_time: '',
    user_notes: ''
})

const newComment = ref({
    comment_text: ''
})

const communityDishes = ref<UserDish[]>([])
const userComments = ref<UserComment[]>([])
const selectedDish = ref<UserDish | null>(null)
const isSubmitting = ref(false)
const isSubmittingComment = ref(false)
const isLoading = ref(false)
const isLoadingComments = ref(false)
const currentUserName = ref(AuthService.getCurrentUserName() || '匿名用户')

// 添加食材
const addIngredient = () => {
    newDish.value.ingredients.push('')
}

// 删除食材
const removeIngredient = (index: number) => {
    if (newDish.value.ingredients.length > 1) {
        newDish.value.ingredients.splice(index, 1)
    }
}

// 添加步骤
const addStep = () => {
    newDish.value.steps.push('')
}

// 删除步骤
const removeStep = (index: number) => {
    if (newDish.value.steps.length > 1) {
        newDish.value.steps.splice(index, 1)
    }
}

// 提交菜品
const submitDish = async () => {
    if (!newDish.value.recipe_name.trim()) {
        alert('请输入菜品名称')
        return
    }

    // 过滤空食材和步骤
    const filteredIngredients = newDish.value.ingredients.filter(ingredient => ingredient.trim())
    const filteredSteps = newDish.value.steps.filter(step => step.trim())

    if (filteredIngredients.length === 0) {
        alert('请至少添加一个食材')
        return
    }

    if (filteredSteps.length === 0) {
        alert('请至少添加一个制作步骤')
        return
    }

    isSubmitting.value = true

    try {
        const dishData = {
            recipe_id: generateRecipeId(),
            recipe_name: newDish.value.recipe_name.trim(),
            cuisine: newDish.value.cuisine.trim() || null,
            ingredients: filteredIngredients,
            steps: filteredSteps,
            cooking_tips: newDish.value.cooking_tips.trim() || null,
            difficulty: newDish.value.difficulty || null,
            cooking_time: newDish.value.cooking_time.trim() || null,
            user_notes: newDish.value.user_notes.trim() || null
        }

        await communityService.addUserDish(dishData)
        
        // 重置表单
        newDish.value = {
            recipe_name: '',
            cuisine: '',
            ingredients: [''],
            steps: [''],
            cooking_tips: '',
            difficulty: '',
            cooking_time: '',
            user_notes: ''
        }

        // 重新加载菜品列表
        await loadCommunityDishes()
        
        alert('菜品分享成功！')
    } catch (error) {
        console.error('上传菜品失败:', error)
        alert('上传菜品失败，请重试')
    } finally {
        isSubmitting.value = false
    }
}

// 提交评论
const submitComment = async () => {
    if (!newComment.value.comment_text.trim()) {
        alert('请输入评论内容')
        return
    }

    isSubmittingComment.value = true

    try {
        const commentData = {
            user_name: currentUserName.value,
            comment_text: newComment.value.comment_text.trim()
        }

        await communityService.addUserComment(commentData)
        
        // 重置表单
        newComment.value = {
            comment_text: ''
        }

        // 重新加载评论列表
        await loadUserComments()
        
        alert('评论发表成功！')
    } catch (error) {
        console.error('发表评论失败:', error)
        alert('发表评论失败，请重试')
    } finally {
        isSubmittingComment.value = false
    }
}

// 删除评论
const deleteComment = async (commentId: string) => {
    // 找到要删除的评论
    const commentToDelete = userComments.value.find(comment => comment.id === commentId)
    
    // 检查评论是否存在
    if (!commentToDelete) {
        alert('评论不存在')
        return
    }
    
    // 检查用户是否有权限删除（只能删除自己的评论）
    if (commentToDelete.user_name !== currentUserName.value) {
        alert('您只能删除自己的评论')
        return
    }
    
    if (!confirm('确定要删除这条评论吗？')) {
        return
    }

    try {
        const success = await communityService.deleteUserComment(commentId)
        if (success) {
            await loadUserComments()
            alert('评论删除成功！')
        }
    } catch (error) {
        console.error('删除评论失败:', error)
        alert('删除评论失败，请重试')
    }
}

// 生成唯一的recipe_id
const generateRecipeId = (): string => {
    return 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9)
}

// 查看菜品详情
const viewDishDetail = (dish: UserDish) => {
    selectedDish.value = dish
}

// 格式化日期
const formatDate = (dateString: string): string => {
    const date = new Date(dateString)
    return date.toLocaleDateString('zh-CN', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    })
}

// 加载社区菜品
const loadCommunityDishes = async () => {
    isLoading.value = true
    try {
        communityDishes.value = await communityService.getUserDishes()
    } catch (error) {
        console.error('加载社区菜品失败:', error)
        alert('加载菜品失败，请刷新页面重试')
    } finally {
        isLoading.value = false
    }
}

// 加载用户评论
const loadUserComments = async () => {
    isLoadingComments.value = true
    try {
        userComments.value = await communityService.getUserComments()
    } catch (error) {
        console.error('加载用户评论失败:', error)
        alert('加载评论失败，请刷新页面重试')
    } finally {
        isLoadingComments.value = false
    }
}

onMounted(() => {
    loadCommunityDishes()
    loadUserComments()
})
</script>

<style scoped>
.line-clamp-2 {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
}
</style>