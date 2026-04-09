import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import { updateStudent } from '../../firebase/db.js'
import {
  X, User, Hash, BookOpen, GraduationCap, Mail, Save, Loader2,
} from 'lucide-react'

const DEPARTMENTS = [
  'Software Engineering',
  'Computer Science',
  'Information Communication Technology',
]
const YEARS = ['1st Year', '2nd Year', '3rd Year', '4th Year']

const inputBase =
  'w-full px-3 py-2.5 rounded-xl border bg-gray-50 dark:bg-gray-700/60 border-gray-200 dark:border-gray-600 text-gray-800 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-transparent transition-all duration-200 text-sm'

export default function EditModal({ student, onClose }) {
  const [form, setForm] = useState({
    name: student.name || '',
    studentId: student.studentId || '',
    department: student.department || '',
    year: student.year || '',
    email: student.email || '',
  })
  const [status, setStatus] = useState('idle')
  const [error, setError] = useState('')

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSave = async (e) => {
    e.preventDefault()
    setStatus('loading')
    setError('')
    try {
      await updateStudent(student.id, form)
      onClose()
    } catch (err) {
      setError('Failed to update. Please try again.')
      setStatus('error')
    }
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
        onClick={(e) => e.target === e.currentTarget && onClose()}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
          className="w-full max-w-md bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-white/10 overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 dark:border-white/5">
            <div>
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">Edit Student</h2>
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">Update registration details</p>
            </div>
            <button onClick={onClose}
              className="p-2 rounded-xl text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-white/5 transition-all cursor-pointer">
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSave} className="p-6 space-y-4">
            {error && (
              <p className="text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-500/30 rounded-xl px-4 py-3">
                {error}
              </p>
            )}

            {[
              { label: 'Name', name: 'name', icon: User, type: 'text', placeholder: 'Full name' },
              { label: 'Student ID', name: 'studentId', icon: Hash, type: 'text', placeholder: 'OBU/2021/CS/001' },
              { label: 'Email', name: 'email', icon: Mail, type: 'email', placeholder: 'student@email.com' },
            ].map(({ label, name, icon: Icon, type, placeholder }) => (
              <div key={name}>
                <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1.5 uppercase tracking-wide">{label}</label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 pointer-events-none">
                    <Icon className="w-4 h-4" />
                  </div>
                  <input type={type} name={name} value={form[name]} onChange={handleChange}
                    placeholder={placeholder} className={`${inputBase} pl-10`} required />
                </div>
              </div>
            ))}

            {/* Department */}
            <div>
              <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1.5 uppercase tracking-wide">Department</label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 pointer-events-none">
                  <BookOpen className="w-4 h-4" />
                </div>
                <select name="department" value={form.department} onChange={handleChange}
                  className={`${inputBase} pl-10 appearance-none`} required>
                  <option value="" disabled>Select department</option>
                  {DEPARTMENTS.map((d) => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>
            </div>

            {/* Year */}
            <div>
              <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1.5 uppercase tracking-wide">Year</label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 pointer-events-none">
                  <GraduationCap className="w-4 h-4" />
                </div>
                <select name="year" value={form.year} onChange={handleChange}
                  className={`${inputBase} pl-10 appearance-none`} required>
                  <option value="" disabled>Select year</option>
                  {YEARS.map((y) => <option key={y} value={y}>{y}</option>)}
                </select>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-2">
              <button type="button" onClick={onClose}
                className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 transition-all cursor-pointer">
                Cancel
              </button>
              <motion.button type="submit" disabled={status === 'loading'}
                className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 shadow-md shadow-indigo-500/20 transition-all cursor-pointer disabled:opacity-60"
                whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <span className="flex items-center justify-center gap-2">
                  {status === 'loading'
                    ? <><Loader2 className="w-4 h-4 animate-spin" /> Saving…</>
                    : <><Save className="w-4 h-4" /> Save Changes</>}
                </span>
              </motion.button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
