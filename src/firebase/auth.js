import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updatePassword,
  signOut,
  onAuthStateChanged,
} from 'firebase/auth'
import { doc, getDoc, setDoc } from 'firebase/firestore'
import { auth, db } from './config'

// ─── Default admin credentials ───────────────────────────────────────────────
const ADMIN_EMAIL    = 'hamdiseid58@gmail.com'
const ADMIN_PASSWORD = 'admin123'
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Ensures the admin account exists in Firebase Auth + Firestore.
 * Tries creating first; if it already exists, logs in to confirm.
 * Called automatically before every login attempt for ADMIN_EMAIL.
 */
async function ensureAdminExists() {
  // 1. Try to create the account fresh
  try {
    const cred = await createUserWithEmailAndPassword(auth, ADMIN_EMAIL, ADMIN_PASSWORD)
    await setDoc(doc(db, 'users', cred.user.uid), {
      email: ADMIN_EMAIL,
      role: 'admin',
      createdAt: new Date().toISOString(),
    })
    console.log('[Auth] Admin account created successfully.')
    return { created: true, user: cred.user }
  } catch (createErr) {
    if (createErr.code !== 'auth/email-already-in-use') throw createErr
  }

  // 2. Account already exists — try known passwords to confirm & refresh role
  const candidates = [ADMIN_PASSWORD, 'admin 123', 'Admin123', 'admin123!', 'password']
  for (const pwd of candidates) {
    try {
      const cred = await signInWithEmailAndPassword(auth, ADMIN_EMAIL, pwd)
      // If we got in with a non-canonical password, upgrade it
      if (pwd !== ADMIN_PASSWORD) {
        await updatePassword(cred.user, ADMIN_PASSWORD)
        console.log('[Auth] Password upgraded to canonical.')
      }
      // Guarantee role in Firestore
      await setDoc(doc(db, 'users', cred.user.uid), { email: ADMIN_EMAIL, role: 'admin' }, { merge: true })
      console.log('[Auth] Admin account verified.')
      return { created: false, user: cred.user }
    } catch {
      // try next candidate
    }
  }

  throw new Error('Account exists but no known password works. Delete the user in Firebase Console → Authentication, then click "Fix Account" again.')
}

/**
 * Sign in with email + password, then verify admin role in Firestore.
 * For the designated admin email, auto-ensures the account exists first.
 */
export async function loginAdmin(email, password) {
  // We no longer call ensureAdminExists() automatically here.
  // This makes it a "pure" Firebase login.
  // If the admin account doesn't exist or password is wrong, Firebase will throw an error.
  // The user can then click the "Fix" button on the UI which calls seedAdminAccount().
  const credential = await signInWithEmailAndPassword(auth, email, password)
  const user = credential.user

  // Ensure Firestore role for designated admin (in case it was missing)
  if (email === ADMIN_EMAIL) {
    await setDoc(doc(db, 'users', user.uid), { email, role: 'admin' }, { merge: true })
    return { user, role: 'admin' }
  }

  // For any other email, check role in Firestore
  const userDoc = await getDoc(doc(db, 'users', user.uid))
  if (!userDoc.exists()) {
    await signOut(auth)
    throw new Error('Your account has no role assigned. Contact the administrator.')
  }
  const role = userDoc.data().role
  if (role !== 'admin') {
    await signOut(auth)
    throw new Error('Access denied. You do not have admin privileges.')
  }
  return { user, role }
}

/** Sign out the current user */
export async function logoutAdmin() {
  await signOut(auth)
}

/**
 * Subscribe to auth state changes.
 * Callback receives { user, role } or null.
 * Returns the unsubscribe function.
 */
export function onAuthChange(callback) {
  return onAuthStateChanged(auth, async (firebaseUser) => {
    if (!firebaseUser) {
      callback(null)
      return
    }
    try {
      // Designated admin always gets role 'admin'
      if (firebaseUser.email === ADMIN_EMAIL) {
        callback({ user: firebaseUser, role: 'admin' })
        return
      }
      const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid))
      const role = userDoc.exists() ? userDoc.data().role : null
      callback({ user: firebaseUser, role })
    } catch {
      callback({ user: firebaseUser, role: null })
    }
  })
}

/**
 * Public helper: re-seed / fix the admin account on demand.
 * Exposed for the "Fix Account" button on the login page.
 */
export async function seedAdminAccount(email = ADMIN_EMAIL, password = ADMIN_PASSWORD) {
  return ensureAdminExists()
}
