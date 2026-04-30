'use client';

import { Habit } from '../../types/habit';
import { getHabitSlug } from '../../lib/slug';
import { calculateCurrentStreak } from '../../lib/streaks';
import { toggleHabitCompletion } from '../../lib/habits';

export default function HabitCard({ habit, onUpdate }: { habit: Habit; onUpdate: () => void }) {
  const slug = getHabitSlug(habit.name);
  const streak = calculateCurrentStreak(habit.completions);
  const today = new Date().toISOString().split('T')[0];
  const isCompleted = habit.completions.includes(today);

  const handleToggle = () => {
    const updatedHabit = toggleHabitCompletion(habit, today);
    const allHabits = JSON.parse(localStorage.getItem('habit-tracker-habits') || '[]');
    const newHabits = allHabits.map((h: Habit) => (h.id === habit.id ? updatedHabit : h));
    localStorage.setItem('habit-tracker-habits', JSON.stringify(newHabits));
    onUpdate();
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this habit?')) {
      const allHabits = JSON.parse(localStorage.getItem('habit-tracker-habits') || '[]');
      const newHabits = allHabits.filter((h: Habit) => h.id !== habit.id);
      localStorage.setItem('habit-tracker-habits', JSON.stringify(newHabits));
      onUpdate();
    }
  };

  return (
    <div 
      data-testid={`habit-card-${slug}`}
      className="bg-white p-6 rounded-3xl border border-purple-100 shadow-sm flex items-center justify-between transition-all hover:shadow-md"
    >
      <div className="flex-1">
        <h3 className="text-lg font-black text-purple-950 leading-tight">{habit.name}</h3>
        <div className="flex items-center space-x-3 mt-1">
          <span 
            data-testid={`habit-streak-${slug}`}
            className="text-xs font-bold bg-purple-100 text-purple-700 px-2 py-0.5 rounded-lg"
          >
            🔥 {streak} Day Streak
          </span>
          <button 
            data-testid={`habit-delete-${slug}`}
            onClick={handleDelete}
            className="text-xs font-bold text-red-400 hover:text-red-600"
          >
            Delete
          </button>
        </div>
      </div>

      <button
        data-testid={`habit-complete-${slug}`}
        onClick={handleToggle}
        className={`px-4 h-12 rounded-2xl flex items-center justify-center transition-all font-bold text-sm ${
          isCompleted 
          ? 'bg-purple-600 text-white shadow-lg shadow-purple-200' 
          : 'bg-purple-50 text-purple-600 border-2 border-purple-100'
        }`}
      >
        {isCompleted ? 'Completed' : 'Mark Done'}
      </button>
    </div>
  );
}