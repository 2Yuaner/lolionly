<script setup lang="ts">
import { ref, computed } from 'vue'
import type { WindowState } from './types'

const props = defineProps<{
  win: WindowState
}>()

const emit = defineEmits<{
  close: [id: string]
  focus: [id: string]
  minimize: [id: string]
  toggleMaximize: [id: string]
  move: [id: string, x: number, y: number]
  resize: [id: string, x: number, y: number, w: number, h: number]
}>()

// ====== 拖拽移动 ======
const dragging = ref(false)
const dragStart = ref({ mx: 0, my: 0, wx: 0, wy: 0 })

function onTitleMouseDown(e: MouseEvent) {
  if (props.win.maximized) return
  dragging.value = true
  dragStart.value = { mx: e.clientX, my: e.clientY, wx: props.win.x, wy: props.win.y }
  document.addEventListener('mousemove', onDragMove)
  document.addEventListener('mouseup', onDragEnd)
}

function onDragMove(e: MouseEvent) {
  if (!dragging.value) return
  const dx = e.clientX - dragStart.value.mx
  const dy = e.clientY - dragStart.value.my
  emit('move', props.win.id, dragStart.value.wx + dx, dragStart.value.wy + dy)
}

function onDragEnd() {
  dragging.value = false
  document.removeEventListener('mousemove', onDragMove)
  document.removeEventListener('mouseup', onDragEnd)
}

// ====== 调整大小 ======
type ResizeDir = 'n' | 's' | 'e' | 'w' | 'ne' | 'nw' | 'se' | 'sw'
const resizing = ref(false)
const resizeDir = ref<ResizeDir | null>(null)
const resizeStart = ref({ mx: 0, my: 0, x: 0, y: 0, w: 0, h: 0 })

function onResizeStart(dir: ResizeDir, e: MouseEvent) {
  if (props.win.maximized) return
  e.stopPropagation()
  e.preventDefault()
  resizing.value = true
  resizeDir.value = dir
  resizeStart.value = {
    mx: e.clientX, my: e.clientY,
    x: props.win.x, y: props.win.y,
    w: props.win.width, h: props.win.height,
  }
  document.addEventListener('mousemove', onResizeMove)
  document.addEventListener('mouseup', onResizeEnd)
}

function onResizeMove(e: MouseEvent) {
  if (!resizing.value || !resizeDir.value) return
  const dx = e.clientX - resizeStart.value.mx
  const dy = e.clientY - resizeStart.value.my
  let { x, y, w, h } = resizeStart.value
  const dir = resizeDir.value

  if (dir.includes('e')) w = Math.max(props.win.minWidth, resizeStart.value.w + dx)
  if (dir.includes('s')) h = Math.max(props.win.minHeight, resizeStart.value.h + dy)
  if (dir.includes('w')) {
    w = Math.max(props.win.minWidth, resizeStart.value.w - dx)
    x = resizeStart.value.x + (resizeStart.value.w - w)
  }
  if (dir.includes('n')) {
    h = Math.max(props.win.minHeight, resizeStart.value.h - dy)
    y = resizeStart.value.y + (resizeStart.value.h - h)
  }

  emit('resize', props.win.id, x, y, w, h)
}

function onResizeEnd() {
  resizing.value = false
  resizeDir.value = null
  document.removeEventListener('mousemove', onResizeMove)
  document.removeEventListener('mouseup', onResizeEnd)
}

function onTitleDblClick() {
  emit('toggleMaximize', props.win.id)
}

const winStyle = computed(() => {
  if (props.win.maximized) {
    // 最大化：百分比填充桌面，top=0 贴顶，留 40px 给任务栏
    return {
      left: '0',
      top: `${props.win.y}px`,
      width: '100%',
      height: 'calc(100% - 40px)',
      zIndex: props.win.zIndex,
    }
  }
  return {
    left: `${props.win.x}px`,
    top: `${props.win.y}px`,
    width: `${props.win.width}px`,
    height: `${props.win.height}px`,
    zIndex: props.win.zIndex,
  }
})
</script>

<template>
  <div
    v-show="!win.minimized"
    class="winxp-window"
    :class="{
      focused: win.focused,
      maximized: win.maximized,
      dragging,
      resizing,
    }"
    :style="winStyle"
    @mousedown="emit('focus', win.id)"
  >
    <!-- 标题栏 -->
    <div
      class="winxp-titlebar"
      :class="{ focused: win.focused }"
      @mousedown="onTitleMouseDown"
      @dblclick="onTitleDblClick"
    >
      <div class="winxp-titlebar-left">
        <span v-if="win.icon" class="winxp-title-icon">{{ win.icon }}</span>
        <span class="winxp-title-text">{{ win.title }}</span>
      </div>
      <div class="winxp-titlebar-btns">
        <button class="winxp-btn winxp-btn-minimize" @click.stop="emit('minimize', win.id)" title="最小化">
          <svg viewBox="0 0 10 10" width="10" height="10"><rect x="1" y="4" width="8" height="2" fill="currentColor"/></svg>
        </button>
        <button class="winxp-btn winxp-btn-maximize" @click.stop="emit('toggleMaximize', win.id)" :title="win.maximized ? '还原' : '最大化'">
          <svg v-if="!win.maximized" viewBox="0 0 10 10" width="10" height="10"><rect x="1" y="1" width="8" height="8" fill="none" stroke="currentColor" stroke-width="1.5"/></svg>
          <svg v-else viewBox="0 0 10 10" width="10" height="10">
            <rect x="2" y="0" width="8" height="8" fill="none" stroke="currentColor" stroke-width="1.2"/>
            <rect x="0" y="4" width="8" height="6" fill="white" stroke="currentColor" stroke-width="1.2"/>
          </svg>
        </button>
        <button
          v-if="win.closable"
          class="winxp-btn winxp-btn-close"
          @click.stop="emit('close', win.id)"
          title="关闭"
        >
          <svg viewBox="0 0 10 10" width="10" height="10"><line x1="1" y1="1" x2="9" y2="9" stroke="currentColor" stroke-width="1.5"/><line x1="9" y1="1" x2="1" y2="9" stroke="currentColor" stroke-width="1.5"/></svg>
        </button>
      </div>
    </div>

    <!-- 内容区 -->
    <div class="winxp-body">
      <slot />
    </div>

    <!-- 调整大小手柄 -->
    <template v-if="!win.maximized">
      <div class="resize-handle n" @mousedown="onResizeStart('n', $event)" />
      <div class="resize-handle s" @mousedown="onResizeStart('s', $event)" />
      <div class="resize-handle e" @mousedown="onResizeStart('e', $event)" />
      <div class="resize-handle w" @mousedown="onResizeStart('w', $event)" />
      <div class="resize-handle ne" @mousedown="onResizeStart('ne', $event)" />
      <div class="resize-handle nw" @mousedown="onResizeStart('nw', $event)" />
      <div class="resize-handle se" @mousedown="onResizeStart('se', $event)" />
      <div class="resize-handle sw" @mousedown="onResizeStart('sw', $event)" />
    </template>
  </div>
</template>

<style scoped>
.winxp-window {
  position: absolute;
  display: flex;
  flex-direction: column;
  border-radius: 8px 8px 0 0;
  box-shadow:
    0 0 0 1px rgba(0, 59, 143, 0.8),
    0 0 0 3px rgba(210, 228, 247, 0.9),
    0 4px 20px rgba(0, 0, 0, 0.55);
  overflow: hidden;
  user-select: none;
}
.winxp-window.focused {
  box-shadow:
    0 0 0 1px rgba(0, 59, 143, 1),
    0 0 0 3px rgba(180, 210, 245, 1),
    0 6px 24px rgba(0, 0, 0, 0.6);
}
.winxp-window.maximized { border-radius: 0; }
.winxp-window.dragging,
.winxp-window.resizing { transition: none !important; }

.winxp-titlebar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 30px;
  padding: 0 4px 0 8px;
  background: linear-gradient(180deg,
    #0058e6 0%, #1a6cf0 3%, #2b7ff5 6%, #509cf9 15%,
    #6cb0fb 25%, #3d8df7 50%, #2b7ff5 60%, #1a6cf0 70%,
    #0d5de0 85%, #0050d4 100%
  );
  border-radius: 8px 8px 0 0;
  cursor: default;
  flex-shrink: 0;
}
.winxp-titlebar.focused {
  background: linear-gradient(180deg,
    #0058e6 0%, #1a6cf0 3%, #3d8df7 6%, #6cb0fb 15%,
    #8ec8fd 25%, #509cf9 50%, #3d8df7 60%, #2b7ff5 70%,
    #1a6cf0 85%, #0d5de0 100%
  );
}

.winxp-titlebar-left { display: flex; align-items: center; gap: 5px; min-width: 0; color: #fff; text-shadow: 0 1px 1px rgba(0,0,0,0.4); font-size: 13px; font-family: 'Tahoma', 'Microsoft YaHei', sans-serif; }
.winxp-title-icon { font-size: 14px; line-height: 1; }
.winxp-title-text { white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }

.winxp-titlebar-btns { display: flex; gap: 2px; flex-shrink: 0; }
.winxp-btn {
  width: 21px; height: 21px;
  display: flex; align-items: center; justify-content: center;
  border: none; border-radius: 3px; cursor: pointer;
  color: #fff; background: rgba(255,255,255,0.12);
  transition: background 0.1s;
}
.winxp-btn:hover { background: rgba(255,255,255,0.3); }
.winxp-btn:active { background: rgba(255,255,255,0.15); }
.winxp-btn-close:hover { background: #e04343; }

.winxp-body { flex: 1; min-height: 0; background: #ece9d8; overflow: auto; contain: layout; }

.resize-handle { position: absolute; z-index: 10; }
.resize-handle.n, .resize-handle.s { left: 4px; right: 4px; height: 4px; cursor: ns-resize; }
.resize-handle.n { top: 0; } .resize-handle.s { bottom: 0; }
.resize-handle.e, .resize-handle.w { top: 4px; bottom: 4px; width: 4px; cursor: ew-resize; }
.resize-handle.e { right: 0; } .resize-handle.w { left: 0; }
.resize-handle.ne, .resize-handle.nw, .resize-handle.se, .resize-handle.sw { width: 8px; height: 8px; }
.resize-handle.ne { top: 0; right: 0; cursor: nesw-resize; }
.resize-handle.nw { top: 0; left: 0; cursor: nwse-resize; }
.resize-handle.se { bottom: 0; right: 0; cursor: nwse-resize; }
.resize-handle.sw { bottom: 0; left: 0; cursor: nesw-resize; }
</style>
