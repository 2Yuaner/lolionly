// ====== 核心 ======
export { useWindowStore } from './useWindowStore'
export { appRegistry } from './appRegistry'
export { default as DesktopLayout } from './DesktopLayout.vue'

// ====== 基础组件 ======
export { default as WindowFrame } from './WindowFrame.vue'
export { default as Taskbar } from './Taskbar.vue'
export { default as DesktopIcon } from './DesktopIcon.vue'

// ====== 内置应用 ======
export { default as DefaultApp } from './apps/DefaultApp.vue'
export { default as WelcomeApp } from './apps/WelcomeApp.vue'

// ====== 类型 ======
export type {
  WindowState,
  Rect,
  DesktopApp,
  IAppRegistry,
  WindowEvents,
} from './types'
