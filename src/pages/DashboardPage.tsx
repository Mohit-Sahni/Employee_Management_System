import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useEmployeeStore } from '../store/employeeStore';
import GlassCard from '../components/GlassCard';
import StatusBadge from '../components/StatusBadge';
import {
  Users,
  UserCheck,
  UserPlus,
  Building2,
  TrendingUp,
  Clock,
  Activity,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { format, parseISO, isAfter, subDays } from 'date-fns';

const COLORS = ['#2563EB', '#10B981', '#8B5CF6', '#F59E0B', '#EF4444', '#EC4899'];

export default function DashboardPage() {
  const { employees, activities } = useEmployeeStore();

  const stats = useMemo(() => {
    const active = employees.filter((e) => e.employmentStatus === 'active').length;
    const thirtyDaysAgo = subDays(new Date(), 30);
    const newJoiners = employees.filter((e) => isAfter(parseISO(e.dateOfJoining), thirtyDaysAgo)).length;

    const deptMap: Record<string, number> = {};
    employees.forEach((e) => {
      deptMap[e.department] = (deptMap[e.department] || 0) + 1;
    });
    const departmentStats = Object.entries(deptMap).map(([name, count]) => ({ name, count }));

    const statusMap: Record<string, number> = {};
    employees.forEach((e) => {
      statusMap[e.employmentStatus] = (statusMap[e.employmentStatus] || 0) + 1;
    });
    const statusStats = Object.entries(statusMap).map(([name, value]) => ({ name, value }));

    return { total: employees.length, active, newJoiners, departmentStats, statusStats };
  }, [employees]);

  const statCards = [
    { label: 'Total Employees', value: stats.total, icon: Users, color: 'from-blue-500 to-blue-600', change: '+12%' },
    { label: 'Active Employees', value: stats.active, icon: UserCheck, color: 'from-emerald-500 to-emerald-600', change: '+5%' },
    { label: 'New Joiners (30d)', value: stats.newJoiners, icon: UserPlus, color: 'from-violet-500 to-violet-600', change: '+2' },
    { label: 'Departments', value: stats.departmentStats.length, icon: Building2, color: 'from-amber-500 to-amber-600', change: '' },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-white">Dashboard</h1>
          <p className="text-slate-400 text-sm mt-1">Welcome back! Here's your workforce overview.</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-slate-400">
          <Clock className="w-4 h-4" />
          {format(new Date(), 'EEEE, MMMM d, yyyy')}
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card, i) => (
          <motion.div key={card.label} variants={itemVariants}>
            <GlassCard className="p-5" delay={i * 0.1}>
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-slate-400 mb-1">{card.label}</p>
                  <p className="text-3xl font-bold text-white">{card.value}</p>
                  {card.change && (
                    <div className="flex items-center gap-1 mt-2">
                      <TrendingUp className="w-3 h-3 text-emerald-400" />
                      <span className="text-xs text-emerald-400">{card.change}</span>
                    </div>
                  )}
                </div>
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${card.color} flex items-center justify-center`}>
                  <card.icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </GlassCard>
          </motion.div>
        ))}
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Department Bar Chart */}
        <motion.div variants={itemVariants}>
          <GlassCard className="p-6" delay={0.4}>
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Building2 className="w-5 h-5 text-blue-400" />
              Department Distribution
            </h3>
            <div className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats.departmentStats}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="name" tick={{ fill: '#94A3B8', fontSize: 12 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: '#94A3B8', fontSize: 12 }} axisLine={false} tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1E293B',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '12px',
                      color: '#fff',
                    }}
                  />
                  <Bar dataKey="count" radius={[8, 8, 0, 0]}>
                    {stats.departmentStats.map((_, index) => (
                      <Cell key={index} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </GlassCard>
        </motion.div>

        {/* Status Pie Chart */}
        <motion.div variants={itemVariants}>
          <GlassCard className="p-6" delay={0.5}>
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Activity className="w-5 h-5 text-emerald-400" />
              Employment Status
            </h3>
            <div className="h-[280px] flex items-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={stats.statusStats}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {stats.statusStats.map((_, index) => (
                      <Cell key={index} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1E293B',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '12px',
                      color: '#fff',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-2 pr-4">
                {stats.statusStats.map((s, i) => (
                  <div key={s.name} className="flex items-center gap-2 whitespace-nowrap">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                    <span className="text-xs text-slate-400 capitalize">{s.name}</span>
                    <span className="text-xs text-white font-medium">{s.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </GlassCard>
        </motion.div>
      </div>

      {/* Recent Activity & Top Employees */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <motion.div variants={itemVariants}>
          <GlassCard className="p-6" delay={0.6}>
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Clock className="w-5 h-5 text-violet-400" />
              Recent Activity
            </h3>
            <div className="space-y-3 max-h-[320px] overflow-y-auto pr-2 custom-scrollbar">
              {activities.slice(0, 10).map((activity, i) => (
                <motion.div
                  key={activity.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.7 + i * 0.05 }}
                  className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.02] hover:bg-white/[0.05] transition-colors"
                >
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                    activity.type === 'create' ? 'bg-emerald-500/20 text-emerald-400' :
                    activity.type === 'update' ? 'bg-blue-500/20 text-blue-400' :
                    activity.type === 'delete' ? 'bg-red-500/20 text-red-400' :
                    'bg-violet-500/20 text-violet-400'
                  }`}>
                    <Activity className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-white truncate">{activity.action}</p>
                    <p className="text-xs text-slate-400">{activity.target}</p>
                  </div>
                  <span className="text-xs text-slate-500 flex-shrink-0">
                    {format(parseISO(activity.timestamp), 'MMM d')}
                  </span>
                </motion.div>
              ))}
            </div>
          </GlassCard>
        </motion.div>

        {/* Top Employees */}
        <motion.div variants={itemVariants}>
          <GlassCard className="p-6" delay={0.7}>
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Users className="w-5 h-5 text-blue-400" />
              Recent Employees
            </h3>
            <div className="space-y-3 max-h-[320px] overflow-y-auto pr-2 custom-scrollbar">
              {employees.slice(0, 6).map((emp, i) => (
                <motion.div
                  key={emp.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.8 + i * 0.05 }}
                  className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.02] hover:bg-white/[0.05] transition-colors"
                >
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500/30 to-violet-500/30 flex items-center justify-center text-white font-semibold text-sm flex-shrink-0">
                    {emp.fullName.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white truncate">{emp.fullName}</p>
                    <p className="text-xs text-slate-400">{emp.designation} · {emp.department}</p>
                  </div>
                  <StatusBadge status={emp.employmentStatus} />
                </motion.div>
              ))}
            </div>
          </GlassCard>
        </motion.div>
      </div>
    </motion.div>
  );
}
