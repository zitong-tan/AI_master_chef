-- 完整的用户名称功能SQL语句
-- 在Supabase控制台的SQL编辑器中执行以下语句

-- 1. 为favorites表添加user_name字段
ALTER TABLE favorites ADD COLUMN IF NOT EXISTS user_name VARCHAR(255);

-- 2. 为user_dishes表添加user_name字段
ALTER TABLE user_dishes ADD COLUMN IF NOT EXISTS user_name VARCHAR(255);

-- 3. 为现有数据设置默认用户名为"匿名用户"
UPDATE favorites SET user_name = '匿名用户' WHERE user_name IS NULL;
UPDATE user_dishes SET user_name = '匿名用户' WHERE user_name IS NULL;

-- 4. 创建索引提高查询性能
CREATE INDEX IF NOT EXISTS idx_favorites_user_name ON favorites(user_name);
CREATE INDEX IF NOT EXISTS idx_user_dishes_user_name ON user_dishes(user_name);

-- 5. 添加行级安全策略（确保数据访问安全）
-- 允许任何人查看所有菜品（社区功能）
CREATE POLICY "允许查看所有菜品" ON "public"."user_dishes"
FOR SELECT USING (true);

-- 允许任何人查看所有收藏
CREATE POLICY "允许查看所有收藏" ON "public"."favorites"
FOR SELECT USING (true);

-- 允许认证用户插入菜品（需要登录）
CREATE POLICY "允许认证用户上传菜品" ON "public"."user_dishes"
FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- 允许认证用户插入收藏
CREATE POLICY "允许认证用户添加收藏" ON "public"."favorites"
FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- 允许用户更新自己的菜品
CREATE POLICY "允许用户更新自己菜品" ON "public"."user_dishes"
FOR UPDATE USING (auth.uid()::text = user_name);

-- 允许用户更新自己的收藏
CREATE POLICY "允许用户更新自己收藏" ON "public"."favorites"
FOR UPDATE USING (auth.uid()::text = user_name);

-- 允许用户删除自己的菜品
CREATE POLICY "允许用户删除自己菜品" ON "public"."user_dishes"
FOR DELETE USING (auth.uid()::text = user_name);

-- 允许用户删除自己的收藏
CREATE POLICY "允许用户删除自己收藏" ON "public"."favorites"
FOR DELETE USING (auth.uid()::text = user_name);

-- 6. 验证表结构
SELECT 
    table_name, 
    column_name, 
    data_type, 
    is_nullable
FROM information_schema.columns 
WHERE table_name IN ('favorites', 'user_dishes') 
    AND table_schema = 'public'
ORDER BY table_name, ordinal_position;