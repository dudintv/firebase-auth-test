<script setup lang="ts">
import {
  getAuth,
  signInWithEmailAndPassword,
  RecaptchaVerifier,
  signInWithPopup,
  GoogleAuthProvider,
} from "@firebase/auth";
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

const email = ref("");
const password = ref("");
const errorMessage = ref("");

async function login() {
  const auth = getAuth();

  try {
    console.log("login", email.value, password.value);

    const loginData = await signInWithEmailAndPassword(auth, email.value, password.value);
    console.log("loginData =", loginData);

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
  <h1>LOGIN</h1>
  <p><input type="text" name="email" id="email" v-model="email" class="input" /></p>
  <p><input type="password" name="password" id="password" v-model="password" class="input" /></p>
  <p v-if="errorMessage">{{ errorMessage }}</p>
  <p><button class="button" id="sign-in-button" @click="login">Login by email</button></p>
  <p><button class="button" @click="signInWithGoogle">Sign in with Google</button></p>
</template>

<style lang="scss" scoped></style>
