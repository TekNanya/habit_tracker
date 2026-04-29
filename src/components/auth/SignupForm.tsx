'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function SignupForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <div className="w-full max-w-md px-4">
      <div className="glass-panel p-8 rounded-3xl">
        <h2 className="text-3xl font-extrabold text-purple-900 tracking-tight">Start Fresh</h2>
        <p className="text-purple-600 mt-2 mb-8">Your journey to consistency begins here.</p>
        
        <form className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-purple-900 mb-1">Email Address</label>
            <input
              type="email"
              required
              data-testid="auth-signup-email"
              className="input-auth"
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
              className="input-auth"
              placeholder="Make it strong"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button
            type="submit"
            data-testid="auth-signup-submit"
            className="btn-auth !mt-8"
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