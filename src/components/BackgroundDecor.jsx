import { motion } from 'framer-motion'

export default function BackgroundDecor() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10 bg-[#fdfdff] dark:bg-[#04060b]">
      {/* 1. Top-Left Glowing Blob (Blue/Purple) - Requirement 1 */}
      <motion.div
        animate={{
          x: [0, 30, 0],
          y: [0, 20, 0],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute -top-32 -left-32 w-[600px] h-[600px] bg-blue-500/10 dark:bg-blue-600/15 rounded-full blur-[120px]"
      />

      {/* 2. Bottom-Right Secondary Glow (Pink/Purple) - Requirement 1 */}
      <motion.div
        animate={{
          x: [0, -20, 0],
          y: [0, 30, 0],
          scale: [1, 1.05, 1],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1
        }}
        className="absolute -bottom-40 -right-40 w-[700px] h-[700px] bg-purple-500/10 dark:bg-purple-700/10 rounded-full blur-[140px]"
      />

      {/* Subtle Floating Sparkles */}
      {[...Array(5)].map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 1000 }}
          animate={{
            y: [-100, -800],
            opacity: [0, 0.2, 0],
          }}
          transition={{
            duration: 20 + Math.random() * 10,
            repeat: Infinity,
            delay: i * 4,
            ease: "linear"
          }}
          className="absolute w-1 h-1 bg-blue-400 dark:bg-blue-300 rounded-full blur-[0.5px]"
          style={{ left: `${15 + Math.random() * 70}%` }}
        />
      ))}
    </div>
  )
}
