import { defineConfig } from 'vite'
import path from 'path'
import reactRefresh from '@vitejs/plugin-react-refresh'
import styleImport from 'vite-plugin-style-import' // 按需引入组件css样式

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [reactRefresh(), styleImport(
    {
      libs: [
        {
          libraryName: 'zarm',
          esModule: true,
          resolveStyle: (name) => {
            return `zarm/es/${name}/style/css`
          }
        }
      ]
    }
  )],
  css: {
    modules: {
      localsConvention: 'dashesOnly' // 避免自定义的样式重名的风险
    },
    preprocessorOptions: {
      less: {
        // 支持内联 JavaScript
        javascriptEnabled: true
      }
    }
  },
  server: {
    proxy: {
      '/api': {
        // 当遇到 /api 路径时，将其转换成 target 的值
        target: 'http://127.0.0.1:7001',
        changeOrigin: true,
        // 将 /api 重写为空
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'), // src 路径
      'utils': path.resolve(__dirname, 'src/utils'), // utils 路径
      'config': path.resolve(__dirname, 'src/config') // config 路径
    }
  }
})
