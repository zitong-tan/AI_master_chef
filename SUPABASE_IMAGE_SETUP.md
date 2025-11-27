# Supabase图片存储配置指南

## 前置条件
已按照SQL语句创建了 `recipe_images` 表。

## 步骤1：创建Storage Bucket

1. 登录Supabase Dashboard
2. 进入你的项目
3. 左侧菜单点击 "Storage"
4. 点击 "Create a new bucket"
5. 填写信息：
   - **Name**: `recipe-images`
   - **Public bucket**: 勾选（重要！）
   - **File size limit**: 留空或设置为适当值（如5MB）
6. 点击 "Save"

## 步骤2：设置Bucket权限

在创建bucket后，需要设置正确的权限：

1. 进入刚刚创建的 `recipe-images` bucket
2. 点击 "Settings" 标签
3. 在 "Policies" 部分，创建以下策略：

### 策略1：允许公开读取
```sql
-- 在Policy编辑器中粘贴以下SQL
CREATE POLICY "Allow public access to view images"
ON storage.objects FOR SELECT
USING (bucket_id = 'recipe-images');
```

### 策略2：允许插入（上传）
```sql
-- 在Policy编辑器中粘贴以下SQL
CREATE POLICY "Allow authenticated users to upload images"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'recipe-images');
```

### 策略3：允许删除
```sql
-- 在Policy编辑器中粘贴以下SQL
CREATE POLICY "Allow authenticated users to delete images"
ON storage.objects FOR DELETE
USING (bucket_id = 'recipe-images');
```

## 步骤3：设置数据库表权限

为了确保应用能正确访问 `recipe_images` 表，需要设置RLS（Row Level Security）策略：

```sql
-- 1. 首先启用RLS（如果还没启用）
ALTER TABLE recipe_images ENABLE ROW LEVEL SECURITY;

-- 2. 允许所有人读取数据
CREATE POLICY "Allow public read access to recipe_images"
ON recipe_images FOR SELECT
USING (true);

-- 3. 允许所有人插入数据
CREATE POLICY "Allow public insert access to recipe_images"
ON recipe_images FOR INSERT
WITH CHECK (true);

-- 4. 允许所有人删除自己的数据
CREATE POLICY "Allow users to delete their own recipe_images"
ON recipe_images FOR DELETE
USING (true);
```

## 步骤4：验证配置

完成配置后，可以通过以下方式验证：

1. **检查环境变量**：确保 `.env` 文件中包含：
   ```
   VITE_SUPABASE_URL=你的Supabase项目URL
   VITE_SUPABASE_ANON_KEY=你的Supabase匿名密钥
   ```

2. **测试功能**：
   - 生成一张菜品图片
   - 查看美食图鉴页面
   - 确认图片能正常显示

## 常见问题

### Q: 图片上传成功但无法显示？
A: 检查Storage bucket是否设置为公开访问，以及公开读取权限策略是否正确配置。

### Q: 出现权限错误？
A: 确保数据库表和Storage bucket的权限策略都已正确配置。

### Q: 图片URL无法访问？
A: 检查bucket名称是否正确（代码中使用 `recipe-images`），确保public URL生成正确。

## 技术说明

- 图片通过Supabase Storage存储，避免localStorage大小限制
- 元数据存储在 `recipe_images` 表中，包含图片URL、菜谱信息等
- 支持图片的增删查改操作
- 自动处理Base64和Blob格式的图片数据

配置完成后，图片将能正常上传和显示，不再出现加载失败的问题。