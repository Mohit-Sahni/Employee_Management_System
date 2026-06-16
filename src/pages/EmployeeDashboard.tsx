import { motion } from 'framer-motion';
import { useAuthStore } from '../store/authStore';
import { useEmployeeStore } from '../store/employeeStore';
import GlassCard from '../components/GlassCard';
import StatusBadge from '../components/StatusBadge';
import {
  User,
  Building2,
  Briefcase,
  Calendar,
  MapPin,
  Phone,
  Mail,
  DollarSign,
  Hash,
  Clock,
  Shield,
} from 'lucide-react';
import { format, parseISO } from 'date-fns';

export default function EmployeeDashboard() {
  const { user } = useAuthStore();
  const { employees } = useEmployeeStore();

  const myRecord = employees.find((e) => e.employeeId === user?.employeeId || e.email === user?.email);

  if (!myRecord) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex items-center justify-center min-h-[400px]"
      >
        <div className="text-center">
          <Shield className="w-16 h-16 text-slate-600 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-white mb-2">Welcome, {user?.name}</h2>
          <p className="text-slate-400">Your employee record will appear here once it's created.</p>
        </div>
      </motion.div>
    );
  }

  const infoCards = [
    { icon: Hash, label: 'Employee ID', value: myRecord.employeeId, color: 'from-blue-500 to-blue-600' },
    { icon: Building2, label: 'Department', value: myRecord.department, color: 'from-emerald-500 to-emerald-600' },
    { icon: Briefcase, label: 'Designation', value: myRecord.designation, color: 'from-violet-500 to-violet-600' },
    { icon: DollarSign, label: 'Salary', value: `$${myRecord.salary.toLocaleString()}`, color: 'from-amber-500 to-amber-600' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-white">
          Welcome, {myRecord.fullName.split(' ')[0]} 👋
        </h1>
        <p className="text-slate-400 text-sm mt-1">
          Here's your employment overview · {format(new Date(), 'EEEE, MMMM d, yyyy')}
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {infoCards.map((card, i) => (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <GlassCard className="p-5" delay={i * 0.1}>
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-slate-400 mb-1">{card.label}</p>
                  <p className="text-lg font-bold text-white">{card.value}</p>
                </div>
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${card.color} flex items-center justify-center`}>
                  <card.icon className="w-5 h-5 text-white" />
                </div>
              </div>
            </GlassCard>
          </motion.div>
        ))}
      </div>

      {/* Detailed Info */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Personal Info */}
        <GlassCard className="p-6" delay={0.4} hover={false}>
          <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
            <User className="w-5 h-5 text-blue-400" />
            Personal Information
          </h3>
          <div className="space-y-4">
            {[
              { icon: User, label: 'Full Name', value: myRecord.fullName },
              { icon: Mail, label: 'Email', value: myRecord.email },
              { icon: Phone, label: 'Phone', value: myRecord.phone },
              { icon: MapPin, label: 'Address', value: myRecord.address },
            ].map((field, i) => (
              <motion.div
                key={field.label}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + i * 0.05 }}
                className="flex items-start gap-3 p-3 rounded-xl bg-white/[0.02]"
              >
                <div className="w-8 h-8 rounded-lg bg-white/[0.05] flex items-center justify-center flex-shrink-0">
                  <field.icon className="w-3.5 h-3.5 text-blue-400" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs text-slate-500">{field.label}</p>
                  <p className="text-sm text-white mt-0.5 break-words">{field.value}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </GlassCard>

        {/* Employment Details */}
        <GlassCard className="p-6" delay={0.5} hover={false}>
          <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-emerald-400" />
            Employment Details
          </h3>
          <div className="space-y-4">
            {[
              { icon: Calendar, label: 'Date of Joining', value: format(parseISO(myRecord.dateOfJoining), 'MMMM d, yyyy') },
              { icon: User, label: 'Manager', value: myRecord.managerName || 'N/A' },
              { icon: Clock, label: 'Last Updated', value: format(parseISO(myRecord.updatedAt), 'MMM d, yyyy h:mm a') },
            ].map((field, i) => (
              <motion.div
                key={field.label}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 + i * 0.05 }}
                className="flex items-start gap-3 p-3 rounded-xl bg-white/[0.02]"
              >
                <div className="w-8 h-8 rounded-lg bg-white/[0.05] flex items-center justify-center flex-shrink-0">
                  <field.icon className="w-3.5 h-3.5 text-emerald-400" />
                </div>
                <div>
                  <p className="text-xs text-slate-500">{field.label}</p>
                  <p className="text-sm text-white mt-0.5">{field.value}</p>
                </div>
              </motion.div>
            ))}

            <div className="pt-3 border-t border-white/[0.06]">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-400">Employment Status</span>
                <StatusBadge status={myRecord.employmentStatus} />
              </div>
            </div>
          </div>
        </GlassCard>
      </div>
    </motion.div>
  );
}
