<script setup lang="ts">
import { ref, onMounted } from "vue";
import { getAuth, multiFactor, TotpMultiFactorGenerator, sendEmailVerification } from "@firebase/auth"; //TotpSecret
// import { useRouter } from "vue-router";
import QRCode from "qrcode";

// const router = useRouter();

const totpSecret = ref();
const totpSecretKey = ref("");
const totpUri = ref("");
const totpVerificationCode = ref("");
const errorMessage = ref("");
const qrCodeCanvas = ref();

onMounted(async () => {
  await generateCodeAndUri();
  generateQrCode();
});

async function generateCodeAndUri() {
  const auth = await getAuth();
  const currentUser = auth.currentUser;
  if (!currentUser) {
    alert("Not logged in");
    return;
  }

  try {
    // Generate a TOTP secret.
    const multiFactorSession = await multiFactor(currentUser).getSession();
    totpSecret.value = await TotpMultiFactorGenerator.generateSecret(multiFactorSession);
    totpSecretKey.value = totpSecret.value.secretKey;
    totpUri.value = totpSecret.value.generateQrCodeUrl(currentUser.email!, "test");

    // router.push("/feed");
  } catch (error: any) {
    if (error.code === "auth/unverified-email") {
      sendEmailVerification(auth.currentUser);
      errorMessage.value = "Please verify email first. The mail was sent to your email";
      return;
    }

    console.error(error);
    alert(error);
  }
}

function generateQrCode() {
  const canvas = qrCodeCanvas.value;
  QRCode.toCanvas(canvas, totpUri.value, (error: any) => {
    if (error) {
      console.error("QRCode error:", error);
      return;
    }

    console.log("QRCode success!");
  });
}

async function verifyTotp() {
  const auth = getAuth();

  // Finalize the enrollment.
  try {
    const multiFactorAssertion = TotpMultiFactorGenerator.assertionForEnrollment(
      totpSecret.value,
      totpVerificationCode.value,
    );
    await multiFactor(auth.currentUser!).enroll(multiFactorAssertion, "Test app (MFA display name)");

    console.log("Successfully enrolled TOTP!");
  } catch (error: any) {
    if (error.code === "auth/invalid-verification-code") {
      errorMessage.value = "Invalid TOTP code";
    }
    console.error(error);
  }
}
</script>

<template>
  <h1>TOTP register</h1>
  <canvas ref="qrCodeCanvas"></canvas>
  <p v-if="errorMessage">{{ errorMessage }}</p>
  <p>
    <label for="totpSecretKey"> TOTP secret key </label>
    <input type="text" name="totpSecretKey" id="totpSecretKey" v-model="totpSecretKey" class="input" readonly />
  </p>
  <p>
    <label for="totpUri"> TOTP QRcode URI </label>
    <input type="text" name="totpUri" id="totpUri" v-model="totpUri" class="input" readonly />
  </p>
  <br />
  <p>
    <label for="totpVerificationCode"> Insert generated TOTP code </label>
    <input
      type="text"
      name="totpVerificationCode"
      id="totpVerificationCode"
      v-model="totpVerificationCode"
      class="input"
    />
  </p>
  <p><button class="button" id="sign-in-button" @click="verifyTotp">Verify TOTP</button></p>
</template>

<style lang="scss" scoped></style>
