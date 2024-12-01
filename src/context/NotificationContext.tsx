import type { ReactNode} from 'react';

import React, { useMemo, useState, useContext, useCallback, createContext } from 'react';

type NotificationType = 'success' | 'error' | 'info' | 'warning';

export interface Notification {
  id: number;
  message: string;
  type: NotificationType;
}

interface NotificationContextType {
  notifications: Notification[];
  addNotification: (message: string, type: NotificationType) => void;
  removeNotification: (id: number) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const removeNotification = useCallback((id: number) => {
    setNotifications((prev) => prev.filter((notification) => notification.id !== id));
  }, []);

  const addNotification = useCallback((message: string, type: NotificationType) => {
    const id = Date.now(); // ID único baseado no timestamp
    setNotifications((prev) => [...prev, { id, message, type }]);
    // Remove automaticamente após 5 segundos
    setTimeout(() => removeNotification(id), 5000);
  }, [removeNotification]);

  const memorizedValue = useMemo(
    () => ({notifications, addNotification, removeNotification}),
    [notifications, addNotification, removeNotification]
  );

  return (
    <NotificationContext.Provider value={memorizedValue}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotification = (): NotificationContextType => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification deve ser usado dentro de um NotificationProvider');
  }
  return context;
};
