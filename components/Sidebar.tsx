
import React from 'react';
import { ICONS } from '../constants';
import type { Page } from '../types';

interface SidebarProps {
  currentPage: Page;
  setCurrentPage: (page: Page) => void;
}

const NavItem: React.FC<{
  icon: React.ReactNode;
  label: Page;
  isActive: boolean;
  onClick: () => void;
}> = ({ icon, label, isActive, onClick }) => (
  <li>
    <a
      href="#"
      onClick={(e) => {
        e.preventDefault();
        onClick();
      }}
      className={`flex items-center p-3 rounded-lg transition-colors duration-200 ${
        isActive
          ? 'bg-primary text-primary-foreground'
          : 'hover:bg-primary/10 text-gray-500 dark:text-gray-400'
      }`}
    >
      {icon}
      <span className="ml-3 font-medium">{label}</span>
    </a>
  </li>
);

export const Sidebar: React.FC<SidebarProps> = ({ currentPage, setCurrentPage }) => {
  const navItems: { label: Page; icon: React.ReactNode }[] = [
    { label: 'Dashboard', icon: ICONS.dashboard },
    { label: 'Students', icon: ICONS.students },
    { label: 'Workouts', icon: ICONS.workouts },
    { label: 'Diet Plans', icon: ICONS.diet },
    { label: 'Messages', icon: ICONS.messages },
  ];

  return (
    <aside className="w-64 bg-light-card dark:bg-dark-card p-4 flex-col justify-between hidden md:flex">
      <div>
        <div className="flex items-center mb-8 px-2">
          {ICONS.logo}
          <h1 className="text-xl font-bold ml-2 text-light-text dark:text-dark-text">FitTrack Pro</h1>
        </div>
        <nav>
          <ul className="space-y-2">
            {navItems.map((item) => (
              <NavItem
                key={item.label}
                icon={item.icon}
                label={item.label}
                isActive={currentPage === item.label}
                onClick={() => setCurrentPage(item.label)}
              />
            ))}
          </ul>
        </nav>
      </div>
      <div>
        <NavItem
          icon={ICONS.settings}
          label="Settings"
          isActive={currentPage === 'Settings'}
          onClick={() => setCurrentPage('Settings')}
        />
      </div>
    </aside>
  );
};
