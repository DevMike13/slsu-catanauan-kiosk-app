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
    apiKey: "AIzaSyAluQ7BR2k96xMpNK0NtfPWZb-YljU8LLg",
    authDomain: "iflutter-e9337.firebaseapp.com",
    databaseURL: "https://iflutter-e9337-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "iflutter-e9337",
    storageBucket: "iflutter-e9337.firebasestorage.app",
    messagingSenderId: "1023101324566",
    appId: "1:1023101324566:web:987f61290b28793549d437"
};

const app = initializeApp(firebaseConfig);
const auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage),
});
  
const firestoreDB = getFirestore(app);

const realtimeDB = getDatabase(app);

export { auth, firestoreDB, realtimeDB };
