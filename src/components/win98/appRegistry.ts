import { reactive } from 'vue'
import type { DesktopApp, IAppRegistry } from './types'

/**
 * 应用注册表 —— 注册表模式 (Registry Pattern)
 *
 * 全局单例，负责管理所有已注册的桌面应用。
 * 使用 reactive(Map) 确保 Vue 响应式系统能追踪增删操作。
 */
class AppRegistry implements IAppRegistry {
  private apps: Map<string, DesktopApp> = reactive(new Map())
  private routeMap: Map<string, string> = reactive(new Map()) // route -> appId

  /** 注册一个应用 */
  register(app: DesktopApp): void {
    if (this.apps.has(app.id)) {
      console.warn(`[AppRegistry] 应用 "${app.id}" 已存在，将被覆盖`)
    }
    this.apps.set(app.id, app)
    if (app.route) {
      this.routeMap.set(app.route, app.id)
    }
  }

  /** 批量注册 */
  registerAll(apps: DesktopApp[]): void {
    apps.forEach((a) => this.register(a))
  }

  /** 注销一个应用 */
  unregister(id: string): void {
    const app = this.apps.get(id)
    if (app?.route) {
      this.routeMap.delete(app.route)
    }
    this.apps.delete(id)
  }

  /** 通过 ID 获取应用 */
  get(id: string): DesktopApp | undefined {
    return this.apps.get(id)
  }

  /** 通过路由路径查找应用（用于路由拦截） */
  getByRoute(route: string): DesktopApp | undefined {
    const id = this.routeMap.get(route)
    if (id) return this.apps.get(id)
    // 也尝试直接匹配 id（id 本身可能就是路由 path）
    return this.apps.get(route)
  }

  /** 获取所有已注册应用 */
  list(): DesktopApp[] {
    return Array.from(this.apps.values())
  }

  /** 获取应显示在桌面上的应用 */
  listDesktopIcons(): DesktopApp[] {
    return this.list().filter((a) => a.showOnDesktop)
  }
}

/** 全局单例 */
export const appRegistry = new AppRegistry()
