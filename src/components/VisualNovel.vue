<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import type { ChapterDef, NovelNode, GameState, FlagEffect, Condition } from '@/types/novel'

// ====== Props ======
const props = defineProps<{
  chapter: ChapterDef
  autoPlaySpeed?: number
}>()

const emit = defineEmits<{
  (e: 'nodeChange', nodeId: string): void
  (e: 'end'): void
}>()

// ====== 游戏状态 ======
const state = reactive<GameState>({
  currentNodeId: props.chapter.startNode,
  flags: {},
})

const isTyping = ref(false)
const displayedText = ref('')
const showChoices = ref(false)
const currentBg = ref('')
const bgVisible = ref(false)

let typeTimer: ReturnType<typeof setInterval> | null = null
let typeIndex = 0

// ====== 当前节点 ======
const currentNode = computed<NovelNode>(() => {
  return props.chapter.nodes[state.currentNodeId]
})

// ====== 条件检查 ======
function checkCondition(cond: Condition): boolean {
  const currentVal = state.flags[cond.key]
  if (currentVal === undefined) return false
  const { operator, value } = cond
  switch (operator) {
    case 'eq': return currentVal === value
    case 'ne': return currentVal !== value
    case 'gt': return Number(currentVal) > Number(value)
    case 'gte': return Number(currentVal) >= Number(value)
    case 'lt': return Number(currentVal) < Number(value)
    case 'lte': return Number(currentVal) <= Number(value)
    default: return false
  }
}

function checkConditions(conditions?: Condition[]): boolean {
  if (!conditions || conditions.length === 0) return true
  return conditions.every(checkCondition)
}

const availableChoices = computed(() => {
  return currentNode.value.edges.filter(e => e.type === 'choice' && checkConditions(e.conditions))
})

const autoEdge = computed(() => {
  return currentNode.value.edges.find(e => e.type === 'auto')
})

// ====== 剧情锁 ======
function applyFlagEffects(effects?: FlagEffect[]): void {
  if (!effects) return
  effects.forEach(fx => {
    state.flags[fx.key] = fx.value
  })
}

// ====== 路径解析 ======
function resolveAssetUrl(path: string): string {
  if (path.startsWith('@/')) {
    return '/src/' + path.slice(2)
  }
  return path
}

// ====== 背景 ======
function applyBackground(bg?: string): void {
  if (!bg) return
  const resolved = resolveAssetUrl(bg)
  if (currentBg.value !== resolved) {
    currentBg.value = resolved
    bgVisible.value = true
  }
}

// ====== 打字机效果 ======
function startTyping(text: string): void {
  stopTyping()
  displayedText.value = ''
  typeIndex = 0
  isTyping.value = true
  const speed = props.autoPlaySpeed ?? 60

  typeTimer = setInterval(() => {
    if (typeIndex < text.length) {
      displayedText.value += text[typeIndex]
      typeIndex++
    } else {
      stopTyping()
      finishNodeDisplay()
    }
  }, speed)
}

function stopTyping(): void {
  if (typeTimer) {
    clearInterval(typeTimer)
    typeTimer = null
  }
  isTyping.value = false
}

function skipTyping(): void {
  if (!isTyping.value || !currentNode.value) return
  stopTyping()
  displayedText.value = currentNode.value.text
  finishNodeDisplay()
}

function finishNodeDisplay(): void {
  if (availableChoices.value.length > 0) {
    showChoices.value = true
  }
}

// ====== 节点进入 ======
function enterNode(nodeId: string): void {
  const node = props.chapter.nodes[nodeId]
  if (!node) {
    emit('end')
    return
  }
  state.currentNodeId = nodeId
  showChoices.value = false
  applyBackground(node.background)
  applyFlagEffects(node.onEnter)
  startTyping(node.text)
  emit('nodeChange', nodeId)
}

// ====== 前进 ======
function advance(): void {
  if (isTyping.value) {
    skipTyping()
    return
  }
  if (showChoices.value) return
  if (autoEdge.value) {
    enterNode(autoEdge.value.target)
    return
  }
  if (currentNode.value.edges.length === 0) {
    emit('end')
  }
}

function selectChoice(target: string): void {
  showChoices.value = false
  enterNode(target)
}

// ====== 立绘样式 ======
function getCharacterStyle(characterId: string) {
  const pose = currentNode.value.characters?.find(c => c.characterId === characterId)
  if (!pose || !pose.visible) return { display: 'none' }
  const positionMap: Record<string, string> = {
    left: '20%', center: '50%', right: '80%',
  }
  return { left: positionMap[pose.position] || '50%', display: 'block' }
}

function getCharacterImage(characterId: string): string {
  const def = props.chapter.characters.find(c => c.id === characterId)
  if (!def) return ''
  if (def.modelType !== 'static') return ''
  const pose = currentNode.value.characters?.find(c => c.characterId === characterId)
  let path = ''
  if (pose) {
    path = def.expressions[pose.expression] || def.staticImagePath || ''
  } else {
    path = def.staticImagePath || ''
  }
  return resolveAssetUrl(path)
}

// ====== 初始化 ======
onMounted(() => {
  const startNode = props.chapter.nodes[state.currentNodeId]
  if (startNode) {
    applyBackground(startNode.background)
    startTyping(startNode.text)
    emit('nodeChange', state.currentNodeId)
  }
})
</script>

<template>
  <div class="visual-novel" @click="advance">
    <!-- 背景层 -->
    <div class="vn-bg-layer" :class="{ 'vn-bg-hidden': !bgVisible }">
      <img
        v-if="currentBg"
        :src="currentBg"
        class="vn-bg-img"
        :class="`vn-transition-${currentNode.transition || 'fade'}`"
        alt="background"
      />
    </div>

    <!-- 角色立绘层 -->
    <div class="vn-character-layer">
      <div
        v-for="charDef in chapter.characters"
        :key="charDef.id"
        class="vn-character"
        :style="getCharacterStyle(charDef.id)"
      >
        <img
          v-if="charDef.modelType === 'static'"
          :src="getCharacterImage(charDef.id)"
          class="vn-char-img"
          :alt="charDef.name"
        />
        <slot
          v-else
          :name="`live2d-${charDef.id}`"
          :character="charDef"
          :pose="currentNode.characters?.find(c => c.characterId === charDef.id)"
        />
      </div>
    </div>

    <!-- 对话框 -->
    <div class="vn-dialogue-box" @click.stop>
      <div
        v-if="currentNode.speaker"
        class="vn-speaker-name"
        :style="{ color: currentNode.speaker.color || '#fff' }"
      >
        {{ currentNode.speaker.name }}
      </div>
      <div class="vn-text-area" @click="advance">
        <p class="vn-text">
          {{ displayedText }}
          <span v-if="isTyping" class="vn-cursor">|</span>
        </p>
        <div v-if="!isTyping && !showChoices && currentNode.edges.length > 0" class="vn-hint">
          ▼
        </div>
      </div>
    </div>

    <!-- 选项 -->
    <Transition name="vn-choices-fade">
      <div v-if="showChoices" class="vn-choices-overlay" @click.stop>
        <button
          v-for="edge in availableChoices"
          :key="edge.id"
          class="vn-choice-btn"
          @click="selectChoice(edge.target)"
        >
          {{ edge.label }}
        </button>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.visual-novel {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  background: #000;
  user-select: none;
  cursor: pointer;
}

.vn-bg-layer {
  position: absolute;
  inset: 0;
  z-index: 1;
}
.vn-bg-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
}
.vn-bg-hidden { opacity: 0; }

.vn-transition-fade { animation: vnBgFade 0.6s ease; }
.vn-transition-slide { animation: vnBgSlide 0.5s ease; }
.vn-transition-dissolve { animation: vnBgFade 1.2s ease; }

@keyframes vnBgFade {
  from { opacity: 0; }
  to   { opacity: 1; }
}
@keyframes vnBgSlide {
  from { opacity: 0; transform: translateX(30px); }
  to   { opacity: 1; transform: translateX(0); }
}

.vn-character-layer {
  position: absolute;
  inset: 0;
  z-index: 3;
  pointer-events: none;
}

.vn-character {
  position: absolute;
  bottom: 0;
  transform: translateX(-50%);
  max-width: 35%;
  max-height: 85%;
  pointer-events: none;
}

.vn-char-img {
  max-width: 100%;
  max-height: 100%;
  height: auto;
  object-fit: contain;
  filter: drop-shadow(0 4px 12px rgba(0, 0, 0, 0.3));
}

.vn-dialogue-box {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 10;
  padding: 20px 32px;
  background: linear-gradient(
    to top,
    rgba(0, 0, 0, 0.85) 0%,
    rgba(0, 0, 0, 0.7)  60%,
    rgba(0, 0, 0, 0)    100%
  );
  min-height: 160px;
}

.vn-speaker-name {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 8px;
  text-shadow: 0 2px 6px rgba(0, 0, 0, 0.6);
  padding-left: 4px;
}

.vn-text-area {
  min-height: 60px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.vn-text {
  color: #f0f0f0;
  font-size: 18px;
  line-height: 1.8;
  margin: 0;
  text-shadow: 0 1px 4px rgba(0, 0, 0, 0.5);
  white-space: pre-wrap;
  word-break: break-word;
}

.vn-cursor {
  animation: vnCursorBlink 0.7s infinite;
  color: #f9a8d4;
  font-weight: bold;
}

@keyframes vnCursorBlink {
  0%, 100% { opacity: 1; }
  50%      { opacity: 0; }
}

.vn-hint {
  text-align: center;
  color: rgba(255, 255, 255, 0.5);
  font-size: 14px;
  margin-top: 8px;
  animation: vnHintBounce 1.2s infinite;
}

@keyframes vnHintBounce {
  0%, 100% { transform: translateY(0); opacity: 0.3; }
  50%      { transform: translateY(4px); opacity: 0.8; }
}

.vn-choices-overlay {
  position: absolute;
  inset: 0;
  z-index: 20;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(4px);
}

.vn-choice-btn {
  min-width: 280px;
  max-width: 80%;
  padding: 14px 32px;
  background: rgba(255, 255, 255, 0.12);
  border: 1px solid rgba(255, 255, 255, 0.25);
  border-radius: 8px;
  color: #f0f0f0;
  font-size: 17px;
  cursor: pointer;
  transition: all 0.2s ease;
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.4);
}

.vn-choice-btn:hover {
  background: rgba(249, 168, 212, 0.3);
  border-color: rgba(249, 168, 212, 0.6);
  transform: scale(1.03);
  box-shadow: 0 0 20px rgba(249, 168, 212, 0.2);
}

.vn-choices-fade-enter-active,
.vn-choices-fade-leave-active {
  transition: opacity 0.35s ease;
}
.vn-choices-fade-enter-from,
.vn-choices-fade-leave-to {
  opacity: 0;
}
</style>
