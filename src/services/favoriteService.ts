import type { Recipe, FavoriteRecipe } from '@/types'
import { supabase } from './supabaseService'

const FAVORITES_KEY = 'yifan-fengshen-favorites'

/**
 * 收藏服务 - 管理本地收藏的菜谱和Supabase同步
 */
export class FavoriteService {
    /**
     * 获取所有收藏的菜谱
     */
    static getFavorites(): FavoriteRecipe[] {
        try {
            const stored = localStorage.getItem(FAVORITES_KEY)
            return stored ? JSON.parse(stored) : []
        } catch (error) {
            console.error('获取收藏列表失败:', error)
            return []
        }
    }

    /**
     * 添加菜谱到收藏（本地存储 + Supabase同步）
     */
    static async addFavorite(recipe: Recipe, notes?: string): Promise<boolean> {
        try {
            const favorites = this.getFavorites()

            // 检查是否已收藏
            if (favorites.some(fav => fav.recipe.id === recipe.id)) {
                return false // 已收藏
            }

            const favoriteRecipe: FavoriteRecipe = {
                id: `fav-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                recipe,
                favoriteDate: new Date().toISOString(),
                notes
            }

            // 1. 添加到本地存储
            favorites.unshift(favoriteRecipe)
            localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites))

            // 2. 同步到Supabase（使用更简单的方式）
            try {
                const supabaseData = {
                    recipe_id: recipe.id,
                    recipe_name: recipe.name,
                    cuisine: recipe.cuisine || null,
                    ingredients: recipe.ingredients || [],
                    steps: recipe.steps || [],
                    cooking_tips: recipe.tips?.join(', ') || null, // 使用tips字段
                    difficulty: recipe.difficulty || null,
                    cooking_time: recipe.cookingTime?.toString() || null,
                    servings: null, // Recipe类型中没有servings字段
                    tags: null, // Recipe类型中没有tags字段
                    user_notes: notes || null,
                    favorite_date: new Date().toISOString()
                }
                
                const { error } = await supabase
                    .from('favorites')
                    .insert(supabaseData)

                if (error) {
                    console.error('Supabase添加收藏失败:', error)
                    // 本地存储成功，Supabase失败，仍然返回成功
                    return true
                }
            } catch (supabaseError) {
                console.error('Supabase操作异常:', supabaseError)
                // 本地存储成功，Supabase异常，仍然返回成功
                return true
            }

            return true
        } catch (error) {
            console.error('添加收藏失败:', error)
            return false
        }
    }

    /**
     * 从收藏中移除菜谱（本地存储 + Supabase同步）
     */
    static async removeFavorite(recipeId: string): Promise<boolean> {
        try {
            const favorites = this.getFavorites()
            const filteredFavorites = favorites.filter(fav => fav.recipe.id !== recipeId)

            if (filteredFavorites.length === favorites.length) {
                return false // 未找到要删除的项
            }

            // 1. 从本地存储移除
            localStorage.setItem(FAVORITES_KEY, JSON.stringify(filteredFavorites))

            // 2. 从Supabase移除
            try {
                const { error } = await supabase
                    .from('favorites')
                    .delete()
                    .eq('recipe_id', recipeId)

                if (error) {
                    console.error('Supabase移除收藏失败:', error)
                    // 本地存储成功，Supabase失败，仍然返回成功
                    return true
                }
            } catch (supabaseError) {
                console.error('Supabase操作异常:', supabaseError)
                // 本地存储成功，Supabase异常，仍然返回成功
                return true
            }

            return true
        } catch (error) {
            console.error('移除收藏失败:', error)
            return false
        }
    }

    /**
     * 检查菜谱是否已收藏
     */
    static isFavorite(recipeId: string): boolean {
        try {
            const favorites = this.getFavorites()
            return favorites.some(fav => fav.recipe.id === recipeId)
        } catch (error) {
            console.error('检查收藏状态失败:', error)
            return false
        }
    }

    /**
     * 更新收藏备注（本地存储 + Supabase同步）
     */
    static async updateFavoriteNotes(recipeId: string, notes: string): Promise<boolean> {
        try {
            const favorites = this.getFavorites()
            const favoriteIndex = favorites.findIndex(fav => fav.recipe.id === recipeId)

            if (favoriteIndex === -1) {
                return false
            }

            // 1. 更新本地存储
            favorites[favoriteIndex].notes = notes
            localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites))

            // 2. 更新Supabase
            try {
                const { error } = await supabase
                    .from('favorites')
                    .update({ user_notes: notes, updated_at: new Date().toISOString() })
                    .eq('recipe_id', recipeId)

                if (error) {
                    console.error('Supabase更新备注失败:', error)
                    // 本地存储成功，Supabase失败，仍然返回成功
                    return true
                }
            } catch (supabaseError) {
                console.error('Supabase操作异常:', supabaseError)
                // 本地存储成功，Supabase异常，仍然返回成功
                return true
            }

            return true
        } catch (error) {
            console.error('更新收藏备注失败:', error)
            return false
        }
    }

    /**
     * 清空所有收藏（本地存储 + Supabase同步）
     */
    static async clearAllFavorites(): Promise<boolean> {
        try {
            // 1. 清空本地存储
            localStorage.removeItem(FAVORITES_KEY)

            // 2. 清空Supabase（删除所有记录）
            try {
                const { error } = await supabase
                    .from('favorites')
                    .delete()
                    .neq('id', '') // 删除所有记录

                if (error) {
                    console.error('Supabase清空收藏失败:', error)
                    // 本地存储成功，Supabase失败，仍然返回成功
                    return true
                }
            } catch (supabaseError) {
                console.error('Supabase操作异常:', supabaseError)
                // 本地存储成功，Supabase异常，仍然返回成功
                return true
            }

            return true
        } catch (error) {
            console.error('清空收藏失败:', error)
            return false
        }
    }

    /**
     * 获取收藏统计信息
     */
    static getFavoriteStats() {
        const favorites = this.getFavorites()
        const cuisineStats: Record<string, number> = {}

        favorites.forEach(fav => {
            const cuisine = fav.recipe.cuisine
            cuisineStats[cuisine] = (cuisineStats[cuisine] || 0) + 1
        })

        return {
            total: favorites.length,
            cuisineStats,
            latestFavorite: favorites[0]?.favoriteDate
        }
    }
}
