import React, { useState, useEffect } from 'react';
import { mockChats } from './data';
import AdminHeader from './components/AdminHeader';
import Sidebar from './components/Sidebar';
import ChatList from './components/ChatList';
import ChatRoom from './components/ChatRoom';
import UserDetails from './components/UserDetails';
import Dashboard from './components/Dashboard';
import UserManagement from './components/UserManagement';


// Custom Hooks
const useLocalStorage = (key, initialValue) => {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      return initialValue;
    }
  });

  const setValue = (value) => {
    try {
      setStoredValue(value);
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(error);
    }
  };

  return [storedValue, setValue];
};

const App = () => {
  const [darkMode, setDarkMode] = useLocalStorage('darkMode', false);
  const [language, setLanguage] = useLocalStorage('language', 'ko');
  const [activeMenu, setActiveMenu] = useState('dashboard');
  const [selectedChat, setSelectedChat] = useState(mockChats[0]);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const renderContent = () => {
    switch (activeMenu) {
      case 'dashboard':
        return <Dashboard language={language} darkMode={darkMode} />;
      case 'userManagement':
        return <UserManagement language={language} darkMode={darkMode} />;
      case 'chats':
        return (
          <>
            <ChatList
              chats={mockChats}
              selectedChat={selectedChat}
              setSelectedChat={setSelectedChat}
              language={language}
            />
            <ChatRoom chat={selectedChat} language={language} />
            <UserDetails user={selectedChat} language={language} />
          </>
        );
      case 'settings':
        return <div className="flex-1 p-6 bg-gray-50 dark:bg-gray-900"><h1 className="text-2xl font-bold text-gray-800 dark:text-white">Settings</h1></div>;
      default:
        return <Dashboard language={language} darkMode={darkMode} />;
    }
  };

  return (
    <div className={`h-screen w-full flex flex-col font-sans transition-colors duration-200 ${darkMode ? 'dark' : ''}`}>
      <AdminHeader language={language} setLanguage={setLanguage} />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar
          activeMenu={activeMenu}
          setActiveMenu={setActiveMenu}
          language={language}
          darkMode={darkMode}
          setDarkMode={setDarkMode}
        />
        <main className="flex flex-1 bg-white dark:bg-gray-800">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default App;