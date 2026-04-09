import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updatePassword,
  signOut,
  onAuthStateChanged,
} from 'firebase/auth'
import { doc, getDoc, setDoc } from 'firebase/firestore'
import { auth, db } from './config'

/**
 * Sign in with email + password, then verify admin role in Firestore.
 * Returns { user, role } on success.
 * Throws an Error with a user-friendly message on failure.
 */
export async function loginAdmin(email, password) {
  // --- EMERGENCY BYPASS FOR USER ---
  // If the user uses these exact credentials, we ensure they get in as admin
  // This bypasses potential Firebase seeding delays or password mismatches during setup.
  if (email === 'hamdiseid58@gmail.com' && password === 'admin123') {
    try {
      const credential = await signInWithEmailAndPassword(auth, email, password)
      const user = credential.user
      // Try to ensure the role exists in Firestore just in case
      await setDoc(doc(db, 'users', user.uid), { email, role: 'admin' }, { merge: true })
      return { user, role: 'admin' }
    } catch (err) {
      // If the user doesn't exist yet, we'll let the standard error throw or 
      // we could even auto-create here. To keep it simple, if it exists but password 
      // is wrong, we'll try to re-seed or just throw a more helpful message.
      console.error("Standard login failed, check credentials or seed status", err)
    }
  }

  const credential = await signInWithEmailAndPassword(auth, email, password)
  const user = credential.user

  // Check role in /users/{uid}
  const userDoc = await getDoc(doc(db, 'users', user.uid))
  if (!userDoc.exists()) {
    // If it's our target user, auto-assign the role now
    if (email === 'hamdiseid58@gmail.com') {
      await setDoc(doc(db, 'users', user.uid), { email, role: 'admin' })
      return { user, role: 'admin' }
    }
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
 * Subscribe to auth state. Callback receives { user, role } or null.
 * Returns unsubscribe function.
 */
export function onAuthChange(callback) {
  return onAuthStateChanged(auth, async (firebaseUser) => {
    if (!firebaseUser) {
      callback(null)
      return
    }
    try {
      const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid))
      const role = userDoc.exists() ? userDoc.data().role : null
      callback({ user: firebaseUser, role })
    } catch {
      callback({ user: firebaseUser, role: null })
    }
  })
}

/**
 * Programmatically creates an admin account and sets its role.
 * This is used for initial setup/seeding.
 */
export async function seedAdminAccount(email, password) {
  try {
    // Attempt sign in to see if exists
    const cred = await createUserWithEmailAndPassword(auth, email, password)
    const user = cred.user
    
    // Set role to admin in Firestore
    await setDoc(doc(db, 'users', user.uid), {
      email: user.email,
      role: 'admin',
      createdAt: new Date().toISOString()
    })
    
    console.log("Admin seeded successfully")
    return { success: true, message: "Admin account created and role assigned." }
  } catch (err) {
    if (err.code === 'auth/email-already-in-use') {
      console.log("User exists, attempting password upgrade/check...");
      try {
        // Attempt login with the NEW password first
        const cred = await signInWithEmailAndPassword(auth, email, password);
        // If successful, just ensure role is set
        await setDoc(doc(db, 'users', cred.user.uid), { email, role: 'admin' }, { merge: true });
        return { success: true, message: "Account verified and role assigned." };
      } catch (loginErr) {
        // If login failed, try the OLD password ('admin 123' with space)
        try {
          const oldPass = 'admin 123';
          const cred = await signInWithEmailAndPassword(auth, email, oldPass);
          console.log("Old password detected. Upgrading to new password...");
          await updatePassword(cred.user, password);
          await setDoc(doc(db, 'users', cred.user.uid), { email, role: 'admin' }, { merge: true });
          return { success: true, message: "Password upgraded and role assigned." };
        } catch (oldPassErr) {
          throw new Error("Account exists but password setup failed. Please delete user in Firebase Console and click 'Fix' again.");
        }
      }
    }
    throw err
  }
}
