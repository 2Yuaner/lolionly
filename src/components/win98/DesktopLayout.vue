<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch, computed } from 'vue'
import { useRouter } from 'vue-router'
import type { Component } from 'vue'
import DesktopIcon from './DesktopIcon.vue'
import WindowFrame from './WindowFrame.vue'
import Taskbar from './Taskbar.vue'
import { appRegistry } from './appRegistry'
import { useWindowStore } from './useWindowStore'
import DefaultApp from './apps/DefaultApp.vue'

const props = withDefaults(defineProps<{
  /** 桌面图标列表（覆盖注册表中 showOnDesktop 的图标） */
  desktopIcons?: { icon: string; label: string; appId: string }[]
  /** '开始' 按钮文字 */
  startButtonText?: string
  /** 桌面背景渐变 */
  background?: string
}>(), {
  startButtonText: '开始',
  background: 'linear-gradient(135deg, #3a6fd8 0%, #245edc 40%, #7ba9e8 70%, #a8cff0 100%)',
})

const router = useRouter()
const winStore = useWindowStore()
const { windowList, openByAppId, openByRoute, closeWindow, focusWindow, minimizeWindow, restoreWindow, toggleMaximize, moveWindow, resizeWindow, getAppComponent } = winStore

// ====== 时钟 ======
const clock = ref('')
let clockTimer: ReturnType<typeof setInterval> | null = null

function updateClock() {
  const now = new Date()
  const h = String(now.getHours()).padStart(2, '0')
  const m = String(now.getMinutes()).padStart(2, '0')
  clock.value = `${h}:${m}`
}

onMounted(() => {
  updateClock()
  clockTimer = setInterval(updateClock, 10000)
})

onUnmounted(() => {
  if (clockTimer) clearInterval(clockTimer)
})

// ====== 桌面图标（优先用 props，fallback 到注册表） ======
const desktopIcons = computed(() => {
  if (props.desktopIcons && props.desktopIcons.length > 0) {
    return props.desktopIcons
  }
  return appRegistry.listDesktopIcons().map((app) => ({
    icon: app.icon,
    label: app.title,
    appId: app.id,
  }))
})

function onIconDblClick(appId: string) {
  const app = appRegistry.get(appId)
  // 如果应用配置了路由跳转，直接导航而非开窗
  if (app?.meta?.navigateTo) {
    router.push(app.meta.navigateTo as string)
    return
  }
  openByAppId(appId)
}

// ====== 路由拦截 —— 核心：拦截已注册路由 → 打开窗口而非跳转 ======
let removeRouteGuard: (() => void) | null = null

onMounted(() => {
  removeRouteGuard = router.beforeEach((to, from, next) => {
    // 仅在桌面路由内拦截
    if (from.name !== 'desktop') {
      next()
      return
    }
    // 跳回桌面首页 → 正常放行
    if (to.name === 'desktop') {
      next()
      return
    }
    // 检查是否注册了对应应用
    const app = appRegistry.getByRoute(to.path) || appRegistry.get(to.name as string)
    if (app) {
      // 拦截：打开窗口，阻止路由跳转
      openByRoute(to.path)
      next(false)
    } else {
      next()
    }
  })
})

onUnmounted(() => {
  removeRouteGuard?.()
})

// ====== 任务栏按钮切换 ======
function onTaskbarToggle(id: string) {
  const win = windowList.find((w) => w.id === id)
  if (!win) return
  if (win.minimized) {
    restoreWindow(id)
  } else if (win.focused) {
    minimizeWindow(id)
  } else {
    focusWindow(id)
  }
}

// ====== 获取窗口内容组件 ======
function resolveAppComponent(win: (typeof windowList)[number]): Component {
  return getAppComponent(win) ?? DefaultApp
}
</script>

<template>
  <div class="winxp-desktop" :style="{ background }">
    <!-- 桌面图标区 -->
    <div class="desktop-icons-area">
      <DesktopIcon
        v-for="item in desktopIcons"
        :key="item.appId"
        :icon="item.icon"
        :label="item.label"
        @dblclick="onIconDblClick(item.appId)"
      />
    </div>

    <!-- 窗口层 -->
    <WindowFrame
      v-for="win in windowList"
      :key="win.id"
      :win="win"
      @close="closeWindow"
      @focus="focusWindow"
      @minimize="minimizeWindow"
      @toggle-maximize="toggleMaximize"
      @move="moveWindow"
      @resize="resizeWindow"
    >
      <component
        :is="resolveAppComponent(win)"
        :app="appRegistry.get(win.appId)"
        :window-props="win.props"
      />
    </WindowFrame>

    <!-- 任务栏 -->
    <Taskbar
      :windows="windowList"
      :clock="clock"
      :start-button-text="startButtonText"
      @toggle-window="onTaskbarToggle"
      @start-click="() => {}"
    />
  </div>
</template>

<style scoped>
.winxp-desktop {
  position: absolute;
  inset: 0;
  overflow: hidden;
  font-family: 'Tahoma', 'Microsoft YaHei', sans-serif;
}

.desktop-icons-area {
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  align-content: flex-start;
  gap: 2px;
  padding: 12px 8px;
  height: calc(100% - 40px);
  max-width: 400px;
}
</style>
