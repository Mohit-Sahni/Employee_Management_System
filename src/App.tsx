import { useEffect, useState, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useAuthStore } from './store/authStore';
import { useEmployeeStore } from './store/employeeStore';
import AnimatedBackground from './components/AnimatedBackground';
import CursorEffects from './components/CursorEffects';
import Sidebar from './components/Sidebar';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import EmployeesPage from './pages/EmployeesPage';
import EmployeeFormPage from './pages/EmployeeFormPage';
import ViewEmployeePage from './pages/ViewEmployeePage';
import ProfilePage from './pages/ProfilePage';
import EmployeeDashboard from './pages/EmployeeDashboard';
import { Loader2 } from 'lucide-react';

interface NavData {
  id?: string;
}

export default function App() {
  const { isAuthenticated, user, checkAuth } = useAuthStore();
  const { loadEmployees } = useEmployeeStore();
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [navData, setNavData] = useState<NavData>({});
  const [appReady, setAppReady] = useState(false);

  useEffect(() => {
    checkAuth();
    loadEmployees();
    setTimeout(() => setAppReady(true), 300);
  }, [checkAuth, loadEmployees]);

  useEffect(() => {
    if (isAuthenticated && user) {
      if (user.role === 'admin') {
        setCurrentPage('dashboard');
      } else {
        setCurrentPage('employee-dashboard');
      }
    }
  }, [isAuthenticated, user]);

  const handleNavigate = useCallback((page: string, data?: any) => {
    setCurrentPage(page);
    setNavData(data || {});
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  if (!appReady) {
    return (
      <div className="min-h-screen bg-[#0B1120] flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center gap-4"
        >
          <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
          <p className="text-slate-400 text-sm">Loading...</p>
        </motion.div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <>
        <CursorEffects />
        <LoginPage />
      </>
    );
  }

  const isAdmin = user?.role === 'admin';
  const sidebarWidth = 'md:pl-[260px]';

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return isAdmin ? <DashboardPage /> : <EmployeeDashboard />;
      case 'employee-dashboard':
        return <EmployeeDashboard />;
      case 'employees':
        return isAdmin ? <EmployeesPage onNavigate={handleNavigate} /> : <EmployeeDashboard />;
      case 'add-employee':
        return isAdmin ? <EmployeeFormPage onNavigate={handleNavigate} /> : <EmployeeDashboard />;
      case 'edit-employee':
        return isAdmin ? (
          <EmployeeFormPage employeeId={navData.id} onNavigate={handleNavigate} />
        ) : (
          <EmployeeDashboard />
        );
      case 'view-employee':
        return isAdmin && navData.id ? (
          <ViewEmployeePage employeeId={navData.id} onNavigate={handleNavigate} />
        ) : (
          <EmployeeDashboard />
        );
      case 'profile':
        return <ProfilePage />;
      default:
        return isAdmin ? <DashboardPage /> : <EmployeeDashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-[#0B1120]">
      <AnimatedBackground />
      <CursorEffects />
      <Sidebar currentPage={currentPage} onNavigate={handleNavigate} />
      <main className={`relative z-10 ${sidebarWidth} min-h-screen`}>
        <div className="p-4 pt-16 md:pt-6 md:p-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentPage + (navData.id || '')}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              {renderPage()}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
