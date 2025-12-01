import type { Recipe } from '@/types'
import { supabase } from '@/services/supabaseService'
import { AuthService } from './authService'

export interface GalleryImage {
    id: string
    url: string
    recipeName: string
    recipeId: string
    cuisine: string
    ingredients: string[]
    generatedAt: string
    prompt?: string
    filePath?: string
}

export interface GalleryStats {
    total: number
    cuisineStats: Record<string, number>
    latestGenerated?: string
}

class GalleryServiceClass {
    private readonly BUCKET_NAME = 'recipe-images'

    // 获取当前用户的图库图片
    async getGalleryImages(): Promise<GalleryImage[]> {
        try {
            const currentUser = AuthService.getCurrentUser()
            
            // 如果用户未登录，返回空数组
            if (!currentUser) {
                return []
            }

            const { data, error } = await supabase
                .from('recipe_images')
                .select('*')
                .eq('user_id', currentUser.id)
                .order('created_at', { ascending: false })

            if (error) {
                console.error('获取图库数据失败:', error)
                return []
            }

            return data.map(item => ({
                id: item.id,
                url: item.image_url,
                recipeName: item.recipe_name,
                recipeId: item.recipe_id,
                cuisine: item.cuisine,
                ingredients: item.ingredients || [],
                generatedAt: item.created_at,
                prompt: item.prompt,
                filePath: item.file_path
            }))
        } catch (error) {
            console.error('获取图库数据失败:', error)
            return []
        }
    }

    // 上传图片到Supabase Storage并添加到图库
    async addToGallery(recipe: Recipe, imageFile: File, imageId: string, prompt?: string): Promise<boolean> {
        try {
            const currentUser = AuthService.getCurrentUser()
            
            // 如果用户未登录，不允许上传
            if (!currentUser) {
                console.error('用户未登录，无法保存图片')
                return false
            }

            // 1. 上传图片到Storage
            const fileName = `${imageId}-${Date.now()}.jpg`
            const filePath = `recipe-images/${currentUser.id}/${fileName}`

            const { error: uploadError } = await supabase.storage
                .from(this.BUCKET_NAME)
                .upload(filePath, imageFile, {
                    contentType: 'image/jpeg',
                    cacheControl: '3600'
                })

            if (uploadError) {
                console.error('上传图片失败:', uploadError)
                return false
            }

            // 2. 获取公共URL
            const { data: urlData } = supabase.storage
                .from(this.BUCKET_NAME)
                .getPublicUrl(filePath)

            const imageUrl = urlData.publicUrl

            // 3. 保存元数据到数据库
            const { error: dbError } = await supabase
                .from('recipe_images')
                .insert({
                    user_id: currentUser.id,
                    image_url: imageUrl,
                    recipe_name: recipe.name,
                    recipe_id: recipe.id,
                    cuisine: recipe.cuisine,
                    ingredients: recipe.ingredients,
                    file_path: filePath,
                    prompt: prompt
                })

            if (dbError) {
                console.error('保存图片元数据失败:', dbError)
                return false
            }

            return true
        } catch (error) {
            console.error('添加图片到图库失败:', error)
            return false
        }
    }

    // 直接保存图片URL到数据库（不下载文件）
    async addImageUrlToGallery(recipe: Recipe, imageUrl: string, imageId: string, prompt?: string): Promise<boolean> {
        try {
            const currentUser = AuthService.getCurrentUser()
            
            // 如果用户未登录，不允许保存
            if (!currentUser) {
                console.error('用户未登录，无法保存图片')
                return false
            }

            // 保存元数据到数据库
            const { error: dbError } = await supabase
                .from('recipe_images')
                .insert({
                    user_id: currentUser.id,
                    image_url: imageUrl,
                    recipe_name: recipe.name,
                    recipe_id: recipe.id,
                    cuisine: recipe.cuisine,
                    ingredients: recipe.ingredients,
                    file_path: null, // 外部URL没有本地文件路径
                    prompt: prompt
                })

            if (dbError) {
                console.error('保存图片URL失败:', dbError)
                return false
            }

            return true
        } catch (error) {
            console.error('添加图片URL到图库失败:', error)
            return false
        }
    }

    // 处理Base64图片数据并添加到图库
    async addBase64ImageToGallery(recipe: Recipe, base64Data: string, imageId: string, prompt?: string): Promise<boolean> {
        try {
            // 将Base64转换为File对象
            const response = await fetch(base64Data)
            const blob = await response.blob()
            const file = new File([blob], `recipe-${imageId}.jpg`, { type: 'image/jpeg' })

            return this.addToGallery(recipe, file, imageId, prompt)
        } catch (error) {
            console.error('处理Base64图片失败:', error)
            return false
        }
    }

    // 从图库删除图片
    async removeFromGallery(imageId: string): Promise<boolean> {
        try {
            const currentUser = AuthService.getCurrentUser()
            
            // 如果用户未登录，不允许删除
            if (!currentUser) {
                console.error('用户未登录，无法删除图片')
                return false
            }

            // 1. 先获取图片信息（包括文件路径和用户ID）
            const { data: imageData, error: fetchError } = await supabase
                .from('recipe_images')
                .select('file_path, user_id')
                .eq('id', imageId)
                .single()

            if (fetchError) {
                console.error('获取图片信息失败:', fetchError)
                return false
            }

            // 2. 验证图片属于当前用户
            if (!imageData || imageData.user_id !== currentUser.id) {
                console.error('无权限删除此图片')
                return false
            }

            // 3. 如果是本地存储的图片，从Storage删除文件
            if (imageData?.file_path) {
                const { error: deleteFileError } = await supabase.storage
                    .from(this.BUCKET_NAME)
                    .remove([imageData.file_path])

                if (deleteFileError) {
                    console.error('删除存储文件失败:', deleteFileError)
                    // 继续删除数据库记录，不因文件删除失败而中断
                }
            }

            // 4. 从数据库删除记录
            const { error: deleteError } = await supabase
                .from('recipe_images')
                .delete()
                .eq('id', imageId)
                .eq('user_id', currentUser.id) // 双重验证

            if (deleteError) {
                console.error('从图库删除图片失败:', deleteError)
                return false
            }

            return true
        } catch (error) {
            console.error('从图库删除图片失败:', error)
            return false
        }
    }

    // 清空当前用户的图库
    async clearGallery(): Promise<boolean> {
        try {
            const currentUser = AuthService.getCurrentUser()
            
            // 如果用户未登录，不允许清空
            if (!currentUser) {
                console.error('用户未登录，无法清空图库')
                return false
            }

            // 1. 获取当前用户所有图片的文件路径
            const { data: images } = await supabase
                .from('recipe_images')
                .select('file_path')
                .eq('user_id', currentUser.id)

            // 2. 删除用户的所有本地Storage文件（只删除有file_path的）
            if (images && images.length > 0) {
                const filePaths = images.map(img => img.file_path).filter(Boolean)
                if (filePaths.length > 0) {
                    await supabase.storage
                        .from(this.BUCKET_NAME)
                        .remove(filePaths)
                }
            }

            // 3. 清空当前用户的数据库记录
            const { error } = await supabase
                .from('recipe_images')
                .delete()
                .eq('user_id', currentUser.id)

            if (error) {
                console.error('清空图库失败:', error)
                return false
            }

            return true
        } catch (error) {
            console.error('清空图库失败:', error)
            return false
        }
    }

    // 获取当前用户的图库统计信息
    async getGalleryStats(): Promise<GalleryStats> {
        try {
            const currentUser = AuthService.getCurrentUser()
            
            // 如果用户未登录，返回空统计
            if (!currentUser) {
                return { total: 0, cuisineStats: {} }
            }

            const { data: images, error } = await supabase
                .from('recipe_images')
                .select('cuisine, created_at')
                .eq('user_id', currentUser.id)

            if (error) {
                console.error('获取图库统计失败:', error)
                return { total: 0, cuisineStats: {} }
            }

            const cuisineStats: Record<string, number> = {}
            let latestGenerated: string | undefined

            images?.forEach(img => {
                cuisineStats[img.cuisine] = (cuisineStats[img.cuisine] || 0) + 1
                if (!latestGenerated || new Date(img.created_at) > new Date(latestGenerated)) {
                    latestGenerated = img.created_at
                }
            })

            return {
                total: images?.length || 0,
                cuisineStats,
                latestGenerated
            }
        } catch (error) {
            console.error('获取图库统计失败:', error)
            return { total: 0, cuisineStats: {} }
        }
    }

    // 根据菜系筛选当前用户的图片
    async getImagesByCuisine(cuisine: string): Promise<GalleryImage[]> {
        try {
            const currentUser = AuthService.getCurrentUser()
            
            // 如果用户未登录，返回空数组
            if (!currentUser) {
                return []
            }

            const { data, error } = await supabase
                .from('recipe_images')
                .select('*')
                .eq('user_id', currentUser.id)
                .eq('cuisine', cuisine)
                .order('created_at', { ascending: false })

            if (error) {
                console.error('按菜系获取图片失败:', error)
                return []
            }

            return data.map(item => ({
                id: item.id,
                url: item.image_url,
                recipeName: item.recipe_name,
                recipeId: item.recipe_id,
                cuisine: item.cuisine,
                ingredients: item.ingredients || [],
                generatedAt: item.created_at,
                prompt: item.prompt,
                filePath: item.file_path
            }))
        } catch (error) {
            console.error('按菜系获取图片失败:', error)
            return []
        }
    }

    // 搜索当前用户的图片
    async searchImages(query: string): Promise<GalleryImage[]> {
        try {
            const currentUser = AuthService.getCurrentUser()
            
            // 如果用户未登录，返回空数组
            if (!currentUser) {
                return []
            }

            const lowerQuery = query.toLowerCase()
            const { data, error } = await supabase
                .from('recipe_images')
                .select('*')
                .eq('user_id', currentUser.id)
                .or(`recipe_name.ilike.%${lowerQuery}%,cuisine.ilike.%${lowerQuery}%`)
                .order('created_at', { ascending: false })

            if (error) {
                console.error('搜索图片失败:', error)
                return []
            }

            // 客户端筛选ingredients（PostgreSQL数组搜索需要特定语法）
            const filteredData = data?.filter(img => 
                img.ingredients?.some((ingredient: string) => 
                    ingredient.toLowerCase().includes(lowerQuery)
                )
            ) || []

            return filteredData.map(item => ({
                id: item.id,
                url: item.image_url,
                recipeName: item.recipe_name,
                recipeId: item.recipe_id,
                cuisine: item.cuisine,
                ingredients: item.ingredients || [],
                generatedAt: item.created_at,
                prompt: item.prompt,
                filePath: item.file_path
            }))
        } catch (error) {
            console.error('搜索图片失败:', error)
            return []
        }
    }

    // 获取当前用户最近生成的图片
    async getRecentImages(limit: number = 10): Promise<GalleryImage[]> {
        try {
            const currentUser = AuthService.getCurrentUser()
            
            // 如果用户未登录，返回空数组
            if (!currentUser) {
                return []
            }

            const { data, error } = await supabase
                .from('recipe_images')
                .select('*')
                .eq('user_id', currentUser.id)
                .order('created_at', { ascending: false })
                .limit(limit)

            if (error) {
                console.error('获取最近图片失败:', error)
                return []
            }

            return data.map(item => ({
                id: item.id,
                url: item.image_url,
                recipeName: item.recipe_name,
                recipeId: item.recipe_id,
                cuisine: item.cuisine,
                ingredients: item.ingredients || [],
                generatedAt: item.created_at,
                prompt: item.prompt,
                filePath: item.file_path
            }))
        } catch (error) {
            console.error('获取最近图片失败:', error)
            return []
        }
    }
}

export const GalleryService = new GalleryServiceClass()
