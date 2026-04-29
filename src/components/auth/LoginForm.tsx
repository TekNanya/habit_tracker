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

    localStorage.setItem('habit-tracker-session', JSON.stringify({ userId: user.id, email: user.email }));
    router.push('/dashboard');
  };

  return (
    <div className="w-full max-w-md px-6 py-12 bg-white/70 backdrop-blur-xl border border-purple-100 rounded-[2.5rem] shadow-2xl shadow-purple-100">
      <h2 className="text-4xl font-black text-purple-950 mb-2 tracking-tight">Welcome.</h2>
      <p className="text-purple-600 mb-8 font-medium">Log in to keep the flame alive.</p>
      
      <form onSubmit={handleLogin} className="space-y-5">
        {error && <p className="text-red-500 text-sm font-bold bg-red-50 p-3 rounded-xl">{error}</p>}
        <div>
          <label className="block text-xs font-bold text-purple-900 uppercase tracking-widest mb-2 ml-1">Email</label>
          <input
            type="email" required data-testid="auth-login-email"
            className="w-full p-4 rounded-2xl bg-white border border-purple-50 outline-none focus:ring-4 focus:ring-purple-100 transition-all"
            value={email} onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-purple-900 uppercase tracking-widest mb-2 ml-1">Password</label>
          <input
            type="password" required data-testid="auth-login-password"
            className="w-full p-4 rounded-2xl bg-white border border-purple-50 outline-none focus:ring-4 focus:ring-purple-100 transition-all"
            value={password} onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button
          type="submit" data-testid="auth-login-submit"
          className="w-full bg-purple-700 text-white p-5 rounded-2xl font-black text-lg hover:bg-purple-800 active:scale-[0.98] transition-all shadow-xl shadow-purple-200"
        >
          Sign In
        </button>
      </form>
      <div className="mt-8 text-center text-purple-800 font-medium">
        Don't have an account? <Link href="/signup" className="text-purple-600 font-black hover:underline">Sign Up</Link>
      </div>
    </div>
  );
}