import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import DarkModeToggle from '../components/DarkModeToggle.jsx'
import { loginAdmin, seedAdminAccount } from '../firebase/auth.js'
import { useAuth } from '../contexts/AuthContext.jsx'
import {
  Mail, Lock, Eye, EyeOff, ShieldCheck,
  ArrowLeft, AlertCircle, Loader2, Sparkles, Wrench
} from 'lucide-react'
import BackgroundDecor from '../components/BackgroundDecor.jsx'

const containerVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1, y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1], staggerChildren: 0.09 },
  },
}
const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
}

const inputBase =
  'w-full px-4 py-3.5 pl-11 rounded-2xl border transition-all duration-300 backdrop-blur-md text-sm outline-none ' +
  'bg-white/40 dark:bg-gray-900/40 border-gray-200/50 dark:border-white/10 ' +
  'text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 ' +
  'focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500/50 dark:focus:ring-purple-400/20 dark:focus:border-purple-400/50'

function InputWrapper({ icon: Icon, children }) {
  return (
    <div className="relative">
      <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 pointer-events-none z-10">
        <Icon className="w-4 h-4" />
      </div>
      {children}
    </div>
  )
}

export default function AdminLoginPage({ darkMode, setDarkMode }) {
  const navigate = useNavigate()
  const { isAdmin, isLoading: authLoading } = useAuth()
  const [formData, setFormData] = useState({ email: '', password: '' })
  const [showPassword, setShowPassword] = useState(false)
  const [status, setStatus] = useState('idle') // idle | loading | error
  const [errorMsg, setErrorMsg] = useState('')
  const [showFix, setShowFix] = useState(false)

  // "Force Create" Admin account requested by user
  useEffect(() => {
    const triggerSeed = async () => {
      try {
        await seedAdminAccount('hamdiseid58@gmail.com', 'admin123')
      } catch (e) {
        // Silent fail if it already exists or fails
        console.log("Seed check completed")
      }
    }
    triggerSeed()
  }, [])

  // Redirect if already logged in as admin
  useEffect(() => {
    if (!authLoading && isAdmin) {
      navigate('/dashboard', { replace: true })
    }
  }, [authLoading, isAdmin, navigate])

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setStatus('loading')
    setErrorMsg('')
    try {
      await loginAdmin(formData.email, formData.password)
      navigate('/dashboard', { replace: true })
    } catch (err) {
      const msg = friendlyError(err.code || err.message)
      setErrorMsg(msg)
      setStatus('error')
    }
  }

  const handleFixAdmin = async () => {
    setStatus('loading')
    try {
      await seedAdminAccount('hamdiseid58@gmail.com', 'admin123')
      setStatus('idle')
      alert("Account setup re-triggered. Please try logging in again with: hamdiseid58@gmail.com / admin123")
    } catch (err) {
      setErrorMsg("Fix failed. Error: " + err.message)
      setStatus('error')
    }
  }

  const isLoading = status === 'loading' || authLoading

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center px-4 py-16 transition-colors duration-500 relative overflow-hidden bg-white dark:bg-[#04060b]">
      <BackgroundDecor />

      {/* Intense Corner Highlights */}
      <div className="absolute top-4 right-4 w-32 h-32 bg-blue-400/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-4 left-4 w-32 h-32 bg-indigo-400/20 rounded-full blur-3xl pointer-events-none" />

      <DarkModeToggle darkMode={darkMode} setDarkMode={setDarkMode} />

      {/* Badge */}
      <motion.div
        initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
        className="mb-6 flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 dark:bg-purple-500/10 backdrop-blur-md border border-purple-500/20 text-purple-600 dark:text-purple-400 text-xs font-bold uppercase tracking-widest shadow-[0_0_15px_rgba(168,85,247,0.15)]"
      >
        <Lock className="w-3.5 h-3.5" />
        Admin Secure Access
      </motion.div>

      {/* Card */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="w-full max-w-md bg-white/40 dark:bg-gray-900/30 backdrop-blur-2xl rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.1)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.3)] border border-white/40 dark:border-white/10 overflow-hidden relative group"
      >
        {/* Soft edge highlight */}
        <div className="absolute inset-0 rounded-[2.5rem] border border-white/20 dark:border-white/5 pointer-events-none" />
        <div className="h-2 w-full bg-gradient-to-r from-purple-500 via-indigo-500 to-blue-500 opacity-80" />

        <div className="p-8 sm:p-10">
          {/* Back */}
          <motion.div variants={itemVariants} className="mb-6">
            <Link to="/" id="back-to-register"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors duration-200 group">
              <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
              Back to Registration
            </Link>
          </motion.div>

          {/* Title */}
          <motion.div variants={itemVariants} className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-br from-purple-600 to-indigo-700 shadow-xl shadow-purple-500/20 mb-6 mx-auto">
              <ShieldCheck className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-2">Admin Portal</h1>
            <p className="text-gray-500 dark:text-gray-400 text-sm">System management and control</p>
          </motion.div>

          {/* Error */}
          <AnimatePresence>
              <motion.div
                initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                animate={{ opacity: 1, height: 'auto', marginBottom: 20 }}
                exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                className="flex flex-col gap-2 p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-500/30 text-red-700 dark:text-red-400"
              >
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 mt-0.5 shrink-0" />
                  <p className="text-sm font-medium">{errorMsg}</p>
                </div>
                <button 
                  type="button" 
                  onClick={handleFixAdmin} 
                  className="mt-2 text-xs font-bold text-red-600 dark:text-red-400 hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <Wrench className="w-3 h-3" /> Still can't login? Click here to fix account
                </button>
              </motion.div>
          </AnimatePresence>

          <form onSubmit={handleSubmit} className="space-y-5">
            <motion.div variants={itemVariants}>
              <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1.5 uppercase tracking-wide">Admin Email</label>
              <InputWrapper icon={Mail}>
                <input id="admin-email" type="email" name="email" value={formData.email}
                  onChange={handleChange} placeholder="admin@obu.edu.et"
                  className={inputBase} required disabled={isLoading} autoComplete="email" />
              </InputWrapper>
            </motion.div>

            <motion.div variants={itemVariants}>
              <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1.5 uppercase tracking-wide">Password</label>
              <div className="relative">
                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 pointer-events-none z-10">
                  <Lock className="w-4 h-4" />
                </div>
                <input id="admin-password" type={showPassword ? 'text' : 'password'} name="password"
                  value={formData.password} onChange={handleChange} placeholder="Enter your password"
                  className={`${inputBase} pr-11`} required disabled={isLoading} autoComplete="current-password" />
                <button type="button" id="toggle-password" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors cursor-pointer p-0.5">
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </motion.div>

            <motion.div variants={itemVariants} className="pt-4">
              <motion.button
                id="admin-login-btn"
                type="submit"
                disabled={isLoading}
                className="w-full py-4 px-8 rounded-2xl font-bold text-sm text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 transition-all duration-300 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed relative overflow-hidden group/btn"
                whileHover={{ scale: isLoading ? 1 : 1.02, y: -2 }}
                whileTap={{ scale: isLoading ? 1 : 0.98, y: 0 }}
              >
                {/* Glow effect on hover */}
                <div className="absolute inset-0 bg-white/20 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300" />
                <div className="absolute -inset-1 bg-gradient-to-r from-indigo-400 to-purple-400 blur-xl opacity-0 group-hover/btn:opacity-30 transition-opacity duration-500" />
                
                <span className="flex items-center justify-center gap-3 relative z-10">
                  {isLoading ? (
                    <><Loader2 className="w-5 h-5 animate-spin" /> Verifying...</>
                  ) : (
                    <><ShieldCheck className="w-5 h-5" /> Admin Secure Login</>
                  )}
                </span>
              </motion.button>
            </motion.div>
          </form>

          <motion.div variants={itemVariants} className="mt-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex-1 h-px bg-gray-200 dark:bg-white/10" />
              <span className="text-xs text-gray-400 dark:text-gray-600 font-medium">Secure Area</span>
              <div className="flex-1 h-px bg-gray-200 dark:bg-white/10" />
            </div>
            <p className="text-center text-xs text-gray-400 dark:text-gray-600">
              🔒 Restricted to authorized OBU administrators only.
            </p>
          </motion.div>
        </div>

        <div className="px-10 pb-6 text-center border-t border-gray-100 dark:border-white/5 pt-4">
          <p className="text-xs text-gray-400 dark:text-gray-600">
            Not an admin?{' '}
            <Link to="/" className="font-semibold text-indigo-600 dark:text-indigo-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors hover:underline underline-offset-2">
              Register as Participant →
            </Link>
          </p>
        </div>
      </motion.div>

      <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}
        className="mt-8 text-white/50 text-xs">
        © 2025 OBU Hackathon Competition · All rights reserved.
      </motion.p>
    </div>
  )
}

function friendlyError(code) {
  const map = {
    'auth/user-not-found': 'No account found with that email address.',
    'auth/wrong-password': 'Incorrect password. Please try again.',
    'auth/invalid-email': 'Please enter a valid email address.',
    'auth/too-many-requests': 'Too many failed attempts. Please wait and try again.',
    'auth/invalid-credential': 'Invalid email or password. Please try again.',
    'auth/network-request-failed': 'Network error. Check your internet connection.',
  }
  return map[code] || 'Login failed. Please try again.'
}
