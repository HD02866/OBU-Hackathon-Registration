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
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
        onClick={(e) => e.target === e.currentTarget && onClose()}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
          className="w-full max-w-sm bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-white/10 p-6"
        >
          <div className="flex items-start justify-between mb-5">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-red-50 dark:bg-red-900/20">
                <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400" />
              </div>
              <div>
                <h2 className="text-base font-bold text-gray-900 dark:text-white">Delete Student</h2>
                <p className="text-xs text-gray-400 dark:text-gray-500">This action cannot be undone</p>
              </div>
            </div>
            <button onClick={onClose}
              className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-white/5 transition-all cursor-pointer">
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="mb-6 p-4 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5">
            <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">{student.name}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{student.studentId} · {student.department}</p>
          </div>

          {status === 'error' && (
            <p className="text-sm text-red-600 dark:text-red-400 mb-4 text-center">Delete failed. Please try again.</p>
          )}

          <p className="text-sm text-gray-600 dark:text-gray-400 mb-6 text-center">
            Are you sure you want to permanently remove this student's registration?
          </p>

          <div className="flex gap-3">
            <button onClick={onClose}
              className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 transition-all cursor-pointer">
              Cancel
            </button>
            <motion.button onClick={handleDelete} disabled={status === 'loading'}
              className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-400 hover:to-rose-500 shadow-md shadow-red-500/20 transition-all cursor-pointer disabled:opacity-60"
              whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <span className="flex items-center justify-center gap-2">
                {status === 'loading'
                  ? <><Loader2 className="w-4 h-4 animate-spin" /> Deleting…</>
                  : <><Trash2 className="w-4 h-4" /> Delete</>}
              </span>
            </motion.button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
