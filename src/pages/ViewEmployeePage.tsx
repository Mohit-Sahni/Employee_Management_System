import { motion } from 'framer-motion';
import { useEmployeeStore } from '../store/employeeStore';
import GlassCard from '../components/GlassCard';
import StatusBadge from '../components/StatusBadge';
import {
  ArrowLeft,
  Edit3,
  Mail,
  Phone,
  Building2,
  Briefcase,
  DollarSign,
  Calendar,
  MapPin,
  User,
  Hash,
  Clock,
} from 'lucide-react';
import { format, parseISO } from 'date-fns';

interface ViewEmployeePageProps {
  employeeId: string;
  onNavigate: (page: string, data?: any) => void;
}

export default function ViewEmployeePage({ employeeId, onNavigate }: ViewEmployeePageProps) {
  const { getEmployee } = useEmployeeStore();
  const emp = getEmployee(employeeId);

  if (!emp) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <User className="w-16 h-16 text-slate-600 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-white mb-2">Employee Not Found</h2>
          <button onClick={() => onNavigate('employees')} className="text-blue-400 hover:text-blue-300 text-sm">
            Back to Employees
          </button>
        </div>
      </div>
    );
  }

  const fields = [
    { icon: Hash, label: 'Employee ID', value: emp.employeeId },
    { icon: Mail, label: 'Email', value: emp.email },
    { icon: Phone, label: 'Phone', value: emp.phone },
    { icon: Building2, label: 'Department', value: emp.department },
    { icon: Briefcase, label: 'Designation', value: emp.designation },
    { icon: DollarSign, label: 'Salary', value: `$${emp.salary.toLocaleString()}` },
    { icon: Calendar, label: 'Date of Joining', value: format(parseISO(emp.dateOfJoining), 'MMMM d, yyyy') },
    { icon: MapPin, label: 'Address', value: emp.address },
    { icon: User, label: 'Manager', value: emp.managerName || 'N/A' },
    { icon: Clock, label: 'Last Updated', value: format(parseISO(emp.updatedAt), 'MMM d, yyyy h:mm a') },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-4xl mx-auto space-y-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <button
            onClick={() => onNavigate('employees')}
            className="p-2 rounded-xl bg-white/5 border border-white/10 text-slate-400 hover:text-white transition-all"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-2xl md:text-3xl font-bold text-white">Employee Details</h1>
        </div>
        <button
          onClick={() => onNavigate('edit-employee', { id: emp.id })}
          className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 text-white font-medium text-sm hover:from-blue-500 hover:to-blue-400 transition-all flex items-center gap-2"
        >
          <Edit3 className="w-4 h-4" />
          Edit
        </button>
      </div>

      {/* Profile Card */}
      <GlassCard className="p-6 md:p-8" hover={false}>
        <div className="flex flex-col sm:flex-row items-start gap-6 mb-8 pb-6 border-b border-white/[0.06]">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500 to-violet-500 flex items-center justify-center text-white text-2xl font-bold flex-shrink-0">
            {emp.fullName.split(' ').map((n) => n[0]).join('')}
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-white">{emp.fullName}</h2>
            <p className="text-slate-400 mt-1">{emp.designation} · {emp.department}</p>
            <div className="mt-3">
              <StatusBadge status={emp.employmentStatus} />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {fields.map((field, i) => (
            <motion.div
              key={field.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.05 }}
              className="flex items-start gap-3"
            >
              <div className="w-10 h-10 rounded-xl bg-white/[0.05] flex items-center justify-center flex-shrink-0">
                <field.icon className="w-4 h-4 text-blue-400" />
              </div>
              <div>
                <p className="text-xs text-slate-500 uppercase tracking-wider">{field.label}</p>
                <p className="text-sm text-white mt-0.5">{field.value}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </GlassCard>
    </motion.div>
  );
}
