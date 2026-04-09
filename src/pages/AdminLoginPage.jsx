import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import DarkModeToggle from '../components/DarkModeToggle.jsx'
import { loginAdmin, seedAdminAccount } from '../firebase/auth.js'
import { useAuth } from '../contexts/AuthContext.jsx'
import {
  Mail, Lock, Eye, EyeOff, ShieldCheck,
  ArrowLeft, AlertCircle, Loader2, Wrench,
} from 'lucide-react'
import BackgroundDecor from '../components/BackgroundDecor.jsx'

const containerVariants = {
  hidden: { opacity: 0, y: 32 },
  visible: {
    opacity: 1, y: 0,
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1], staggerChildren: 0.07 },
  },
}
const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } },
}

const inputBase =
  'w-full px-4 py-3.5 pl-11 rounded-xl border transition-all duration-200 text-sm outline-none ' +
  'bg-white/70 dark:bg-white/6 ' +
  'border-gray-200/70 dark:border-white/12 ' +
  'text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-600 ' +
  'focus:ring-2 focus:ring-purple-500/25 focus:border-purple-400/60 dark:focus:ring-purple-400/20 dark:focus:border-purple-500/40 ' +
  'focus:bg-white dark:focus:bg-white/10 ' +
  'backdrop-blur-sm'

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
  const [status, setStatus] = useState('idle') // idle | loading | error | fixed
  const [errorMsg, setErrorMsg] = useState('')

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
    setErrorMsg('')
    try {
      await seedAdminAccount('hamdiseid58@gmail.com', 'admin123')
      setStatus('fixed')
    } catch (err) {
      setErrorMsg('Fix failed: ' + err.message)
      setStatus('error')
    }
  }

  const isLoading = status === 'loading' || authLoading
  const isFixed = status === 'fixed'

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center px-4 py-16 relative overflow-hidden bg-[#fdfdff] dark:bg-[#04060b] transition-colors duration-500">
      <BackgroundDecor />
      <DarkModeToggle darkMode={darkMode} setDarkMode={setDarkMode} />

      {/* Admin Panel badge */}
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-7 flex items-center gap-2 px-4 py-2 rounded-full bg-purple-50 dark:bg-purple-500/10 backdrop-blur-md border border-purple-200/60 dark:border-purple-500/20 text-purple-700 dark:text-purple-400 text-xs font-bold uppercase tracking-widest shadow-sm"
      >
        <Lock className="w-3.5 h-3.5" />
        Admin Secure Access
      </motion.div>

      {/* Card */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="w-full max-w-md relative"
      >
        {/* Card glow halo */}
        <div className="absolute -inset-1 bg-gradient-to-br from-purple-500/10 to-indigo-500/10 rounded-3xl blur-xl pointer-events-none" />

        <div className="relative w-full bg-white/70 dark:bg-gray-900/50 backdrop-blur-2xl rounded-3xl shadow-2xl shadow-black/8 dark:shadow-black/40 border border-white/80 dark:border-white/8 overflow-hidden">
          {/* Top gradient bar */}
          <div className="h-[3px] w-full bg-gradient-to-r from-purple-500 via-indigo-500 to-blue-500" />
          {/* Top sheen */}
          <div className="absolute inset-x-0 top-[3px] h-16 bg-gradient-to-b from-white/30 dark:from-white/5 to-transparent pointer-events-none" />

          <div className="p-8 sm:p-10">
            {/* Back link */}
            <motion.div variants={itemVariants} className="mb-7">
              <Link to="/" id="back-to-register"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-400 dark:text-gray-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors duration-200 group">
                <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform duration-200" />
                Back to Registration
              </Link>
            </motion.div>

            {/* Title */}
            <motion.div variants={itemVariants} className="text-center mb-9">
              <div className="inline-flex items-center justify-center w-[72px] h-[72px] rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-600 shadow-xl shadow-purple-500/25 mb-5 mx-auto">
                <ShieldCheck className="w-9 h-9 text-white" />
              </div>
              <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-1.5">
                Admin Portal
              </h1>
              <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">
                System management and control
              </p>
            </motion.div>

            {/* Status banners */}
            <AnimatePresence mode="wait">
              {status === 'error' && (
                <motion.div
                  key="error-banner"
                  initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                  animate={{ opacity: 1, height: 'auto', marginBottom: 20 }}
                  exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                  className="flex flex-col gap-2 p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-500/30 text-red-600 dark:text-red-400"
                >
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 mt-0.5 shrink-0" />
                    <p className="text-sm font-medium">{errorMsg || 'Invalid email or password.'}</p>
                  </div>
                  <button
                    type="button"
                    onClick={handleFixAdmin}
                    disabled={isLoading}
                    className="mt-1 text-xs font-bold text-red-600 dark:text-red-400 hover:underline flex items-center gap-1 cursor-pointer disabled:opacity-50"
                  >
                    <Wrench className="w-3 h-3" />
                    {isLoading ? 'Fixing account…' : 'Still can\'t login? Click here to auto-fix account'}
                  </button>
                </motion.div>
              )}
              {isFixed && (
                <motion.div
                  key="fixed-banner"
                  initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                  animate={{ opacity: 1, height: 'auto', marginBottom: 20 }}
                  exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                  className="flex items-start gap-3 p-4 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-500/30 text-emerald-700 dark:text-emerald-400"
                >
                  <ShieldCheck className="w-5 h-5 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-sm font-semibold">Account fixed! ✅</p>
                    <p className="text-xs mt-0.5 opacity-80">Now login with <span className="font-mono font-bold">hamdiseid58@gmail.com</span> / <span className="font-mono font-bold">admin123</span></p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <form onSubmit={handleSubmit} className="space-y-4">
              <motion.div variants={itemVariants}>
                <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1.5 uppercase tracking-wide">Admin Email</label>
                <InputWrapper icon={Mail}>
                  <input id="admin-email" type="email" name="email" value={formData.email}
                    onChange={handleChange} placeholder="admin@obu.edu.et"
                    className={inputBase} required disabled={isLoading} autoComplete="email" />
                </InputWrapper>
              </motion.div>

              <motion.div variants={itemVariants}>
                <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1.5 uppercase tracking-wide">Password</label>
                <div className="relative">
                  <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 pointer-events-none z-10">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input id="admin-password" type={showPassword ? 'text' : 'password'} name="password"
                    value={formData.password} onChange={handleChange} placeholder="Enter your password"
                    className={`${inputBase} pr-11`} required disabled={isLoading} autoComplete="current-password" />
                  <button type="button" id="toggle-password" onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors cursor-pointer p-0.5 z-10">
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </motion.div>

              <motion.div variants={itemVariants} className="pt-3">
                <motion.button
                  id="admin-login-btn"
                  type="submit"
                  disabled={isLoading}
                  className="relative w-full py-3.5 px-8 rounded-xl font-bold text-sm text-white overflow-hidden cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                  style={{ background: 'linear-gradient(135deg, #8b5cf6 0%, #6366f1 50%, #4f46e5 100%)' }}
                  whileHover={{ scale: isLoading ? 1 : 1.015, y: isLoading ? 0 : -2 }}
                  whileTap={{ scale: isLoading ? 1 : 0.98 }}
                  transition={{ duration: 0.15 }}
                >
                  <motion.div
                    className="absolute inset-0 bg-white/20 opacity-0"
                    whileHover={{ opacity: 1 }}
                    transition={{ duration: 0.2 }}
                  />
                  <span className="flex items-center justify-center gap-2.5 relative z-10">
                    {isLoading ? (
                      <><Loader2 className="w-4.5 h-4.5 animate-spin" /> Verifying…</>
                    ) : (
                      <><ShieldCheck className="w-4.5 h-4.5" /> Admin Secure Login</>
                    )}
                  </span>
                </motion.button>
              </motion.div>
            </form>

            {/* Divider */}
            <motion.div variants={itemVariants} className="mt-7">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex-1 h-px bg-gray-200/80 dark:bg-white/8" />
                <span className="text-xs text-gray-400 dark:text-gray-600 font-medium">Secure Area</span>
                <div className="flex-1 h-px bg-gray-200/80 dark:bg-white/8" />
              </div>
              <p className="text-center text-xs text-gray-400 dark:text-gray-600">
                🔒 Restricted to authorized OBU administrators only.
              </p>
            </motion.div>
          </div>

          {/* Footer */}
          <div className="px-8 sm:px-10 pb-7 text-center border-t border-gray-100/80 dark:border-white/6 pt-5">
            <p className="text-xs text-gray-400 dark:text-gray-500">
              Not an admin?{' '}
              <Link to="/" className="font-semibold text-indigo-600 dark:text-indigo-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors hover:underline underline-offset-2">
                Register as Participant →
              </Link>
            </p>
          </div>
        </div>
      </motion.div>

      <motion.p
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }}
        className="mt-8 text-gray-400 dark:text-gray-600 text-xs"
      >
        © 2026 OBU Hackathon Competition · All rights reserved.
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
