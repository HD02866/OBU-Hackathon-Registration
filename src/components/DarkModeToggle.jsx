import { motion } from 'framer-motion'
import { Sun, Moon, Trophy, Sparkles } from 'lucide-react'

export default function DarkModeToggle({ darkMode, setDarkMode }) {
  return (
    <motion.button
      id="dark-mode-toggle"
      onClick={() => setDarkMode(!darkMode)}
      className="
        fixed top-4 right-4 z-50
        flex items-center gap-2 px-3 py-2
        rounded-full
        bg-white/20 dark:bg-white/10
        backdrop-blur-md
        border border-white/30 dark:border-white/20
        text-white
        text-sm font-medium
        shadow-lg
        cursor-pointer
        transition-all duration-300
      "
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      aria-label="Toggle dark mode"
    >
      <motion.div
        initial={false}
        animate={{ rotate: darkMode ? 360 : 0 }}
        transition={{ duration: 0.4 }}
      >
        {darkMode ? (
          <Sun className="w-4 h-4" />
        ) : (
          <Moon className="w-4 h-4" />
        )}
      </motion.div>
      <span className="hidden sm:inline">
        {darkMode ? 'Light' : 'Dark'}
      </span>
    </motion.button>
  )
}
