import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAd7OpMZkveGX3HgCL9jCd61Gi1-AfYRaw",
  authDomain: "hostalmanagmentsystem.firebaseapp.com",
  databaseURL:
    "https://hostalmanagmentsystem-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "hostalmanagmentsystem",
  storageBucket: "hostalmanagmentsystem.appspot.com",
  messagingSenderId: "928976329492",
  appId: "1:928976329492:web:6f18cd37a7cbb349f38001",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore and Auth
const db = getFirestore(app);
export const auth = getAuth(app);

export default db; // Export Firestore instance as default
