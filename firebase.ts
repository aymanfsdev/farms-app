// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyAgUHG1-PcS6UQRkpc4mlEoQwABfyC6WWE",
  authDomain: "farms-app-51041.firebaseapp.com",
  projectId: "farms-app-51041",
  storageBucket: "farms-app-51041.appspot.com",
  messagingSenderId: "1065216083973",
  appId: "1:1065216083973:web:f83e7537f8643bd6f9f46c",
  measurementId: "G-YLDFB4MY59",
};

// Initialize Firebase

const firebaseApp = initializeApp(firebaseConfig);

export { firebaseApp };
