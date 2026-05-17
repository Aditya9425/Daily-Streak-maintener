import { createContext, useContext, useState, useEffect } from 'react';

const SettingsContext = createContext({});

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};

export const SettingsProvider = ({ children }) => {
  // Appearance
  const [theme, setTheme] = useState(() => localStorage.getItem('streakwise_theme') || 'System');

  // Notifications
  const [notifications, setNotifications] = useState(() => {
    const saved = localStorage.getItem('streakwise_notifications');
    return saved ? JSON.parse(saved) : {
      dailyReminder: true,
      streakWarning: true,
      eveningReminder: false,
      reminderTime: '08:00',
    };
  });

  // Productivity
  const [productivity, setProductivity] = useState(() => {
    const saved = localStorage.getItem('streakwise_productivity');
    return saved ? JSON.parse(saved) : {
      focusMode: false,
      dayResetTime: '12:00 AM',
    };
  });

  useEffect(() => {
    localStorage.setItem('streakwise_theme', theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('streakwise_notifications', JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem('streakwise_productivity', JSON.stringify(productivity));
  }, [productivity]);

  const updateNotifications = (updates) => {
    setNotifications(prev => ({ ...prev, ...updates }));
  };

  const updateProductivity = (updates) => {
    setProductivity(prev => ({ ...prev, ...updates }));
  };

  return (
    <SettingsContext.Provider 
      value={{ 
        theme, 
        setTheme,
        notifications,
        updateNotifications,
        productivity,
        updateProductivity
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};
