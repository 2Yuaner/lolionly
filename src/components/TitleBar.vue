<script setup lang="ts">
import { useRouter } from 'vue-router'

defineProps<{
  icon?: string
  title?: string
  /** OS 风格：'windows' | 'mac' | 'linux' | 'win98' */
  os?: 'windows' | 'mac' | 'linux' | 'win98'
}>()

const router = useRouter()
function closeWindow() {
  router.back()
}
</script>

<template>
  <div class="title-bar" :class="`title-bar--${os || 'windows'}`">
    <!-- ====== macOS 红绿灯（左侧） ====== -->
    <div v-if="os === 'mac'" class="traffic-lights">
      <div class="traffic-btn traffic-close" title="关闭" @click="closeWindow">
        <svg width="6" height="6" viewBox="0 0 6 6">
          <line x1="1" y1="1" x2="5" y2="5" stroke="currentColor" stroke-width="1" stroke-linecap="round" />
          <line x1="5" y1="1" x2="1" y2="5" stroke="currentColor" stroke-width="1" stroke-linecap="round" />
        </svg>
      </div>
      <div class="traffic-btn traffic-minimize" title="最小化">
        <svg width="6" height="6" viewBox="0 0 6 6">
          <line x1="1" y1="3" x2="5" y2="3" stroke="currentColor" stroke-width="1" stroke-linecap="round" />
        </svg>
      </div>
      <div class="traffic-btn traffic-maximize" title="全屏">
        <svg width="6" height="6" viewBox="0 0 6 6">
          <polygon points="1,1 1,2.5 2.5,1" fill="currentColor" />
          <polygon points="5,1 5,2.5 3.5,1" fill="currentColor" />
          <polygon points="1,5 1,3.5 2.5,5" fill="currentColor" />
          <polygon points="5,5 5,3.5 3.5,5" fill="currentColor" />
        </svg>
      </div>
    </div>

    <!-- ====== 左侧：图标 + 标题 ====== -->
    <div class="title-bar-left">
      <!-- Win98 小图标（经典 16px 应用图标位） -->
      <span v-if="icon && os === 'win98'" class="title-bar-icon title-bar-icon--win98" v-html="icon" />
      <span v-else-if="icon" class="title-bar-icon" v-html="icon" />
      <span v-if="title" class="title-bar-text">{{ title }}</span>
    </div>

    <!-- 中间留空 -->
    <div class="title-bar-center" />

    <!-- ====== Windows / Linux / Win98 控制按钮（右侧） ====== -->
    <div v-if="os !== 'mac'" class="title-bar-controls">
      <!-- Linux：只有关闭按钮 -->
      <template v-if="os === 'linux'">
        <div class="control-btn control-close" title="关闭" @click="closeWindow">
          <svg width="10" height="10" viewBox="0 0 10 10">
            <line x1="2" y1="2" x2="8" y2="8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
            <line x1="8" y1="2" x2="2" y2="8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
          </svg>
        </div>
      </template>
      <!-- Win98：经典凸起按钮 -->
      <template v-else-if="os === 'win98'">
        <div class="win98-btn win98-minimize" title="最小化">
          <svg width="8" height="8" viewBox="0 0 8 8">
            <rect x="1" y="3.5" width="6" height="1.5" fill="currentColor" />
          </svg>
        </div>
        <div class="win98-btn win98-maximize" title="最大化">
          <svg width="8" height="8" viewBox="0 0 8 8">
            <rect x="1.5" y="1" width="5.5" height="5.5" fill="none" stroke="currentColor" stroke-width="1.3" />
          </svg>
        </div>
        <div class="win98-btn win98-close" title="关闭" @click="closeWindow">
          <svg width="8" height="8" viewBox="0 0 8 8">
            <line x1="1.5" y1="1.5" x2="6.5" y2="6.5" stroke="currentColor" stroke-width="1.5" />
            <line x1="6.5" y1="1.5" x2="1.5" y2="6.5" stroke="currentColor" stroke-width="1.5" />
          </svg>
        </div>
      </template>
      <!-- Windows：最小化 / 最大化 / 关闭 -->
      <template v-else>
        <div class="control-btn control-minimize" title="最小化">
          <svg width="10" height="10" viewBox="0 0 10 10">
            <rect x="1.5" y="4.5" width="7" height="1" fill="currentColor" />
          </svg>
        </div>
        <div class="control-btn control-maximize" title="最大化">
          <svg width="10" height="10" viewBox="0 0 10 10">
            <rect x="1.5" y="1.5" width="7" height="7" rx="1" fill="none" stroke="currentColor" stroke-width="1.2" />
          </svg>
        </div>
        <div class="control-btn control-close" title="关闭" @click="closeWindow">
          <svg width="10" height="10" viewBox="0 0 10 10">
            <line x1="2" y1="2" x2="8" y2="8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
            <line x1="8" y1="2" x2="2" y2="8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
          </svg>
        </div>
      </template>
    </div>
  </div>
</template>

<style scoped>
/* ====== 基础容器 ====== */
.title-bar {
  display: flex;
  align-items: center;
  height: 36px;
  padding: 0 8px;
  user-select: none;
  flex-shrink: 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
}

/* ====== Windows 风格 ====== */
.title-bar--windows {
  background: linear-gradient(180deg,
    #1a1a2e 0%,
    #16213e 50%,
    #0f3460 100%
  );
  border-bottom: 1px solid rgba(100, 180, 255, 0.15);
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.04),
    0 1px 3px rgba(0, 0, 0, 0.3);
}
.title-bar--windows .title-bar-text {
  font-size: 11px;
  font-family: 'Segoe UI', system-ui, sans-serif;
  color: rgba(255, 255, 255, 0.75);
  letter-spacing: 0.02em;
}
.title-bar--windows .title-bar-icon {
  font-size: 13px;
  color: rgba(100, 180, 255, 0.8);
}

/* ====== Win98 经典风格 ====== */
.title-bar--win98 {
  height: 28px;
  padding: 0 3px;
  background: linear-gradient(90deg,
    #08216b 0%,
    #1042b0 10%,
    #1042b0 90%,
    #08216b 100%
  );
  border-bottom: none;
  box-shadow: none;
  gap: 0;
}
.title-bar--win98 .title-bar-left {
  gap: 4px;
  flex: 1;
}
.title-bar--win98 .title-bar-icon--win98 {
  width: 18px;
  height: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 11px;
  color: #fff;
  background: #c0c0c0;
  border: 2px solid;
  border-color: #fff #808080 #808080 #fff;
  margin-left: 1px;
}
.title-bar--win98 .title-bar-text {
  font-size: 11px;
  font-weight: bold;
  font-family: 'Tahoma', 'MS Sans Serif', sans-serif;
  color: #fff;
  letter-spacing: 0;
}
.title-bar--win98 .title-bar-center {
  display: none;
}

/* Win98 凸起按钮 */
.title-bar--win98 .title-bar-controls {
  gap: 2px;
  padding-right: 1px;
}
.win98-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 16px;
  height: 14px;
  cursor: pointer;
  background: #c0c0c0;
  border: 2px solid;
  border-color: #fff #808080 #808080 #fff;
  box-shadow: inset 0 0 0 1px #dfdfdf;
  color: #000;
}
.win98-btn:active {
  border-color: #808080 #fff #fff #808080;
  box-shadow: inset 0 0 0 1px #c0c0c0;
  padding: 1px 0 0 1px;
}
.win98-close {
  margin-left: 2px;
}

/* ====== macOS 风格 ====== */
.title-bar--mac {
  background: linear-gradient(180deg,
    #323246 0%,
    #2c2c3e 50%,
    #262638 100%
  );
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.03),
    0 1px 2px rgba(0, 0, 0, 0.2);
}
.title-bar--mac .title-bar-text {
  font-size: 12px;
  font-weight: 600;
  font-family: -apple-system, 'SF Pro Text', system-ui, sans-serif;
  color: rgba(255, 255, 255, 0.7);
  letter-spacing: 0.01em;
}
.title-bar--mac .title-bar-left {
  justify-content: center;
  flex: 1;
}
.title-bar--mac .title-bar-center {
  display: none;
}

/* macOS 红绿灯 */
.traffic-lights {
  display: flex;
  align-items: center;
  gap: 7px;
  flex-shrink: 0;
  padding-left: 4px;
}
.traffic-btn {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: filter 0.15s;
}
.traffic-btn svg {
  opacity: 0;
  transition: opacity 0.15s;
}
.traffic-lights:hover .traffic-btn svg {
  opacity: 1;
}
.traffic-close {
  background: #ff5f57;
  color: #4a0000;
}
.traffic-minimize {
  background: #febc2e;
  color: #4a3500;
}
.traffic-maximize {
  background: #28c840;
  color: #004a00;
}

/* ====== Linux (GNOME) 风格 ====== */
.title-bar--linux {
  background: #2d2d2d;
  border-bottom: 1px solid rgba(255, 255, 255, 0.04);
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.02),
    0 1px 2px rgba(0, 0, 0, 0.15);
}
.title-bar--linux .title-bar-text {
  font-size: 11px;
  font-weight: 500;
  font-family: 'Cantarell', 'Ubuntu', system-ui, sans-serif;
  color: rgba(255, 255, 255, 0.6);
}
.title-bar--linux .title-bar-icon {
  font-size: 13px;
  color: rgba(255, 255, 255, 0.5);
}
.title-bar--linux .title-bar-controls {
  gap: 0;
}
.title-bar--linux .control-btn {
  width: 22px;
  height: 20px;
  border-radius: 3px;
}

/* ====== 左侧 ====== */
.title-bar-left {
  display: flex;
  align-items: center;
  gap: 7px;
  min-width: 0;
}
.title-bar-icon {
  display: flex;
  align-items: center;
  flex-shrink: 0;
}
.title-bar-text {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* ====== 中间填充 ====== */
.title-bar-center {
  flex: 1;
}

/* ====== 窗口控制按钮（Windows / Linux） ====== */
.title-bar-controls {
  display: flex;
  align-items: center;
  gap: 2px;
  flex-shrink: 0;
}
.control-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 24px;
  border-radius: 3px;
  color: rgba(255, 255, 255, 0.45);
  cursor: pointer;
  transition: background 0.12s, color 0.12s;
}
.control-btn:hover {
  background: rgba(255, 255, 255, 0.08);
  color: rgba(255, 255, 255, 0.85);
}
.control-close:hover {
  background: #e81123;
  color: #fff;
}
</style>
