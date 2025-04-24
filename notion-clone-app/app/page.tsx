'use client';

import { ArrowLeftCircle, MoonIcon, SunIcon } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';

export default function Home() {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const storedMode = localStorage.getItem('darkMode');
    if (storedMode === 'true') {
      setDarkMode(true);
      document.body.classList.add('dark-theme');
    }
  }, []);

  const toggleTheme = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    localStorage.setItem('darkMode', newMode.toString());

    if (newMode) {
      document.body.classList.add('dark-theme');
    } else {
      document.body.classList.remove('dark-theme');
    }
  };

  return (
    <main className='flex space-x-4 items-center'>
      <ArrowLeftCircle className='w-12 h-12' />
      <h1 className='font-bold'>Get Started with Creating a New Document</h1>

      <Button
        variant='outline'
        onClick={toggleTheme}
        className='ml-auto'
        style={{
          backgroundColor: 'var(--input)',
          color: 'var(--foreground)',
          borderColor: 'var(--border)',
        }}
      >
        {darkMode ? <SunIcon className='w-4 h-4' /> : <MoonIcon className='w-4 h-4' />}
      </Button>
    </main>
  );
}
