import { supabase } from './supabaseService'
import { AuthService } from './authService'

export interface Food {
  id: number
  user_id: string
  food_name: string
  quantity: number
  unit: string
  expiration_date: string
  storage_suggestion?: string
  created_at: string
  updated_at: string
}

export interface FoodInput {
  food_name: string
  quantity: number
  unit: string
  expiration_date: string
  storage_suggestion?: string
}

// 常见食材的默认保质期数据
const defaultExpirationData: Record<string, number> = {
  // 蛋奶类
  '鸡蛋': 21, '鸭蛋': 21, '鹌鹑蛋': 14,
  '牛奶': 7, '酸奶': 14, '奶酪': 21, '黄油': 30,
  
  // 肉类
  '牛肉': 3, '猪肉': 3, '羊肉': 3, '鸡肉': 2, '鸭肉': 2,
  '鱼肉': 1, '虾': 1, '蟹': 1, '贝类': 1,
  
  // 蔬菜类
  '白菜': 14, '青菜': 7, '菠菜': 5, '芹菜': 10,
  '胡萝卜': 21, '土豆': 30, '洋葱': 30, '大蒜': 60,
  '西红柿': 10, '黄瓜': 7, '辣椒': 14, '蘑菇': 5,
  '玉米': 7, '豌豆': 5, '豆角': 7,
  
  // 水果类
  '苹果': 30, '梨': 14, '香蕉': 7, '橙子': 21,
  '葡萄': 7, '草莓': 3, '樱桃': 5, '桃子': 5,
  '西瓜': 10, '哈密瓜': 10, '菠萝': 7,
  
  // 主食类
  '米饭': 2, '面条': 3, '面包': 5, '馒头': 3,
  '面粉': 180, '大米': 180, '玉米面': 90,
  
  // 调味品
  '酱油': 180, '醋': 180, '盐': 365, '糖': 365,
  '油': 180, '料酒': 90, '味精': 365,
}

// 常见食材的储藏建议
const storageSuggestions: Record<string, string> = {
  '鸡蛋': '冷藏保存，避免与强烈气味食物放在一起',
  '牛奶': '冷藏保存，开封后尽快饮用',
  '牛肉': '冷冻保存，分装后避免反复解冻',
  '猪肉': '冷冻保存，分装后避免反复解冻',
  '鸡肉': '冷冻保存，分装后避免反复解冻',
  '鱼肉': '冷冻保存，尽快食用保持新鲜',
  '虾': '冷冻保存，避免反复解冻',
  '白菜': '阴凉通风处保存，避免潮湿',
  '青菜': '冷藏保存，用保鲜袋包装',
  '胡萝卜': '阴凉干燥处保存，避免发芽',
  '土豆': '阴凉干燥处保存，避免阳光直射',
  '西红柿': '常温保存，避免阳光直射',
  '黄瓜': '冷藏保存，保持干燥',
  '苹果': '阴凉处保存，避免与其他水果接触',
  '香蕉': '常温保存，避免挤压',
  '橙子': '阴凉通风处保存',
  '米饭': '冷藏保存，尽快食用',
  '面条': '干燥处保存，避免潮湿',
  '面包': '密封保存，避免变硬',
  '面粉': '干燥密封保存，防虫防潮',
  '大米': '干燥密封保存，防虫防潮',
}

export class FoodService {
  // 获取当前用户的食材列表
  static async getFoods(): Promise<Food[]> {
    try {
      const currentUser = AuthService.getCurrentUser()
      if (!currentUser) {
        return []
      }

      const { data, error } = await supabase
        .from('foods')
        .select('*')
        .eq('user_id', currentUser.id)
        .order('expiration_date', { ascending: true })

      if (error) {
        console.error('获取食材列表失败:', error)
        return []
      }

      return data || []
    } catch (error) {
      console.error('获取食材列表异常:', error)
      return []
    }
  }

  // 添加食材
  static async addFood(foodData: FoodInput): Promise<boolean> {
    try {
      const currentUser = AuthService.getCurrentUser()
      if (!currentUser) {
        return false
      }

      const { error } = await supabase
        .from('foods')
        .insert([{
          ...foodData,
          user_id: currentUser.id
        }])

      if (error) {
        console.error('添加食材失败:', error)
        return false
      }

      return true
    } catch (error) {
      console.error('添加食材异常:', error)
      return false
    }
  }

  // 更新食材
  static async updateFood(foodId: number, foodData: Partial<FoodInput>): Promise<boolean> {
    try {
      const currentUser = AuthService.getCurrentUser()
      if (!currentUser) {
        return false
      }

      const { error } = await supabase
        .from('foods')
        .update(foodData)
        .eq('id', foodId)
        .eq('user_id', currentUser.id)

      if (error) {
        console.error('更新食材失败:', error)
        return false
      }

      return true
    } catch (error) {
      console.error('更新食材异常:', error)
      return false
    }
  }

  // 删除食材
  static async removeFood(foodId: number): Promise<boolean> {
    try {
      const currentUser = AuthService.getCurrentUser()
      if (!currentUser) {
        return false
      }

      const { error } = await supabase
        .from('foods')
        .delete()
        .eq('id', foodId)
        .eq('user_id', currentUser.id)

      if (error) {
        console.error('删除食材失败:', error)
        return false
      }

      return true
    } catch (error) {
      console.error('删除食材异常:', error)
      return false
    }
  }

  // 清理过期食材
  static async clearExpiredFoods(): Promise<boolean> {
    try {
      const currentUser = AuthService.getCurrentUser()
      if (!currentUser) {
        return false
      }

      const { error } = await supabase
        .from('foods')
        .delete()
        .eq('user_id', currentUser.id)
        .lte('expiration_date', new Date().toISOString().split('T')[0])

      if (error) {
        console.error('清理过期食材失败:', error)
        return false
      }

      return true
    } catch (error) {
      console.error('清理过期食材异常:', error)
      return false
    }
  }

  // 清空所有食材
  static async clearAllFoods(): Promise<boolean> {
    try {
      const currentUser = AuthService.getCurrentUser()
      if (!currentUser) {
        return false
      }

      const { error } = await supabase
        .from('foods')
        .delete()
        .eq('user_id', currentUser.id)

      if (error) {
        console.error('清空食材失败:', error)
        return false
      }

      return true
    } catch (error) {
      console.error('清空食材异常:', error)
      return false
    }
  }

  // 获取食材的默认保质期
  static getDefaultExpiration(foodName: string): number {
    const lowerName = foodName.toLowerCase()
    
    for (const [key, days] of Object.entries(defaultExpirationData)) {
      if (lowerName.includes(key.toLowerCase())) {
        return days
      }
    }
    
    // 默认保质期：7天
    return 7
  }

  // 获取食材的储藏建议
  static getStorageSuggestion(foodName: string): string {
    const lowerName = foodName.toLowerCase()
    
    for (const [key, suggestion] of Object.entries(storageSuggestions)) {
      if (lowerName.includes(key.toLowerCase())) {
        return suggestion
      }
    }
    
    // 默认储藏建议
    return '请根据食材特性选择合适的储藏方式，注意保持干燥和适当温度。'
  }

  // 计算保质期到期日期
  static calculateExpirationDate(days: number): string {
    const date = new Date()
    date.setDate(date.getDate() + days)
    return date.toISOString().split('T')[0]
  }

  // 获取即将过期的食材（7天内）
  static async getExpiringFoods(): Promise<Food[]> {
    try {
      const currentUser = AuthService.getCurrentUser()
      if (!currentUser) {
        return []
      }

      const sevenDaysLater = new Date()
      sevenDaysLater.setDate(sevenDaysLater.getDate() + 7)

      const { data, error } = await supabase
        .from('foods')
        .select('*')
        .eq('user_id', currentUser.id)
        .gte('expiration_date', new Date().toISOString().split('T')[0])
        .lte('expiration_date', sevenDaysLater.toISOString().split('T')[0])
        .order('expiration_date', { ascending: true })

      if (error) {
        console.error('获取即将过期食材失败:', error)
        return []
      }

      return data || []
    } catch (error) {
      console.error('获取即将过期食材异常:', error)
      return []
    }
  }

  // 统计食材数据
  static async getFoodStats() {
    const foods = await this.getFoods()
    const now = new Date()
    const sevenDaysLater = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)

    const total = foods.length
    const expiringSoon = foods.filter(food => {
      const expiration = new Date(food.expiration_date)
      return expiration > now && expiration <= sevenDaysLater
    }).length
    
    const expired = foods.filter(food => {
      const expiration = new Date(food.expiration_date)
      return expiration <= now
    }).length

    return {
      total,
      expiringSoon,
      expired
    }
  }

  // 补货清单相关方法
  // 获取补货清单（本地存储）
  static getShoppingList(): ShoppingListItem[] {
    if (typeof window === 'undefined') return []
    
    try {
      const list = localStorage.getItem('shopping_list')
      return list ? JSON.parse(list) : []
    } catch (error) {
      console.error('获取补货清单失败:', error)
      return []
    }
  }

  // 保存补货清单
  static saveShoppingList(list: ShoppingListItem[]): void {
    if (typeof window === 'undefined') return
    
    try {
      localStorage.setItem('shopping_list', JSON.stringify(list))
    } catch (error) {
      console.error('保存补货清单失败:', error)
    }
  }

  // 添加食材到补货清单
  static addToShoppingList(food: Food): boolean {
    try {
      const list = this.getShoppingList()
      
      // 检查是否已存在
      const existingItem = list.find(item => item.food_name === food.food_name)
      if (existingItem) {
        // 如果已存在，更新数量为当前数量（作为参考）
        existingItem.reference_quantity = food.quantity
        existingItem.unit = food.unit
      } else {
        // 添加新项
        list.push({
          id: Date.now(),
          food_name: food.food_name,
          unit: food.unit,
          reference_quantity: food.quantity,
          quantity_to_buy: 1,
          is_selected: false,
          created_at: new Date().toISOString()
        })
      }
      
      this.saveShoppingList(list)
      return true
    } catch (error) {
      console.error('添加到补货清单失败:', error)
      return false
    }
  }

  // 从补货清单移除食材
  static removeFromShoppingList(itemId: number): boolean {
    try {
      const list = this.getShoppingList()
      const filteredList = list.filter(item => item.id !== itemId)
      this.saveShoppingList(filteredList)
      return true
    } catch (error) {
      console.error('从补货清单移除失败:', error)
      return false
    }
  }

  // 更新补货清单项
  static updateShoppingListItem(item: ShoppingListItem): boolean {
    try {
      const list = this.getShoppingList()
      const index = list.findIndex(i => i.id === item.id)
      if (index !== -1) {
        list[index] = { ...list[index], ...item }
        this.saveShoppingList(list)
        return true
      }
      return false
    } catch (error) {
      console.error('更新补货清单项失败:', error)
      return false
    }
  }

  // 清空补货清单
  static clearShoppingList(): boolean {
    try {
      this.saveShoppingList([])
      return true
    } catch (error) {
      console.error('清空补货清单失败:', error)
      return false
    }
  }

  // 批量添加补货清单项到食材库
  static async addPurchasedItemsToFoods(items: ShoppingListItem[]): Promise<boolean> {
    try {
      const currentUser = AuthService.getCurrentUser()
      if (!currentUser) {
        return false
      }

      const purchasedItems = items.filter(item => item.is_selected)
      if (purchasedItems.length === 0) {
        return true
      }

      const foodData = purchasedItems.map(item => ({
        food_name: item.food_name,
        quantity: item.quantity_to_buy,
        unit: item.unit,
        expiration_date: this.calculateExpirationDate(this.getDefaultExpiration(item.food_name)),
        storage_suggestion: this.getStorageSuggestion(item.food_name),
        user_id: currentUser.id
      }))

      const { error } = await supabase
        .from('foods')
        .insert(foodData)

      if (error) {
        console.error('批量添加食材失败:', error)
        return false
      }

      return true
    } catch (error) {
      console.error('批量添加食材异常:', error)
      return false
    }
  }

  // 使用食材相关方法
  // 使用指定数量的食材
  static async useFood(foodId: number, quantity: number, unit: string): Promise<boolean> {
    try {
      // 首先获取当前食材信息
      const { data: foodData, error: fetchError } = await supabase
        .from('foods')
        .select('*')
        .eq('id', foodId)
        .single()

      if (fetchError) {
        console.error('获取食材信息失败:', fetchError)
        return false
      }

      if (!foodData) {
        console.error('食材不存在')
        return false
      }

      // 检查使用数量是否超过库存
      if (quantity > foodData.quantity) {
        console.error('使用数量超过库存')
        return false
      }

      // 计算剩余数量
      const remainingQuantity = foodData.quantity - quantity

      if (remainingQuantity === 0) {
        // 如果用完了，删除食材记录
        const { error: deleteError } = await supabase
          .from('foods')
          .delete()
          .eq('id', foodId)

        if (deleteError) {
          console.error('删除用完的食材失败:', deleteError)
          return false
        }
      } else {
        // 如果还有剩余，更新数量
        const { error: updateError } = await supabase
          .from('foods')
          .update({ quantity: remainingQuantity })
          .eq('id', foodId)

        if (updateError) {
          console.error('更新食材数量失败:', updateError)
          return false
        }
      }

      return true
    } catch (error) {
      console.error('使用食材异常:', error)
      return false
    }
  }

  // 使用全部食材
  static async useAllFood(foodId: number): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('foods')
        .delete()
        .eq('id', foodId)

      if (error) {
        console.error('删除用完的食材失败:', error)
        return false
      }

      return true
    } catch (error) {
      console.error('使用全部食材异常:', error)
      return false
    }
  }

  // 获取即将过期的食材（用于提醒）
  static async getExpiringSoonFoods(daysAhead: number = 3): Promise<Food[]> {
    try {
      const currentUser = AuthService.getCurrentUser()
      if (!currentUser) {
        return []
      }

      const targetDate = new Date()
      targetDate.setDate(targetDate.getDate() + daysAhead)
      targetDate.setHours(23, 59, 59, 999)

      const today = new Date()
      today.setHours(0, 0, 0, 0)

      const { data, error } = await supabase
        .from('foods')
        .select('*')
        .eq('user_id', currentUser.id)
        .gte('expiration_date', today.toISOString().split('T')[0])
        .lte('expiration_date', targetDate.toISOString().split('T')[0])
        .order('expiration_date', { ascending: true })

      if (error) {
        console.error('获取即将过期食材失败:', error)
        return []
      }

      return data || []
    } catch (error) {
      console.error('获取即将过期食材异常:', error)
      return []
    }
  }

  // 获取已过期的食材
  static async getExpiredFoods(): Promise<Food[]> {
    try {
      const currentUser = AuthService.getCurrentUser()
      if (!currentUser) {
        return []
      }

      const today = new Date()
      today.setHours(23, 59, 59, 999)

      const { data, error } = await supabase
        .from('foods')
        .select('*')
        .eq('user_id', currentUser.id)
        .lt('expiration_date', today.toISOString().split('T')[0])
        .order('expiration_date', { ascending: true })

      if (error) {
        console.error('获取已过期食材失败:', error)
        return []
      }

      return data || []
    } catch (error) {
      console.error('获取已过期食材异常:', error)
      return []
    }
  }

  // 获取需要提醒的食材（1天和3天后过期，以及已过期的）
  static async getFoodsWithReminders(): Promise<{
    expiringInOneDay: Food[]
    expiringInThreeDays: Food[]
    expired: Food[]
  }> {
    try {
      const [expiringInOneDay, expiringInThreeDays, expired] = await Promise.all([
        this.getExpiringSoonFoods(1),
        this.getExpiringSoonFoods(3),
        this.getExpiredFoods()
      ])

      // 筛选出确切1天后过期的食材
      const today = new Date()
      const oneDayFromNow = new Date(today)
      oneDayFromNow.setDate(oneDayFromNow.getDate() + 1)
      oneDayFromNow.setHours(23, 59, 59, 999)

      const exactlyOneDay = expiringInOneDay.filter(food => {
        const expiration = new Date(food.expiration_date)
        return expiration.toDateString() === oneDayFromNow.toDateString()
      })

      // 筛选出确切3天后过期的食材
      const threeDaysFromNow = new Date(today)
      threeDaysFromNow.setDate(threeDaysFromNow.getDate() + 3)
      threeDaysFromNow.setHours(23, 59, 59, 999)

      const exactlyThreeDays = expiringInThreeDays.filter(food => {
        const expiration = new Date(food.expiration_date)
        return expiration.toDateString() === threeDaysFromNow.toDateString() && 
               expiration.toDateString() !== oneDayFromNow.toDateString()
      })

      return {
        expiringInOneDay: exactlyOneDay,
        expiringInThreeDays: exactlyThreeDays,
        expired: expired
      }
    } catch (error) {
      console.error('获取提醒食材异常:', error)
      return {
        expiringInOneDay: [],
        expiringInThreeDays: [],
        expired: []
      }
    }
  }
}

// 补货清单项接口
export interface ShoppingListItem {
  id: number
  food_name: string
  unit: string
  reference_quantity: number // 参考数量（原食材数量）
  quantity_to_buy: number // 要购买的数量
  is_selected: boolean
  created_at: string
}