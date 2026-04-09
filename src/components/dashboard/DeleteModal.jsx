import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import { deleteStudent } from '../../firebase/db.js'
import { AlertTriangle, Trash2, Loader2, X } from 'lucide-react'

export default function DeleteModal({ student, onClose }) {
  const [status, setStatus] = useState('idle')

  const handleDelete = async () => {
    setStatus('loading')
    try {
      await deleteStudent(student.id)
      onClose()
    } catch {
      setStatus('error')
    }
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-md"
        onClick={(e) => e.target === e.currentTarget && onClose()}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 24 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 24 }}
          transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
          className="w-full max-w-sm relative"
        >
          {/* Halo */}
          <div className="absolute -inset-1 bg-gradient-to-br from-red-500/10 to-rose-500/10 rounded-3xl blur-xl pointer-events-none" />

          <div className="relative bg-white/80 dark:bg-gray-900/80 backdrop-blur-2xl rounded-2xl shadow-2xl shadow-black/15 dark:shadow-black/50 border border-white/80 dark:border-white/8 overflow-hidden p-6">
            {/* Top accent bar */}
            <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-red-400 via-rose-500 to-pink-500" />

            {/* Header */}
            <div className="flex items-start justify-between mb-5 mt-2">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-500/20">
                  <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-gray-900 dark:text-white">Delete Student</h2>
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">This action cannot be undone</p>
                </div>
              </div>
              <button onClick={onClose}
                className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-white/6 transition-all cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Student Info */}
            <div className="mb-5 p-4 rounded-xl bg-gray-50/80 dark:bg-white/4 border border-gray-100/80 dark:border-white/6">
              <p className="text-sm font-semibold text-gray-800 dark:text-gray-100">{student.name}</p>
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">{student.studentId} · {student.department}</p>
            </div>

            {status === 'error' && (
              <p className="text-xs text-red-600 dark:text-red-400 mb-4 text-center font-medium">Delete failed. Please try again.</p>
            )}

            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6 text-center leading-relaxed">
              Are you sure you want to permanently remove this student's registration?
            </p>

            <div className="flex gap-3">
              <button onClick={onClose}
                className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-gray-600 dark:text-gray-300 bg-gray-100/80 dark:bg-white/6 hover:bg-gray-200/80 dark:hover:bg-white/10 border border-gray-200/60 dark:border-white/6 transition-all cursor-pointer">
                Cancel
              </button>
              <motion.button onClick={handleDelete} disabled={status === 'loading'}
                className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-400 hover:to-rose-500 shadow-md shadow-red-500/25 transition-all cursor-pointer disabled:opacity-60"
                whileHover={{ scale: 1.02, y: -1 }} whileTap={{ scale: 0.98 }}>
                <span className="flex items-center justify-center gap-2">
                  {status === 'loading'
                    ? <><Loader2 className="w-4 h-4 animate-spin" /> Deleting…</>
                    : <><Trash2 className="w-4 h-4" /> Delete</>}
                </span>
              </motion.button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
