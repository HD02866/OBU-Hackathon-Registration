import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
  serverTimestamp,
  query,
  orderBy,
  onSnapshot,
} from 'firebase/firestore'
import { db } from './config'

/** Register a new student into /students collection */
export async function registerStudent({ name, studentId, department, year, email }) {
  const docRef = await addDoc(collection(db, 'students'), {
    name,
    studentId,
    department,
    year,
    email,
    registeredAt: serverTimestamp(),
  })
  return docRef.id
}

/** Fetch all students once (for non-realtime use) */
export async function getAllStudents() {
  const q = query(collection(db, 'students'), orderBy('registeredAt', 'desc'))
  const snapshot = await getDocs(q)
  return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }))
}

/**
 * Subscribe to students collection with real-time updates.
 * @param {function} callback - receives array of { id, ...data }
 * @returns unsubscribe function
 */
export function subscribeToStudents(callback) {
  const q = query(collection(db, 'students'), orderBy('registeredAt', 'desc'))
  return onSnapshot(q, (snapshot) => {
    const students = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }))
    callback(students)
  })
}

/** Update a student document by id */
export async function updateStudent(id, data) {
  const ref = doc(db, 'students', id)
  await updateDoc(ref, { ...data, updatedAt: serverTimestamp() })
}

/** Delete a student document by id */
export async function deleteStudent(id) {
  const ref = doc(db, 'students', id)
  await deleteDoc(ref)
}
