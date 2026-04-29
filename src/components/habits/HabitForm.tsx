'use client';

import { useState } from 'react';
import { validateHabitName } from '../../lib/validators';

type HabitFormProps = {
  onSave: (habit: { name: string; description: string }) => void;
  onCancel: () => void;
  initialData?: { name: string; description: string };
};

export default function HabitForm({ onSave, onCancel, initialData }: HabitFormProps) {
  const [name, setName] = useState(initialData?.name || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validation = validateHabitName(name);
    
    if (!validation.valid) {
      setError(validation.error);
      return;
    }

    onSave({ name: validation.value, description });
  };

  return (
    <form onSubmit={handleSubmit} data-testid="habit-form" className="p-4 border rounded bg-white space-y-4">
      <div>
        <label className="block text-sm font-medium">Habit Name</label>
        <input
          data-testid="habit-name-input"
          className="w-full border p-2 rounded"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            setError(null);
          }}
        />
        {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
      </div>
      <div>
        <label className="block text-sm font-medium">Description</label>
        <textarea
          data-testid="habit-description-input"
          className="w-full border p-2 rounded"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>
      <div>
        <label className="block text-sm font-medium">Frequency</label>
        <select data-testid="habit-frequency-select" className="w-full border p-2 rounded" disabled>
          <option value="daily">daily</option>
        </select>
      </div>
      <div className="flex gap-2">
        <button
          type="submit"
          data-testid="habit-save-button"
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          Save Habit
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="bg-gray-300 px-4 py-2 rounded"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}