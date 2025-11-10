-- 创建用户评论表
CREATE TABLE IF NOT EXISTS user_comments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_name TEXT NOT NULL,
    comment_text TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 为评论表添加索引以提高查询性能
CREATE INDEX IF NOT EXISTS idx_user_comments_created_at ON user_comments(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_user_comments_user_name ON user_comments(user_name);

-- 启用行级安全策略（RLS）
ALTER TABLE user_comments ENABLE ROW LEVEL SECURITY;

-- 创建策略：允许所有用户查看评论
CREATE POLICY "允许所有用户查看评论" ON user_comments
    FOR SELECT USING (true);

-- 创建策略：允许所有用户插入评论
CREATE POLICY "允许所有用户插入评论" ON user_comments
    FOR INSERT WITH CHECK (true);

-- 创建策略：允许用户更新自己的评论
CREATE POLICY "允许用户更新自己的评论" ON user_comments
    FOR UPDATE USING (user_name = current_setting('request.jwt.claims', true)::json->>'user_name' OR user_name = auth.jwt() ->> 'user_name');

-- 创建策略：允许用户删除自己的评论
CREATE POLICY "允许用户删除自己的评论" ON user_comments
    FOR DELETE USING (user_name = current_setting('request.jwt.claims', true)::json->>'user_name' OR user_name = auth.jwt() ->> 'user_name');

-- 创建更新时间的触发器
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_user_comments_updated_at 
    BEFORE UPDATE ON user_comments 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();