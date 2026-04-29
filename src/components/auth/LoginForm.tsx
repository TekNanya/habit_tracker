'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const users = JSON.parse(localStorage.getItem('habit-tracker-users') || '[]');
    const user = users.find((u: any) => u.email === email && u.password === password);

    if (!user) {
      setError('Invalid email or password');
      return;
    }

    const session = { userId: user.id, email: user.email };
    localStorage.setItem('habit-tracker-session', JSON.stringify(session));
    router.push('/dashboard');
  };

  return (
    <div className="w-full max-w-md">
      <form onSubmit={handleLogin} className="space-y-4 p-6 bg-white rounded shadow">
        <h2 className="text-2xl font-bold">Login</h2>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <div>
          <label className="block text-sm font-medium">Email</label>
          <input
            type="email"
            required
            data-testid="auth-login-email"
            className="w-full border p-2 rounded"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Password</label>
          <input
            type="password"
            required
            data-testid="auth-login-password"
            className="w-full border p-2 rounded"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button
          type="submit"
          data-testid="auth-login-submit"
          className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
        >
          Login
        </button>
      </form>
      <p className="mt-4 text-center text-sm text-gray-600">
        Don't have an account?{' '}
        <Link href="/signup" className="text-blue-600 hover:underline font-medium">
          Sign Up
        </Link>
      </p>
    </div>
  );
}