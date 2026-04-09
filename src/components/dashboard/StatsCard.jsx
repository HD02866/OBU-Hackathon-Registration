import { motion } from 'framer-motion'

const colorMap = {
  blue:   {
    gradient: 'from-blue-500 to-cyan-500',
    glow: 'shadow-blue-500/20',
    text: 'text-blue-600 dark:text-blue-400',
    ring: 'ring-blue-500/10',
  },
  purple: {
    gradient: 'from-purple-500 to-violet-500',
    glow: 'shadow-purple-500/20',
    text: 'text-purple-600 dark:text-purple-400',
    ring: 'ring-purple-500/10',
  },
  indigo: {
    gradient: 'from-indigo-500 to-blue-500',
    glow: 'shadow-indigo-500/20',
    text: 'text-indigo-600 dark:text-indigo-400',
    ring: 'ring-indigo-500/10',
  },
  green: {
    gradient: 'from-emerald-500 to-teal-500',
    glow: 'shadow-emerald-500/20',
    text: 'text-emerald-600 dark:text-emerald-400',
    ring: 'ring-emerald-500/10',
  },
  rose: {
    gradient: 'from-rose-500 to-pink-500',
    glow: 'shadow-rose-500/20',
    text: 'text-rose-600 dark:text-rose-400',
    ring: 'ring-rose-500/10',
  },
}

export default function StatsCard({ icon: Icon, label, value, color = 'blue', delay = 0 }) {
  const c = colorMap[color] || colorMap.blue
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -3, transition: { duration: 0.2 } }}
      className={`
        group relative flex items-center gap-4 p-5 rounded-2xl
        bg-white/60 dark:bg-gray-900/40
        backdrop-blur-xl
        border border-white/60 dark:border-white/8
        shadow-lg ${c.glow}
        ring-1 ${c.ring}
        overflow-hidden cursor-default
      `}
    >
      {/* Subtle top sheen */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/60 dark:via-white/10 to-transparent" />

      <div className={`
        flex-shrink-0 p-3 rounded-xl shadow-lg ${c.glow}
        bg-gradient-to-br ${c.gradient}
      `}>
        <Icon className="w-5 h-5 text-white" />
      </div>

      <div>
        <motion.p
          key={value}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="text-2xl font-black text-gray-900 dark:text-white leading-none tracking-tight"
        >
          {value}
        </motion.p>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 font-medium leading-tight">{label}</p>
      </div>
    </motion.div>
  )
}
