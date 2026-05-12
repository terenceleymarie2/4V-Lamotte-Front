import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';
import AdminView from '../views/AdminView.vue';
import { useSchedulesStore } from '../stores/schedules';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/admin',
      name: 'admin',
      component: AdminView,
    },
  ],
});

router.beforeEach((to, from, next) => {
  if (to.path === '/admin') {
    const password = prompt('Code d\'accès :');
    if (password === 'azertyuiop') {
      const store = useSchedulesStore();
      store.isAdmin = true;
      next();
    } else {
      alert('Accès refusé');
      next('/');
    }
  } else {
    next();
  }
});

export default router;
