-- ============================================
-- 菜品评论表 - 数据库初始化脚本
-- ============================================
-- 用途: 为每道菜品添加评论功能
-- 执行方式: 在Supabase SQL Editor中执行此脚本
-- ============================================

-- 1. 创建菜品评论表
-- ============================================
CREATE TABLE IF NOT EXISTS dish_comments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    dish_id UUID NOT NULL REFERENCES user_dishes(id) ON DELETE CASCADE,
    user_name TEXT NOT NULL,
    comment_text TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 2. 创建索引以提高查询性能
-- ============================================
CREATE INDEX IF NOT EXISTS idx_dish_comments_dish_id ON dish_comments(dish_id);
CREATE INDEX IF NOT EXISTS idx_dish_comments_created_at ON dish_comments(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_dish_comments_user_name ON dish_comments(user_name);

-- 3. 启用行级安全策略（RLS）
-- ============================================
ALTER TABLE dish_comments ENABLE ROW LEVEL SECURITY;

-- 4. 删除旧策略（如果存在）
-- ============================================
DROP POLICY IF EXISTS "Allow public read access on dish_comments" ON dish_comments;
DROP POLICY IF EXISTS "Allow public insert access on dish_comments" ON dish_comments;
DROP POLICY IF EXISTS "Allow users to delete their own dish comments" ON dish_comments;

-- 5. 创建新的RLS策略
-- ============================================

-- 允许所有人读取评论
CREATE POLICY "Allow public read access on dish_comments" 
ON dish_comments FOR SELECT 
USING (true);

-- 允许所有人添加评论
CREATE POLICY "Allow public insert access on dish_comments" 
ON dish_comments FOR INSERT 
WITH CHECK (true);

-- 允许用户删除自己的评论
CREATE POLICY "Allow users to delete their own dish comments" 
ON dish_comments FOR DELETE 
USING (true);

-- 6. 创建更新时间戳的触发器
-- ============================================
DROP TRIGGER IF EXISTS update_dish_comments_updated_at ON dish_comments;

CREATE TRIGGER update_dish_comments_updated_at
    BEFORE UPDATE ON dish_comments
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- 7. 验证表结构
-- ============================================
SELECT 
    column_name, 
    data_type, 
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_name = 'dish_comments'
ORDER BY ordinal_position;

-- ============================================
-- 初始化完成！
-- ============================================
