import { createRouter, createWebHashHistory } from 'vue-router'

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/',
      name: 'desktop',
      meta: { title: '桌面' },
      component: () => import('@/pages/index/Index.vue'),
    },
    {
      path: '/galgame',
      component: () => import('@/pages/galgame/Index.vue'),
      children: [
        {
          path: 'play',
          name: 'galgame-play',
          meta: { title: '视觉小说' },
          component: () => import('@/pages/galgame/Play.vue'),
        },
        {
          path: 'chapters',
          name: 'galgame-chapters',
          meta: { title: '章节选择' },
          component: () => import('@/pages/galgame/Placeholder.vue'),
        },
        {
          path: 'gallery',
          name: 'galgame-gallery',
          meta: { title: '回想' },
          component: () => import('@/pages/galgame/Placeholder.vue'),
        },
      ],
    },
    {
      path: '/about',
      name: 'about',
      meta: { title: '关于' },
      component: () => import('@/pages/About.vue'),
    },
    {
      path: '/projects',
      name: 'projects',
      meta: { title: '作品' },
      component: () => import('@/pages/Projects.vue'),
    },
    {
      path: '/my',
      name: 'my',
      meta: { title: '个人' },
      component: () => import('@/pages/my/Index.vue'),
    },
  ],
})

export default router
