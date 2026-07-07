import { resolve } from 'node:path'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'
import AutoImport from 'unplugin-auto-import/vite'
import Icons from 'unplugin-icons/vite'
import IconsResolver from 'unplugin-icons/resolver'
import Components from 'unplugin-vue-components/vite'

export default defineConfig({
  base: './',
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
  plugins: [
    vue(),
    tailwindcss(),
    AutoImport({
      dts: './src/types/auto-imports.d.ts',
      imports: ['vue', 'vue-router', 'vue-i18n', '@vueuse/core'],
    }),
    Components({
      dts: './src/types/components.d.ts',
      resolvers: [
        IconsResolver({ prefix: 'icon' }),
      ],
    }),
    Icons({ compiler: 'vue3' }),
  ],
})
