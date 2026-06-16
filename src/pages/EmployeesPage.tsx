import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useEmployeeStore } from '../store/employeeStore';
import GlassCard from '../components/GlassCard';
import StatusBadge from '../components/StatusBadge';
import ConfirmModal from '../components/ConfirmModal';
import {
  Search,
  Filter,
  SortAsc,
  SortDesc,
  Eye,
  Edit3,
  Trash2,
  Users,
  ChevronLeft,
  ChevronRight,
  X,
} from 'lucide-react';
import { format, parseISO } from 'date-fns';

interface EmployeesPageProps {
  onNavigate: (page: string, data?: any) => void;
}

const DEPARTMENTS = ['All', 'Engineering', 'Design', 'Marketing', 'Human Resources', 'Finance', 'Sales'];
const STATUSES = ['All', 'active', 'inactive', 'on-leave', 'terminated'];
const PAGE_SIZE = 6;

export default function EmployeesPage({ onNavigate }: EmployeesPageProps) {
  const { employees, deleteEmployee } = useEmployeeStore();
  const [search, setSearch] = useState('');
  const [deptFilter, setDeptFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [sortField, setSortField] = useState<'dateOfJoining' | 'fullName' | 'salary'>('dateOfJoining');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');
  const [page, setPage] = useState(1);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  const filtered = useMemo(() => {
    let result = [...employees];

    // Search
    if (search) {
      const s = search.toLowerCase();
      result = result.filter(
        (e) =>
          e.fullName.toLowerCase().includes(s) ||
          e.employeeId.toLowerCase().includes(s) ||
          e.email.toLowerCase().includes(s)
      );
    }

    // Department filter
    if (deptFilter !== 'All') {
      result = result.filter((e) => e.department === deptFilter);
    }

    // Status filter
    if (statusFilter !== 'All') {
      result = result.filter((e) => e.employmentStatus === statusFilter);
    }

    // Sort
    result.sort((a, b) => {
      let valA: any, valB: any;
      if (sortField === 'dateOfJoining') {
        valA = new Date(a.dateOfJoining).getTime();
        valB = new Date(b.dateOfJoining).getTime();
      } else if (sortField === 'salary') {
        valA = a.salary;
        valB = b.salary;
      } else {
        valA = a.fullName.toLowerCase();
        valB = b.fullName.toLowerCase();
      }
      if (sortDir === 'asc') return valA > valB ? 1 : -1;
      return valA < valB ? 1 : -1;
    });

    return result;
  }, [employees, search, deptFilter, statusFilter, sortField, sortDir]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const toggleSort = (field: typeof sortField) => {
    if (sortField === field) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDir('asc');
    }
  };

  const SortIcon = sortDir === 'asc' ? SortAsc : SortDesc;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-white flex items-center gap-3">
            <Users className="w-7 h-7 text-blue-400" />
            Employees
          </h1>
          <p className="text-slate-400 text-sm mt-1">{filtered.length} employees found</p>
        </div>
        <button
          onClick={() => onNavigate('add-employee')}
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 text-white font-medium text-sm hover:from-blue-500 hover:to-blue-400 transition-all"
        >
          + Add Employee
        </button>
      </div>

      {/* Search & Filters */}
      <GlassCard className="p-4" hover={false}>
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              type="text"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              placeholder="Search by name, ID, or email..."
              className="w-full pl-11 pr-4 py-2.5 bg-white/[0.05] border border-white/[0.08] rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-blue-500/50 transition-all text-sm"
            />
            {search && (
              <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Filter toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`px-4 py-2.5 rounded-xl border text-sm font-medium flex items-center gap-2 transition-all ${
              showFilters ? 'border-blue-500/30 bg-blue-500/10 text-blue-400' : 'border-white/10 text-slate-400 hover:text-white'
            }`}
          >
            <Filter className="w-4 h-4" />
            Filters
          </button>
        </div>

        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4 pt-4 border-t border-white/[0.06]">
                {/* Department */}
                <div>
                  <label className="block text-xs text-slate-400 mb-1.5">Department</label>
                  <select
                    value={deptFilter}
                    onChange={(e) => { setDeptFilter(e.target.value); setPage(1); }}
                    className="w-full px-3 py-2 bg-white/[0.05] border border-white/[0.08] rounded-xl text-white text-sm focus:outline-none focus:border-blue-500/50 appearance-none"
                  >
                    {DEPARTMENTS.map((d) => (
                      <option key={d} value={d} className="bg-[#1E293B]">{d}</option>
                    ))}
                  </select>
                </div>

                {/* Status */}
                <div>
                  <label className="block text-xs text-slate-400 mb-1.5">Status</label>
                  <select
                    value={statusFilter}
                    onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
                    className="w-full px-3 py-2 bg-white/[0.05] border border-white/[0.08] rounded-xl text-white text-sm focus:outline-none focus:border-blue-500/50 appearance-none"
                  >
                    {STATUSES.map((s) => (
                      <option key={s} value={s} className="bg-[#1E293B] capitalize">{s === 'All' ? 'All' : s.charAt(0).toUpperCase() + s.slice(1)}</option>
                    ))}
                  </select>
                </div>

                {/* Sort */}
                <div>
                  <label className="block text-xs text-slate-400 mb-1.5">Sort By</label>
                  <div className="flex gap-2">
                    {(['dateOfJoining', 'fullName', 'salary'] as const).map((f) => (
                      <button
                        key={f}
                        onClick={() => toggleSort(f)}
                        className={`flex-1 px-2 py-2 rounded-xl text-xs font-medium border transition-all flex items-center justify-center gap-1 ${
                          sortField === f
                            ? 'border-blue-500/30 bg-blue-500/10 text-blue-400'
                            : 'border-white/[0.08] text-slate-400 hover:text-white'
                        }`}
                      >
                        {f === 'dateOfJoining' ? 'Date' : f === 'fullName' ? 'Name' : 'Salary'}
                        {sortField === f && <SortIcon className="w-3 h-3" />}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </GlassCard>

      {/* Employee Table (Desktop) */}
      <div className="hidden lg:block">
        <GlassCard className="overflow-hidden" hover={false}>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/[0.06]">
                  <th className="text-left p-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Employee</th>
                  <th className="text-left p-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">ID</th>
                  <th className="text-left p-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Department</th>
                  <th className="text-left p-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Designation</th>
                  <th className="text-left p-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Status</th>
                  <th className="text-left p-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Joined</th>
                  <th className="text-right p-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody>
                <AnimatePresence>
                  {paginated.map((emp, i) => (
                    <motion.tr
                      key={emp.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ delay: i * 0.03 }}
                      className="border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors"
                    >
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500/30 to-violet-500/30 flex items-center justify-center text-white font-semibold text-sm flex-shrink-0">
                            {emp.fullName.split(' ').map((n) => n[0]).join('')}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-white">{emp.fullName}</p>
                            <p className="text-xs text-slate-400">{emp.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className="text-sm text-slate-300 font-mono">{emp.employeeId}</span>
                      </td>
                      <td className="p-4">
                        <span className="text-sm text-slate-300">{emp.department}</span>
                      </td>
                      <td className="p-4">
                        <span className="text-sm text-slate-300">{emp.designation}</span>
                      </td>
                      <td className="p-4">
                        <StatusBadge status={emp.employmentStatus} />
                      </td>
                      <td className="p-4">
                        <span className="text-sm text-slate-400">
                          {format(parseISO(emp.dateOfJoining), 'MMM d, yyyy')}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => onNavigate('view-employee', { id: emp.id })}
                            className="p-2 rounded-lg text-slate-400 hover:text-blue-400 hover:bg-blue-500/10 transition-all"
                            title="View"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => onNavigate('edit-employee', { id: emp.id })}
                            className="p-2 rounded-lg text-slate-400 hover:text-emerald-400 hover:bg-emerald-500/10 transition-all"
                            title="Edit"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setDeleteTarget(emp.id)}
                            className="p-2 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-all"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>

          {paginated.length === 0 && (
            <div className="p-12 text-center">
              <Users className="w-12 h-12 text-slate-600 mx-auto mb-3" />
              <p className="text-slate-400">No employees found</p>
              <p className="text-sm text-slate-500 mt-1">Try adjusting your search or filters</p>
            </div>
          )}
        </GlassCard>
      </div>

      {/* Employee Cards (Mobile/Tablet) */}
      <div className="lg:hidden grid grid-cols-1 sm:grid-cols-2 gap-4">
        <AnimatePresence>
          {paginated.map((emp, i) => (
            <motion.div
              key={emp.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <GlassCard className="p-4">
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500/30 to-violet-500/30 flex items-center justify-center text-white font-semibold flex-shrink-0">
                    {emp.fullName.split(' ').map((n) => n[0]).join('')}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-white truncate">{emp.fullName}</p>
                    <p className="text-xs text-slate-400">{emp.employeeId} · {emp.department}</p>
                    <p className="text-xs text-slate-500">{emp.designation}</p>
                  </div>
                  <StatusBadge status={emp.employmentStatus} />
                </div>
                <div className="flex items-center justify-between pt-3 border-t border-white/[0.06]">
                  <span className="text-xs text-slate-400">
                    {format(parseISO(emp.dateOfJoining), 'MMM d, yyyy')}
                  </span>
                  <div className="flex gap-1">
                    <button
                      onClick={() => onNavigate('view-employee', { id: emp.id })}
                      className="p-2 rounded-lg text-slate-400 hover:text-blue-400 hover:bg-blue-500/10 transition-all"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onNavigate('edit-employee', { id: emp.id })}
                      className="p-2 rounded-lg text-slate-400 hover:text-emerald-400 hover:bg-emerald-500/10 transition-all"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setDeleteTarget(emp.id)}
                      className="p-2 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-all"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="p-2 rounded-xl border border-white/10 text-slate-400 hover:text-white disabled:opacity-30 transition-all"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              onClick={() => setPage(p)}
              className={`w-9 h-9 rounded-xl text-sm font-medium transition-all ${
                p === page ? 'bg-blue-500 text-white' : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              {p}
            </button>
          ))}
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="p-2 rounded-xl border border-white/10 text-slate-400 hover:text-white disabled:opacity-30 transition-all"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => {
          if (deleteTarget) deleteEmployee(deleteTarget);
          setDeleteTarget(null);
        }}
        title="Delete Employee"
        message="Are you sure you want to delete this employee? This action cannot be undone."
        confirmText="Delete"
        type="danger"
      />
    </motion.div>
  );
}
