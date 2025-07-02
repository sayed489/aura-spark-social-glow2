import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBXfrsmmy1k7KocwyXfHzmPVMUkW4QDCTw",
  authDomain: "aura-ai-142d1.firebaseapp.com",
  projectId: "aura-ai-142d1",
  storageBucket: "aura-ai-142d1.firebasestorage.app",
  messagingSenderId: "493117857734",
  appId: "1:493117857734:web:433691ba6a4180a15e9cc7",
  measurementId: "G-N97ZRGEX2G"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services for production
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;