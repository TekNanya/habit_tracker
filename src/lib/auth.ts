import { User, Session } from '../types/auth';

export function createSession(user: User): void {
  const session: Session = {
    userId: user.id,
    email: user.email,
  };
  localStorage.setItem('habit-tracker-session', JSON.stringify(session));
}

export function clearSession(): void {
  localStorage.removeItem('habit-tracker-session');
}

export function getActiveSession(): Session | null {
  const data = localStorage.getItem('habit-tracker-session');
  return data ? JSON.parse(data) : null;
}