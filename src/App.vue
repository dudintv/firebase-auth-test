<script setup lang="ts">
import { RouterView } from "vue-router";

// const links = ["Home", "Feed", "Login", "Register"];
const links = [
  { name: "Home", path: "/" },
  { name: "Feed", path: "/feed" },
];
</script>

<template>
  <nav>
    <router-link v-for="link in links" :key="link.name" :to="link.path" class="px-4 text-cyan-600">
      {{ link.name }}
    </router-link>
  </nav>
  <RouterView />
</template>

<style scoped></style>
