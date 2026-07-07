<script setup lang="ts">
import VisualNovel from '@/components/VisualNovel.vue'
import chapterData from '@/data/chapter-demo'
import { useRouter } from 'vue-router'

const router = useRouter()

function onNovelEnd() {
  router.push('/galgame')
}
</script>

<template>
  <VisualNovel :chapter="chapterData" @end="onNovelEnd" />
</template>
