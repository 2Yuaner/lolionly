<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import { wlLive2d } from 'wl-live2d'

const props = withDefaults(defineProps<{
  modelPath?: string
  scale?: number
}>(), {
  modelPath: './live2d/character-costume.model3.json',
  scale: 0.5,
})

const containerRef = ref<HTMLDivElement>()
let controller: any = null

onMounted(() => {
  if (!containerRef.value) return
  const id = `vn-l2d-${Math.random().toString(36).slice(2, 8)}`
  containerRef.value.id = id

  controller = wlLive2d({
    selector: `#${id}`,
    fixed: false,
    models: [
      {
        path: props.modelPath,
        scale: props.scale,
        position: { x: 0, y: 0 },
      }
    ],
  } as any)
})

onUnmounted(() => {
  controller?.destroy?.()
  controller = null
})
</script>

<template>
  <div ref="containerRef" class="live2d-char-container" />
</template>

<style scoped>
.live2d-char-container {
  width: 100%;
  height: 100%;
}
</style>
