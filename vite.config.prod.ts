import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

export default defineConfig({
    plugins: [vue()],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, 'src')
        }
    },
    build: {
        outDir: 'dist',
        assetsDir: 'assets',
        sourcemap: false,
        minify: 'esbuild', // 启用esbuild压缩
        rollupOptions: {
            output: {
                manualChunks: undefined
            }
        }
    },
    base: '/' // 使用绝对路径，与 createWebHistory() 匹配
})
