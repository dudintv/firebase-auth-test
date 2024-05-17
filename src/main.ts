import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";
import router from "./router";

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDqtl68Ib8NIJWm2B-g25TKu-T-2jAnK8Y",
  authDomain: "test-aeba3.firebaseapp.com",
  projectId: "test-aeba3",
  storageBucket: "test-aeba3.appspot.com",
  messagingSenderId: "796385790552",
  appId: "1:796385790552:web:21868c641224234126182d",
  measurementId: "G-FH6L93R76T",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
console.log("auth =", auth);

createApp(App).use(router).mount("#app");
