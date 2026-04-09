import { useEffect, useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import * as XLSX from 'xlsx'
import { saveAs } from 'file-saver'

import { useAuth } from '../contexts/AuthContext.jsx'
import { logoutAdmin } from '../firebase/auth.js'
import { subscribeToStudents } from '../firebase/db.js'

import DarkModeToggle from '../components/DarkModeToggle.jsx'
import StatsCard from '../components/dashboard/StatsCard.jsx'
import EditModal from '../components/dashboard/EditModal.jsx'
import DeleteModal from '../components/dashboard/DeleteModal.jsx'
import BackgroundDecor from '../components/BackgroundDecor.jsx'

import {
  Users, Trophy, Code2, Monitor, Network,
  Search, Filter, Download, LogOut,
  Pencil, Trash2, ChevronLeft, ChevronRight,
  RefreshCw, GraduationCap, LayoutDashboard,
  ArrowUpDown, ArrowUp, ArrowDown,
} from 'lucide-react'

const DEPT_ABBR = {
  'Software Engineering': 'SE',
  'Computer Science': 'CS',
  'Information Communication Technology': 'ICT',
}
const DEPT_COLOR = {
  'Software Engineering': 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300',
  'Computer Science': 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300',
  'Information Communication Technology': 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300',
}
const YEAR_COLOR = {
  '1st Year': 'bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-300',
  '2nd Year': 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300',
  '3rd Year': 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300',
  '4th Year': 'bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300',
}

const PAGE_SIZE = 10

export default function DashboardPage({ darkMode, setDarkMode }) {
  const navigate = useNavigate()
  const { currentUser } = useAuth()

  const [students, setStudents] = useState([])
  const [loading, setLoading] = useState(true)
  const [editTarget, setEditTarget] = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)

  const [search, setSearch] = useState('')
  const [deptFilter, setDeptFilter] = useState('all')
  const [yearFilter, setYearFilter] = useState('all')
  const [sortField, setSortField] = useState('registeredAt')
  const [sortDir, setSortDir] = useState('desc')
  const [page, setPage] = useState(1)

  useEffect(() => {
    const unsub = subscribeToStudents((data) => {
      setStudents(data)
      setLoading(false)
    })
    return () => unsub()
  }, [])

  useEffect(() => { setPage(1) }, [search, deptFilter, yearFilter, sortField, sortDir])

  const filtered = useMemo(() => {
    let data = [...students]
    if (search.trim()) {
      const q = search.toLowerCase()
      data = data.filter(
        (s) => s.name?.toLowerCase().includes(q) || s.studentId?.toLowerCase().includes(q)
      )
    }
    if (deptFilter !== 'all') data = data.filter((s) => s.department === deptFilter)
    if (yearFilter !== 'all') data = data.filter((s) => s.year === yearFilter)

    data.sort((a, b) => {
      let valA = a[sortField] ?? ''
      let valB = b[sortField] ?? ''
      if (sortField === 'registeredAt') {
        valA = a.registeredAt?.seconds ?? 0
        valB = b.registeredAt?.seconds ?? 0
      }
      if (valA < valB) return sortDir === 'asc' ? -1 : 1
      if (valA > valB) return sortDir === 'asc' ? 1 : -1
      return 0
    })
    return data
  }, [students, search, deptFilter, yearFilter, sortField, sortDir])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  const stats = useMemo(() => ({
    total: students.length,
    se: students.filter((s) => s.department === 'Software Engineering').length,
    cs: students.filter((s) => s.department === 'Computer Science').length,
    ict: students.filter((s) => s.department === 'Information Communication Technology').length,
  }), [students])

  const toggleSort = (field) => {
    if (sortField === field) setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))
    else { setSortField(field); setSortDir('asc') }
  }

  const SortIcon = ({ field }) => {
    if (sortField !== field) return <ArrowUpDown className="w-3.5 h-3.5 opacity-30" />
    return sortDir === 'asc'
      ? <ArrowUp className="w-3.5 h-3.5 text-indigo-500" />
      : <ArrowDown className="w-3.5 h-3.5 text-indigo-500" />
  }

  const exportExcel = () => {
    const rows = filtered.map((s, i) => ({
      '#': i + 1,
      Name: s.name,
      'Student ID': s.studentId,
      Department: s.department,
      Year: s.year,
      Email: s.email,
      'Registered At': s.registeredAt?.toDate?.().toLocaleString() ?? 'N/A',
    }))
    const ws = XLSX.utils.json_to_sheet(rows)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'Students')
    const buf = XLSX.write(wb, { bookType: 'xlsx', type: 'array' })
    saveAs(new Blob([buf], { type: 'application/octet-stream' }), 'OBU_Hackathon_Students.xlsx')
  }

  const handleLogout = async () => {
    await logoutAdmin()
    navigate('/admin', { replace: true })
  }

  const ctrlCls = 'px-3 py-2 rounded-xl border border-gray-200/80 dark:border-white/8 bg-white/70 dark:bg-white/6 backdrop-blur-sm text-gray-700 dark:text-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30 transition-all duration-200'

  return (
    <div className="min-h-screen bg-[#fdfdff] dark:bg-[#04060b] transition-colors duration-300 relative overflow-hidden">
      <BackgroundDecor />
      <DarkModeToggle darkMode={darkMode} setDarkMode={setDarkMode} />

      {/* ── Header ── */}
      <header className="sticky top-0 z-30 bg-white/70 dark:bg-gray-900/50 backdrop-blur-2xl border-b border-gray-200/50 dark:border-white/6 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-[60px] flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-md shadow-indigo-500/20">
              <Trophy className="w-4.5 h-4.5 text-white" />
            </div>
            <div>
              <h1 className="text-sm font-bold text-gray-900 dark:text-white leading-none">OBU Hackathon</h1>
              <p className="text-[11px] text-gray-400 dark:text-gray-500 mt-0.5 flex items-center gap-1">
                <LayoutDashboard className="w-3 h-3" /> Admin Dashboard
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-gray-100/80 dark:bg-white/6 border border-gray-200/60 dark:border-white/8">
              <div className="w-5 h-5 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-[10px] font-black">
                {currentUser?.email?.[0]?.toUpperCase() ?? 'A'}
              </div>
              <span className="text-xs text-gray-600 dark:text-gray-400 font-medium max-w-[140px] truncate">
                {currentUser?.email}
              </span>
            </div>
            <motion.button
              onClick={handleLogout}
              id="logout-btn"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 border border-red-200/80 dark:border-red-500/20 transition-all cursor-pointer"
              whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}>
              <LogOut className="w-3.5 h-3.5" /> Logout
            </motion.button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">

        {/* ── Stats ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard icon={Users} label="Total Registered" value={stats.total} color="blue" delay={0} />
          <StatsCard icon={Code2} label="Software Engineering" value={stats.se} color="purple" delay={0.06} />
          <StatsCard icon={Monitor} label="Computer Science" value={stats.cs} color="indigo" delay={0.12} />
          <StatsCard icon={Network} label="ICT" value={stats.ict} color="green" delay={0.18} />
        </div>

        {/* ── Filters / Controls ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.22 }}
          className="bg-white/60 dark:bg-gray-900/40 backdrop-blur-xl rounded-2xl border border-white/70 dark:border-white/6 shadow-sm p-4 sm:p-5"
        >
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:flex-wrap">
            {/* Search */}
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              <input
                id="search-input"
                type="text"
                placeholder="Search by name or ID…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className={`${ctrlCls} w-full pl-9`}
              />
            </div>

            {/* Dept filter */}
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              <select id="dept-filter" value={deptFilter} onChange={(e) => setDeptFilter(e.target.value)}
                className={`${ctrlCls} pl-9 appearance-none pr-8 cursor-pointer`}>
                <option value="all">All Departments</option>
                <option value="Software Engineering">Software Engineering</option>
                <option value="Computer Science">Computer Science</option>
                <option value="Information Communication Technology">ICT</option>
              </select>
            </div>

            {/* Year filter */}
            <div className="relative">
              <GraduationCap className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              <select id="year-filter" value={yearFilter} onChange={(e) => setYearFilter(e.target.value)}
                className={`${ctrlCls} pl-9 appearance-none pr-8 cursor-pointer`}>
                <option value="all">All Years</option>
                <option value="1st Year">1st Year</option>
                <option value="2nd Year">2nd Year</option>
                <option value="3rd Year">3rd Year</option>
                <option value="4th Year">4th Year</option>
              </select>
            </div>

            {/* Export */}
            <motion.button
              id="export-btn"
              onClick={exportExcel}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-emerald-500 to-teal-600 shadow-md shadow-emerald-500/20 transition-all cursor-pointer hover:from-emerald-400 hover:to-teal-500"
              whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}>
              <Download className="w-4 h-4" /> Export Excel
            </motion.button>
          </div>

          {/* Active filter hint */}
          {(search || deptFilter !== 'all' || yearFilter !== 'all') && (
            <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-100/80 dark:border-white/6 flex-wrap">
              <span className="text-xs text-gray-400 font-medium">Showing</span>
              <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400">{filtered.length}</span>
              <span className="text-xs text-gray-400">of {students.length} students</span>
              <button onClick={() => { setSearch(''); setDeptFilter('all'); setYearFilter('all') }}
                className="ml-auto text-xs text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 flex items-center gap-1 cursor-pointer transition-colors">
                <RefreshCw className="w-3 h-3" /> Clear filters
              </button>
            </div>
          )}
        </motion.div>

        {/* ── Table ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.28 }}
          className="bg-white/60 dark:bg-gray-900/30 backdrop-blur-xl rounded-2xl border border-white/70 dark:border-white/6 shadow-sm overflow-hidden"
        >
          {loading ? (
            <div className="flex flex-col items-center justify-center py-24 gap-4">
              <div className="w-10 h-10 border-[3px] border-indigo-200 dark:border-indigo-800 border-t-indigo-500 dark:border-t-indigo-400 rounded-full animate-spin" />
              <p className="text-sm text-gray-400 font-medium">Loading students…</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 gap-3">
              <div className="w-14 h-14 rounded-2xl bg-gray-100 dark:bg-white/5 flex items-center justify-center">
                <Users className="w-7 h-7 text-gray-300 dark:text-gray-600" />
              </div>
              <p className="text-sm font-semibold text-gray-400">No students found</p>
              <p className="text-xs text-gray-300 dark:text-gray-600">
                {students.length === 0 ? 'No registrations yet.' : 'Try adjusting your filters.'}
              </p>
            </div>
          ) : (
            <>
              {/* Desktop Table */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-100/80 dark:border-white/6 bg-gray-50/60 dark:bg-white/2">
                      <th className="px-5 py-3.5 text-left text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider w-10">#</th>
                      {[
                        { label: 'Name', field: 'name' },
                        { label: 'Student ID', field: 'studentId' },
                        { label: 'Department', field: 'department' },
                        { label: 'Year', field: 'year' },
                        { label: 'Email', field: 'email' },
                      ].map(({ label, field }) => (
                        <th key={field}
                          className="px-5 py-3.5 text-left text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider cursor-pointer hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
                          onClick={() => toggleSort(field)}>
                          <span className="flex items-center gap-1.5 select-none">
                            {label} <SortIcon field={field} />
                          </span>
                        </th>
                      ))}
                      <th className="px-5 py-3.5 text-right text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100/60 dark:divide-white/4">
                    <AnimatePresence mode="popLayout">
                      {paginated.map((student, idx) => (
                        <motion.tr
                          key={student.id}
                          layout
                          initial={{ opacity: 0, x: -8 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 8, height: 0 }}
                          transition={{ duration: 0.22, delay: idx * 0.025 }}
                          className="hover:bg-gray-50/70 dark:hover:bg-white/3 transition-colors group"
                        >
                          <td className="px-5 py-4 text-gray-300 dark:text-gray-700 text-xs w-10">
                            {(page - 1) * PAGE_SIZE + idx + 1}
                          </td>
                          <td className="px-5 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold shrink-0 shadow-sm">
                                {student.name?.[0]?.toUpperCase() ?? '?'}
                              </div>
                              <span className="font-semibold text-gray-800 dark:text-white">{student.name}</span>
                            </div>
                          </td>
                          <td className="px-5 py-4 text-gray-500 dark:text-gray-400 font-mono text-xs tracking-wide">{student.studentId}</td>
                          <td className="px-5 py-4">
                            <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold ${DEPT_COLOR[student.department] || 'bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-gray-300'}`}>
                              {DEPT_ABBR[student.department] || student.department}
                            </span>
                          </td>
                          <td className="px-5 py-4">
                            <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold ${YEAR_COLOR[student.year] || 'bg-gray-100 text-gray-600'}`}>
                              {student.year}
                            </span>
                          </td>
                          <td className="px-5 py-4 text-gray-400 dark:text-gray-500 text-xs">{student.email}</td>
                          <td className="px-5 py-4">
                            <div className="flex items-center justify-end gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                              <motion.button
                                onClick={() => setEditTarget(student)}
                                className="p-2 rounded-lg text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-all cursor-pointer"
                                whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} title="Edit">
                                <Pencil className="w-3.5 h-3.5" />
                              </motion.button>
                              <motion.button
                                onClick={() => setDeleteTarget(student)}
                                className="p-2 rounded-lg text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all cursor-pointer"
                                whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} title="Delete">
                                <Trash2 className="w-3.5 h-3.5" />
                              </motion.button>
                            </div>
                          </td>
                        </motion.tr>
                      ))}
                    </AnimatePresence>
                  </tbody>
                </table>
              </div>

              {/* Mobile Cards */}
              <div className="md:hidden divide-y divide-gray-100/60 dark:divide-white/4">
                <AnimatePresence mode="popLayout">
                  {paginated.map((student, idx) => (
                    <motion.div
                      key={student.id}
                      layout
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.22, delay: idx * 0.025 }}
                      className="p-4 space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-sm font-bold shadow-sm">
                            {student.name?.[0]?.toUpperCase() ?? '?'}
                          </div>
                          <div>
                            <p className="font-semibold text-gray-800 dark:text-white text-sm">{student.name}</p>
                            <p className="text-xs text-gray-400 font-mono">{student.studentId}</p>
                          </div>
                        </div>
                        <div className="flex gap-1.5">
                          <button onClick={() => setEditTarget(student)}
                            className="p-2 rounded-lg text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-all cursor-pointer">
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button onClick={() => setDeleteTarget(student)}
                            className="p-2 rounded-lg text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all cursor-pointer">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <span className={`px-2.5 py-1 rounded-lg text-xs font-semibold ${DEPT_COLOR[student.department] || 'bg-gray-100 text-gray-600'}`}>
                          {DEPT_ABBR[student.department] || student.department}
                        </span>
                        <span className={`px-2.5 py-1 rounded-lg text-xs font-semibold ${YEAR_COLOR[student.year] || 'bg-gray-100 text-gray-600'}`}>
                          {student.year}
                        </span>
                        <span className="px-2.5 py-1 rounded-lg text-xs text-gray-400 bg-gray-100/80 dark:bg-white/5">{student.email}</span>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between px-5 py-4 border-t border-gray-100/80 dark:border-white/6">
                  <p className="text-xs text-gray-400">
                    Page <span className="font-semibold text-gray-700 dark:text-gray-200">{page}</span> of{' '}
                    <span className="font-semibold text-gray-700 dark:text-gray-200">{totalPages}</span>
                    {' '}· {filtered.length} results
                  </p>
                  <div className="flex items-center gap-1">
                    <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}
                      className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-white/6 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-all">
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      let p = i + 1
                      if (totalPages > 5) {
                        p = Math.max(1, Math.min(page - 2, totalPages - 4)) + i
                      }
                      return (
                        <button key={p} onClick={() => setPage(p)}
                          className={`w-8 h-8 rounded-lg text-xs font-semibold transition-all cursor-pointer ${page === p
                            ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/30'
                            : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-white/6'
                            }`}>
                          {p}
                        </button>
                      )
                    })}
                    <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages}
                      className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-white/6 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-all">
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </motion.div>
      </main>

      {/* Modals */}
      {editTarget && <EditModal student={editTarget} onClose={() => setEditTarget(null)} />}
      {deleteTarget && <DeleteModal student={deleteTarget} onClose={() => setDeleteTarget(null)} />}
    </div>
  )
}
