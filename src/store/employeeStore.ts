import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';
import type { Employee, EmployeeFormData, ActivityItem } from '../types';

interface EmployeeState {
  employees: Employee[];
  activities: ActivityItem[];
  isLoading: boolean;
  loadEmployees: () => void;
  addEmployee: (data: EmployeeFormData) => Employee;
  updateEmployee: (id: string, data: Partial<EmployeeFormData>) => void;
  deleteEmployee: (id: string) => void;
  getEmployee: (id: string) => Employee | undefined;
}

const EMPLOYEES_KEY = 'ems_employees';
const ACTIVITIES_KEY = 'ems_activities';

function generateEmployeeId(index: number): string {
  return `EMP-${String(index).padStart(3, '0')}`;
}

const defaultEmployees: Employee[] = [
  {
    id: uuidv4(),
    employeeId: 'EMP-001',
    fullName: 'John Smith',
    email: 'john@company.com',
    phone: '+1 (555) 123-4567',
    department: 'Engineering',
    designation: 'Senior Developer',
    salary: 95000,
    dateOfJoining: '2023-03-15',
    address: '123 Tech Street, San Francisco, CA 94102',
    profileImage: '',
    employmentStatus: 'active',
    managerName: 'Sarah Wilson',
    createdAt: '2023-03-15T10:00:00Z',
    updatedAt: '2024-01-10T14:30:00Z',
  },
  {
    id: uuidv4(),
    employeeId: 'EMP-002',
    fullName: 'Emily Chen',
    email: 'emily.chen@company.com',
    phone: '+1 (555) 234-5678',
    department: 'Design',
    designation: 'UI/UX Lead',
    salary: 88000,
    dateOfJoining: '2023-06-01',
    address: '456 Creative Ave, New York, NY 10001',
    profileImage: '',
    employmentStatus: 'active',
    managerName: 'Mark Johnson',
    createdAt: '2023-06-01T09:00:00Z',
    updatedAt: '2024-02-15T11:00:00Z',
  },
  {
    id: uuidv4(),
    employeeId: 'EMP-003',
    fullName: 'Michael Brown',
    email: 'michael.b@company.com',
    phone: '+1 (555) 345-6789',
    department: 'Marketing',
    designation: 'Marketing Manager',
    salary: 82000,
    dateOfJoining: '2022-11-20',
    address: '789 Market Blvd, Chicago, IL 60601',
    profileImage: '',
    employmentStatus: 'active',
    managerName: 'Lisa Taylor',
    createdAt: '2022-11-20T08:00:00Z',
    updatedAt: '2024-03-01T16:00:00Z',
  },
  {
    id: uuidv4(),
    employeeId: 'EMP-004',
    fullName: 'Sarah Davis',
    email: 'sarah.d@company.com',
    phone: '+1 (555) 456-7890',
    department: 'Human Resources',
    designation: 'HR Specialist',
    salary: 72000,
    dateOfJoining: '2024-01-10',
    address: '321 People Lane, Austin, TX 78701',
    profileImage: '',
    employmentStatus: 'active',
    managerName: 'Robert King',
    createdAt: '2024-01-10T10:00:00Z',
    updatedAt: '2024-01-10T10:00:00Z',
  },
  {
    id: uuidv4(),
    employeeId: 'EMP-005',
    fullName: 'David Wilson',
    email: 'david.w@company.com',
    phone: '+1 (555) 567-8901',
    department: 'Engineering',
    designation: 'DevOps Engineer',
    salary: 105000,
    dateOfJoining: '2023-08-15',
    address: '654 Cloud Drive, Seattle, WA 98101',
    profileImage: '',
    employmentStatus: 'on-leave',
    managerName: 'Sarah Wilson',
    createdAt: '2023-08-15T09:00:00Z',
    updatedAt: '2024-04-01T12:00:00Z',
  },
  {
    id: uuidv4(),
    employeeId: 'EMP-006',
    fullName: 'Jessica Lee',
    email: 'jessica.l@company.com',
    phone: '+1 (555) 678-9012',
    department: 'Finance',
    designation: 'Financial Analyst',
    salary: 78000,
    dateOfJoining: '2023-02-28',
    address: '987 Wall Street, Boston, MA 02101',
    profileImage: '',
    employmentStatus: 'active',
    managerName: 'Tom Harris',
    createdAt: '2023-02-28T08:00:00Z',
    updatedAt: '2024-02-28T14:00:00Z',
  },
  {
    id: uuidv4(),
    employeeId: 'EMP-007',
    fullName: 'Robert Martinez',
    email: 'robert.m@company.com',
    phone: '+1 (555) 789-0123',
    department: 'Engineering',
    designation: 'Frontend Developer',
    salary: 85000,
    dateOfJoining: '2024-02-01',
    address: '147 Code Avenue, Portland, OR 97201',
    profileImage: '',
    employmentStatus: 'active',
    managerName: 'Sarah Wilson',
    createdAt: '2024-02-01T10:00:00Z',
    updatedAt: '2024-02-01T10:00:00Z',
  },
  {
    id: uuidv4(),
    employeeId: 'EMP-008',
    fullName: 'Amanda Taylor',
    email: 'amanda.t@company.com',
    phone: '+1 (555) 890-1234',
    department: 'Sales',
    designation: 'Sales Executive',
    salary: 68000,
    dateOfJoining: '2023-09-10',
    address: '258 Deal Road, Denver, CO 80201',
    profileImage: '',
    employmentStatus: 'inactive',
    managerName: 'Chris Anderson',
    createdAt: '2023-09-10T09:00:00Z',
    updatedAt: '2024-05-15T11:00:00Z',
  },
];

const defaultActivities: ActivityItem[] = [
  { id: '1', action: 'Added new employee', target: 'Robert Martinez', timestamp: '2024-02-01T10:00:00Z', type: 'create' },
  { id: '2', action: 'Updated profile', target: 'Emily Chen', timestamp: '2024-02-15T11:00:00Z', type: 'update' },
  { id: '3', action: 'Updated status', target: 'David Wilson', timestamp: '2024-04-01T12:00:00Z', type: 'update' },
  { id: '4', action: 'Deactivated employee', target: 'Amanda Taylor', timestamp: '2024-05-15T11:00:00Z', type: 'update' },
  { id: '5', action: 'Admin login', target: 'System', timestamp: '2024-06-01T08:00:00Z', type: 'login' },
];

function loadFromStorage(): { employees: Employee[]; activities: ActivityItem[] } {
  const empData = localStorage.getItem(EMPLOYEES_KEY);
  const actData = localStorage.getItem(ACTIVITIES_KEY);
  return {
    employees: empData ? JSON.parse(empData) : defaultEmployees,
    activities: actData ? JSON.parse(actData) : defaultActivities,
  };
}

function saveToStorage(employees: Employee[], activities: ActivityItem[]) {
  localStorage.setItem(EMPLOYEES_KEY, JSON.stringify(employees));
  localStorage.setItem(ACTIVITIES_KEY, JSON.stringify(activities));
}

export const useEmployeeStore = create<EmployeeState>((set, get) => ({
  employees: [],
  activities: [],
  isLoading: false,

  loadEmployees: () => {
    set({ isLoading: true });
    const { employees, activities } = loadFromStorage();
    setTimeout(() => {
      set({ employees, activities, isLoading: false });
    }, 300);
  },

  addEmployee: (data: EmployeeFormData) => {
    const state = get();
    const maxId = state.employees.reduce((max, e) => {
      const num = parseInt(e.employeeId.replace('EMP-', ''));
      return num > max ? num : max;
    }, 0);
    const newEmployee: Employee = {
      ...data,
      id: uuidv4(),
      employeeId: generateEmployeeId(maxId + 1),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    const newActivity: ActivityItem = {
      id: uuidv4(),
      action: 'Added new employee',
      target: data.fullName,
      timestamp: new Date().toISOString(),
      type: 'create',
    };
    const employees = [newEmployee, ...state.employees];
    const activities = [newActivity, ...state.activities];
    saveToStorage(employees, activities);
    set({ employees, activities });
    return newEmployee;
  },

  updateEmployee: (id: string, data: Partial<EmployeeFormData>) => {
    const state = get();
    const employees = state.employees.map((e) =>
      e.id === id ? { ...e, ...data, updatedAt: new Date().toISOString() } : e
    );
    const target = state.employees.find((e) => e.id === id);
    const newActivity: ActivityItem = {
      id: uuidv4(),
      action: 'Updated employee',
      target: target?.fullName || 'Unknown',
      timestamp: new Date().toISOString(),
      type: 'update',
    };
    const activities = [newActivity, ...state.activities];
    saveToStorage(employees, activities);
    set({ employees, activities });
  },

  deleteEmployee: (id: string) => {
    const state = get();
    const target = state.employees.find((e) => e.id === id);
    const employees = state.employees.filter((e) => e.id !== id);
    const newActivity: ActivityItem = {
      id: uuidv4(),
      action: 'Deleted employee',
      target: target?.fullName || 'Unknown',
      timestamp: new Date().toISOString(),
      type: 'delete',
    };
    const activities = [newActivity, ...state.activities];
    saveToStorage(employees, activities);
    set({ employees, activities });
  },

  getEmployee: (id: string) => {
    return get().employees.find((e) => e.id === id);
  },
}));
