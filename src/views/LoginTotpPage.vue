<script setup lang="ts">
// import { getAuth, multiFactor, TotpMultiFactorGenerator, TotpSecret } from "@firebase/auth";
import { ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

const email = ref("");
const errorMessage = ref("");

async function login() {
  // const auth = getAuth();

  try {
    console.log("login", email.value);

    router.push("/feed");
  } catch (error: any) {
    console.error(error);
    alert(error);
  }
}
</script>

<template>
  <h1>TOTP login</h1>
  <p>
    <label for="email"> Email </label>
    <input type="text" name="email" id="email" v-model="email" class="input" />
  </p>
  <p v-if="errorMessage">{{ errorMessage }}</p>
  <p><button class="button" id="sign-in-button" @click="login">Login by TOTP code</button></p>
</template>

<style lang="scss" scoped></style>
