import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyCp2e7CNo83HwDx_HAVgY_IDh0_KW2Y0HI",
  authDomain: "y-spot-e84ca.firebaseapp.com",
  databaseURL: "https://y-spot-e84ca-default-rtdb.firebaseio.com",
  projectId: "y-spot-e84ca",
  storageBucket: "y-spot-e84ca.appspot.com",
  messagingSenderId: "783996806068",
  appId: "1:783996806068:web:298ca1ddb4dfb7e758c8e1",
  measurementId: "G-TSH2JVYJHR"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

