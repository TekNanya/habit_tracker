'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation'; // Added for proper navigation testing

export default function SignupForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter(); // Initialize router

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    
    // 1. Get existing users from correct key
    const storageKey = 'habit-tracker-users';
    const existingUsers = JSON.parse(localStorage.getItem(storageKey) || '[]');

    // 2. Check for duplicate email - TRD requires exact error message
    if (existingUsers.find((u: any) => u.email === email)) {
      setError('User already exists');
      return;
    }

    // 3. Create and save user - Ensure shape matches TRD Requirement 5
    const newUser = { 
      id: crypto.randomUUID(), 
      email, 
      password,
      createdAt: new Date().toISOString() 
    };
    const updatedUsers = [...existingUsers, newUser];
    localStorage.setItem(storageKey, JSON.stringify(updatedUsers));

    // 4. Set session for auto-login
    localStorage.setItem('habit-tracker-session', JSON.stringify({ 
      userId: newUser.id, 
      email: newUser.email 
    }));

    // 5. Redirect using router.push for test compatibility
    router.push('/dashboard');
  };

  return (
    <div className="w-full max-w-md px-4">
      <div className="glass-panel p-8 rounded-3xl bg-white/80 backdrop-blur-md shadow-xl border border-purple-100">
        <h2 className="text-3xl font-extrabold text-purple-900 tracking-tight">Start Fresh</h2>
        <p className="text-purple-600 mt-2 mb-8">Your journey to consistency begins here.</p>
        
        <form onSubmit={handleSignup} className="space-y-5">
          {/* Error display - Text matches TRD exactly */}
          {error && <p className="text-red-500 text-sm font-bold bg-red-50 p-3 rounded-xl">{error}</p>}
          
          <div>
            <label className="block text-sm font-medium text-purple-900 mb-1">Email Address</label>
            <input
              type="email"
              required
              data-testid="auth-signup-email"
              className="w-full p-4 rounded-2xl bg-white border border-purple-100 outline-none focus:ring-4 focus:ring-purple-100 transition-all"
              placeholder="future-champion@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-purple-900 mb-1">Create Password</label>
            <input
              type="password"
              required
              data-testid="auth-signup-password"
              className="w-full p-4 rounded-2xl bg-white border border-purple-100 outline-none focus:ring-4 focus:ring-purple-100 transition-all"
              placeholder="Make it strong"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button
            type="submit"
            data-testid="auth-signup-submit"
            className="w-full bg-purple-700 text-white p-5 rounded-2xl font-black text-lg hover:bg-purple-800 active:scale-[0.98] transition-all shadow-xl shadow-purple-200 !mt-8"
          >
            Create Account
          </button>
        </form>
      </div>
      
      <p className="mt-6 text-center text-sm text-purple-800">
        Already have an account?{' '}
        <Link href="/login" className="text-purple-700 hover:text-purple-900 font-semibold underline">
          Sign In Instead
        </Link>
      </p>
    </div>
  );
}