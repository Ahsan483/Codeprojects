import { createRouter, createWebHistory } from 'vue-router';
import Home from '../views/Home.vue';
import Posts from '../views/Posts.vue';
import Projects from '../views/Projects.vue';
import Orders from '../views/Orders.vue';
import Courses from '../views/Courses.vue';
import Requests from '../views/Requests.vue';
import Settings from '../views/Settings.vue';
import Profile from '../views/Profile.vue';

const routes = [
  { path: '/', component: Home },
  { path: '/posts', component: Posts },
  { path: '/projects', component: Projects },
  { path: '/orders', component: Orders },
  { path: '/courses', component: Courses },
  { path: '/requests', component: Requests },
  { path: '/settings', component: Settings },
  { path: '/profile', component: Profile },
  { path: '/logout', redirect: '/' } // Simulate logout by redirecting to home
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;