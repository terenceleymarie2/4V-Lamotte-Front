import { createRouter, createWebHistory } from 'vue-router';
import AdminView from '../views/AdminView.vue';
import CompetitionsView from '../views/CompetitionsView.vue';
import HomeView from '../views/HomeView.vue';
import LoginView from '../views/LoginView.vue';


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: "/2026_Jardy",
    },
    {
      path: '/competitions',
      name: 'competitions',
      component: CompetitionsView,
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
