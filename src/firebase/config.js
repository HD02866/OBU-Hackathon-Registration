import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: "AIzaSyDcEKbIuJMbeA8DOBcHvUPnQdVVWawGm2g",
  authDomain: "obu-hackathon-competition.firebaseapp.com",
  projectId: "obu-hackathon-competition",
  storageBucket: "obu-hackathon-competition.firebasestorage.app",
  messagingSenderId: "824747579321",
  appId: "1:824747579321:web:8ae042698f9d5068154868",
}

const app = initializeApp(firebaseConfig)

export const auth = getAuth(app)
export const db = getFirestore(app)
export default app
