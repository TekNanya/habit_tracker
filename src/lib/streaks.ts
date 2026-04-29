export function calculateCurrentStreak(completions: string[], today?: string): number {
  const now = today || new Date().toISOString().split('T')[0];
  const sortedCompletions = Array.from(new Set(completions)).sort((a, b) => 
    new Date(b).getTime() - new Date(a).getTime()
  );

  if (!sortedCompletions.includes(now)) return 0;

  let streak = 0;
  let checkDate = new Date(now);

  for (const dateStr of sortedCompletions) {
    const d = new Date(dateStr);
    if (d.toISOString().split('T')[0] === checkDate.toISOString().split('T')[0]) {
      streak++;
      checkDate.setDate(checkDate.getDate() - 1);
    } else if (new Date(dateStr) < checkDate) {
      break;
    }
  }
  return streak;
}