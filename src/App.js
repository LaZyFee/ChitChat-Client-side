import React from 'react';
import { RouterProvider } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { router } from './routes/Routes/Routes';
import VantaBackground from './Hooks/VantaBackground';
import { useThemeStore } from './Store/ThemeStore';

function App() {
  const currentEffect = useThemeStore((state) => state.currentEffect);

  return (
    <div className='max-w-[1440px] mx-auto'>
      <VantaBackground effect={currentEffect} />
      <RouterProvider router={router} />
      <Toaster />
    </div>
  );
}

export default App;