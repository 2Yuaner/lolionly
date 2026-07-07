<script setup lang="ts">
import { computed, onMounted, onUnmounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import ChatQueue from '@/components/ChatQueue.vue'
import FrameContainer from '@/components/FrameContainer.vue'
import Live2dModel from '@/components/Live2dModel.vue'
import StatusBar from '@/components/StatusBar.vue'
import TitleBar from '@/components/TitleBar.vue'
import { useActivityStore } from '@/stores/activity'

const activity = useActivityStore()
const router = useRouter()

const route = useRoute()

const locationLabel = computed(() => {
  return (route.meta?.title as string) || route.path
})

// 拓展为新数组，确保每次长度变化时 prop 能触发响应式更新
const allMessages = computed(() => [...activity.messages])

// ====== 全局事件监听 ======

/** 获取点击目标的描述文字 */
function getClickTarget(el: HTMLElement): string {
  // 优先取文本内容（截短）
  const text = (el.textContent || el.innerText || '').trim().slice(0, 20)
  if (text) return text
  // 没有文本则取标签名 + class
  const tag = el.tagName.toLowerCase()
  const cls = el.className && typeof el.className === 'string'
    ? '.' + el.className.split(' ').slice(0, 2).join('.')
    : ''
  return `<${tag}${cls}>`
}

function onDocumentClick(e: MouseEvent) {
  const target = e.target as HTMLElement
  if (!target) return
  const label = getClickTarget(target)
  activity.logClick(label)
}

function onDocumentKeydown(e: KeyboardEvent) {
  // 忽略输入框内的按键
  const tag = (e.target as HTMLElement)?.tagName
  if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return
  let key = e.key
  if (key === ' ') key = 'Space'
  if (key.length === 1) key = key.toUpperCase()
  activity.logKey(key)
}

let removeRouteGuard: (() => void) | null = null

onMounted(() => {
  document.addEventListener('click', onDocumentClick)
  document.addEventListener('keydown', onDocumentKeydown)

  // 路由变化
  removeRouteGuard = router.afterEach((to) => {
    const name = (to.meta?.title as string) || to.name || to.path
    activity.logRoute(to.path, String(name))
  })
})

onUnmounted(() => {
  document.removeEventListener('click', onDocumentClick)
  document.removeEventListener('keydown', onDocumentKeydown)
  removeRouteGuard?.()
})
</script>

<template>
  <Live2dModel />
  <FrameContainer :right="260">
    <TitleBar icon="&#9674;" os="win98" :title="`神户小鸟的爱 - ${locationLabel}`" />
    <div class="app-window-body">
      <RouterView />
    </div>
    <template #right>
      <ChatQueue :messages="allMessages" max-height="100%" />
    </template>
    <template #bottom>
      <StatusBar :location="locationLabel" />
    </template>
  </FrameContainer>
</template>

<style>
/* 窗口主体：填充剩余空间，滚动条在这里 */
.app-window-body {
  flex: 1;
  overflow-y: auto;
  min-height: 0;
}

/* 自定义滚动条 */
.app-window-body::-webkit-scrollbar {
  width: 6px;
}
.app-window-body::-webkit-scrollbar-track {
  background: rgba(30, 30, 40, 0.3);
  border-radius: 3px;
}
.app-window-body::-webkit-scrollbar-thumb {
  background: linear-gradient(180deg, #f9a8d4, #93c5fd);
  border-radius: 3px;
  box-shadow: 0 0 4px rgba(249, 168, 212, 0.4);
}
.app-window-body::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(180deg, #f472b6, #60a5fa);
}

/* Firefox */
.app-window-body {
  scrollbar-width: thin;
  scrollbar-color: #f9a8d4 rgba(30, 30, 40, 0.3);
}
</style>
