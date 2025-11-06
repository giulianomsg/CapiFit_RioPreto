import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { Dashboard } from './components/Dashboard';
import { Students } from './components/Students';
import type { Page } from './types';
import { ThemeContext } from './components/ThemeContext';

const App: React.FC = () => {
  const [theme, setTheme] = useState('dark');
  const [currentPage, setCurrentPage] = useState<Page>('Dashboard');

  useEffect(() => {
    const root = document.documentElement;
    const oldTheme = theme === 'light' ? 'dark' : 'light';
    root.classList.remove(oldTheme);
    root.classList.add(theme);
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  }, []);

  const themeContextValue = useMemo(() => ({ theme, toggleTheme }), [theme, toggleTheme]);
  
  const renderContent = () => {
    switch (currentPage) {
      case 'Dashboard':
        return <Dashboard />;
      case 'Students':
        return <Students />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <ThemeContext.Provider value={themeContextValue}>
      <div className="dark:bg-dark-bg bg-light-bg min-h-screen flex text-light-text dark:text-dark-text">
        <Sidebar currentPage={currentPage} setCurrentPage={setCurrentPage} />
        <div className="flex-1 flex flex-col">
          <Header currentPage={currentPage} />
          <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
            {renderContent()}
          </main>
        </div>
      </div>
    </ThemeContext.Provider>
  );
};

export default App;