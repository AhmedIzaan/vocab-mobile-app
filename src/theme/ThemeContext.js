import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { themes } from './theme';

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [mode, setMode] = useState('paper');

  useEffect(() => {
    AsyncStorage.getItem('vocab:theme').then(saved => {
      if (saved === 'paper' || saved === 'dusk') setMode(saved);
    });
  }, []);

  const toggleTheme = () => {
    const next = mode === 'paper' ? 'dusk' : 'paper';
    setMode(next);
    AsyncStorage.setItem('vocab:theme', next);
  };

  const setTheme = (key) => {
    if (key === 'paper' || key === 'dusk') {
      setMode(key);
      AsyncStorage.setItem('vocab:theme', key);
    }
  };

  return (
    <ThemeContext.Provider value={{ theme: themes[mode], mode, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
