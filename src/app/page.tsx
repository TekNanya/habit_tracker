'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import SplashScreen from '../components/shared/SplashScreen';

export default function Home() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      const session = localStorage.getItem('habit-tracker-session');
      if (session) {
        router.push('/dashboard');
      } else {
        router.push('/login');
      }
      setLoading(false);
    }, 1200);

    return () => clearTimeout(timer);
  }, [router]);

  return <SplashScreen />;
}