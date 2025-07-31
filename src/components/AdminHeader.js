import React from 'react';
import { Bot, User, Globe } from 'lucide-react';
import { translations } from '../data';

const AdminHeader = ({ language, setLanguage }) => {
  const t = translations[language];

  return (
    <header className="w-full bg-white dark:bg-cool-gray-800 shadow-md border-b border-gray-200 dark:border-cool-gray-700 px-6 py-4 transition-colors duration-200">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="p-2 bg-sky-600 rounded-lg shadow-lg">
            <Bot className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-xl font-bold text-gray-800 dark:text-white tracking-wide">
            MALAYSIA <span className="text-sky-500">HIGHPASS</span> Admin
          </h1>
        </div>

        <div className="flex items-center space-x-6">
          {/* Language Control */}
          <div className="relative flex items-center">
            <Globe className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-cool-gray-400" />
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="pl-9 pr-4 py-2 text-sm bg-gray-100 dark:bg-cool-gray-700 border border-gray-200 dark:border-cool-gray-600 rounded-md focus:ring-2 focus:ring-sky-500 cursor-pointer text-gray-700 dark:text-white appearance-none"
            >
              <option value="ko">한국어</option>
              <option value="en">English</option>
              <option value="ms">Bahasa Malaysia</option>
            </select>
          </div>

          {/* System Status */}
          <div className="flex items-center space-x-2">
            <div className="relative">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <div className="absolute inset-0 w-3 h-3 bg-green-500 rounded-full animate-ping opacity-75"></div>
            </div>
            <span className="text-sm font-medium text-green-600 dark:text-green-400">{t.systemOnline}</span>
          </div>

          {/* User Profile */}
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 bg-cool-gray-200 dark:bg-cool-gray-700 rounded-full flex items-center justify-center ring-2 ring-white dark:ring-cool-gray-800">
              <User className="w-5 h-5 text-cool-gray-600 dark:text-cool-gray-300" />
            </div>
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{t.admin}</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;