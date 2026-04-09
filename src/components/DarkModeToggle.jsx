import { motion } from 'framer-motion'
import { Sun, Moon } from 'lucide-react'

export default function DarkModeToggle({ darkMode, setDarkMode, className = 'fixed top-4 right-4 z-50' }) {
  return (
    <motion.button
      id="dark-mode-toggle"
      onClick={() => setDarkMode(!darkMode)}
      className={`
        flex items-center gap-2 px-3.5 py-2
        rounded-full
        bg-white/70 dark:bg-white/10
        backdrop-blur-xl
        border border-gray-200/60 dark:border-white/15
        text-gray-700 dark:text-white/80
        text-xs font-semibold
        shadow-lg shadow-black/5 dark:shadow-black/30
        cursor-pointer
        transition-all duration-300
        ${className}
      `}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      aria-label="Toggle dark mode"
    >
      <motion.div
        initial={false}
        animate={{ rotate: darkMode ? 180 : 0, scale: [1, 0.8, 1] }}
        transition={{ duration: 0.35 }}
      >
        {darkMode ? (
          <Sun className="w-3.5 h-3.5 text-amber-400" />
        ) : (
          <Moon className="w-3.5 h-3.5 text-indigo-500" />
        )}
      </motion.div>
      <span className="hidden sm:inline">
        {darkMode ? 'Light' : 'Dark'}
      </span>
    </motion.button>
  )
}
