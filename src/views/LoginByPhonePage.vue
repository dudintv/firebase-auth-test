<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import {
  getAuth,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  PhoneAuthProvider,
  signInWithCredential,
} from "firebase/auth";

const router = useRouter();

const phone = ref("");
const confirmationCode = ref("");
const isConfirmationShown = ref(false);

function loginByPhone() {
  const auth = getAuth();
  const appVerifier = (window as any).recaptchaVerifier;
  if (!appVerifier) return;

  signInWithPhoneNumber(auth, phone.value, appVerifier)
    .then((confirmationResult) => {
      // SMS sent. Prompt user to type the code from the message, then sign the
      // user in with confirmationResult.confirm(code).
      console.log("confirmationResult =", confirmationResult);
      (window as any).confirmationResult = confirmationResult;
      isConfirmationShown.value = true;
    })
    .catch((error) => {
      // Error; SMS not sent
      console.error("SMS not sent. Error:", error);
    });
}

onMounted(() => {
  const auth = getAuth();
  // (window as any).recaptchaVerifier = new RecaptchaVerifier(auth, "recaptcha-container", {});
  (window as any).recaptchaVerifier = new RecaptchaVerifier(auth, "sign-in-button", {
    size: "invisible",
    callback: (_response: any) => {
      // reCAPTCHA solved, allow signInWithPhoneNumber.
      loginByPhone();
    },
  });
});

async function confirm() {
  const auth = getAuth();
  try {
    var credential = PhoneAuthProvider.credential(
      (window as any).confirmationResult.verificationId,
      confirmationCode.value,
    );
    await signInWithCredential(auth, credential);
    router.push("/feed");
  } catch (error: any) {
    console.error(error);
  }
}
</script>

<template>
  <h1>Login by phone</h1>
  <p><input type="text" name="phone" id="phone" v-model="phone" class="input" /></p>
  <p><button class="button" id="sign-in-button" @click="loginByPhone">Login by phone</button></p>
  <div id="recaptcha-container"></div>

  <p v-if="isConfirmationShown">
    <input type="text" name="confirmation" id="confirmation" v-model="confirmationCode" class="input" />
    <button class="button" @click="confirm">Confirm</button>
  </p>
</template>

<style lang="scss" scoped></style>
