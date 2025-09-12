import { createRouter, createWebHistory } from 'vue-router';
import Home from '../views/Home.vue';
import Posts from '../views/Posts.vue';
import Projects from '../views/Projects.vue';
import Orders from '../views/Orders.vue';
import Courses from '../views/Courses.vue';
import Requests from '../views/Requests.vue';
import Settings from '../views/Settings.vue';
import Profile from '../views/Profile.vue';
import axios from 'axios';

const routes = [
  { path: '/', component: Home, meta: { requiresAuth: true } },
  { path: '/posts', component: Posts, meta: { requiresAuth: true } },
  { path: '/projects', component: Projects, meta: { requiresAuth: true } },
  { path: '/orders', component: Orders, meta: { requiresAuth: true } },
  { path: '/courses', component: Courses, meta: { requiresAuth: true } },
  { path: '/requests', component: Requests, meta: { requiresAuth: true } },
  { path: '/settings', component: Settings, meta: { requiresAuth: true } },
  { path: '/profile', component: Profile, meta: { requiresAuth: true } },
  { path: '/:pathMatch(.*)*', redirect: '/' }, 
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach(async (to, from, next) => {
  if (to.meta.requiresAuth) {
    const token = localStorage.getItem('authToken');
    if (token) {
      try {
        await axios.get('http://localhost:5000/api/auth/me', {
          headers: { Authorization: `Bearer ${token}` },
        });
        next();
      } catch (error) {
        console.error('Token verification failed:', error);
        localStorage.removeItem('authToken');
        next('/');
      }
    } else {
      next('/'); 
    }
  } else {
    next();
  }
});

export default router;