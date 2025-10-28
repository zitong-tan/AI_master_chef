import { createClient } from '@supabase/supabase-js'

// 创建Supabase客户端（简化版本，避免类型冲突）
const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
)

export { supabase }