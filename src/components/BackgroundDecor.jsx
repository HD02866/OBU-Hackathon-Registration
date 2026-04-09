/**
 * BackgroundDecor — fixed layer with:
 *  - animated blue/purple glow blobs (top-left, bottom-right)
 *  - red/dark accent glow at the very bottom
 *  - blue corner bracket accents on all 4 corners
 *  - subtle dot-grid overlay
 * Rendered on every page.
 */
export default function BackgroundDecor() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10 bg-[#fdfdff] dark:bg-[#04060b]">

      {/* ── Top-left blue/indigo blob ── */}
      <div
        className="glow-tl absolute -top-40 -left-40 w-[650px] h-[650px] rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(59,130,246,0.18) 0%, rgba(99,102,241,0.10) 50%, transparent 80%)',
          filter: 'blur(60px)',
        }}
      />

      {/* ── Bottom-right purple blob ── */}
      <div
        className="glow-br absolute -bottom-40 -right-40 w-[700px] h-[700px] rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(168,85,247,0.14) 0%, rgba(236,72,153,0.08) 50%, transparent 80%)',
          filter: 'blur(70px)',
        }}
      />

      {/* ── Bottom red/dark glow strip ── */}
      <div
        className="absolute bottom-0 left-0 right-0 h-[280px]"
        style={{
          background: 'linear-gradient(to top, rgba(185,28,28,0.07) 0%, rgba(220,38,38,0.04) 40%, transparent 100%)',
          filter: 'blur(2px)',
        }}
      />
      {/* Red centre shine on bottom edge */}
      <div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[160px] rounded-full"
        style={{
          background: 'radial-gradient(ellipse, rgba(239,68,68,0.10) 0%, rgba(185,28,28,0.06) 40%, transparent 75%)',
          filter: 'blur(30px)',
        }}
      />
      {/* Thin red glow line along bottom edge */}
      <div
        className="absolute bottom-0 inset-x-0 h-[2px] opacity-30 dark:opacity-20"
        style={{
          background: 'linear-gradient(to right, transparent 0%, rgba(239,68,68,0.8) 30%, rgba(220,38,38,1) 50%, rgba(239,68,68,0.8) 70%, transparent 100%)',
        }}
      />

      {/* ── Corner bracket accents ── */}

      {/* Top-left */}
      <div className="absolute top-5 left-5">
        <div className="relative w-10 h-10">
          <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-blue-500 to-transparent opacity-55 dark:opacity-35 rounded-full" />
          <div className="absolute top-0 left-0 h-full w-[2px] bg-gradient-to-b from-blue-500 to-transparent opacity-55 dark:opacity-35 rounded-full" />
        </div>
      </div>

      {/* Top-right */}
      <div className="absolute top-5 right-5">
        <div className="relative w-10 h-10">
          <div className="absolute top-0 right-0 w-full h-[2px] bg-gradient-to-l from-indigo-500 to-transparent opacity-55 dark:opacity-35 rounded-full" />
          <div className="absolute top-0 right-0 h-full w-[2px] bg-gradient-to-b from-indigo-500 to-transparent opacity-55 dark:opacity-35 rounded-full" />
        </div>
      </div>

      {/* Bottom-left */}
      <div className="absolute bottom-5 left-5">
        <div className="relative w-10 h-10">
          <div className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-red-500 to-transparent opacity-50 dark:opacity-30 rounded-full" />
          <div className="absolute bottom-0 left-0 h-full w-[2px] bg-gradient-to-t from-red-500 to-transparent opacity-50 dark:opacity-30 rounded-full" />
        </div>
      </div>

      {/* Bottom-right */}
      <div className="absolute bottom-5 right-5">
        <div className="relative w-10 h-10">
          <div className="absolute bottom-0 right-0 w-full h-[2px] bg-gradient-to-l from-rose-500 to-transparent opacity-50 dark:opacity-30 rounded-full" />
          <div className="absolute bottom-0 right-0 h-full w-[2px] bg-gradient-to-t from-rose-500 to-transparent opacity-50 dark:opacity-30 rounded-full" />
        </div>
      </div>

      {/* ── Subtle dot-grid overlay ── */}
      <div
        className="absolute inset-0 opacity-[0.016] dark:opacity-[0.028]"
        style={{
          backgroundImage: `linear-gradient(rgba(59,130,246,1) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(59,130,246,1) 1px, transparent 1px)`,
          backgroundSize: '60px 60px',
        }}
      />
    </div>
  )
}
