import React, { useContext } from 'react';
import { ThemeContext } from './ThemeContext';
import { ICONS } from '../constants';
import type { Page } from '../types';

interface HeaderProps {
  currentPage: Page;
  onLogout: () => void;
}

export const Header: React.FC<HeaderProps> = ({ currentPage, onLogout }) => {
  const { theme, toggleTheme } = useContext(ThemeContext);

  return (
    <header className="bg-light-card dark:bg-dark-card p-4 flex items-center justify-between border-b border-gray-200 dark:border-gray-700">
      <h2 className="text-2xl font-bold text-light-text dark:text-dark-text">{currentPage}</h2>
      
      <div className="flex items-center space-x-4">
        <div className="relative hidden sm:block">
          <input
            type="text"
            placeholder="Pesquisar alunos..."
            className="bg-light-bg dark:bg-dark-bg border border-gray-300 dark:border-gray-600 rounded-full py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
            {ICONS.search}
          </div>
        </div>

        <button
          onClick={toggleTheme}
          className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          aria-label="Alternar tema"
        >
          {theme === 'light' ? ICONS.moon : ICONS.sun}
        </button>

        <button className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors" aria-label="Notificações">
          {ICONS.bell}
        </button>

        <div className="flex items-center space-x-2">
          <img
            src="https://picsum.photos/seed/trainer/200/200"
            alt="Treinador"
            className="w-10 h-10 rounded-full object-cover"
          />
          <button onClick={onLogout} className="text-sm font-medium text-gray-500 hover:text-primary dark:text-gray-400 dark:hover:text-primary-light transition-colors">
            Sair
          </button>
        </div>
      </div>
    </header>
  );
};
