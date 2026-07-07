import { defineStore } from 'pinia'
import { ref } from 'vue'

export interface ActivityMessage {
  id: number
  type: 'left'
  avatar: string
  nickname: string
  content: string
}

export const useActivityStore = defineStore('activity', () => {
  const messages = ref<ActivityMessage[]>([])
  let nextId = 1
  const maxMessages = 100

  function add(nickname: string, content: string) {
    messages.value.push({
      id: nextId++,
      type: 'left' as const,
      avatar: 'https://api.dicebear.com/9.x/avataaars/svg?seed=SystemLog',
      nickname,
      content,
    })
    // 保持最新 N 条
    if (messages.value.length > maxMessages) {
      messages.value = messages.value.slice(-maxMessages)
    }
  }

  /** 鼠标点击 */
  function logClick(target: string) {
    add('🖱️ 鼠标', `点击了「${target}」`)
  }

  /** 键盘按键 */
  function logKey(key: string) {
    add('⌨️ 键盘', `按下了「${key}」键`)
  }

  /** 路由跳转 */
  function logRoute(path: string, name: string) {
    add('🔗 导航', `进入了「${name}」页面`)
  }

  /** 按钮点击 */
  function logButton(label: string) {
    add('🔘 按钮', `点击了「${label}」按钮`)
  }

  function clear() {
    messages.value = []
    nextId = 1
  }

  return {
    messages,
    add,
    logClick,
    logKey,
    logRoute,
    logButton,
    clear,
  }
})
