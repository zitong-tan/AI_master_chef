export interface Database {
  public: {
    Tables: {
      favorites: {
        Row: {
          id: string
          recipe_id: string
          recipe_name: string
          cuisine: string | null
          ingredients: string[]
          steps: any[]
          cooking_tips: string | null
          difficulty: string | null
          cooking_time: string | null
          favorite_date: string
          user_notes: string | null
          user_name: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          recipe_id: string
          recipe_name: string
          cuisine?: string | null
          ingredients: string[]
          steps: any[]
          cooking_tips?: string | null
          difficulty?: string | null
          cooking_time?: string | null
          favorite_date?: string
          user_notes?: string | null
          user_name?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          recipe_id?: string
          recipe_name?: string
          cuisine?: string | null
          ingredients?: string[]
          steps?: any[]
          cooking_tips?: string | null
          difficulty?: string | null
          cooking_time?: string | null
          favorite_date?: string
          user_notes?: string | null
          user_name?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      user_dishes: {
        Row: {
          id: string
          recipe_id: string
          recipe_name: string
          cuisine: string | null
          ingredients: string[]
          steps: any[]
          cooking_tips: string | null
          difficulty: string | null
          cooking_time: string | null
          favorite_date: string
          user_notes: string | null
          user_name: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          recipe_id: string
          recipe_name: string
          cuisine?: string | null
          ingredients: string[]
          steps: any[]
          cooking_tips?: string | null
          difficulty?: string | null
          cooking_time?: string | null
          favorite_date?: string
          user_notes?: string | null
          user_name?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          recipe_id?: string
          recipe_name?: string
          cuisine?: string | null
          ingredients?: string[]
          steps?: any[]
          cooking_tips?: string | null
          difficulty?: string | null
          cooking_time?: string | null
          favorite_date?: string
          user_notes?: string | null
          user_name?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      users: {
        Row: {
          id: string
          user_name: string
          password: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_name: string
          password: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_name?: string
          password?: string
          created_at?: string
          updated_at?: string
        }
      },
      foods: {
        Row: {
          id: number
          user_id: number
          food_name: string
          quantity: number
          unit: string
          expiration_date: string
          storage_suggestion?: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: number
          user_id: number
          food_name: string
          quantity?: number
          unit?: string
          expiration_date: string
          storage_suggestion?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: number
          user_id?: number
          food_name?: string
          quantity?: number
          unit?: string
          expiration_date?: string
          storage_suggestion?: string
          created_at?: string
          updated_at?: string
        }
      },
    
    }
  }
}