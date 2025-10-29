import { supabase } from './supabaseService'

export interface UserDish {
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
    created_at: string
    updated_at: string
}

export interface UserDishInput {
    recipe_id: string
    recipe_name: string
    cuisine?: string | null
    ingredients: string[]
    steps: string[]
    cooking_tips?: string | null
    difficulty?: string | null
    cooking_time?: string | null
    user_notes?: string | null
}

export const communityService = {
    // 获取所有用户菜品
    async getUserDishes(): Promise<UserDish[]> {
        try {
            const { data, error } = await supabase
                .from('user_dishes')
                .select('*')
                .order('created_at', { ascending: false })

            if (error) {
                console.error('获取用户菜品失败:', error)
                throw error
            }

            return data || []
        } catch (error) {
            console.error('获取用户菜品异常:', error)
            return []
        }
    },

    // 添加用户菜品
    async addUserDish(dish: UserDishInput): Promise<UserDish> {
        try {
            const { data, error } = await supabase
                .from('user_dishes')
                .insert([{
                    recipe_id: dish.recipe_id,
                    recipe_name: dish.recipe_name,
                    cuisine: dish.cuisine,
                    ingredients: dish.ingredients,
                    steps: dish.steps,
                    cooking_tips: dish.cooking_tips,
                    difficulty: dish.difficulty,
                    cooking_time: dish.cooking_time,
                    user_notes: dish.user_notes
                }])
                .select()
                .single()

            if (error) {
                console.error('添加用户菜品失败:', error)
                throw error
            }

            return data
        } catch (error) {
            console.error('添加用户菜品异常:', error)
            throw error
        }
    },

    // 根据ID获取单个菜品
    async getUserDishById(id: string): Promise<UserDish | null> {
        try {
            const { data, error } = await supabase
                .from('user_dishes')
                .select('*')
                .eq('id', id)
                .single()

            if (error) {
                console.error('获取用户菜品失败:', error)
                throw error
            }

            return data
        } catch (error) {
            console.error('获取用户菜品异常:', error)
            return null
        }
    },

    // 根据菜名搜索菜品
    async searchUserDishes(query: string): Promise<UserDish[]> {
        try {
            const { data, error } = await supabase
                .from('user_dishes')
                .select('*')
                .ilike('recipe_name', `%${query}%`)
                .order('created_at', { ascending: false })

            if (error) {
                console.error('搜索用户菜品失败:', error)
                throw error
            }

            return data || []
        } catch (error) {
            console.error('搜索用户菜品异常:', error)
            return []
        }
    },

    // 根据菜系筛选菜品
    async getUserDishesByCuisine(cuisine: string): Promise<UserDish[]> {
        try {
            const { data, error } = await supabase
                .from('user_dishes')
                .select('*')
                .eq('cuisine', cuisine)
                .order('created_at', { ascending: false })

            if (error) {
                console.error('根据菜系获取菜品失败:', error)
                throw error
            }

            return data || []
        } catch (error) {
            console.error('根据菜系获取菜品异常:', error)
            return []
        }
    },

    // 获取热门菜品（按创建时间排序，取前10个）
    async getPopularDishes(limit: number = 10): Promise<UserDish[]> {
        try {
            const { data, error } = await supabase
                .from('user_dishes')
                .select('*')
                .order('created_at', { ascending: false })
                .limit(limit)

            if (error) {
                console.error('获取热门菜品失败:', error)
                throw error
            }

            return data || []
        } catch (error) {
            console.error('获取热门菜品异常:', error)
            return []
        }
    },

    // 更新用户菜品
    async updateUserDish(id: string, updates: Partial<UserDishInput>): Promise<UserDish | null> {
        try {
            const { data, error } = await supabase
                .from('user_dishes')
                .update(updates)
                .eq('id', id)
                .select()
                .single()

            if (error) {
                console.error('更新用户菜品失败:', error)
                throw error
            }

            return data
        } catch (error) {
            console.error('更新用户菜品异常:', error)
            return null
        }
    },

    // 删除用户菜品
    async deleteUserDish(id: string): Promise<boolean> {
        try {
            const { error } = await supabase
                .from('user_dishes')
                .delete()
                .eq('id', id)

            if (error) {
                console.error('删除用户菜品失败:', error)
                throw error
            }

            return true
        } catch (error) {
            console.error('删除用户菜品异常:', error)
            return false
        }
    }
}