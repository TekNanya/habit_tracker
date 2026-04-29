'use client';

import { useEffect } from 'react';
import SplashScreen from '../components/shared/SplashScreen';

export default function Home() {
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const session = localStorage.getItem('habit-tracker-session');
      
      if (session) {
        window.location.href = '/dashboard';
      } else {
        window.location.href = '/login';
      }
    }
  }, []);

  return <SplashScreen />;
}