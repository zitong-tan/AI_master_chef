import { supabase } from './supabaseService'
import type { Database } from '@/types/supabase'

type User = Database['public']['Tables']['users']['Row']

export interface LoginData {
  user_name: string
  password: string
}

export interface RegisterData extends LoginData {
  confirmPassword: string
}

export interface ChangePasswordData {
  currentPassword: string
  newPassword: string
  confirmPassword: string
}

export class AuthService {
  private static currentUser: User | null = null

  /**
   * 用户登录
   */
  static async login(loginData: LoginData): Promise<{ success: boolean; user?: User; error?: string }> {
    try {
      // 查询用户
      const { data: users, error } = await supabase
        .from('users')
        .select('*')
        .eq('user_name', loginData.user_name)
        .limit(1)

      if (error) {
        console.error('登录查询失败:', error)
        return { success: false, error: '登录失败，请稍后重试' }
      }

      if (!users || users.length === 0) {
        return { success: false, error: '用户名不存在' }
      }

      const user = users[0]
      
      // 简单密码验证（实际应用中应该使用哈希加密）
      if (user.password !== loginData.password) {
        return { success: false, error: '密码错误' }
      }

      // 保存用户信息到本地存储
      localStorage.setItem('currentUser', JSON.stringify(user))
      this.currentUser = user

      return { success: true, user }
    } catch (error) {
      console.error('登录异常:', error)
      return { success: false, error: '登录失败，请稍后重试' }
    }
  }

  /**
   * 用户注册
   */
  static async register(registerData: RegisterData): Promise<{ success: boolean; user?: User; error?: string }> {
    try {
      // 验证密码确认
      if (registerData.password !== registerData.confirmPassword) {
        return { success: false, error: '两次输入的密码不一致' }
      }

      // 检查用户名是否已存在
      const { data: existingUsers, error: checkError } = await supabase
        .from('users')
        .select('user_name')
        .eq('user_name', registerData.user_name)
        .limit(1)

      if (checkError) {
        console.error('检查用户名失败:', checkError)
        return { success: false, error: '注册失败，请稍后重试' }
      }

      if (existingUsers && existingUsers.length > 0) {
        return { success: false, error: '用户名已存在' }
      }

      // 创建新用户
      const { data: newUser, error: createError } = await supabase
        .from('users')
        .insert({
          user_name: registerData.user_name,
          password: registerData.password // 实际应用中应该加密
        })
        .select()
        .single()

      if (createError) {
        console.error('创建用户失败:', createError)
        return { success: false, error: '注册失败，请稍后重试' }
      }

      // 自动登录
      localStorage.setItem('currentUser', JSON.stringify(newUser))
      this.currentUser = newUser

      return { success: true, user: newUser }
    } catch (error) {
      console.error('注册异常:', error)
      return { success: false, error: '注册失败，请稍后重试' }
    }
  }

  /**
   * 修改密码
   */
  static async changePassword(passwordData: ChangePasswordData): Promise<{ success: boolean; error?: string }> {
    try {
      const currentUser = this.getCurrentUser()
      if (!currentUser) {
        return { success: false, error: '请先登录' }
      }

      // 验证当前密码
      if (currentUser.password !== passwordData.currentPassword) {
        return { success: false, error: '当前密码错误' }
      }

      // 验证新密码确认
      if (passwordData.newPassword !== passwordData.confirmPassword) {
        return { success: false, error: '两次输入的新密码不一致' }
      }

      // 更新密码
      const { error } = await supabase
        .from('users')
        .update({ password: passwordData.newPassword })
        .eq('id', currentUser.id)

      if (error) {
        console.error('修改密码失败:', error)
        return { success: false, error: '修改密码失败，请稍后重试' }
      }

      // 更新本地存储的用户信息
      const updatedUser = { ...currentUser, password: passwordData.newPassword }
      localStorage.setItem('currentUser', JSON.stringify(updatedUser))
      this.currentUser = updatedUser

      return { success: true }
    } catch (error) {
      console.error('修改密码异常:', error)
      return { success: false, error: '修改密码失败，请稍后重试' }
    }
  }

  /**
   * 用户登出
   */
  static logout(): void {
    localStorage.removeItem('currentUser')
    this.currentUser = null
  }

  /**
   * 获取当前用户
   */
  static getCurrentUser(): User | null {
    if (this.currentUser) {
      return this.currentUser
    }

    try {
      const storedUser = localStorage.getItem('currentUser')
      if (storedUser) {
        this.currentUser = JSON.parse(storedUser)
        return this.currentUser
      }
    } catch (error) {
      console.error('获取用户信息失败:', error)
    }

    return null
  }

  /**
   * 检查是否已登录
   */
  static isLoggedIn(): boolean {
    return this.getCurrentUser() !== null
  }

  /**
   * 获取当前用户名
   */
  static getCurrentUserName(): string | null {
    const user = this.getCurrentUser()
    return user ? user.user_name : null
  }
}