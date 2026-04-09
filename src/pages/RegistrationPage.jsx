import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import DarkModeToggle from '../components/DarkModeToggle.jsx'
import { registerStudent } from '../firebase/db.js'
import {
  User, Hash, BookOpen, GraduationCap, Mail,
  ChevronDown, Trophy, Sparkles, CheckCircle2, AlertCircle, Loader2,
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
  'focus:ring-2 focus:ring-indigo-500/25 focus:border-indigo-400/60 dark:focus:ring-indigo-400/20 dark:focus:border-indigo-500/40 ' +
  'focus:bg-white dark:focus:bg-white/10 ' +
  'backdrop-blur-sm'

const selectBase =
  'w-full px-4 py-3.5 pl-11 pr-10 rounded-xl border transition-all duration-200 text-sm outline-none appearance-none cursor-pointer ' +
  'bg-white/70 dark:bg-white/6 ' +
  'border-gray-200/70 dark:border-white/12 ' +
  'text-gray-900 dark:text-gray-100 ' +
  'focus:ring-2 focus:ring-indigo-500/25 focus:border-indigo-400/60 dark:focus:ring-indigo-400/20 dark:focus:border-indigo-500/40 ' +
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

const INITIAL = { studentName: '', studentId: '', department: '', year: '', email: '' }

export default function RegistrationPage({ darkMode, setDarkMode }) {
  const [formData, setFormData] = useState(INITIAL)
  const [status, setStatus] = useState('idle')
  const [errorMsg, setErrorMsg] = useState('')

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setStatus('loading')
    setErrorMsg('')
    try {
      await registerStudent({
        name: formData.studentName,
        studentId: formData.studentId,
        department: formData.department,
        year: formData.year,
        email: formData.email,
      })
      setStatus('success')
      setFormData(INITIAL)
      setTimeout(() => setStatus('idle'), 4500)
    } catch (err) {
      console.error(err)
      setErrorMsg('Registration failed. Please check your connection and try again.')
      setStatus('error')
    }
  }

  const isLoading = status === 'loading'

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center px-4 py-16 relative overflow-hidden bg-[#fdfdff] dark:bg-[#04060b] transition-colors duration-500 isolate">
      <BackgroundDecor type="auth" />
      <DarkModeToggle darkMode={darkMode} setDarkMode={setDarkMode} />

      {/* Badge */}
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-7 flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 dark:bg-indigo-500/10 backdrop-blur-md border border-indigo-200/60 dark:border-indigo-500/20 text-indigo-600 dark:text-indigo-400 text-xs font-bold uppercase tracking-widest shadow-sm"
      >
        <Sparkles className="w-3.5 h-3.5 text-amber-400" />
        OBU Hackathon 2026
        <Sparkles className="w-3.5 h-3.5 text-amber-400" />
      </motion.div>

      {/* Card */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="w-full max-w-md relative z-10"
      >
        {/* Card glow halo */}
        <div className="absolute -inset-1 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 rounded-3xl blur-xl pointer-events-none" />

        <div className="relative w-full bg-white/70 dark:bg-gray-900/50 backdrop-blur-2xl rounded-3xl shadow-2xl shadow-black/8 dark:shadow-black/40 border border-white/80 dark:border-white/8 overflow-hidden">
          {/* Top gradient bar */}
          <div className="h-[3px] w-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500" />
          {/* Top sheen */}
          <div className="absolute inset-x-0 top-[3px] h-16 bg-gradient-to-b from-white/30 dark:from-white/5 to-transparent pointer-events-none" />

          <div className="p-8 sm:p-10">
            {/* Title */}
            <motion.div variants={itemVariants} className="text-center mb-9">
              <div className="inline-flex items-center justify-center w-[72px] h-[72px] rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-xl shadow-blue-500/25 mb-5 mx-auto">
                <Trophy className="w-9 h-9 text-white" />
              </div>
              <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-1.5">
                Participant Registration
              </h1>
              <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">
                Empowering the next generation of innovators
              </p>
            </motion.div>

            {/* Banners */}
            <AnimatePresence mode="wait">
              {status === 'success' && (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                  animate={{ opacity: 1, height: 'auto', marginBottom: 20 }}
                  exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                  className="flex items-start gap-3 p-4 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-500/30 text-emerald-700 dark:text-emerald-400"
                >
                  <CheckCircle2 className="w-5 h-5 mt-0.5 shrink-0" />
                  <div>
                    <p className="font-semibold text-sm">Registration Successful! 🎉</p>
                    <p className="text-xs mt-0.5 opacity-75">You're now registered for OBU Hackathon 2026.</p>
                  </div>
                </motion.div>
              )}
              {status === 'error' && (
                <motion.div
                  key="error"
                  initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                  animate={{ opacity: 1, height: 'auto', marginBottom: 20 }}
                  exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                  className="flex items-start gap-3 p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-500/30 text-red-600 dark:text-red-400"
                >
                  <AlertCircle className="w-5 h-5 mt-0.5 shrink-0" />
                  <p className="text-sm">{errorMsg}</p>
                </motion.div>
              )}
            </AnimatePresence>

            <form onSubmit={handleSubmit} className="space-y-4">
              <motion.div variants={itemVariants}>
                <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1.5 uppercase tracking-wide">Student Name</label>
                <InputWrapper icon={User}>
                  <input id="student-name" type="text" name="studentName" value={formData.studentName}
                    onChange={handleChange} placeholder="Enter your full name"
                    className={inputBase} required disabled={isLoading} />
                </InputWrapper>
              </motion.div>

              <motion.div variants={itemVariants}>
                <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1.5 uppercase tracking-wide">Student ID</label>
                <InputWrapper icon={Hash}>
                  <input id="student-id" type="text" name="studentId" value={formData.studentId}
                    onChange={handleChange} placeholder="e.g. OBU/2021/CS/001"
                    className={inputBase} required disabled={isLoading} />
                </InputWrapper>
              </motion.div>

              <motion.div variants={itemVariants}>
                <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1.5 uppercase tracking-wide">Department</label>
                <InputWrapper icon={BookOpen}>
                  <select id="department" name="department" value={formData.department}
                    onChange={handleChange} className={selectBase} required disabled={isLoading}>
                    <option value="" disabled className="bg-gray-900 text-gray-400">Select your department</option>
                    <option value="Software Engineering" className="bg-gray-900 text-white">Software Engineering</option>
                    <option value="Computer Science" className="bg-gray-900 text-white">Computer Science</option>
                    <option value="Information Communication Technology" className="bg-gray-900 text-white">Information Communication Technology</option>
                  </select>
                  <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400 dark:text-gray-500">
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </InputWrapper>
              </motion.div>

              <motion.div variants={itemVariants}>
                <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1.5 uppercase tracking-wide">Year</label>
                <InputWrapper icon={GraduationCap}>
                  <select id="year" name="year" value={formData.year}
                    onChange={handleChange} className={selectBase} required disabled={isLoading}>
                    <option value="" disabled className="bg-gray-900 text-gray-400">Select your year</option>
                    <option value="1st Year" className="bg-gray-900 text-white">1st Year</option>
                    <option value="2nd Year" className="bg-gray-900 text-white">2nd Year</option>
                    <option value="3rd Year" className="bg-gray-900 text-white">3rd Year</option>
                    <option value="4th Year" className="bg-gray-900 text-white">4th Year</option>
                  </select>
                  <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400 dark:text-gray-500">
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </InputWrapper>
              </motion.div>

              <motion.div variants={itemVariants}>
                <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1.5 uppercase tracking-wide">Email Address</label>
                <InputWrapper icon={Mail}>
                  <input id="email" type="email" name="email" value={formData.email}
                    onChange={handleChange} placeholder="your@email.com"
                    className={inputBase} required disabled={isLoading} />
                </InputWrapper>
              </motion.div>

              <motion.div variants={itemVariants} className="pt-3">
                <motion.button
                  id="register-btn"
                  type="submit"
                  disabled={isLoading}
                  className="relative w-full py-3.5 px-8 rounded-xl font-bold text-sm text-white overflow-hidden cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                  style={{ background: 'linear-gradient(135deg, #3b82f6 0%, #6366f1 50%, #8b5cf6 100%)' }}
                  whileHover={{ scale: isLoading ? 1 : 1.015, y: isLoading ? 0 : -2 }}
                  whileTap={{ scale: isLoading ? 1 : 0.98 }}
                  transition={{ duration: 0.15 }}
                >
                  {/* Hover sheen */}
                  <motion.div
                    className="absolute inset-0 bg-white/20 opacity-0"
                    whileHover={{ opacity: 1 }}
                    transition={{ duration: 0.2 }}
                  />
                  {/* Glow */}
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-400 to-purple-400 blur-lg opacity-0 group-hover:opacity-40 transition-opacity duration-500 -z-10 rounded-xl" />
                  <span className="flex items-center justify-center gap-2.5 relative z-10">
                    {isLoading ? (
                      <><Loader2 className="w-4.5 h-4.5 animate-spin" /> Processing…</>
                    ) : (
                      <><Trophy className="w-4.5 h-4.5" /> Register Now</>
                    )}
                  </span>
                </motion.button>
              </motion.div>
            </form>
          </div>

          {/* Footer */}
          <div className="px-8 sm:px-10 pb-7 text-center border-t border-gray-100/80 dark:border-white/6 pt-5">
            <p className="text-xs text-gray-400 dark:text-gray-500">
              Are you an administrator?{' '}
              <Link to="/admin" id="admin-link"
                className="font-semibold text-indigo-600 dark:text-indigo-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors duration-200 underline-offset-2 hover:underline">
                Admin Portal →
              </Link>
            </p>
          </div>
        </div>
      </motion.div>

      <motion.p
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9, duration: 0.5 }}
        className="mt-8 text-gray-400 dark:text-gray-600 text-xs text-center"
      >
        © 2026 OBU Hackathon Competition. All rights reserved.
      </motion.p>
    </div>
  )
}
