import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuthStore } from '../store/authStore';
import { useEmployeeStore } from '../store/employeeStore';
import GlassCard from '../components/GlassCard';
import StatusBadge from '../components/StatusBadge';
import {
  User,
  Mail,
  Shield,
  Key,
  Save,
  Loader2,
  CheckCircle,
  Phone,
  Building2,
  Briefcase,
  Calendar,
  MapPin,
  DollarSign,
  Hash,
} from 'lucide-react';
import { format, parseISO } from 'date-fns';

export default function ProfilePage() {
  const { user } = useAuthStore();
  const { employees } = useEmployeeStore();
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [newPassword, setNewPassword] = useState('');

  const isEmployee = user?.role === 'employee';
  const myRecord = isEmployee
    ? employees.find((e) => e.employeeId === user?.employeeId || e.email === user?.email)
    : null;

  const handleSave = async () => {
    setSaving(true);
    await new Promise((r) => setTimeout(r, 800));
    setSaving(false);
    setSaved(true);
    setNewPassword('');
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-3xl mx-auto space-y-6"
    >
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-white">Profile</h1>
        <p className="text-slate-400 text-sm mt-1">Manage your account settings</p>
      </div>

      {/* Profile Card */}
      <GlassCard className="p-6 md:p-8" hover={false}>
        <div className="flex flex-col sm:flex-row items-center gap-6 mb-6 pb-6 border-b border-white/[0.06]">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500 to-emerald-500 flex items-center justify-center text-white text-2xl font-bold flex-shrink-0">
            {user?.name?.split(' ').map((n) => n[0]).join('') || 'U'}
          </div>
          <div className="text-center sm:text-left">
            <h2 className="text-xl font-bold text-white">{user?.name}</h2>
            <p className="text-slate-400 text-sm">{user?.email}</p>
            <span className={`inline-block mt-2 px-3 py-1 rounded-lg text-xs font-semibold uppercase tracking-wider ${
              user?.role === 'admin' ? 'bg-blue-500/20 text-blue-400' : 'bg-emerald-500/20 text-emerald-400'
            }`}>
              {user?.role}
            </span>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2 flex items-center gap-2">
              <User className="w-4 h-4" />
              Full Name
            </label>
            <input
              type="text"
              defaultValue={user?.name}
              className="w-full px-4 py-3 bg-white/[0.05] border border-white/[0.08] rounded-xl text-white text-sm focus:outline-none focus:border-blue-500/50 transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2 flex items-center gap-2">
              <Mail className="w-4 h-4" />
              Email Address
            </label>
            <input
              type="email"
              defaultValue={user?.email}
              readOnly
              className="w-full px-4 py-3 bg-white/[0.03] border border-white/[0.06] rounded-xl text-slate-500 text-sm cursor-not-allowed"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2 flex items-center gap-2">
              <Shield className="w-4 h-4" />
              Role
            </label>
            <input
              type="text"
              value={user?.role?.toUpperCase() || ''}
              readOnly
              className="w-full px-4 py-3 bg-white/[0.03] border border-white/[0.06] rounded-xl text-slate-500 text-sm cursor-not-allowed"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2 flex items-center gap-2">
              <Key className="w-4 h-4" />
              New Password
            </label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Enter new password"
              className="w-full px-4 py-3 bg-white/[0.05] border border-white/[0.08] rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:border-blue-500/50 transition-all"
            />
          </div>
        </div>

        <div className="flex items-center justify-end gap-4 mt-6 pt-6 border-t border-white/[0.06]">
          {saved && (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center gap-1 text-emerald-400 text-sm"
            >
              <CheckCircle className="w-4 h-4" /> Saved!
            </motion.span>
          )}
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 text-white font-semibold text-sm hover:from-blue-500 hover:to-blue-400 transition-all disabled:opacity-50 flex items-center gap-2"
          >
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                Save Changes
              </>
            )}
          </button>
        </div>
      </GlassCard>

      {/* Employee-specific: My employment details */}
      {isEmployee && myRecord && (
        <GlassCard className="p-6 md:p-8" hover={false}>
          <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-blue-400" />
            Employment Details
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { icon: Hash, label: 'Employee ID', value: myRecord.employeeId },
              { icon: Building2, label: 'Department', value: myRecord.department },
              { icon: Briefcase, label: 'Designation', value: myRecord.designation },
              { icon: DollarSign, label: 'Salary', value: `$${myRecord.salary.toLocaleString()}` },
              { icon: Calendar, label: 'Date of Joining', value: format(parseISO(myRecord.dateOfJoining), 'MMMM d, yyyy') },
              { icon: Phone, label: 'Phone', value: myRecord.phone },
              { icon: MapPin, label: 'Address', value: myRecord.address },
              { icon: User, label: 'Manager', value: myRecord.managerName || 'N/A' },
            ].map((field, i) => (
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
          <div className="mt-6 pt-4 border-t border-white/[0.06]">
            <div className="flex items-center gap-2">
              <span className="text-sm text-slate-400">Status:</span>
              <StatusBadge status={myRecord.employmentStatus} />
            </div>
          </div>
        </GlassCard>
      )}
    </motion.div>
  );
}
