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
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}