import { motion } from 'framer-motion'

/**
 * A stats card for the dashboard header row.
 * Props: icon, label, value, color ('blue' | 'purple' | 'indigo' | 'green' | 'rose')
 */
const colorMap = {
  blue:   { bg: 'bg-blue-500/10 dark:bg-blue-500/15',   icon: 'text-blue-600 dark:text-blue-400',   border: 'border-blue-200 dark:border-blue-500/20' },
  purple: { bg: 'bg-purple-500/10 dark:bg-purple-500/15', icon: 'text-purple-600 dark:text-purple-400', border: 'border-purple-200 dark:border-purple-500/20' },
  indigo: { bg: 'bg-indigo-500/10 dark:bg-indigo-500/15', icon: 'text-indigo-600 dark:text-indigo-400', border: 'border-indigo-200 dark:border-indigo-500/20' },
  green:  { bg: 'bg-emerald-500/10 dark:bg-emerald-500/15', icon: 'text-emerald-600 dark:text-emerald-400', border: 'border-emerald-200 dark:border-emerald-500/20' },
  rose:   { bg: 'bg-rose-500/10 dark:bg-rose-500/15',   icon: 'text-rose-600 dark:text-rose-400',   border: 'border-rose-200 dark:border-rose-500/20' },
}

export default function StatsCard({ icon: Icon, label, value, color = 'blue', delay = 0 }) {
  const c = colorMap[color] || colorMap.blue
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay, ease: [0.22, 1, 0.36, 1] }}
      className={`flex items-center gap-4 p-5 rounded-2xl bg-white dark:bg-gray-800/60 border ${c.border} shadow-sm`}
    >
      <div className={`p-3 rounded-xl ${c.bg}`}>
        <Icon className={`w-5 h-5 ${c.icon}`} />
      </div>
      <div>
        <p className="text-2xl font-bold text-gray-900 dark:text-white leading-none">{value}</p>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 font-medium">{label}</p>
      </div>
    </motion.div>
  )
}
