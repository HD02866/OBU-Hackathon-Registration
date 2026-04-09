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
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1, y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1], staggerChildren: 0.08 },
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
  'focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 dark:focus:ring-blue-400/20 dark:focus:border-blue-400/50'

const selectBase =
  'w-full px-4 py-3.5 pl-11 pr-10 rounded-2xl border transition-all duration-300 backdrop-blur-md text-sm outline-none appearance-none cursor-pointer ' +
  'bg-white/40 dark:bg-gray-900/40 border-gray-200/50 dark:border-white/10 ' +
  'text-gray-900 dark:text-gray-100 ' +
  'focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 dark:focus:ring-blue-400/20 dark:focus:border-blue-400/50'

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
  const [status, setStatus] = useState('idle') // idle | loading | success | error
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
      // Reset after 4s
      setTimeout(() => setStatus('idle'), 4000)
    } catch (err) {
      console.error(err)
      setErrorMsg('Registration failed. Please check your connection and try again.')
      setStatus('error')
    }
  }

  const isLoading = status === 'loading'

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center px-4 py-16 transition-colors duration-500 relative overflow-hidden bg-white dark:bg-[#04060b]">
      <BackgroundDecor />

      <DarkModeToggle darkMode={darkMode} setDarkMode={setDarkMode} />

      {/* Badge */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-6 flex items-center gap-2 px-4 py-2 rounded-full bg-white/15 dark:bg-white/10 backdrop-blur-sm border border-white/25 text-white text-xs font-semibold uppercase tracking-widest"
      >
        <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
        OBU Hackathon 2025
        <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
      </motion.div>

      {/* Card */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="w-full max-w-lg bg-white/40 dark:bg-gray-900/30 backdrop-blur-2xl rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.1)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.3)] border border-white/40 dark:border-white/10 overflow-hidden relative group"
      >
        {/* Soft edge highlight */}
        <div className="absolute inset-0 rounded-[2.5rem] border border-white/20 dark:border-white/5 pointer-events-none" />
        <div className="h-2 w-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 opacity-80" />

        <div className="p-8 sm:p-10">
          {/* Title */}
          <motion.div variants={itemVariants} className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-br from-blue-600 to-indigo-700 shadow-xl shadow-blue-500/20 mb-6 mx-auto">
              <Trophy className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-2">
              Participant Registration
            </h1>
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              Empowering the next generation of innovators
            </p>
          </motion.div>

          {/* Success Banner */}
          <AnimatePresence>
            {status === 'success' && (
              <motion.div
                initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                animate={{ opacity: 1, height: 'auto', marginBottom: 20 }}
                exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                className="flex items-start gap-3 p-4 rounded-xl bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-500/30 text-green-700 dark:text-green-400"
              >
                <CheckCircle2 className="w-5 h-5 mt-0.5 shrink-0" />
                <div>
                  <p className="font-semibold text-sm">Registration Successful! 🎉</p>
                  <p className="text-xs mt-0.5 opacity-80">You're now registered for the OBU Hackathon 2026.</p>
                </div>
              </motion.div>
            )}
            {status === 'error' && (
              <motion.div
                initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                animate={{ opacity: 1, height: 'auto', marginBottom: 20 }}
                exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                className="flex items-start gap-3 p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-500/30 text-red-700 dark:text-red-400"
              >
                <AlertCircle className="w-5 h-5 mt-0.5 shrink-0" />
                <p className="text-sm">{errorMsg}</p>
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Student Name */}
            <motion.div variants={itemVariants}>
              <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1.5 uppercase tracking-wide">Student Name</label>
              <InputWrapper icon={User}>
                <input id="student-name" type="text" name="studentName" value={formData.studentName}
                  onChange={handleChange} placeholder="Enter your full name"
                  className={inputBase} required disabled={isLoading} />
              </InputWrapper>
            </motion.div>

            {/* Student ID */}
            <motion.div variants={itemVariants}>
              <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1.5 uppercase tracking-wide">Student ID</label>
              <InputWrapper icon={Hash}>
                <input id="student-id" type="text" name="studentId" value={formData.studentId}
                  onChange={handleChange} placeholder="e.g. OBU/2021/CS/001"
                  className={inputBase} required disabled={isLoading} />
              </InputWrapper>
            </motion.div>

            {/* Department */}
            <motion.div variants={itemVariants}>
              <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1.5 uppercase tracking-wide">Department</label>
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

            {/* Year */}
            <motion.div variants={itemVariants}>
              <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1.5 uppercase tracking-wide">Year</label>
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

            {/* Email */}
            <motion.div variants={itemVariants}>
              <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1.5 uppercase tracking-wide">Email Address</label>
              <InputWrapper icon={Mail}>
                <input id="email" type="email" name="email" value={formData.email}
                  onChange={handleChange} placeholder="your@email.com"
                  className={inputBase} required disabled={isLoading} />
              </InputWrapper>
            </motion.div>

            <motion.div variants={itemVariants} className="pt-4">
              <motion.button
                id="register-btn"
                type="submit"
                disabled={isLoading}
                className="w-full py-4 px-8 rounded-2xl font-bold text-sm text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 transition-all duration-300 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed relative overflow-hidden group/btn"
                whileHover={{ scale: isLoading ? 1 : 1.02, y: -2 }}
                whileTap={{ scale: isLoading ? 1 : 0.98, y: 0 }}
              >
                {/* Glow effect on hover */}
                <div className="absolute inset-0 bg-white/20 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300" />
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-400 to-purple-400 blur-xl opacity-0 group-hover/btn:opacity-30 transition-opacity duration-500" />
                
                <span className="flex items-center justify-center gap-3 relative z-10">
                  {isLoading ? (
                    <><Loader2 className="w-5 h-5 animate-spin" /> Processing...</>
                  ) : (
                    <><Trophy className="w-5 h-5" /> Register Now</>
                  )}
                </span>
              </motion.button>
            </motion.div>
          </form>
        </div>

        {/* Footer */}
        <div className="px-8 sm:px-10 pb-6 text-center border-t border-gray-100 dark:border-white/5 pt-4">
          <p className="text-xs text-gray-400 dark:text-gray-600">
            Are you an administrator?{' '}
            <Link to="/admin" id="admin-link"
              className="font-semibold text-indigo-600 dark:text-indigo-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors duration-200 underline-offset-2 hover:underline">
              Admin Portal →
            </Link>
          </p>
        </div>
      </motion.div>

      <motion.p
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8, duration: 0.5 }}
        className="mt-8 text-white/50 text-xs text-center"
      >
        © 2026 OBU Hackathon Competition. All rights reserved.
      </motion.p>
    </div>
  )
}
