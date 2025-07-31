import React from 'react';
import { BarChart3, Users, MessageSquare, Settings, Moon, Sun } from 'lucide-react';
import { translations } from '../data';
import Toggle from './Toggle';

const Sidebar = ({ activeMenu, setActiveMenu, language, darkMode, setDarkMode }) => {
  const t = translations[language];

  const menuItems = [
    { id: 'dashboard', label: t.dashboard, icon: BarChart3 },
    { id: 'userManagement', label: t.userManagement, icon: Users },
    { id: 'chats', label: t.activeChats, icon: MessageSquare },
    { id: 'settings', label: t.settings, icon: Settings }
  ];

  return (
    <aside className="w-72 bg-sidebar-bg dark:bg-cool-gray-900 border-r border-gray-200/50 dark:border-gray-800 h-full transition-colors duration-300 flex flex-col">
      <div className="p-6">
        {/* Can add a logo here */}
      </div>
      <nav className="px-6 flex-1">
        <ul className="space-y-3">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeMenu === item.id;
            return (
              <li key={item.id}>
                <button
                  onClick={() => setActiveMenu(item.id)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 transform hover:scale-105 ${
                    isActive
                      ? 'bg-sky-600 text-white shadow-lg'
                      : 'text-cool-gray-600 dark:text-gray-400 hover:bg-white/50 dark:hover:bg-cool-gray-700/50 hover:text-cool-gray-800 dark:hover:text-white'
                  }`}
                >
                  <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-cool-gray-500'}`} />
                  <span className={`font-medium ${isActive ? 'font-semibold' : ''}`}>{item.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Dark Mode Toggle at Bottom */}
      <div className="p-6 border-t border-black/10 dark:border-gray-800">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {darkMode ? (
              <Moon className="w-5 h-5 text-cool-gray-600 dark:text-gray-400" />
            ) : (
              <Sun className="w-5 h-5 text-cool-gray-600 dark:text-gray-400" />
            )}
            <span className="text-sm font-medium text-cool-gray-700 dark:text-gray-300">
              {t.darkMode}
            </span>
          </div>
          <Toggle
            enabled={darkMode}
            onChange={setDarkMode}
          />
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;