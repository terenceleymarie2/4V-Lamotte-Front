import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';
import AdminView from '../views/AdminView.vue';
import LoginView from '../views/LoginView.vue';
import { useSchedulesStore } from "../stores/schedules.ts";
import { storeToRefs } from "pinia";

const defaultCompetition = storeToRefs(useSchedulesStore()).defaultCompetition;

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: `/${defaultCompetition.value as unknown as string}`,
    },
    {
      path: '/:competition',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView,
    },
    {
      path: '/admin',
      name: 'admin',
      component: AdminView,
    },
  ],
});

router.beforeEach((to) => {
  if (to.path === '/admin') {
    const isAdmin = sessionStorage.getItem('isAdmin') === 'true';
    if (!isAdmin) {
      return '/login';
    }
  }

  return true;
});

export default router;
