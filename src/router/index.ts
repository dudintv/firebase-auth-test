import { createRouter, createWebHistory } from "vue-router";
import { getAuth } from "firebase/auth";

import HomePage from "@/views/HomePage.vue";
import FeedPage from "@/views/FeedPage.vue";
import RegisterPage from "@/views/RegisterPage.vue";
import LoginPage from "@/views/LoginPage.vue";
import LoginByPhonePage from "@/views/LoginByPhonePage.vue";

const routes = [
  { path: "/", component: HomePage },
  { path: "/register", component: RegisterPage },
  { path: "/login", component: LoginPage },
  { path: "/login-by-phone", component: LoginByPhonePage },
  { path: "/feed", component: FeedPage, meta: { requiresAuth: true } },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

function getCurrentUser() {
  return new Promise((resolve, reject) => {
    const unsubscribe = getAuth().onAuthStateChanged((user) => {
      unsubscribe();
      resolve(user);
    }, reject);
  });
}

router.beforeEach(async (to, from, next) => {
  if (to.matched.some((record) => record.meta.requiresAuth)) {
    if (await getCurrentUser()) {
      next();
    } else {
      next("/login");
    }
  } else {
    next();
  }
});

export default router;
