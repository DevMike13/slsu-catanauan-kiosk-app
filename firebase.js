import { initializeApp } from 'firebase/app';
import {
    getAuth,
    initializeAuth,
    getReactNativePersistence,
  } from 'firebase/auth';
  import { getFirestore } from 'firebase/firestore';
  import { getDatabase } from 'firebase/database';
  import AsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
    apiKey: "AIzaSyA_pV3280TXjI0rZUT0yj81K0uLwFkk0hU",
    authDomain: "slsukiosk.firebaseapp.com",
    projectId: "slsukiosk",
    storageBucket: "slsukiosk.firebasestorage.app",
    messagingSenderId: "31307623938",
    appId: "1:31307623938:web:4410982ffaebad0c46411b"
};

const app = initializeApp(firebaseConfig);
const auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage),
});
  
const firestoreDB = getFirestore(app);

const realtimeDB = getDatabase(app);

export { auth, firestoreDB, realtimeDB };
