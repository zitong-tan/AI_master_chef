<template>
    <div class="min-h-screen bg-blue-400 px-2 md:px-4 py-6 pb-20 md:pb-6">
        <GlobalNavigation />
        <div class="max-w-7xl mx-auto">
            <div class="text-center mb-8">
                <h1 class="text-4xl font-bold text-gray-800 mb-2">美食社区</h1>
                <p class="text-lg text-gray-600">分享你的拿手好菜，看看大家都吃了什么</p>
            </div>
            <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div class="lg:col-span-2 space-y-6">
                    <div class="bg-white rounded-xl shadow-lg border-2 border-gray-800">
                        <button @click="showUploadForm = !showUploadForm" class="w-full p-6 flex items-center justify-between hover:bg-gray-50 transition-colors">
                            <div class="flex items-center gap-3">
                                <span class="text-2xl">📝</span>
                                <h2 class="text-2xl font-bold text-gray-800">分享你的菜品</h2>
                            </div>
                            <span class="text-2xl transform transition-transform" :class="{ 'rotate-180': showUploadForm }">▼</span>
                        </button>
                        <div v-show="showUploadForm" class="px-6 pb-6">
                            <form @submit.prevent="submitDish" class="space-y-4">
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-2">菜品名称</label>
                                    <input v-model="newDish.recipe_name" type="text" required class="w-full px-4 py-2 border-2 border-gray-800 rounded-lg focus:outline-none focus:border-blue-500" placeholder="请输入菜品名称" />
                                </div>
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-2">菜系</label>
                                    <input v-model="newDish.cuisine" type="text" class="w-full px-4 py-2 border-2 border-gray-800 rounded-lg focus:outline-none focus:border-blue-500" placeholder="如：川菜、粤菜、西餐等" />
                                </div>
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-2">所需食材（记得写用量哦）</label>
                                    <div class="space-y-2">
                                        <div v-for="(_, index) in newDish.ingredients" :key="index" class="flex gap-2">
                                            <input v-model="newDish.ingredients[index]" type="text" class="flex-1 px-4 py-2 border-2 border-gray-800 rounded-lg" placeholder="食材名称和用量" />
                                            <button type="button" @click="removeIngredient(index)" class="px-3 py-2 border-2 border-gray-800 bg-red-500 text-white rounded-lg hover:bg-red-600">删除</button>
                                        </div>
                                        <button type="button" @click="addIngredient" class="px-4 py-2 border-2 border-gray-800 bg-pink-400 text-white rounded-lg hover:bg-pink-500">+ 添加食材</button>
                                    </div>
                                </div>
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-2">制作步骤</label>
                                    <div class="space-y-2">
                                        <div v-for="(_, index) in newDish.steps" :key="index" class="flex gap-2">
                                            <span class="px-4 py-1 border-2 border-gray-800 bg-blue-500 text-white rounded-lg flex items-center justify-center">{{ index + 1 }}</span>
                                            <textarea v-model="newDish.steps[index]" rows="2" class="flex-1 px-4 py-2 border-2 border-gray-800 rounded-lg" placeholder="详细描述制作步骤"></textarea>
                                            <button type="button" @click="removeStep(index)" class="px-3 py-2 border-2 border-gray-800 bg-red-500 text-white rounded-lg hover:bg-red-600">删除</button>
                                        </div>
                                        <button type="button" @click="addStep" class="px-4 py-2 border-2 border-gray-800 bg-pink-400 text-white rounded-lg hover:bg-pink-500">+ 添加步骤</button>
                                    </div>
                                </div>
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-2">烹饪技巧</label>
                                    <textarea v-model="newDish.cooking_tips" rows="3" class="w-full px-4 py-2 border-2 border-gray-800 rounded-lg" placeholder="分享你的独家烹饪小技巧"></textarea>
                                </div>
                                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label class="block text-sm font-medium text-gray-700 mb-2">难度</label>
                                        <select v-model="newDish.difficulty" class="w-full px-4 py-2 border-2 border-gray-800 rounded-lg">
                                            <option value="">请选择烹饪难度</option>
                                            <option value="简单">简单</option>
                                            <option value="中等">中等</option>
                                            <option value="困难">困难</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label class="block text-sm font-medium text-gray-700 mb-2">烹饪时间</label>
                                        <input v-model="newDish.cooking_time" type="text" class="w-full px-4 py-2 border-2 border-gray-800 rounded-lg" placeholder="如：30分钟" />
                                    </div>
                                </div>
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-2">个人备注</label>
                                    <textarea v-model="newDish.user_notes" rows="2" class="w-full px-4 py-2 border-2 border-gray-800 rounded-lg" placeholder="分享这道菜的故事或心得"></textarea>
                                </div>
                                <div class="flex justify-end">
                                    <button type="submit" :disabled="isSubmitting" class="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-400 font-medium">
                                        {{ isSubmitting ? '上传中...' : '分享菜品' }}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                    <div>
                        <h2 class="text-2xl font-bold text-gray-800 mb-4">社区菜品</h2>
                        <div v-if="isLoading" class="text-center py-8">
                            <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                            <p class="mt-2 text-gray-600">加载中...</p>
                        </div>
                        <div v-else class="grid grid-cols-2 md:grid-cols-3 gap-4">
                            <div v-for="dish in communityDishes" :key="dish.id" class="bg-white rounded-xl shadow-lg border-2 border-gray-800 hover:shadow-xl transition-shadow aspect-square flex flex-col">
                                <div class="p-3 flex-1 flex flex-col overflow-hidden">
                                    <h3 class="text-base font-bold text-gray-800 mb-2 line-clamp-2">{{ dish.recipe_name }}</h3>
                                    <div class="flex items-center gap-2 mb-2 flex-wrap">
                                        <span v-if="dish.cuisine" class="px-2 py-0.5 bg-blue-100 text-blue-800 text-xs rounded-full">{{ dish.cuisine }}</span>
                                        <span v-if="dish.difficulty" class="px-2 py-0.5 bg-yellow-100 text-yellow-800 text-xs rounded-full">{{ dish.difficulty }}</span>
                                    </div>
                                    <div v-if="dish.cooking_time" class="text-xs text-gray-600 mb-2 flex items-center gap-1">
                                        <span>⏱️</span>
                                        <span>{{ dish.cooking_time }}</span>
                                    </div>
                                    <div v-if="dish.ingredients && dish.ingredients.length > 0" class="mb-2 flex-1 overflow-hidden">
                                        <div class="text-xs text-gray-500 mb-1">食材：</div>
                                        <div class="flex flex-wrap gap-1">
                                            <span v-for="(ingredient, idx) in dish.ingredients.slice(0, 3)" :key="idx" class="px-1.5 py-0.5 bg-gray-100 text-gray-700 text-xs rounded">
                                                {{ ingredient.length > 8 ? ingredient.substring(0, 8) + '...' : ingredient }}
                                            </span>
                                            <span v-if="dish.ingredients.length > 3" class="px-1.5 py-0.5 bg-gray-100 text-gray-500 text-xs rounded">
                                                +{{ dish.ingredients.length - 3 }}
                                            </span>
                                        </div>
                                    </div>
                                    <div class="mt-auto">
                                        <div class="flex items-center justify-between text-xs text-gray-500 mb-2">
                                            <span class="truncate">{{ dish.user_name || '匿名' }}</span>
                                            <span class="flex items-center gap-1">
                                                <span>💬</span>
                                                <span>{{ dishCommentCounts[dish.id] || 0 }}</span>
                                            </span>
                                        </div>
                                        <button @click="viewDishDetail(dish)" class="w-full px-3 py-1.5 bg-blue-500 text-white rounded hover:bg-blue-600 text-xs font-medium">查看详情</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div v-if="!isLoading && communityDishes.length === 0" class="text-center py-12">
                            <div class="text-6xl mb-4">◈</div>
                            <h3 class="text-xl font-medium text-gray-600 mb-2">还没有菜品分享</h3>
                            <p class="text-gray-500">成为第一个分享菜品的人吧！</p>
                        </div>
                    </div>
                </div>
                <div class="lg:col-span-1">
                    <div class="bg-white rounded-xl shadow-lg p-6 border-2 border-gray-800 sticky top-6">
                        <h2 class="text-2xl font-bold text-gray-800 mb-4">美食讨论</h2>
                        <form @submit.prevent="submitComment" class="space-y-4 mb-6">
                            <textarea v-model="newComment.comment_text" rows="3" required class="w-full px-4 py-2 border-2 border-gray-800 rounded-lg focus:outline-none focus:border-blue-500" placeholder="分享你对美食的想法..."></textarea>
                            <button type="submit" :disabled="isSubmittingComment" class="w-full px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:bg-gray-400 font-medium">
                                {{ isSubmittingComment ? '发表中...' : '发表评论' }}
                            </button>
                        </form>
                        <div v-if="isLoadingComments" class="text-center py-8">
                            <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
                        </div>
                        <div v-else class="space-y-4 max-h-96 overflow-y-auto">
                            <div v-for="comment in userComments" :key="comment.id" class="bg-gray-50 rounded-lg p-4 border border-gray-200">
                                <div class="flex items-start justify-between mb-2">
                                    <div class="flex items-center gap-2">
                                        <span class="w-2 h-2 bg-purple-500 rounded-full"></span>
                                        <span class="font-medium text-gray-800 text-sm">{{ comment.user_name }}</span>
                                    </div>
                                    <button v-if="comment.user_name === currentUserName" @click="deleteComment(comment.id)" class="text-red-500 hover:text-red-700 text-xs">删除</button>
                                </div>
                                <p class="text-gray-700 text-sm whitespace-pre-wrap">{{ comment.comment_text }}</p>
                                <span class="text-xs text-gray-500 mt-2 block">{{ formatDate(comment.created_at) }}</span>
                            </div>
                        </div>
                        <div v-if="!isLoadingComments && userComments.length === 0" class="text-center py-8">
                            <div class="text-4xl mb-3">💬</div>
                            <p class="text-gray-500 text-sm">还没有评论</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div v-if="selectedDish" class="fixed inset-0 bg-black bg-opacity-50 z-50 overflow-y-auto" @click.self="selectedDish = null">
            <div class="min-h-screen flex items-start justify-center p-4 py-8">
                <div class="bg-white rounded-xl max-w-4xl w-full flex flex-col shadow-2xl">
                    <div class="sticky top-0 bg-white rounded-t-xl border-b-2 border-gray-200 p-6 z-10">
                        <div class="flex items-center justify-between">
                            <h2 class="text-2xl font-bold text-gray-800">{{ selectedDish.recipe_name }}</h2>
                            <button @click="selectedDish = null" class="text-gray-400 hover:text-gray-600 flex-shrink-0 ml-4">
                                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                            </button>
                        </div>
                    </div>
                    <div class="p-6">
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
                            <div class="font-medium text-sm">{{ formatDate(selectedDish.created_at) }}</div>
                        </div>
                    </div>
                    <div class="mb-6">
                        <h3 class="text-lg font-semibold text-gray-800 mb-3">所需食材</h3>
                        <ul class="grid grid-cols-1 md:grid-cols-2 gap-2">
                            <li v-for="(ingredient, index) in selectedDish.ingredients" :key="index" class="flex items-center gap-2 p-2 bg-gray-50 rounded">
                                <span class="w-2 h-2 bg-blue-500 rounded-full"></span>
                                <span>{{ ingredient }}</span>
                            </li>
                        </ul>
                    </div>
                    <div class="mb-6">
                        <h3 class="text-lg font-semibold text-gray-800 mb-3">制作步骤</h3>
                        <ol class="space-y-3">
                            <li v-for="(step, index) in selectedDish.steps" :key="index" class="flex gap-3">
                                <span class="flex-shrink-0 w-6 h-6 bg-blue-500 text-white rounded-full text-sm flex items-center justify-center">{{ index + 1 }}</span>
                                <span class="text-gray-700">{{ step }}</span>
                            </li>
                        </ol>
                    </div>
                    <div v-if="selectedDish.cooking_tips" class="mb-6">
                        <h3 class="text-lg font-semibold text-gray-800 mb-3">烹饪技巧</h3>
                        <p class="text-gray-700 bg-yellow-50 p-4 rounded-lg">{{ selectedDish.cooking_tips }}</p>
                    </div>
                    <div v-if="selectedDish.user_notes" class="mb-6">
                        <h3 class="text-lg font-semibold text-gray-800 mb-3">个人备注</h3>
                        <p class="text-gray-700 bg-green-50 p-4 rounded-lg">{{ selectedDish.user_notes }}</p>
                    </div>
                    <div class="border-t pt-6">
                        <div class="flex items-center justify-between mb-4">
                            <h3 class="text-lg font-semibold text-gray-800">菜品评论 ({{ currentDishComments.length }})</h3>
                            <button @click="showDishCommentForm = !showDishCommentForm" class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 text-sm">
                                {{ showDishCommentForm ? '取消' : '发表评论' }}
                            </button>
                        </div>
                        <div v-if="showDishCommentForm" class="mb-4">
                            <form @submit.prevent="submitDishComment" class="space-y-3">
                                <textarea v-model="newDishComment.comment_text" rows="3" required class="w-full px-4 py-2 border-2 border-gray-800 rounded-lg focus:outline-none focus:border-blue-500" placeholder="说说你对这道菜的看法..."></textarea>
                                <button type="submit" :disabled="isSubmittingDishComment" class="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-400 font-medium">
                                    {{ isSubmittingDishComment ? '发表中...' : '发表评论' }}
                                </button>
                            </form>
                        </div>
                        <div class="space-y-3 max-h-96 overflow-y-auto">
                            <div v-for="comment in currentDishComments" :key="comment.id" class="bg-gray-50 rounded-lg p-4 border border-gray-200">
                                <div class="flex items-start justify-between mb-2">
                                    <div class="flex items-center gap-2">
                                        <span class="w-2 h-2 bg-purple-500 rounded-full"></span>
                                        <span class="font-medium text-gray-800 text-sm">{{ comment.user_name }}</span>
                                        <span class="text-xs text-gray-500">{{ formatDate(comment.created_at) }}</span>
                                    </div>
                                    <button v-if="comment.user_name === currentUserName" @click="deleteDishComment(comment.id)" class="text-red-500 hover:text-red-700 text-xs">删除</button>
                                </div>
                                <p class="text-gray-700 text-sm whitespace-pre-wrap">{{ comment.comment_text }}</p>
                            </div>
                        </div>
                        <div v-if="currentDishComments.length === 0" class="text-center py-8">
                            <div class="text-4xl mb-3">💬</div>
                            <p class="text-gray-500 text-sm">还没有评论，快来抢沙发吧！</p>
                        </div>
                    </div>
                </div>
            </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { communityService, type UserDish, type UserComment, type DishComment } from '../services/communityService'
import { AuthService } from '../services/authService'
import GlobalNavigation from '../components/GlobalNavigation.vue'

const showUploadForm = ref(false)
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

const newComment = ref({ comment_text: '' })
const newDishComment = ref({ comment_text: '' })
const communityDishes = ref<UserDish[]>([])
const userComments = ref<UserComment[]>([])
const selectedDish = ref<UserDish | null>(null)
const currentDishComments = ref<DishComment[]>([])
const dishCommentCounts = ref<Record<string, number>>({})
const showDishCommentForm = ref(false)
const isSubmitting = ref(false)
const isSubmittingComment = ref(false)
const isSubmittingDishComment = ref(false)
const isLoading = ref(false)
const isLoadingComments = ref(false)
const currentUserName = ref(AuthService.getCurrentUserName() || '匿名用户')

const addIngredient = () => { newDish.value.ingredients.push('') }
const removeIngredient = (index: number) => { if (newDish.value.ingredients.length > 1) newDish.value.ingredients.splice(index, 1) }
const addStep = () => { newDish.value.steps.push('') }
const removeStep = (index: number) => { if (newDish.value.steps.length > 1) newDish.value.steps.splice(index, 1) }

const submitDish = async () => {
    if (!newDish.value.recipe_name.trim()) { alert('请输入菜品名称'); return }
    const filteredIngredients = newDish.value.ingredients.filter(i => i.trim())
    const filteredSteps = newDish.value.steps.filter(s => s.trim())
    if (filteredIngredients.length === 0) { alert('请至少添加一个食材'); return }
    if (filteredSteps.length === 0) { alert('请至少添加一个制作步骤'); return }
    isSubmitting.value = true
    try {
        const dishData = {
            recipe_id: 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
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
        newDish.value = { recipe_name: '', cuisine: '', ingredients: [''], steps: [''], cooking_tips: '', difficulty: '', cooking_time: '', user_notes: '' }
        await loadCommunityDishes()
        showUploadForm.value = false
        alert('菜品分享成功！')
    } catch (error) {
        console.error('上传菜品失败:', error)
        alert('上传菜品失败，请重试')
    } finally {
        isSubmitting.value = false
    }
}

const submitComment = async () => {
    if (!newComment.value.comment_text.trim()) { alert('请输入评论内容'); return }
    isSubmittingComment.value = true
    try {
        await communityService.addUserComment({ user_name: currentUserName.value, comment_text: newComment.value.comment_text.trim() })
        newComment.value = { comment_text: '' }
        await loadUserComments()
        alert('评论发表成功！')
    } catch (error) {
        console.error('发表评论失败:', error)
        alert('发表评论失败，请重试')
    } finally {
        isSubmittingComment.value = false
    }
}

const submitDishComment = async () => {
    if (!selectedDish.value || !newDishComment.value.comment_text.trim()) return
    isSubmittingDishComment.value = true
    try {
        await communityService.addDishComment({
            dish_id: selectedDish.value.id,
            user_name: currentUserName.value,
            comment_text: newDishComment.value.comment_text.trim()
        })
        newDishComment.value = { comment_text: '' }
        await loadDishComments(selectedDish.value.id)
        await loadCommentCounts()
        showDishCommentForm.value = false
        alert('评论发表成功！')
    } catch (error) {
        console.error('发表菜品评论失败:', error)
        alert('发表评论失败，请重试')
    } finally {
        isSubmittingDishComment.value = false
    }
}

const deleteComment = async (commentId: string) => {
    const commentToDelete = userComments.value.find(c => c.id === commentId)
    if (!commentToDelete || commentToDelete.user_name !== currentUserName.value) { alert('您只能删除自己的评论'); return }
    if (!confirm('确定要删除这条评论吗？')) return
    try {
        await communityService.deleteUserComment(commentId)
        await loadUserComments()
        alert('评论删除成功！')
    } catch (error) {
        console.error('删除评论失败:', error)
        alert('删除评论失败，请重试')
    }
}

const deleteDishComment = async (commentId: string) => {
    const commentToDelete = currentDishComments.value.find(c => c.id === commentId)
    if (!commentToDelete || commentToDelete.user_name !== currentUserName.value) { alert('您只能删除自己的评论'); return }
    if (!confirm('确定要删除这条评论吗？')) return
    try {
        await communityService.deleteDishComment(commentId)
        if (selectedDish.value) {
            await loadDishComments(selectedDish.value.id)
            await loadCommentCounts()
        }
        alert('评论删除成功！')
    } catch (error) {
        console.error('删除菜品评论失败:', error)
        alert('删除评论失败，请重试')
    }
}

const viewDishDetail = async (dish: UserDish) => {
    selectedDish.value = dish
    showDishCommentForm.value = false
    newDishComment.value = { comment_text: '' }
    await loadDishComments(dish.id)
}

const formatDate = (dateString: string): string => {
    const date = new Date(dateString)
    return date.toLocaleDateString('zh-CN', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
}

const loadCommunityDishes = async () => {
    isLoading.value = true
    try {
        communityDishes.value = await communityService.getUserDishes()
        await loadCommentCounts()
    } catch (error) {
        console.error('加载社区菜品失败:', error)
        alert('加载菜品失败，请刷新页面重试')
    } finally {
        isLoading.value = false
    }
}

const loadUserComments = async () => {
    isLoadingComments.value = true
    try {
        userComments.value = await communityService.getUserComments()
    } catch (error) {
        console.error('加载用户评论失败:', error)
    } finally {
        isLoadingComments.value = false
    }
}

const loadDishComments = async (dishId: string) => {
    try {
        currentDishComments.value = await communityService.getDishComments(dishId)
    } catch (error) {
        console.error('加载菜品评论失败:', error)
    }
}

const loadCommentCounts = async () => {
    for (const dish of communityDishes.value) {
        try {
            const count = await communityService.getDishCommentCount(dish.id)
            dishCommentCounts.value[dish.id] = count
        } catch (error) {
            console.error('加载评论数量失败:', error)
        }
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
.aspect-square {
    aspect-ratio: 1 / 1;
}
</style>
