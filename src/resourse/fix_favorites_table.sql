-- 修复favorites表结构，确保所有必需的字段都存在
-- 首先检查表结构
SELECT 
    column_name, 
    data_type, 
    is_nullable
FROM information_schema.columns 
WHERE table_name = 'favorites' 
AND table_schema = 'public'
ORDER BY ordinal_position;

-- 如果缺少字段，添加它们
-- 检查并添加user_name字段（如果不存在）
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'favorites' AND column_name = 'user_name'
    ) THEN
        ALTER TABLE favorites ADD COLUMN user_name TEXT;
        RAISE NOTICE '已添加user_name字段';
    END IF;
END $$;

-- 检查并添加cooking_tips字段（如果不存在）
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'favorites' AND column_name = 'cooking_tips'
    ) THEN
        ALTER TABLE favorites ADD COLUMN cooking_tips TEXT;
        RAISE NOTICE '已添加cooking_tips字段';
    END IF;
END $$;

-- 检查并添加difficulty字段（如果不存在）
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'favorites' AND column_name = 'difficulty'
    ) THEN
        ALTER TABLE favorites ADD COLUMN difficulty TEXT;
        RAISE NOTICE '已添加difficulty字段';
    END IF;
END $$;

-- 检查并添加cooking_time字段（如果不存在）
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'favorites' AND column_name = 'cooking_time'
    ) THEN
        ALTER TABLE favorites ADD COLUMN cooking_time TEXT;
        RAISE NOTICE '已添加cooking_time字段';
    END IF;
END $$;

-- 检查并添加user_notes字段（如果不存在）
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'favorites' AND column_name = 'user_notes'
    ) THEN
        ALTER TABLE favorites ADD COLUMN user_notes TEXT;
        RAISE NOTICE '已添加user_notes字段';
    END IF;
END $$;

-- 检查并添加favorite_date字段（如果不存在）
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'favorites' AND column_name = 'favorite_date'
    ) THEN
        ALTER TABLE favorites ADD COLUMN favorite_date TIMESTAMPTZ;
        RAISE NOTICE '已添加favorite_date字段';
    END IF;
END $$;

-- 验证表结构
SELECT 
    column_name, 
    data_type, 
    is_nullable
FROM information_schema.columns 
WHERE table_name = 'favorites' 
AND table_schema = 'public'
ORDER BY ordinal_position;