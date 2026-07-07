<script setup lang="ts">
import { defineAsyncComponent } from 'vue'
import DesktopLayout from '@/components/win98/DesktopLayout.vue'
import { appRegistry } from '@/components/win98/appRegistry'
import WelcomeApp from '@/components/win98/apps/WelcomeApp.vue'
import DefaultApp from '@/components/win98/apps/DefaultApp.vue'
import desktopBg from '@/assets/background/win98.jpg'

// ====== 注册桌面应用 ======
// 旧路由页面注册为桌面窗口应用，在桌面内跳转时会被拦截打开为窗口
// 增删对象即可管理桌面应用，完全数据驱动

appRegistry.registerAll([
  // ---- 系统应用 ----
  {
    id: 'welcome',
    title: '欢迎',
    icon: '🖥️',
    component: WelcomeApp,
    defaultSize: { width: 520, height: 380 },
    minSize: { width: 320, height: 240 },
    showOnDesktop: true,
    closable: true,
    singleton: true,
  },
  {
    id: 'my-computer',
    title: '我的电脑',
    icon: '💻',
    route: '/my-computer',
    component: DefaultApp,
    defaultSize: { width: 640, height: 440 },
    minSize: { width: 360, height: 260 },
    showOnDesktop: true,
    closable: true,
    singleton: true,
  },
  {
    id: 'my-documents',
    title: '我的文档',
    icon: '📁',
    route: '/my-documents',
    component: DefaultApp,
    defaultSize: { width: 580, height: 420 },
    minSize: { width: 320, height: 240 },
    showOnDesktop: true,
    closable: true,
    singleton: true,
  },
  {
    id: 'internet-explorer',
    title: 'Internet Explorer',
    icon: '🌐',
    route: '/ie',
    component: DefaultApp,
    defaultSize: { width: 720, height: 480 },
    minSize: { width: 400, height: 300 },
    showOnDesktop: true,
    closable: true,
    singleton: true,
  },
  {
    id: 'notepad',
    title: '记事本',
    icon: '📝',
    route: '/notepad',
    component: DefaultApp,
    defaultSize: { width: 560, height: 400 },
    minSize: { width: 300, height: 200 },
    showOnDesktop: true,
    closable: true,
    singleton: false,
  },
  {
    id: 'pictures',
    title: '图片收藏',
    icon: '🖼️',
    route: '/pictures',
    component: DefaultApp,
    defaultSize: { width: 600, height: 420 },
    minSize: { width: 320, height: 240 },
    showOnDesktop: true,
    closable: true,
    singleton: true,
  },

  // ---- 项目页面 ----
  {
    id: 'app-galgame',
    title: 'Galgame',
    icon: '🌸',
    component: defineAsyncComponent(() => import('@/pages/galgame/Index.vue')),
    defaultSize: { width: 780, height: 560 },
    minSize: { width: 400, height: 300 },
    showOnDesktop: true,
    closable: true,
    singleton: true,
    meta: { navigateTo: '/galgame' },
  },
  {
    id: 'app-about',
    title: '关于',
    icon: 'ℹ️',
    route: '/about',
    component: defineAsyncComponent(() => import('@/pages/About.vue')),
    defaultSize: { width: 640, height: 480 },
    minSize: { width: 400, height: 300 },
    showOnDesktop: true,
    closable: true,
    singleton: true,
  },
  {
    id: 'app-projects',
    title: '作品',
    icon: '🎨',
    route: '/projects',
    component: defineAsyncComponent(() => import('@/pages/Projects.vue')),
    defaultSize: { width: 720, height: 520 },
    minSize: { width: 400, height: 300 },
    showOnDesktop: true,
    closable: true,
    singleton: true,
  },
  {
    id: 'app-my',
    title: '个人',
    icon: '👤',
    route: '/my',
    component: defineAsyncComponent(() => import('@/pages/my/Index.vue')),
    defaultSize: { width: 560, height: 480 },
    minSize: { width: 360, height: 280 },
    showOnDesktop: true,
    closable: true,
    singleton: true,
  },
])
</script>

<template>
  <DesktopLayout
    :background="`url(${desktopBg}) center/cover`"
  />
</template>

<style>
/* 桌面页需要 .app-window-body 作为 absolute 子元素的定位上下文 */
.app-window-body {
  position: relative;
}
</style>
