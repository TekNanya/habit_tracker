'use client';

import ProtectedRoute from '../../components/shared/ProtectedRoute';
import HabitList from '../../components/habits/HabitList';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem('habit-tracker-session');
    router.replace('/login');
  };

  return (
    <ProtectedRoute>
      <main data-testid="dashboard-page" className="min-h-screen bg-[#fdfcff] pb-32">
        <header className="px-6 py-8 flex justify-between items-center max-w-2xl mx-auto">
          <div>
            <h1 className="text-3xl font-black text-purple-950 italic tracking-tighter uppercase">Habit</h1>
            <div className="h-1.5 w-8 bg-purple-600 rounded-full"></div>
          </div>
          <button 
            data-testid="auth-logout-button"
            onClick={handleLogout}
            className="bg-purple-50 text-purple-700 px-5 py-2.5 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-red-50 hover:text-red-600 transition-all"
          >
            Logout
          </button>
        </header>

        <section className="max-w-2xl mx-auto px-6">
          <HabitList />
        </section>
      </main>
    </ProtectedRoute>
  );
}