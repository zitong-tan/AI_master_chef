-- 为users表添加允许插入的行级安全策略
-- 这个策略允许任何人向users表插入数据（适用于注册功能）
CREATE POLICY "允许任何人注册用户" ON "public"."users"
FOR INSERT WITH CHECK (true);

-- 可选：添加允许用户查看自己信息的策略
CREATE POLICY "允许用户查看自己信息" ON "public"."users"
FOR SELECT USING (auth.uid() = id);

-- 可选：添加允许用户更新自己信息的策略
CREATE POLICY "允许用户更新自己信息" ON "public"."users"
FOR UPDATE USING (auth.uid() = id);

-- 如果你想要更严格的策略，可以使用以下替代方案：
-- 只允许认证用户插入数据（需要先启用Supabase Auth）
-- CREATE POLICY "允许认证用户注册" ON "public"."users"
-- FOR INSERT WITH CHECK (auth.role() = 'authenticated');