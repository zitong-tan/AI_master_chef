# 美食图鉴RLS权限策略配置

## 需要在Supabase中执行以下SQL语句来设置Row Level Security策略

```sql
-- 1. 启用RLS（如果还没启用）
ALTER TABLE recipe_images ENABLE ROW LEVEL SECURITY;

-- 2. 允许用户读取自己的图片
CREATE POLICY "Users can view their own recipe images" ON recipe_images
FOR SELECT USING (auth.uid()::text = user_id);

-- 3. 允许用户插入自己的图片
CREATE POLICY "Users can insert their own recipe images" ON recipe_images
FOR INSERT WITH CHECK (auth.uid()::text = user_id);

-- 4. 允许用户更新自己的图片
CREATE POLICY "Users can update their own recipe images" ON recipe_images
FOR UPDATE USING (auth.uid()::text = user_id);

-- 5. 允许用户删除自己的图片
CREATE POLICY "Users can delete their own recipe images" ON recipe_images
FOR DELETE USING (auth.uid()::text = user_id);

-- 6. 公开读取权限（可选：如果希望图片能被公开浏览）
CREATE POLICY "Public read access to recipe images" ON recipe_images
FOR SELECT USING (true);

-- 7. 如果需要用户隔离（不公开读取），删除上面的公开策略，只保留用户自己的策略
```

## 执行步骤

1. **登录Supabase Dashboard**
2. **进入你的项目**
3. **左侧菜单点击 "SQL Editor"**
4. **逐一执行上面的SQL语句**

## Storage权限配置

同时需要配置Storage权限：

1. **进入 "Storage" 部分**
2. **点击 "recipe-images" bucket**
3. **进入 "Settings" 标签**
4. **设置以下策略**：

```sql
-- 允许用户读取自己的文件夹
CREATE POLICY "Users can view their own recipe image files" ON storage.objects
FOR SELECT USING (
    bucket_id = 'recipe-images' AND 
    auth.uid()::text = (storage.foldername(name))[1]
);

-- 允许用户上传到自己的文件夹
CREATE POLICY "Users can upload their own recipe image files" ON storage.objects
FOR INSERT WITH CHECK (
    bucket_id = 'recipe-images' AND 
    auth.uid()::text = (storage.foldername(name))[1]
);

-- 允许用户删除自己的文件
CREATE POLICY "Users can delete their own recipe image files" ON storage.objects
FOR DELETE USING (
    bucket_id = 'recipe-images' AND 
    auth.uid()::text = (storage.foldername(name))[1]
);
```

## 注意事项

1. **用户隔离**：所有数据库操作都添加了 `user_id` 过滤
2. **文件组织**：Storage中使用 `recipe-images/{user_id}/` 结构
3. **权限验证**：删除操作会双重验证用户权限
4. **未登录处理**：未登录用户无法进行任何操作

配置完成后，每个用户只能看到和管理自己生成的图片。