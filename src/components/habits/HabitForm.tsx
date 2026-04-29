'use client';

import { useState } from 'react';
import { validateHabitName } from '../../lib/validators';
import { Habit } from '../../types/habit';

export default function HabitForm({ onClose, onSave, habitToEdit }: any) {
  const [name, setName] = useState(habitToEdit?.name || '');
  const [description, setDescription] = useState(habitToEdit?.description || '');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validation = validateHabitName(name);

    if (!validation.valid) {
      setError(validation.error || 'Invalid name');
      return;
    }

    const session = JSON.parse(localStorage.getItem('habit-tracker-session') || '{}');
    const allHabits = JSON.parse(localStorage.getItem('habit-tracker-habits') || '[]');

    if (habitToEdit) {
      const updated = allHabits.map((h: Habit) => 
        h.id === habitToEdit.id ? { ...h, name: validation.value, description } : h
      );
      localStorage.setItem('habit-tracker-habits', JSON.stringify(updated));
    } else {
      const newHabit: Habit = {
        id: crypto.randomUUID(),
        userId: session.userId,
        name: validation.value,
        description,
        frequency: 'daily',
        createdAt: new Date().toISOString(),
        completions: [],
      };
      localStorage.setItem('habit-tracker-habits', JSON.stringify([...allHabits, newHabit]));
    }

    onSave();
    onClose();
  };

  return (
    <form data-testid="habit-form" onSubmit={handleSubmit} className="bg-white p-8 rounded-[2rem] w-full max-w-md shadow-2xl">
      <h2 className="text-2xl font-black text-purple-950 mb-6 tracking-tight">
        {habitToEdit ? 'Edit Habit' : 'New Habit'}
      </h2>
      
      <div className="space-y-4">
        <div>
          <label className="block text-xs font-bold text-purple-900 uppercase mb-2">Name</label>
          <input
            data-testid="habit-name-input"
            className="w-full p-4 rounded-2xl bg-purple-50 outline-none focus:ring-2 focus:ring-purple-300"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          {error && <p className="text-red-500 text-xs mt-1 font-bold">{error}</p>}
        </div>
        <div>
          <label className="block text-xs font-bold text-purple-900 uppercase mb-2">Description</label>
          <textarea
            data-testid="habit-description-input"
            className="w-full p-4 rounded-2xl bg-purple-50 outline-none focus:ring-2 focus:ring-purple-300 h-24"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <select data-testid="habit-frequency-select" className="hidden" defaultValue="daily">
          <option value="daily">Daily</option>
        </select>
      </div>

      <div className="mt-8 flex space-x-3">
        <button type="button" onClick={onClose} className="flex-1 p-4 font-bold text-purple-600">Cancel</button>
        <button 
          type="submit" 
          data-testid="habit-save-button"
          className="flex-1 bg-purple-700 text-white p-4 rounded-2xl font-bold shadow-lg"
        >
          Save
        </button>
      </div>
    </form>
  );
}