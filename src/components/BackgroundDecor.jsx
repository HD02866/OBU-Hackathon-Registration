/**
 * BackgroundDecor — animated glow layer.
 * 
 * - Removes the base background color (handled by parent page)
 * - Uses z-0 to sit between the parent background and the z-10 content
 * - Increased opacity for better visibility
 * 
 * @param {string} type - "auth" (for Login/Registration) or "default"
 */
export default function BackgroundDecor({ type = 'default' }) {
  const isAuth = type === 'auth'

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">

      {/* ── TOP GLOW (Red/Rose for Auth, Blue for Default) ── */}
      <div
        className={`absolute -top-60 -left-20 w-[800px] h-[800px] rounded-full transition-all duration-700 ${
          isAuth ? 'glow-tr' : 'glow-tl'
        }`}
        style={{
          background: isAuth
            ? 'radial-gradient(circle, rgba(239,68,68,0.22) 0%, rgba(244,63,94,0.12) 50%, transparent 80%)'
            : 'radial-gradient(circle, rgba(59,130,246,0.22) 0%, rgba(99,102,241,0.12) 50%, transparent 80%)',
          filter: 'blur(100px)',
        }}
      />
      
      {/* Navbar Area Blur (Red for Auth) */}
      {isAuth && (
        <div 
          className="absolute top-0 left-0 right-0 h-60 opacity-50 dark:opacity-40"
          style={{
            background: 'linear-gradient(to bottom, rgba(239,68,68,0.15) 0%, rgba(220,38,38,0.08) 40%, transparent 100%)',
            filter: 'blur(60px)',
          }}
        />
      )}

      {/* ── BOTTOM GLOW (Blue for Auth, Purple/Red for Default) ── */}
      <div
        className="absolute -bottom-60 -right-20 w-[900px] h-[900px] rounded-full transition-all duration-700"
        style={{
          background: isAuth
            ? 'radial-gradient(circle, rgba(59,130,246,0.2) 0%, rgba(37,99,235,0.1) 50%, transparent 80%)'
            : 'radial-gradient(circle, rgba(168,85,247,0.18) 0%, rgba(236,72,153,0.1) 50%, transparent 80%)',
          filter: 'blur(110px)',
        }}
      />

      {/* Footer Area Blur (Blue for Auth, Red for Default) */}
      <div
        className="absolute bottom-0 left-0 right-0 h-[350px] transition-all duration-700"
        style={{
          background: isAuth
            ? 'linear-gradient(to top, rgba(59,130,246,0.15) 0%, rgba(37,99,235,0.08) 40%, transparent 100%)'
            : 'linear-gradient(to top, rgba(185,28,28,0.1) 0%, rgba(220,38,38,0.06) 40%, transparent 100%)',
          filter: 'blur(8px)',
        }}
      />

      {/* ── Corner bracket accents ── */}

      {/* Top-left */}
      <div className="absolute top-6 left-6">
        <div className="relative w-12 h-12">
          <div className={`absolute top-0 left-0 w-full h-[2.5px] transition-colors duration-500 rounded-full ${
            isAuth ? 'bg-gradient-to-r from-red-500 to-transparent opacity-70' : 'bg-gradient-to-r from-blue-500 to-transparent opacity-65'
          }`} />
          <div className={`absolute top-0 left-0 h-full w-[2.5px] transition-colors duration-500 rounded-full ${
            isAuth ? 'bg-gradient-to-b from-red-500 to-transparent opacity-70' : 'bg-gradient-to-b from-blue-500 to-transparent opacity-65'
          }`} />
        </div>
      </div>

      {/* Top-right */}
      <div className="absolute top-6 right-6">
        <div className="relative w-12 h-12">
          <div className={`absolute top-0 right-0 w-full h-[2.5px] transition-colors duration-500 rounded-full ${
            isAuth ? 'bg-gradient-to-l from-rose-500 to-transparent opacity-70' : 'bg-gradient-to-l from-indigo-500 to-transparent opacity-65'
          }`} />
          <div className={`absolute top-0 right-0 h-full w-[2.5px] transition-colors duration-500 rounded-full ${
            isAuth ? 'bg-gradient-to-b from-rose-500 to-transparent opacity-70' : 'bg-gradient-to-b from-indigo-500 to-transparent opacity-65'
          }`} />
        </div>
      </div>

      {/* Bottom-left */}
      <div className="absolute bottom-6 left-6">
        <div className="relative w-12 h-12">
          <div className={`absolute bottom-0 left-0 w-full h-[2.5px] transition-colors duration-500 rounded-full ${
            isAuth ? 'bg-gradient-to-r from-blue-500 to-transparent opacity-70' : 'bg-gradient-to-r from-red-500 to-transparent opacity-65'
          }`} />
          <div className={`absolute bottom-0 left-0 h-full w-[2.5px] transition-colors duration-500 rounded-full ${
            isAuth ? 'bg-gradient-to-t from-blue-500 to-transparent opacity-70' : 'bg-gradient-to-t from-red-500 to-transparent opacity-65'
          }`} />
        </div>
      </div>

      {/* Bottom-right */}
      <div className="absolute bottom-6 right-6">
        <div className="relative w-12 h-12">
          <div className={`absolute bottom-0 right-0 w-full h-[2.5px] transition-colors duration-500 rounded-full ${
            isAuth ? 'bg-gradient-to-l from-indigo-500 to-transparent opacity-70' : 'bg-gradient-to-l from-rose-500 to-transparent opacity-65'
          }`} />
          <div className={`absolute bottom-0 right-0 h-full w-[2.5px] transition-colors duration-500 rounded-full ${
            isAuth ? 'bg-gradient-to-t from-indigo-500 to-transparent opacity-70' : 'bg-gradient-to-t from-rose-500 to-transparent opacity-65'
          }`} />
        </div>
      </div>

      {/* ── Subtle dot-grid overlay ── */}
      <div
        className="absolute inset-0 opacity-[0.02] dark:opacity-[0.04]"
        style={{
          backgroundImage: `linear-gradient(rgba(59,130,246,1) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(59,130,246,1) 1px, transparent 1px)`,
          backgroundSize: '64px 64px',
        }}
      />
    </div>
  )
}
