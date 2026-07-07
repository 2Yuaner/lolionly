<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useI18n } from 'vue-i18n'

interface Props {
  location?: string
  hour24?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  location: '',
  hour24: true,
})

const { t, locale } = useI18n()

// ====== 语言切换 ======
const showLangMenu = ref(false)
const availableLocales = ['zh-CN', 'en-US'] as const

function switchLocale(loc: string) {
  locale.value = loc
  showLangMenu.value = false
}

// ====== 时钟 ======
const timeStr = ref('')
const dateStr = ref('')
const weekStr = ref('')
let timer: ReturnType<typeof setInterval>

const weekNames = ['日', '月', '火', '水', '木', '金', '土']

function updateTime() {
  const now = new Date()
  const h = now.getHours()
  const m = now.getMinutes()
  const s = now.getSeconds()

  timeStr.value = props.hour24
    ? `${pad(h)}:${pad(m)}:${pad(s)}`
    : `${pad(h % 12 || 12)}:${pad(m)}:${pad(s)} ${h >= 12 ? 'PM' : 'AM'}`

  dateStr.value = `${now.getFullYear()}/${pad(now.getMonth() + 1)}/${pad(now.getDate())}`
  weekStr.value = weekNames[now.getDay()]
}

function pad(n: number) { return String(n).padStart(2, '0') }

onMounted(() => {
  updateTime()
  timer = setInterval(updateTime, 1000)
})
onUnmounted(() => clearInterval(timer))

// ====== 浮动粒子 ======
interface Particle {
  x: number; y: number; char: string; speed: number; opacity: number; phase: number
}
const particles: Particle[] = [
  { x: 5, y: 40, char: '✧', speed: 1.2, opacity: 0.7, phase: 0 },
  { x: 22, y: 70, char: '✧', speed: 0.9, opacity: 0.5, phase: 1.5 },
  { x: 45, y: 30, char: '♪', speed: 1.5, opacity: 0.6, phase: 3 },
  { x: 68, y: 60, char: '✧', speed: 1.1, opacity: 0.55, phase: 0.8 },
  { x: 85, y: 35, char: '♪', speed: 1.3, opacity: 0.65, phase: 2.2 },
  { x: 95, y: 65, char: '✧', speed: 0.8, opacity: 0.45, phase: 1 },
]
</script>

<template>
  <div class="status-bar">
    <!-- 浮动粒子 -->
    <span
      v-for="(p, i) in particles"
      :key="i"
      class="float-particle"
      :style="{
        left: p.x + '%',
        top: p.y + '%',
        animationDelay: p.phase + 's',
        animationDuration: (2.5 + p.speed * 1.5) + 's',
        opacity: p.opacity,
      }"
    >{{ p.char }}</span>

    <!-- 左侧：时间 -->
    <div class="status-section status-time">
      <span class="deco-icon deco-icon--clock">⌛</span>
      <div class="time-badge">
        <div class="time-block">
          <span class="time-text">{{ timeStr }}</span>
          <span class="time-sub">
            {{ dateStr }}
            <span class="time-week"> {{ weekStr }}曜日</span>
          </span>
        </div>
      </div>
    </div>

    <!-- 分隔装饰 -->
    <div class="status-sep">
      <span class="sep-diamond">◆</span>
      <span class="sep-diamond sep-diamond--sm">◇</span>
      <span class="sep-diamond">◆</span>
    </div>

    <!-- 右侧：状态 -->
    <div class="status-section status-action">
      <span class="deco-icon deco-icon--eye">(◍´꒳`◍)</span>
      <div class="action-badge">
        <span class="action-prefix">{{ t('statusBar.browsing') }}</span>
        <span class="action-location">{{ location || '───' }}</span>
      </div>
      <span class="action-spark">✨</span>
    </div>

    <!-- 分隔装饰 2 -->
    <div class="status-sep">
      <span class="sep-diamond">◆</span>
      <span class="sep-diamond sep-diamond--sm">◇</span>
      <span class="sep-diamond">◆</span>
    </div>

    <!-- 语言切换（侧滑） -->
    <div class="status-section status-lang">
      <span class="lang-label">{{ t('statusBar.languageLabel') }}：</span>
      <div class="lang-slide-wrap">
        <span class="lang-current" @click="showLangMenu = !showLangMenu">
          {{ t(`statusBar.languages.${locale}`) }}
          <span class="lang-arrow" :class="{ open: showLangMenu }">▶</span>
        </span>
        <!-- 侧滑菜单 -->
        <Transition name="slide">
          <div v-if="showLangMenu" class="lang-menu">
            <span class="lang-sep">|</span>
            <div
              v-for="loc in availableLocales"
              :key="loc"
              class="lang-option"
              :class="{ active: locale === loc, hidden: locale === loc }"
              @click.stop="switchLocale(loc)"
            >
              {{ t(`statusBar.languages.${loc}`) }}
            </div>
          </div>
        </Transition>
      </div>
    </div>
  </div>
</template>

<style scoped>
@font-face {
  font-family: 'XingQiBa';
  src: url('@/assets/font/XingQiBadeDianZiRiJi/XingQiBadeDianZiRiJi-2.ttf') format('truetype');
  font-display: swap;
}

.status-bar {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0;
  pointer-events: auto;
  user-select: none;
  position: relative;
  overflow: hidden;
}

/* ====== 浮动粒子 ====== */
.float-particle {
  position: absolute;
  font-size: 10px;
  color: #f9a8d4;
  pointer-events: none;
  animation: float-up 3s ease-in-out infinite;
  text-shadow: 0 0 4px rgba(249, 168, 212, 0.6);
  z-index: 1;
}

.float-particle:nth-child(even) { color: #93c5fd; }

@keyframes float-up {
  0%, 100% { transform: translateY(0) scale(0.8); opacity: 0.3; }
  50%      { transform: translateY(-14px) scale(1.3); opacity: 0.9; }
}

/* ====== 区块 ====== */
.status-section {
  display: flex;
  align-items: center;
  gap: 8px;
  z-index: 1;
}

/* ====== 装饰图标 ====== */
.deco-icon {
  font-size: 16px;
  animation: icon-bounce 1.8s ease-in-out infinite;
  filter: drop-shadow(0 0 4px rgba(249, 168, 212, 0.7));
}
.deco-icon--eye  { animation-delay: 0s; }
.deco-icon--clock { animation-delay: 0.4s; }

@keyframes icon-bounce {
  0%, 100% { transform: translateY(0); }
  30%      { transform: translateY(-4px); }
  60%      { transform: translateY(0); }
}

/* ====== 时间 ====== */
.status-time {
  min-width: 155px;
}

.time-badge {
  background: rgba(0, 0, 0, 0.5);
  border: 1px solid rgba(249, 168, 212, 0.25);
  border-radius: 6px;
  padding: 3px 10px;
  box-shadow:
    0 0 8px rgba(0, 0, 0, 0.3),
    0 0 16px rgba(249, 168, 212, 0.15);
}

.time-block {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  line-height: 1.2;
}

.time-text {
  font-size: 20px;
  font-weight: 800;
  font-family: 'Courier New', 'Consolas', monospace;
  letter-spacing: 3px;
  background: linear-gradient(
    90deg,
    #fca5d4 0%,
    #fde68a 25%,
    #a5d8ff 50%,
    #d4a5fc 75%,
    #fca5d4 100%
  );
  background-size: 200% 100%;
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: time-shift 3s linear infinite;
}

@keyframes time-shift {
  0% { background-position: 0% 50%; }
  100% { background-position: 200% 50%; }
}

.time-sub {
  font-size: 10px;
  color: rgba(255, 255, 255, 0.85);
  letter-spacing: 0.5px;
}

.time-week {
  color: #fcd34d;
  font-weight: 600;
  text-shadow: 0 0 4px rgba(252, 211, 77, 0.5);
}

/* ====== 分隔装饰 ====== */
.status-sep {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  margin: 0 14px;
  flex-shrink: 0;
  z-index: 1;
}

.sep-diamond {
  font-size: 8px;
  color: #f9a8d4;
  text-shadow: 0 0 5px rgba(249, 168, 212, 0.7);
  animation: sep-glow 1.5s ease-in-out infinite;
}
.sep-diamond--sm {
  font-size: 5px;
  color: #93c5fd;
  animation-delay: 0.5s;
}

@keyframes sep-glow {
  0%, 100% { opacity: 0.4; transform: scale(0.8); }
  50%      { opacity: 1;   transform: scale(1.2); }
}

/* ====== 状态文字 ====== */
.status-action {
  display: flex;
  align-items: center;
  gap: 5px;
}

.action-badge {
  display: flex;
  align-items: baseline;
  gap: 4px;
  background: rgba(0, 0, 0, 0.5);
  border: 1px solid rgba(147, 197, 253, 0.25);
  border-radius: 6px;
  padding: 3px 10px;
  box-shadow:
    0 0 8px rgba(0, 0, 0, 0.3),
    0 0 16px rgba(147, 197, 253, 0.15);
}

.action-prefix {
  font-size: 13px;
  font-weight: 500;
  color: #fff;
  text-shadow:
    0 0 6px rgba(249, 168, 212, 0.7),
    0 0 12px rgba(147, 197, 253, 0.4);
  white-space: nowrap;
}

.action-location {
  font-size: 15px;
  font-weight: 700;
  background: linear-gradient(135deg, #fca5d4, #d4a5fc, #a5d8ff);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  filter:
    drop-shadow(0 0 6px rgba(249, 168, 212, 0.7))
    drop-shadow(0 0 12px rgba(147, 197, 253, 0.4));
  max-width: 180px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.action-spark {
  font-size: 12px;
  animation: sparkle 1.2s ease-in-out infinite;
}

@keyframes sparkle {
  0%, 100% { opacity: 0.2; transform: scale(0.6) rotate(0deg); }
  50%      { opacity: 1;   transform: scale(1.3) rotate(180deg); }
}

/* ====== 语言切换（侧滑风格） ====== */
.status-lang {
  font-family: 'XingQiBa', sans-serif;
  gap: 3px;
}

.lang-slide-wrap {
  display: flex;
  align-items: center;
  gap: 0;
}

.lang-label {
  font-size: 14px;
  color: #fde68a;
  text-shadow:
    1px 1px 0 #e879a0,
    2px 2px 0 rgba(249, 168, 212, 0.4),
    0 0 8px rgba(253, 230, 138, 0.5);
  letter-spacing: 0.05em;
  flex-shrink: 0;
}

.lang-current {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 15px;
  font-weight: 700;
  color: #fff;
  padding: 2px 8px;
  background: linear-gradient(135deg,
    rgba(249, 168, 212, 0.4),
    rgba(147, 197, 253, 0.4)
  );
  border: 1.5px dashed rgba(253, 230, 138, 0.6);
  border-radius: 12px;
  text-shadow:
    1px 1px 0 #e879a0,
    0 0 8px rgba(249, 168, 212, 0.6);
  cursor: pointer;
  transition: transform 0.2s, border-color 0.2s;
  animation: lang-wiggle 2s ease-in-out infinite;
  flex-shrink: 0;
  position: relative;
  z-index: 2;
}

.lang-current:hover {
  transform: scale(1.08);
  border-color: #fde68a;
}

.lang-arrow {
  display: inline-block;
  font-size: 7px;
  transition: transform 0.25s;
}
.lang-arrow.open {
  transform: rotate(90deg);
}

/* 侧滑菜单 */
.lang-menu {
  display: flex;
  align-items: center;
  gap: 6px;
  overflow: hidden;
  white-space: nowrap;
}

.lang-sep {
  font-size: 12px;
  color: #fde68a;
  opacity: 0.6;
  flex-shrink: 0;
}

.lang-option {
  font-size: 15px;
  font-weight: 700;
  color: rgba(255, 255, 255, 0.6);
  padding: 2px 8px;
  background: rgba(147, 197, 253, 0.15);
  border: 1.5px dashed rgba(147, 197, 253, 0.3);
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s;
  flex-shrink: 0;
}
.lang-option.hidden {
  display: none;
}
.lang-option:hover {
  color: #fff;
  background: rgba(249, 168, 212, 0.25);
  border-color: rgba(249, 168, 212, 0.6);
  transform: scale(1.05);
}
.lang-option.active {
  color: #fde68a;
  background: rgba(249, 168, 212, 0.2);
  border-color: #fde68a;
}

/* 侧滑过渡 */
.slide-enter-active,
.slide-leave-active {
  transition: all 0.3s ease;
}
.slide-enter-from {
  opacity: 0;
  transform: translateX(-16px);
  max-width: 0;
}
.slide-enter-to {
  opacity: 1;
  transform: translateX(0);
  max-width: 120px;
}
.slide-leave-from {
  opacity: 1;
  transform: translateX(0);
  max-width: 120px;
}
.slide-leave-to {
  opacity: 0;
  transform: translateX(-16px);
  max-width: 0;
}

@keyframes lang-wiggle {
  0%, 100% { transform: rotate(0deg); }
  25%      { transform: rotate(1deg); }
  75%      { transform: rotate(-1deg); }
}
</style>
