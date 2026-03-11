// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getAuth} from 'firebase/auth';
import {getFirestore} from 'firebase/firestore'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDsAIEVV-24AJ44D1OojJ42mNJYFQXWkfg",
  authDomain: "njinga-angola.firebaseapp.com",
  projectId: "njinga-angola",
  storageBucket: "njinga-angola.firebasestorage.app",
  messagingSenderId: "248477237286",
  appId: "1:248477237286:web:7533b53df05af0dd5f66e7",
  measurementId: "G-RP42QZJJ6R"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const secondary = initializeApp(firebaseConfig, 'secundary');
export const authsecond = getAuth(secondary);
export const auth = getAuth(app);
export const db = getFirestore(app)