// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";

import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';



// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyC0L-jrqgk83Ngicke8l8qpWvdI3Wig23Y",
    authDomain: "wish2work-a0168.firebaseapp.com",
    projectId: "wish2work-a0168",
    storageBucket: "wish2work-a0168.firebasestorage.app",
    messagingSenderId: "950142462740",
    appId: "1:950142462740:web:fea1db8bf2838bb395b001",
    measurementId: "G-D2WK7FEL5J"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);