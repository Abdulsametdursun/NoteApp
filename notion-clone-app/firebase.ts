import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyAZx0BeXprzW40rHopNJOubk_IYQBbYz7Q',
  authDomain: 'notion-clone-f0686.firebaseapp.com',
  projectId: 'notion-clone-f0686',
  storageBucket: 'notion-clone-f0686.firebasestorage.app',
  messagingSenderId: '743035942605',
  appId: '1:743035942605:web:a170b92b0cd061702e5b84',
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);

export { db };
