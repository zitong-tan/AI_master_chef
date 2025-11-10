-- 为favorites表添加完整的行级安全策略
-- 修复收藏功能无法插入数据的问题

-- 1. 首先确保RLS已启用
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;

-- 2. 添加允许插入收藏的策略
CREATE POLICY "允许任何人添加收藏" ON "public"."favorites"
FOR INSERT WITH CHECK (true);

-- 3. 添加允许查看所有收藏的策略（已存在，但确保存在）
CREATE POLICY "允许查看所有收藏" ON "public"."favorites"
FOR SELECT USING (true);

-- 4. 添加允许更新收藏的策略
CREATE POLICY "允许更新收藏" ON "public"."favorites"
FOR UPDATE USING (true);

-- 5. 添加允许删除收藏的策略
CREATE POLICY "允许删除收藏" ON "public"."favorites"
FOR DELETE USING (true);

-- 6. 如果策略已存在，先删除再重新创建
DROP POLICY IF EXISTS "允许任何人添加收藏" ON "public"."favorites";
DROP POLICY IF EXISTS "允许查看所有收藏" ON "public"."favorites";
DROP POLICY IF EXISTS "允许更新收藏" ON "public"."favorites";
DROP POLICY IF EXISTS "允许删除收藏" ON "public"."favorites";

-- 重新创建策略
CREATE POLICY "允许任何人添加收藏" ON "public"."favorites"
FOR INSERT WITH CHECK (true);

CREATE POLICY "允许查看所有收藏" ON "public"."favorites"
FOR SELECT USING (true);

CREATE POLICY "允许更新收藏" ON "public"."favorites"
FOR UPDATE USING (true);

CREATE POLICY "允许删除收藏" ON "public"."favorites"
FOR DELETE USING (true);