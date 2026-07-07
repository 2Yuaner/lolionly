<script setup lang="ts">
import type { DesktopApp } from '../types'

const props = defineProps<{
  app: DesktopApp
  windowProps?: Record<string, unknown>
}>()
</script>

<template>
  <div class="default-app-content">
    <div class="app-icon">{{ app.icon }}</div>
    <h2 class="app-title">{{ app.title }}</h2>
    <p class="app-desc">这是「{{ app.title }}」的内容区域。</p>
    <p class="app-hint">拖拽标题栏移动 · 边缘调整大小 · 双击标题栏最大化</p>
    <div v-if="windowProps" class="app-meta">
      <p>传入参数:</p>
      <pre>{{ JSON.stringify(windowProps, null, 2) }}</pre>
    </div>
  </div>
</template>

<style scoped>
.default-app-content {
  display: flex; flex-direction: column; align-items: center;
  justify-content: center; height: 100%; padding: 24px;
  text-align: center; color: #3a3a3a;
}
.app-icon { font-size: 64px; margin-bottom: 16px; opacity: 0.7; }
.app-title { font-size: 20px; font-weight: 700; margin-bottom: 8px; color: #1e3a8a; }
.app-desc { font-size: 14px; color: #555; margin-bottom: 4px; }
.app-hint { font-size: 12px; color: #888; margin-bottom: 16px; }
.app-meta { width: 100%; text-align: left; }
.app-meta p { font-size: 12px; color: #666; margin-bottom: 4px; }
.app-meta pre {
  background: #f0f0f0; padding: 8px 12px; border-radius: 4px;
  font-size: 12px; overflow-x: auto; max-height: 120px;
}
</style>
