import { createRouter, createWebHistory } from "vue-router";

import HomePage from "@/views/HomePage.vue";
import FeedPage from "@/views/FeedPage.vue";
import RegisterPage from "@/views/RegisterPage.vue";
import LoginPage from "@/views/LoginPage.vue";

const routes = [
  { path: "/", component: HomePage },
  { path: "/feed", component: FeedPage },
  { path: "/register", component: RegisterPage },
  { path: "/login", component: LoginPage },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
