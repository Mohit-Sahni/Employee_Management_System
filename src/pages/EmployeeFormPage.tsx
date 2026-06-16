import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { useEmployeeStore } from '../store/employeeStore';
import GlassCard from '../components/GlassCard';
import type { EmployeeFormData } from '../types';
import {
  User,
  Mail,
  Phone,
  Building2,
  Briefcase,
  DollarSign,
  Calendar,
  MapPin,
  UserCheck,
  ArrowLeft,
  Save,
  Loader2,
} from 'lucide-react';
import { useState } from 'react';

interface EmployeeFormPageProps {
  employeeId?: string;
  onNavigate: (page: string) => void;
}

const DEPARTMENTS = ['Engineering', 'Design', 'Marketing', 'Human Resources', 'Finance', 'Sales', 'Operations', 'Legal'];
const STATUSES = ['active', 'inactive', 'on-leave', 'terminated'] as const;

export default function EmployeeFormPage({ employeeId, onNavigate }: EmployeeFormPageProps) {
  const { addEmployee, updateEmployee, getEmployee } = useEmployeeStore();
  const [saving, setSaving] = useState(false);
  const isEdit = !!employeeId;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<EmployeeFormData>();

  useEffect(() => {
    if (isEdit && employeeId) {
      const emp = getEmployee(employeeId);
      if (emp) {
        reset({
          fullName: emp.fullName,
          email: emp.email,
          phone: emp.phone,
          department: emp.department,
          designation: emp.designation,
          salary: emp.salary,
          dateOfJoining: emp.dateOfJoining,
          address: emp.address,
          profileImage: emp.profileImage,
          employmentStatus: emp.employmentStatus,
          managerName: emp.managerName,
        });
      }
    }
  }, [employeeId, isEdit, getEmployee, reset]);

  const onSubmit = async (data: EmployeeFormData) => {
    setSaving(true);
    await new Promise((r) => setTimeout(r, 500));
    if (isEdit && employeeId) {
      updateEmployee(employeeId, data);
    } else {
      addEmployee(data);
    }
    setSaving(false);
    onNavigate('employees');
  };

  const inputClass = "w-full pl-11 pr-4 py-3 bg-white/[0.05] border border-white/[0.08] rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/30 transition-all text-sm";
  const selectClass = "w-full pl-11 pr-4 py-3 bg-white/[0.05] border border-white/[0.08] rounded-xl text-white text-sm focus:outline-none focus:border-blue-500/50 appearance-none";
  const labelClass = "block text-sm font-medium text-slate-300 mb-2";
  const errorClass = "text-red-400 text-xs mt-1";

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-4xl mx-auto space-y-6"
    >
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => onNavigate('employees')}
          className="p-2 rounded-xl bg-white/5 border border-white/10 text-slate-400 hover:text-white transition-all"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-white">
            {isEdit ? 'Edit Employee' : 'Add New Employee'}
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            {isEdit ? 'Update employee information' : 'Fill in the details to create a new employee record'}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <GlassCard className="p-6 md:p-8" hover={false}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Full Name */}
            <div>
              <label className={labelClass}>Full Name *</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  {...register('fullName', { required: 'Full name is required' })}
                  placeholder="John Smith"
                  className={inputClass}
                />
              </div>
              {errors.fullName && <p className={errorClass}>{errors.fullName.message}</p>}
            </div>

            {/* Email */}
            <div>
              <label className={labelClass}>Email Address *</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="email"
                  {...register('email', {
                    required: 'Email is required',
                    pattern: { value: /^\S+@\S+\.\S+$/, message: 'Invalid email format' },
                  })}
                  placeholder="john@company.com"
                  className={inputClass}
                />
              </div>
              {errors.email && <p className={errorClass}>{errors.email.message}</p>}
            </div>

            {/* Phone */}
            <div>
              <label className={labelClass}>Phone Number *</label>
              <div className="relative">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  {...register('phone', {
                    required: 'Phone number is required',
                    pattern: { value: /^[+]?[\d\s()-]{7,}$/, message: 'Invalid phone number' },
                  })}
                  placeholder="+1 (555) 123-4567"
                  className={inputClass}
                />
              </div>
              {errors.phone && <p className={errorClass}>{errors.phone.message}</p>}
            </div>

            {/* Department */}
            <div>
              <label className={labelClass}>Department *</label>
              <div className="relative">
                <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <select
                  {...register('department', { required: 'Department is required' })}
                  className={selectClass}
                >
                  <option value="" className="bg-[#1E293B]">Select Department</option>
                  {DEPARTMENTS.map((d) => (
                    <option key={d} value={d} className="bg-[#1E293B]">{d}</option>
                  ))}
                </select>
              </div>
              {errors.department && <p className={errorClass}>{errors.department.message}</p>}
            </div>

            {/* Designation */}
            <div>
              <label className={labelClass}>Designation *</label>
              <div className="relative">
                <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  {...register('designation', { required: 'Designation is required' })}
                  placeholder="Senior Developer"
                  className={inputClass}
                />
              </div>
              {errors.designation && <p className={errorClass}>{errors.designation.message}</p>}
            </div>

            {/* Salary */}
            <div>
              <label className={labelClass}>Salary *</label>
              <div className="relative">
                <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="number"
                  {...register('salary', {
                    required: 'Salary is required',
                    min: { value: 1, message: 'Salary must be positive' },
                    valueAsNumber: true,
                  })}
                  placeholder="95000"
                  className={inputClass}
                />
              </div>
              {errors.salary && <p className={errorClass}>{errors.salary.message}</p>}
            </div>

            {/* Date of Joining */}
            <div>
              <label className={labelClass}>Date of Joining *</label>
              <div className="relative">
                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="date"
                  {...register('dateOfJoining', { required: 'Date of joining is required' })}
                  className={`${inputClass} [color-scheme:dark]`}
                />
              </div>
              {errors.dateOfJoining && <p className={errorClass}>{errors.dateOfJoining.message}</p>}
            </div>

            {/* Employment Status */}
            <div>
              <label className={labelClass}>Employment Status *</label>
              <div className="relative">
                <UserCheck className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <select
                  {...register('employmentStatus', { required: 'Status is required' })}
                  className={selectClass}
                >
                  <option value="" className="bg-[#1E293B]">Select Status</option>
                  {STATUSES.map((s) => (
                    <option key={s} value={s} className="bg-[#1E293B] capitalize">
                      {s.charAt(0).toUpperCase() + s.slice(1).replace('-', ' ')}
                    </option>
                  ))}
                </select>
              </div>
              {errors.employmentStatus && <p className={errorClass}>{errors.employmentStatus.message}</p>}
            </div>

            {/* Manager Name */}
            <div>
              <label className={labelClass}>Manager Name</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  {...register('managerName')}
                  placeholder="Sarah Wilson"
                  className={inputClass}
                />
              </div>
            </div>

            {/* Profile Image URL */}
            <div>
              <label className={labelClass}>Profile Image URL</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  {...register('profileImage')}
                  placeholder="https://example.com/photo.jpg"
                  className={inputClass}
                />
              </div>
            </div>

            {/* Address */}
            <div className="md:col-span-2">
              <label className={labelClass}>Address *</label>
              <div className="relative">
                <MapPin className="absolute left-4 top-4 w-4 h-4 text-slate-500" />
                <textarea
                  {...register('address', { required: 'Address is required' })}
                  placeholder="123 Tech Street, San Francisco, CA 94102"
                  rows={3}
                  className="w-full pl-11 pr-4 py-3 bg-white/[0.05] border border-white/[0.08] rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/30 transition-all text-sm resize-none"
                />
              </div>
              {errors.address && <p className={errorClass}>{errors.address.message}</p>}
            </div>
          </div>

          {/* Submit */}
          <div className="flex items-center justify-end gap-4 mt-8 pt-6 border-t border-white/[0.06]">
            <button
              type="button"
              onClick={() => onNavigate('employees')}
              className="px-6 py-3 rounded-xl text-sm font-medium text-slate-400 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
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
                  {isEdit ? 'Update Employee' : 'Create Employee'}
                </>
              )}
            </button>
          </div>
        </GlassCard>
      </form>
    </motion.div>
  );
}
