import type { Component, Raw } from 'vue'

// ===================== 窗口状态 =====================

export interface WindowState {
  id: string
  appId: string
  title: string
  icon?: string
  x: number
  y: number
  width: number
  height: number
  minWidth: number
  minHeight: number
  zIndex: number
  minimized: boolean
  maximized: boolean
  focused: boolean
  closable: boolean
  _prevRect: Rect | null
  /** 传递给窗口内容组件的自定义 props */
  props?: Record<string, unknown>
}

export interface Rect {
  x: number
  y: number
  width: number
  height: number
}

// ===================== 应用注册 =====================

/**
 * 桌面应用描述符 —— 注册一个应用所需的全部元信息
 */
export interface DesktopApp {
  /** 唯一标识，同时作为路由 path（无冲突时） */
  id: string
  /** 窗口标题 / 桌面图标文字 */
  title: string
  /** 桌面图标（emoji 或 iconify class） */
  icon: string
  /** 关联的路由路径，拦截用。为空则不参与路由拦截 */
  route?: string
  /** 窗口内容组件（同步组件，Raw 避免 shallowRef 警告） */
  component: Raw<Component>
  /** 默认窗口尺寸 */
  defaultSize: { width: number; height: number }
  /** 最小窗口尺寸 */
  minSize: { width: number; height: number }
  /** 是否显示在桌面上作为图标 */
  showOnDesktop: boolean
  /** 是否允许关闭 */
  closable: boolean
  /** 是否在新窗口中打开（若为 false 则复用同名窗口） */
  singleton: boolean
  /** 额外传给窗口组件和桌面的自定义数据 */
  meta?: Record<string, unknown>
}

// ===================== 应用注册表 =====================

export interface IAppRegistry {
  register(app: DesktopApp): void
  unregister(id: string): void
  get(id: string): DesktopApp | undefined
  getByRoute(route: string): DesktopApp | undefined
  list(): DesktopApp[]
  listDesktopIcons(): DesktopApp[]
}

// ===================== 窗口事件 =====================

export interface WindowEvents {
  close: [id: string]
  focus: [id: string]
  minimize: [id: string]
  toggleMaximize: [id: string]
  move: [id: string, x: number, y: number]
  resize: [id: string, x: number, y: number, w: number, h: number]
}
