import { defineConfig } from 'vite'
import vueJsx from '@vitejs/plugin-vue-jsx'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), vueJsx()],
  base: './',
  build: {
    lib: {
      name: 'vue-ssr-pagination',
      entry: 'src/packages/index.ts'
    }
  }
})
