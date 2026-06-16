export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  role: 'admin' | 'employee';
  employeeId?: string;
}

export interface Employee {
  id: string;
  employeeId: string;
  fullName: string;
  email: string;
  phone: string;
  department: string;
  designation: string;
  salary: number;
  dateOfJoining: string;
  address: string;
  profileImage: string;
  employmentStatus: 'active' | 'inactive' | 'on-leave' | 'terminated';
  managerName: string;
  createdAt: string;
  updatedAt: string;
}

export interface DashboardStats {
  totalEmployees: number;
  activeEmployees: number;
  newJoiners: number;
  departmentStats: { name: string; count: number }[];
  recentActivity: ActivityItem[];
}

export interface ActivityItem {
  id: string;
  action: string;
  target: string;
  timestamp: string;
  type: 'create' | 'update' | 'delete' | 'login';
}

export type EmployeeFormData = Omit<Employee, 'id' | 'employeeId' | 'createdAt' | 'updatedAt'>;
