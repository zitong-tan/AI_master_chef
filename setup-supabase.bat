@echo off
chcp 65001 >nul
echo.
echo ========================================
echo   AI美食大师 - Supabase配置向导
echo ========================================
echo.

REM 检查.env文件是否存在
if not exist .env (
    echo [1/3] 📝 创建.env文件...
    copy .env.example .env >nul
    echo       ✅ .env文件已创建
) else (
    echo [1/3] ✅ .env文件已存在
)

echo.
echo [2/3] 📋 需要配置的环境变量：
echo.
echo       在 .env 文件中添加以下配置：
echo.
echo       VITE_SUPABASE_URL=your_supabase_project_url
echo       VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
echo.
echo       获取方式：
echo       1. 访问 https://app.supabase.com/
echo       2. 选择你的项目
echo       3. 进入 Settings → API
echo       4. 复制 Project URL 和 anon public key
echo.

echo [3/3] 📚 数据库初始化：
echo.
echo       在Supabase SQL Editor中执行：
echo       supabase-init.sql
echo.
echo ========================================
echo   配置完成后运行: npm run dev
echo ========================================
echo.
pause
