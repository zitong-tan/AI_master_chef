// 调试收藏功能的脚本
// 运行此脚本来检查收藏功能的具体问题

const { createClient } = require('@supabase/supabase-js')

// 从环境变量或配置文件中获取Supabase配置
const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://your-project.supabase.co'
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key'

const supabase = createClient(supabaseUrl, supabaseKey)

async function testFavoriteInsertion() {
    console.log('=== 测试收藏功能 ===')
    
    // 测试数据
    const testData = {
        recipe_id: 'test-recipe-' + Date.now(),
        recipe_name: '测试菜品',
        cuisine: '测试菜系',
        ingredients: ['测试食材1', '测试食材2'],
        steps: ['步骤1', '步骤2'],
        cooking_tips: '测试烹饪技巧',
        difficulty: '简单',
        cooking_time: '30分钟',
        servings: null,
        tags: null,
        user_notes: '测试备注',
        user_name: '测试用户',
        favorite_date: new Date().toISOString()
    }
    
    console.log('测试数据:', testData)
    
    try {
        // 测试插入操作
        const { data, error } = await supabase
            .from('favorites')
            .insert(testData)
            .select()
        
        if (error) {
            console.error('❌ 插入失败:', error)
            console.log('错误详情:')
            console.log('- 错误码:', error.code)
            console.log('- 错误信息:', error.message)
            console.log('- 错误详情:', error.details)
            console.log('- 错误提示:', error.hint)
            
            // 检查常见错误
            if (error.code === '42501') {
                console.log('🔒 错误类型: RLS策略问题 - 缺少INSERT权限')
            } else if (error.code === '23505') {
                console.log('🔑 错误类型: 唯一约束冲突 - recipe_id已存在')
            } else if (error.code === '42703') {
                console.log('📊 错误类型: 字段不存在 - 检查表结构')
            }
        } else {
            console.log('✅ 插入成功:', data)
        }
        
        // 测试查询操作
        console.log('\n=== 测试查询功能 ===')
        const { data: queryData, error: queryError } = await supabase
            .from('favorites')
            .select('*')
            .limit(5)
        
        if (queryError) {
            console.error('❌ 查询失败:', queryError)
        } else {
            console.log('✅ 查询成功，找到记录:', queryData.length)
            console.log('示例数据:', queryData[0])
        }
        
    } catch (err) {
        console.error('❌ 测试过程中发生异常:', err)
    }
}

async function checkTableStructure() {
    console.log('\n=== 检查表结构 ===')
    
    try {
        // 检查favorites表是否存在user_name字段
        const { data, error } = await supabase
            .from('favorites')
            .select('*')
            .limit(1)
        
        if (error) {
            console.error('❌ 检查表结构失败:', error)
            return
        }
        
        if (data && data.length > 0) {
            const firstRecord = data[0]
            console.log('表字段:', Object.keys(firstRecord))
            
            // 检查关键字段是否存在
            const requiredFields = ['user_name', 'recipe_id', 'recipe_name']
            const missingFields = requiredFields.filter(field => !(field in firstRecord))
            
            if (missingFields.length > 0) {
                console.log('❌ 缺少字段:', missingFields)
            } else {
                console.log('✅ 所有必需字段都存在')
            }
        }
        
    } catch (err) {
        console.error('❌ 检查表结构时发生异常:', err)
    }
}

async function main() {
    console.log('开始调试收藏功能...')
    
    // 检查Supabase连接
    console.log('Supabase URL:', supabaseUrl.substring(0, 30) + '...')
    console.log('Supabase Key:', supabaseKey.substring(0, 10) + '...')
    
    await testFavoriteInsertion()
    await checkTableStructure()
    
    console.log('\n=== 调试完成 ===')
}

// 运行调试
main().catch(console.error)