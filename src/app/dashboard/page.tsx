'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Habit } from '../../types/habit';
import { Session } from '../../types/auth';
import HabitForm from '../../components/habits/HabitForm';
import { getHabitSlug } from '../../lib/slug';
import { calculateCurrentStreak } from '../../lib/streaks';
import { toggleHabitCompletion } from '../../lib/habits';

export default function DashboardPage() {
  const router = useRouter();
  const [session, setSession] = useState<Session | null>(null);
  const [habits, setHabits] = useState<Habit[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [editingHabit, setEditingHabit] = useState<Habit | null>(null);

  useEffect(() => {
    const savedSession = localStorage.getItem('habit-tracker-session');
    if (!savedSession) {
      router.push('/login');
      return;
    }
    const parsedSession = JSON.parse(savedSession);
    setSession(parsedSession);

    const allHabits = JSON.parse(localStorage.getItem('habit-tracker-habits') || '[]');
    setHabits(allHabits.filter((h: Habit) => h.userId === parsedSession.userId));
  }, [router]);

  const saveToStorage = (newHabits: Habit[]) => {
    const allHabits = JSON.parse(localStorage.getItem('habit-tracker-habits') || '[]');
    const otherUsersHabits = allHabits.filter((h: Habit) => h.userId !== session?.userId);
    localStorage.setItem('habit-tracker-habits', JSON.stringify([...otherUsersHabits, ...newHabits]));
    setHabits(newHabits);
  };

  const handleCreate = (data: { name: string; description: string }) => {
    const newHabit: Habit = {
      id: crypto.randomUUID(),
      userId: session!.userId,
      name: data.name,
      description: data.description,
      frequency: 'daily',
      createdAt: new Date().toISOString(),
      completions: [],
    };
    saveToStorage([...habits, newHabit]);
    setIsAdding(false);
  };

  const handleToggle = (habit: Habit) => {
    const today = new Date().toISOString().split('T')[0];
    const updatedHabit = toggleHabitCompletion(habit, today);
    const updatedHabits = habits.map(h => h.id === habit.id ? updatedHabit : h);
    saveToStorage(updatedHabits);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure?')) {
      saveToStorage(habits.filter(h => h.id !== id));
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('habit-tracker-session');
    router.push('/login');
  };

  if (!session) return null;

  return (
    <main data-testid="dashboard-page" className="max-w-2xl mx-auto p-4">
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">My Habits</h1>
        <button 
          onClick={handleLogout} 
          data-testid="auth-logout-button"
          className="text-red-600 font-medium"
        >
          Logout
        </button>
      </header>

      <button
        data-testid="create-habit-button"
        onClick={() => setIsAdding(true)}
        className="mb-6 w-full bg-blue-600 text-white p-3 rounded-lg font-bold"
      >
        + Add New Habit
      </button>

      {isAdding && (
        <div className="mb-6">
          <HabitForm onSave={handleCreate} onCancel={() => setIsAdding(false)} />
        </div>
      )}

      {habits.length === 0 ? (
        <div data-testid="empty-state" className="text-center py-10 text-gray-500">
          No habits found. Start by adding one!
        </div>
      ) : (
        <div className="space-y-4">
          {habits.map(habit => {
            const slug = getHabitSlug(habit.name);
            const streak = calculateCurrentStreak(habit.completions);
            const isCompletedToday = habit.completions.includes(new Date().toISOString().split('T')[0]);

            return (
              <div key={habit.id} data-testid={`habit-card-${slug}`} className="p-4 border rounded shadow-sm bg-white">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-lg">{habit.name}</h3>
                    <p className="text-gray-600 text-sm">{habit.description}</p>
                    <p data-testid={`habit-streak-${slug}`} className="mt-2 text-blue-600 font-semibold">
                      Streak: {streak} days
                    </p>
                  </div>
                  <div className="flex flex-col gap-2">
                    <button
                      data-testid={`habit-complete-${slug}`}
                      onClick={() => handleToggle(habit)}
                      className={`px-3 py-1 rounded text-sm font-bold ${isCompletedToday ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}
                    >
                      {isCompletedToday ? 'Completed' : 'Mark Done'}
                    </button>
                    <button
                      data-testid={`habit-delete-${slug}`}
                      onClick={() => handleDelete(habit.id)}
                      className="text-red-500 text-xs text-right"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </main>
  );
}