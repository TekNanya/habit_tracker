import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor, cleanup } from '@testing-library/react';
import SignupForm from '../../src/components/auth/SignupForm';
import LoginForm from '../../src/components/auth/LoginForm';

const mockPush = vi.fn();
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

describe('auth flow', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  afterEach(() => {
    cleanup(); // This is the crucial line to fix "Found multiple elements"
  });

  it('submits the signup form and creates a session', async () => {
    render(<SignupForm />);
    
    fireEvent.change(screen.getByTestId('auth-signup-email'), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByTestId('auth-signup-password'), { target: { value: 'password123' } });
    fireEvent.click(screen.getByTestId('auth-signup-submit'));

    await waitFor(() => {
      const session = JSON.parse(localStorage.getItem('habit-tracker-session') || 'null');
      expect(session.email).toBe('test@example.com');
      expect(mockPush).toHaveBeenCalledWith('/dashboard');
    });
  });

  it('shows an error for duplicate signup email', async () => {
    const existingUser = [{ email: 'test@example.com', password: '123' }];
    localStorage.setItem('habit-tracker-users', JSON.stringify(existingUser));
    
    render(<SignupForm />);
    
    fireEvent.change(screen.getByTestId('auth-signup-email'), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByTestId('auth-signup-password'), { target: { value: 'password' } });
    fireEvent.click(screen.getByTestId('auth-signup-submit'));

    expect(await screen.findByText('User already exists')).toBeDefined();
  });

  it('submits the login form and stores the active session', async () => {
    const user = [{ email: 'user@test.com', password: 'password', id: '1' }];
    localStorage.setItem('habit-tracker-users', JSON.stringify(user));
    
    render(<LoginForm />);
    
    fireEvent.change(screen.getByTestId('auth-login-email'), { target: { value: 'user@test.com' } });
    fireEvent.change(screen.getByTestId('auth-login-password'), { target: { value: 'password' } });
    fireEvent.click(screen.getByTestId('auth-login-submit'));

    await waitFor(() => {
      const session = JSON.parse(localStorage.getItem('habit-tracker-session') || 'null');
      expect(session.userId).toBe('1');
    });
  });

  it('shows an error for invalid login credentials', async () => {
    render(<LoginForm />);
    
    fireEvent.change(screen.getByTestId('auth-login-email'), { target: { value: 'wrong@test.com' } });
    fireEvent.change(screen.getByTestId('auth-login-password'), { target: { value: 'wrong' } });
    fireEvent.click(screen.getByTestId('auth-login-submit'));

    expect(await screen.findByText('Invalid email or password')).toBeDefined();
  });
});