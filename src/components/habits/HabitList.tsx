'use client';

import { useState, useEffect } from 'react';
import HabitCard from './HabitCard';
import HabitForm from './HabitForm';
import { Habit } from '../../types/habit';

export default function HabitList() {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);

  useEffect(() => {
    const session = JSON.parse(localStorage.getItem('habit-tracker-session') || 'null');
    const allHabits = JSON.parse(localStorage.getItem('habit-tracker-habits') || '[]');
    if (session) {
      const userHabits = allHabits.filter((h: Habit) => h.userId === session.userId);
      setHabits(userHabits);
    }
  }, []);

  const refreshHabits = () => {
    const session = JSON.parse(localStorage.getItem('habit-tracker-session') || 'null');
    const allHabits = JSON.parse(localStorage.getItem('habit-tracker-habits') || '[]');
    const userHabits = allHabits.filter((h: Habit) => h.userId === session?.userId);
    setHabits(userHabits);
  };

  return (
    <div className="space-y-4">
      {habits.length === 0 ? (
        <div data-testid="empty-state" className="text-center py-20 bg-white/50 border-2 border-dashed border-purple-200 rounded-3xl">
          <p className="text-purple-400 font-medium">No habits yet. Start your journey today.</p>
        </div>
      ) : (
        habits.map((habit) => (
          <HabitCard key={habit.id} habit={habit} onUpdate={refreshHabits} />
        ))
      )}

      {isFormOpen && (
        <div className="fixed inset-0 bg-purple-900/20 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <HabitForm onClose={() => setIsFormOpen(false)} onSave={refreshHabits} />
        </div>
      )}

      <div className="fixed bottom-8 left-0 right-0 px-6 max-w-2xl mx-auto">
        <button 
          data-testid="create-habit-button"
          onClick={() => setIsFormOpen(true)}
          className="w-full bg-purple-900 text-white p-5 rounded-3xl font-black text-xl shadow-2xl hover:scale-[1.02] active:scale-95 transition-all"
        >
          + Add New Habit
        </button>
      </div>
    </div>
  );
}