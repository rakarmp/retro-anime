import { createRouter, createWebHistory } from 'vue-router';
import type { RouteRecordRaw } from 'vue-router';
import HomePage from '../views/HomePage.vue';
import AnimeDetailPage from '../views/AnimeDetailPage.vue';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Home',
    component: HomePage
  },
  {
    path: '/anime/:id',
    name: 'AnimeDetail',
    component: AnimeDetailPage
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;