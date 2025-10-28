// 简单的Supabase连接测试脚本
const { createClient } = require('@supabase/supabase-js')

const supabase = createClient(
  'https://lsffqvdzwnvtrmweqkwu.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxzZmZxdmR6d252dHJtd2Vxa3d1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE2MDg4OTksImV4cCI6MjA3NzE4NDg5OX0.Q1FIHwidSIBtTft-tmpIHe_hWXxx_ll1EX4tubud8Ts'
)

async function testConnection() {
  console.log('正在测试Supabase连接...')
  
  try {
    // 测试查询
    const { data, error } = await supabase
      .from('favorites')
      .select('*')
      .limit(1)
    
    if (error) {
      console.error('❌ Supabase连接失败:', error.message)
      console.log('请检查：')
      console.log('1. Supabase项目URL是否正确')
      console.log('2. Anon密钥是否正确')
      console.log('3. favorites表是否存在')
      console.log('4. RLS策略是否允许匿名访问')
    } else {
      console.log('✅ Supabase连接成功！')
      console.log('当前收藏数量:', data?.length || 0)
    }
  } catch (err) {
    console.error('❌ 连接测试异常:', err.message)
  }
}

testConnection()