// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";

import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCYDH2Xp_kwUgM1Ad8TNMNVt9RnC3lbyzQ",
  authDomain: "bustling-folio-327510.firebaseapp.com",
  projectId: "bustling-folio-327510",
  storageBucket: "bustling-folio-327510.appspot.com",
  messagingSenderId: "878857499403",
  appId: "1:878857499403:web:1e40588aa1af8a9c17e80e",
  measurementId: "G-KS1XVTGZ29",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { auth, provider };
