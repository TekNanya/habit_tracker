export function validateHabitName(name: string) {
  const value = name.trim();
  if (!value) {
    return { valid: false, value: '', error: 'Habit name is required' };
  }
  if (value.length > 60) {
    return { valid: false, value, error: 'Habit name must be 60 characters or fewer' };
  }
  return { valid: true, value, error: null };
}