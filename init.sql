-- 创建收藏表，用于存储用户收藏的食谱信息
create table public.favorites (
                                  id uuid not null default gen_random_uuid (), -- 主键ID，默认生成UUID
                                  recipe_id text not null, -- 食谱唯一标识符
                                  recipe_name text not null, -- 食谱名称
                                  cuisine text null, -- 菜系类型（可为空）
                                  ingredients jsonb not null, -- 食材列表（JSONB格式存储）
                                  steps jsonb not null, -- 制作步骤（JSONB格式存储）
                                  cooking_tips text null, -- 烹饪技巧（可为空）
                                  difficulty text null, -- 难度等级（可为空）
                                  cooking_time text null, -- 烹饪时间（可为空）
                                  favorite_date timestamp with time zone null default now(), -- 收藏日期，默认为当前时间
                                  user_notes text null, -- 用户备注（可为空）
                                  created_at timestamp with time zone null default now(), -- 记录创建时间，默认为当前时间
                                  updated_at timestamp with time zone null default now(), -- 记录更新时间，默认为当前时间
                                  user_name character varying(255) null, -- 用户名（可为空）
                                  constraint favorites_pkey primary key (id) -- 设置主键约束
) TABLESPACE pg_default;

-- 为 recipe_id 字段创建B树索引，提高查询效率
create index IF not exists idx_favorites_recipe_id on public.favorites using btree (recipe_id) TABLESPACE pg_default;

-- 为 favorite_date 字段创建降序B树索引，优化按收藏时间排序的查询
create index IF not exists idx_favorites_favorite_date on public.favorites using btree (favorite_date desc) TABLESPACE pg_default;

-- 为 cuisine 字段创建B树索引，提升菜系分类查询性能
create index IF not exists idx_favorites_cuisine on public.favorites using btree (cuisine) TABLESPACE pg_default;

-- 为 user_name 字段创建B树索引，加快用户相关数据检索速度
create index IF not exists idx_favorites_user_name on public.favorites using btree (user_name) TABLESPACE pg_default;

-- 在更新记录前自动更新 updated_at 字段的时间戳
create trigger update_favorites_updated_at
    BEFORE update on favorites
    for EACH row
    execute FUNCTION update_updated_at_column ();

-- 创建用户评论表，保存用户的评论信息
create table public.user_comments (
    id uuid not null default gen_random_uuid (), -- 主键ID，默认生成UUID
    user_name text not null, -- 用户名（必填）
    comment_text text not null, -- 评论内容（必填）
    created_at timestamp with time zone null default now(), -- 创建时间，默认为当前时间
    updated_at timestamp with time zone null default now(), -- 更新时间，默认为当前时间
    constraint user_comments_pkey primary key (id) -- 设置主键约束
) TABLESPACE pg_default;

-- 按创建时间降序建立索引，方便获取最新评论
create index IF not exists idx_user_comments_created_at on public.user_comments using btree (created_at desc) TABLESPACE pg_default;

-- 为用户名字段建立索引，加速根据用户名查找评论的操作
create index IF not exists idx_user_comments_user_name on public.user_comments using btree (user_name) TABLESPACE pg_default;

-- 更新操作时自动维护 updated_at 时间戳
create trigger update_user_comments_updated_at
BEFORE update on user_comments
for EACH row
execute FUNCTION update_updated_at_column ();


-- 创建用户已做菜谱表，记录用户实际制作过的食谱
create table public.user_dishes (
    id uuid not null default gen_random_uuid (), -- 主键ID，默认生成UUID
    recipe_id text not null, -- 食谱唯一标识符
    recipe_name text not null, -- 食谱名称
    cuisine text null, -- 菜系类型（可为空）
    ingredients text[] not null, -- 食材数组（文本数组形式存储）
    steps jsonb not null, -- 制作步骤（JSONB格式存储）
    cooking_tips text null, -- 烹饪技巧（可为空）
    difficulty text null, -- 难度等级（可为空）
    cooking_time text null, -- 烹饪时间（可为空）
    favorite_date timestamp with time zone null default now(), -- 标记为喜爱的时间，默认为当前时间
    user_notes text null, -- 用户笔记（可为空）
    created_at timestamp with time zone null default now(), -- 记录创建时间，默认为当前时间
    updated_at timestamp with time zone null default now(), -- 记录更新时间，默认为当前时间
    user_name character varying(255) null, -- 用户名（可为空）
    constraint user_dishes_pkey primary key (id) -- 设置主键约束
) TABLESPACE pg_default;

-- 为食谱名称建立索引，便于快速搜索特定食谱
create index IF not exists idx_user_dishes_recipe_name on public.user_dishes using btree (recipe_name) TABLESPACE pg_default;

-- 建立按创建时间倒序排列的索引，支持最近制作的食谱查询
create index IF not exists idx_user_dishes_created_at on public.user_dishes using btree (created_at desc) TABLESPACE pg_default;

-- 为用户名字段建立索引，加速定位某位用户的所有制作记录
create index IF not exists idx_user_dishes_user_name on public.user_dishes using btree (user_name) TABLESPACE pg_default;


-- 创建用户基本信息表，管理平台注册用户的数据
create table public.users (
    id uuid not null default gen_random_uuid (), -- 主键ID，默认生成UUID
    user_name character varying(255) not null, -- 用户名（最大长度255字符，不可重复）
    password character varying(255) not null, -- 密码哈希值（最大长度255字符）
    created_at timestamp with time zone null default now(), -- 注册时间，默认为当前时间
    updated_at timestamp with time zone null default now(), -- 最后修改时间，默认为当前时间
    constraint users_pkey primary key (id), -- 设置主键约束
    constraint users_user_name_key unique (user_name) -- 用户名必须唯一
) TABLESPACE pg_default;

-- 为用户名字段建立索引，用于登录验证等场景下的高效匹配
create index IF not exists idx_users_user_name on public.users using btree (user_name) TABLESPACE pg_default;

-- 按照注册时间升序建立索引，可用于统计新增用户趋势分析
create index IF not exists idx_users_created_at on public.users using btree (created_at) TABLESPACE pg_default;

-- 更新用户资料时自动刷新 updated_at 时间戳
create trigger update_users_updated_at
BEFORE update on users
for EACH row
execute FUNCTION update_updated_at_column ();
