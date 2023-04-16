import path from 'path'
import { defineConfig } from 'vite'
import Vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import Inspect from 'vite-plugin-inspect'

const pathSrc = path.resolve(__dirname, 'src')

export default defineConfig({
  base:'./',
  server:{
    port: 3000,
    host:'0.0.0.0',
    proxy: {
      '/api': {
        target: 'http://106.15.58.0:8888/',
        // target: 'http://10.4.24.12:8888/',
        ws: true,
        changeOrigin: true,
        // rewrite: (path) => path.replace(/^\/api/, ''),
    }
    }
  },
  resolve: {
    alias: {
      '@': pathSrc,
    },
  },
  plugins: [
    Vue(),
    AutoImport({
      imports: ['vue','vue-router'],

      resolvers: [
        ElementPlusResolver(),
      ],

      dts: path.resolve(pathSrc, 'auto-imports.d.ts'),
    }),

    Components({
      resolvers: [
        ElementPlusResolver(),
      ],

      dts: path.resolve(pathSrc, 'components.d.ts'),
    }),
    Inspect(),
  ],
})
