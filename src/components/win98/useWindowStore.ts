import { defineStore } from 'pinia'
import { ref, computed, reactive, markRaw } from 'vue'
import type { Component } from 'vue'
import type { WindowState, DesktopApp } from './types'
import { appRegistry } from './appRegistry'

export const useWindowStore = defineStore('win98-windows', () => {
  // ====== 状态 ======
  const windows = ref<WindowState[]>([])
  let _zCounter = 10
  let _idCounter = 0

  // ====== 计算属性 ======
  const windowList = computed(() => windows.value)
  const hasWindows = computed(() => windows.value.length > 0)

  // ====== 内部工具 ======
  function genId(): string {
    return `win_${++_idCounter}`
  }

  function genZIndex(): number {
    return ++_zCounter
  }

  function findWindow(id: string): WindowState | undefined {
    return windows.value.find((w) => w.id === id)
  }

  // ====== 窗口操作 ======

  /**
   * 通过 App 元信息开窗 —— 工厂方法
   */
  function openByApp(app: DesktopApp, props?: Record<string, unknown>): string {
    // singleton 模式：复用已有窗口
    if (app.singleton) {
      const existing = windows.value.find((w) => w.appId === app.id && !w.minimized)
      if (existing) {
        focusWindow(existing.id)
        return existing.id
      }
    }

    const id = genId()
    const offset = windows.value.length * 30

    const w: WindowState = reactive({
      id,
      appId: app.id,
      title: app.title,
      icon: app.icon,
      x: 100 + offset,
      y: 60 + offset,
      width: app.defaultSize.width,
      height: app.defaultSize.height,
      minWidth: app.minSize.width,
      minHeight: app.minSize.height,
      zIndex: genZIndex(),
      minimized: false,
      maximized: false,
      focused: true,
      closable: app.closable,
      _prevRect: null,
      props,
    })

    windows.value.forEach((w) => (w.focused = false))
    windows.value.push(w)
    return id
  }

  /**
   * 通过 appId 开窗
   */
  function openByAppId(appId: string, props?: Record<string, unknown>): string | null {
    const app = appRegistry.get(appId)
    if (!app) return null
    return openByApp(app, props)
  }

  /**
   * 通过路由路径开窗（路由拦截用）
   */
  function openByRoute(route: string): string | null {
    const app = appRegistry.getByRoute(route)
    if (!app) return null
    return openByApp(app)
  }

  function closeWindow(id: string) {
    const idx = windows.value.findIndex((w) => w.id === id)
    if (idx === -1) return
    windows.value.splice(idx, 1)
    const top = windows.value.reduce(
      (max, w) => (w.zIndex > max.zIndex ? w : max),
      windows.value[0],
    )
    if (top) top.focused = true
  }

  function focusWindow(id: string) {
    const win = findWindow(id)
    if (!win) return
    windows.value.forEach((w) => (w.focused = false))
    win.focused = true
    win.zIndex = genZIndex()
  }

  function minimizeWindow(id: string) {
    const win = findWindow(id)
    if (!win) return
    win.minimized = true
    win.focused = false
    const visible = windows.value
      .filter((w) => !w.minimized && w.id !== id)
      .sort((a, b) => b.zIndex - a.zIndex)
    if (visible.length > 0) {
      visible[0].focused = true
    }
  }

  function restoreWindow(id: string) {
    const win = findWindow(id)
    if (!win) return
    win.minimized = false
    focusWindow(id)
  }

  function toggleMaximize(id: string) {
    const win = findWindow(id)
    if (!win) return
    if (win.maximized) {
      if (win._prevRect) {
        win.x = win._prevRect.x
        win.y = win._prevRect.y
        win.width = win._prevRect.width
        win.height = win._prevRect.height
        win._prevRect = null
      }
      win.maximized = false
    } else {
      win._prevRect = { x: win.x, y: win.y, width: win.width, height: win.height }
      // 最大化：宽高由 CSS 百分比自动填满
      win.y = 0
      win.maximized = true
    }
  }

  function moveWindow(id: string, x: number, y: number) {
    const win = findWindow(id)
    if (!win || win.maximized) return
    win.x = x
    win.y = y
  }

  function resizeWindow(id: string, x: number, y: number, width: number, height: number) {
    const win = findWindow(id)
    if (!win || win.maximized) return
    win.x = x
    win.y = y
    win.width = Math.max(win.minWidth, width)
    win.height = Math.max(win.minHeight, height)
  }

  /**
   * 获取窗口对应的应用组件
   */
  function getAppComponent(win: WindowState): Component | null {
    const app = appRegistry.get(win.appId)
    return app?.component ?? null
  }

  return {
    windows,
    windowList,
    hasWindows,
    openByApp,
    openByAppId,
    openByRoute,
    closeWindow,
    focusWindow,
    minimizeWindow,
    restoreWindow,
    toggleMaximize,
    moveWindow,
    resizeWindow,
    getAppComponent,
  }
})
