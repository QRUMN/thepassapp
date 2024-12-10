import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyDEmo_demo_key_replace_this",
  authDomain: "thepassapp-demo.firebaseapp.com",
  projectId: "thepassapp-demo",
  storageBucket: "thepassapp-demo.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:demo_app_id",
  measurementId: "G-DEMO123456"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// Demo user credentials
export const DEMO_USERS = {
  educator: {
    email: 'demo.teacher@thepassapp.com',
    password: 'demoPass123',
    name: 'John Smith',
    type: 'educator',
    credentials: ['Delaware Teaching License', 'Master of Education'],
    subjects: ['Mathematics', 'Science'],
    grades: ['9-12'],
    availability: 'Full-time'
  },
  institution: {
    email: 'demo.school@thepassapp.com',
    password: 'demoPass123',
    name: 'Delaware High School',
    type: 'institution',
    location: 'Wilmington, DE',
    district: 'Delaware Public Schools'
  }
};
