import { describe, it, expect } from 'vitest';
import { toggleHabitCompletion } from '../../src/lib/habits';
import { Habit } from '../../src/types/habit';

describe('toggleHabitCompletion', () => {
  const mockHabit: Habit = {
    id: '1',
    userId: 'u1',
    name: 'Test',
    description: '',
    frequency: 'daily',
    createdAt: '2024-01-01',
    completions: ['2024-01-01']
  };

  it('adds a completion date when the date is not present', () => {
    const result = toggleHabitCompletion(mockHabit, '2024-01-02');
    expect(result.completions).toContain('2024-01-02');
  });

  it('removes a completion date when the date already exists', () => {
    const result = toggleHabitCompletion(mockHabit, '2024-01-01');
    expect(result.completions).not.toContain('2024-01-01');
  });

  it('does not mutate the original habit object', () => {
    const originalCompletions = [...mockHabit.completions];
    toggleHabitCompletion(mockHabit, '2024-01-02');
    expect(mockHabit.completions).toEqual(originalCompletions);
  });

  it('does not return duplicate completion dates', () => {
    const result = toggleHabitCompletion(mockHabit, '2024-01-02');
    const final = toggleHabitCompletion(result, '2024-01-02');
    expect(final.completions.filter(d => d === '2024-01-02').length).toBe(0);
  });
});