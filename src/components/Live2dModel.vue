<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'
import { wlLive2d } from 'wl-live2d'

let controller: any = null

onMounted(() => {
  controller = wlLive2d({
    models: [
      {
        path: './live2d/character-costume.model3.json',
        scale: 0.6,
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
  <div class="live2d-container" />
</template>
