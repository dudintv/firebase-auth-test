<script setup lang="ts">
import { ref } from "vue";
import router from "@/router";
import { getAuth, createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "firebase/auth";

const email = ref("");
const password = ref("");

async function register() {
  console.log(email.value, password.value);
  try {
    const authData = await createUserWithEmailAndPassword(getAuth(), email.value, password.value);
    console.log("Registered! authData =", authData);
    router.push("/feed");
  } catch (error: any) {
    console.error(error);
    alert(error);
  }
}

async function signInWithGoogle() {
  console.log("Sign In With Google");
  const provide = new GoogleAuthProvider();
  try {
    await signInWithPopup(getAuth(), provide);
    router.push("/feed");
  } catch (error: any) {
    console.error(error);
  }
}
</script>

<template>
  <h1>REGISTER</h1>
  <p><input type="text" name="email" id="email" v-model="email" class="input" /></p>
  <p><input type="password" name="password" id="password" v-model="password" class="input" /></p>
  <p>
    <button @click="register" class="button">Register</button>
    <button @click="signInWithGoogle" class="button">Sign In With Google</button>
  </p>
</template>

<style lang="scss" scoped></style>
