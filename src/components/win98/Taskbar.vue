<script setup lang="ts">
import type { WindowState } from './types'

defineProps<{
  windows: WindowState[]
  clock: string
  startButtonText?: string
}>()

const emit = defineEmits<{
  toggleWindow: [id: string]
  startClick: []
}>()
</script>

<template>
  <div class="winxp-taskbar">
    <button class="taskbar-start-btn" @click="emit('startClick')">
      <span class="taskbar-start-logo">
        <svg viewBox="0 0 32 32" width="18" height="18">
          <rect x="2" y="2" width="12" height="12" rx="2" fill="#fff" opacity="0.9"/>
          <rect x="16" y="2" width="12" height="12" rx="2" fill="#fff" opacity="0.9"/>
          <rect x="2" y="16" width="12" height="12" rx="2" fill="#fff" opacity="0.9"/>
          <rect x="16" y="16" width="12" height="12" rx="2" fill="#fff" opacity="0.9"/>
        </svg>
      </span>
      <span class="taskbar-start-text">{{ startButtonText || '开始' }}</span>
    </button>

    <div class="taskbar-windows">
      <button
        v-for="win in windows"
        :key="win.id"
        class="taskbar-window-btn"
        :class="{ active: win.focused && !win.minimized, minimized: win.minimized }"
        @click="emit('toggleWindow', win.id)"
      >
        <span class="taskbar-win-icon">{{ win.icon || '📄' }}</span>
        <span class="taskbar-win-title">{{ win.title }}</span>
      </button>
    </div>

    <div class="taskbar-tray">
      <span class="tray-clock">{{ clock }}</span>
    </div>
  </div>
</template>

<style scoped>
.winxp-taskbar {
  position: absolute; bottom: 0; left: 0; right: 0; height: 40px;
  display: flex; align-items: center;
  background: linear-gradient(180deg,
    #3168d5 0%, #4580e8 3%, #4a89ed 10%, #5e9cf2 30%,
    #3972d8 60%, #2a5cc5 80%, #1e4db3 95%, #1c47a8 100%
  );
  box-shadow: 0 -1px 0 rgba(255,255,255,0.2) inset;
  z-index: 9999; padding: 0 4px; gap: 4px;
}

.taskbar-start-btn {
  display: flex; align-items: center; gap: 5px; height: 30px;
  padding: 0 12px 0 8px; border: none; border-radius: 0 8px 8px 0;
  cursor: pointer;
  background: linear-gradient(180deg, #5ead3a 0%, #6fc34d 40%, #4a9e2f 60%, #3d8a23 100%);
  color: #fff; font-size: 13px; font-weight: 700;
  font-family: 'Tahoma', 'Microsoft YaHei', sans-serif;
  text-shadow: 0 1px 1px rgba(0,0,0,0.3);
  box-shadow: 0 1px 0 rgba(255,255,255,0.3) inset, 0 0 4px rgba(0,0,0,0.2);
  transition: filter 0.1s; flex-shrink: 0;
}
.taskbar-start-btn:hover { filter: brightness(1.1); }
.taskbar-start-btn:active { filter: brightness(0.9); }
.taskbar-start-logo { display: flex; }
.taskbar-start-text { letter-spacing: 1px; }

.taskbar-windows {
  flex: 1; display: flex; gap: 3px;
  overflow-x: auto; overflow-y: hidden; height: 30px;
}
.taskbar-windows::-webkit-scrollbar { height: 0; }

.taskbar-window-btn {
  display: flex; align-items: center; gap: 5px;
  min-width: 0; max-width: 160px; height: 26px;
  padding: 0 10px; border: 1px solid rgba(255,255,255,0.2);
  border-radius: 3px; cursor: pointer;
  background: rgba(255,255,255,0.12); color: #fff;
  font-size: 12px; font-family: 'Tahoma', 'Microsoft YaHei', sans-serif;
  transition: background 0.15s; flex-shrink: 0; white-space: nowrap;
}
.taskbar-window-btn:hover { background: rgba(255,255,255,0.25); }
.taskbar-window-btn.active {
  background: rgba(255,255,255,0.3); border-color: rgba(255,255,255,0.5);
  box-shadow: 0 0 0 1px rgba(255,255,255,0.15) inset;
}
.taskbar-window-btn.minimized { background: rgba(255,255,255,0.08); }
.taskbar-win-icon { flex-shrink: 0; font-size: 14px; }
.taskbar-win-title { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }

.taskbar-tray {
  display: flex; align-items: center; height: 30px;
  padding: 0 10px; background: rgba(0,0,0,0.08);
  border-radius: 3px; flex-shrink: 0;
}
.tray-clock {
  color: #fff; font-size: 12px;
  font-family: 'Tahoma', 'Microsoft YaHei', sans-serif;
  font-weight: 600; text-shadow: 0 1px 1px rgba(0,0,0,0.3);
}
</style>
