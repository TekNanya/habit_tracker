/* MENTOR_TRACE_STAGE3_HABIT_A91 */
export function calculateCurrentStreak(completions: string[], today?: string): number {
  const now = today || new Date().toISOString().split('T')[0];
  const uniqueDates = Array.from(new Set(completions)).sort((a, b) => b.localeCompare(a));
  
  if (!uniqueDates.includes(now)) return 0;

  let streak = 0;
  let currentDate = new Date(now);

  while (true) {
    const dateStr = currentDate.toISOString().split('T')[0];
    if (uniqueDates.includes(dateStr)) {
      streak++;
      currentDate.setDate(currentDate.getDate() - 1);
    } else {
      break;
    }
  }

  return streak;
}