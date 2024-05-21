<script setup lang="ts">
import { RouterView, useRouter } from "vue-router";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { onMounted, ref } from "vue";

const router = useRouter();

// const links = ["Home", "Feed", "Login", "Register"];
const links = [
  { name: "Home", path: "/" },
  { name: "Feed", path: "/feed" },
  { name: "Register", path: "/register" },
  { name: "Register TOTP", path: "/register-totp" },
  { name: "Login", path: "/login" },
  { name: "Login by phone", path: "/login-by-phone" },
  { name: "Login by TOTP", path: "/login-by-totp" },
];

async function handleSignOut() {
  const auth = getAuth();
  await signOut(auth);
  console.log("Sign out");
  router.push("/login");
}

const isLoggedIn = ref(false);
let auth;
onMounted(() => {
  auth = getAuth();
  onAuthStateChanged(auth, (user) => {
    isLoggedIn.value = !!user;
  });
});
</script>

<template>
  <nav>
    <router-link v-for="link in links" :key="link.name" :to="link.path" class="px-4 text-cyan-600">
      {{ link.name }}
    </router-link>
    <button v-if="isLoggedIn" @click="handleSignOut">Sign out</button>
  </nav>
  <div class="p-4">
    <RouterView />
  </div>
</template>

<style scoped></style>
