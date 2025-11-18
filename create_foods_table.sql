-- 创建用户食材表
CREATE TABLE IF NOT EXISTS foods (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    food_name VARCHAR(100) NOT NULL,
    quantity INTEGER NOT NULL DEFAULT 1,
    unit VARCHAR(20) NOT NULL DEFAULT '个',
    expiration_date DATE NOT NULL,
    storage_suggestion TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- 外键约束，关联用户表
    CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    
    -- 约束：保质期必须大于当前日期
    CONSTRAINT chk_expiration_date CHECK (expiration_date > CURRENT_DATE)
);

-- 创建索引以提高查询性能
CREATE INDEX idx_foods_user_id ON foods(user_id);
CREATE INDEX idx_foods_expiration_date ON foods(expiration_date);
CREATE INDEX idx_foods_created_at ON foods(created_at);

-- 创建触发器，自动更新 updated_at 字段
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_foods_updated_at 
    BEFORE UPDATE ON foods 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- 创建视图，显示即将过期的食材（7天内）
CREATE VIEW expiring_foods AS
SELECT 
    f.*,
    u.user_name,
    (f.expiration_date - CURRENT_DATE) as days_remaining
FROM foods f
JOIN users u ON f.user_id = u.id
WHERE f.expiration_date <= CURRENT_DATE + INTERVAL '7 days'
ORDER BY f.expiration_date ASC;

-- 插入示例数据（可选）
INSERT INTO foods (user_id, food_name, quantity, unit, expiration_date, storage_suggestion) VALUES
(1, '鸡蛋', 12, '个', CURRENT_DATE + INTERVAL '14 days', '冷藏保存，避免与强烈气味食物放在一起'),
(1, '牛奶', 2, '瓶', CURRENT_DATE + INTERVAL '5 days', '冷藏保存，开封后尽快饮用'),
(1, '牛肉', 500, '克', CURRENT_DATE + INTERVAL '3 days', '冷冻保存，分装后避免反复解冻'),
(2, '西红柿', 6, '个', CURRENT_DATE + INTERVAL '7 days', '常温保存，避免阳光直射'),
(2, '土豆', 5, '个', CURRENT_DATE + INTERVAL '30 days', '阴凉干燥处保存，避免发芽');