-- 为favorites表添加user_name字段
ALTER TABLE favorites ADD COLUMN IF NOT EXISTS user_name VARCHAR(255);

-- 为user_dishes表添加user_name字段
ALTER TABLE user_dishes ADD COLUMN IF NOT EXISTS user_name VARCHAR(255);

-- 可选：为现有数据设置默认用户名为"匿名用户"
UPDATE favorites SET user_name = '匿名用户' WHERE user_name IS NULL;
UPDATE user_dishes SET user_name = '匿名用户' WHERE user_name IS NULL;

-- 创建索引（可选，提高查询性能）
CREATE INDEX IF NOT EXISTS idx_favorites_user_name ON favorites(user_name);
CREATE INDEX IF NOT EXISTS idx_user_dishes_user_name ON user_dishes(user_name);

-- 添加行级安全策略（如果需要）
-- 允许用户查看所有菜品
CREATE POLICY "允许查看所有菜品" ON "public"."user_dishes"
FOR SELECT USING (true);

-- 允许用户查看所有收藏
CREATE POLICY "允许查看所有收藏" ON "public"."favorites"
FOR SELECT USING (true);