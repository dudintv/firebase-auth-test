<script setup lang="ts">
import {
  getAuth,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  getMultiFactorResolver,
  TotpMultiFactorGenerator,
} from "@firebase/auth";
import { ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

const email = ref("");
const password = ref("");
const totpCode = ref("");
const errorMessage = ref("");

const hasTotpInputShown = ref(false);
let mfaResolver: ReturnType<typeof getMultiFactorResolver>;

async function login() {
  const auth = getAuth();

  try {
    console.log("login", email.value, password.value);

    const userCredential = await signInWithEmailAndPassword(auth, email.value, password.value);
    console.log("userCredential =", userCredential);

    router.push("/feed");
  } catch (error: any) {
    if (error.code === "auth/multi-factor-auth-required") {
      // Initiate your second factor sign-in flow
      hasTotpInputShown.value = true;
      mfaResolver = getMultiFactorResolver(getAuth(), error);
      return;
    }
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

async function resolveMfa() {
  console.log("resolveMfa: mfaResolver.hints =", mfaResolver.hints);
  console.log("TotpMultiFactorGenerator =", TotpMultiFactorGenerator);
  console.log("TotpMultiFactorGenerator.FACTOR_ID =", TotpMultiFactorGenerator.FACTOR_ID);

  const uid = mfaResolver.hints.find((hint) => hint.factorId === TotpMultiFactorGenerator.FACTOR_ID)?.uid;
  if (!uid) {
    console.error("There is no TOTP MFA hint object");
    return;
  }

  const multiFactorAssertion = TotpMultiFactorGenerator.assertionForSignIn(uid, totpCode.value);
  try {
    const userCredential = await mfaResolver.resolveSignIn(multiFactorAssertion);
    // Successfully signed in!

    console.log("userCredential =", userCredential);

    router.push("/feed");
  } catch (error: any) {
    // Invalid or expired OTP.

    if (error.code === "auth/invalid-verification-code") {
      errorMessage.value = "Invalid TOTP code";
    }

    console.error("Invalid or expired OTP. Error:", error);
    alert(error);
  }
}
</script>

<template>
  <h1>LOGIN</h1>
  <p><input type="text" name="email" id="email" v-model="email" class="input" /></p>
  <p>
    <input type="password" name="password" id="password" v-model="password" class="input" @keypress.enter="login" />
  </p>
  <p v-if="hasTotpInputShown">
    <label for="totpCode"> TOTP code from Google Authenticator </label>
    <input type="text" name="totpCode" id="totpCode" v-model="totpCode" class="input" @keypress.enter="resolveMfa" />
  </p>
  <p v-if="errorMessage">{{ errorMessage }}</p>
  <p><button class="button" id="sign-in-button" @click="login">Login by email</button></p>
  <p><button class="button" @click="signInWithGoogle">Sign in with Google</button></p>
</template>

<style lang="scss" scoped></style>
