import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

export const firebaseConfig = {
  apiKey: 'AIzaSyCPXzTohAyT9gYvKNNoel60EaOo8rR_OMs',
  authDomain: 'moncenip-toh2025-1.firebaseapp.com',
  projectId: 'moncenip-toh2025-1',
  storageBucket: 'moncenip-toh2025-1.firebasestorage.app',
  messagingSenderId: '755483682116',
  appId: '1:755483682116:web:00d155b232aba5f678a311'
};

export const firebaseApp = initializeApp(firebaseConfig);

export const db = getFirestore(firebaseApp);
export const auth = getAuth(firebaseApp);