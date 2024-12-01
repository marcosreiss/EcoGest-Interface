import type { Notification} from 'src/context/NotificationContext';

import React from 'react';

import { useNotification } from 'src/context/NotificationContext';

const SnackBarComponent: React.FC = () => {
  const { notifications, removeNotification } = useNotification();

  return (
    <div style={{ position: 'fixed', top: '10px', right: '10px', zIndex: 1300 }}>
      {notifications.map(({ id, message, type }: Notification) => (
        <div
          key={id}
          style={{
            margin: '8px 0',
            padding: '10px 15px',
            borderRadius: '5px',
            color: 'white',
            backgroundColor: type === 'success' ? 'green' : type === 'error' ? 'red' : 'blue',
          }}
        >
          {message}
          <button
            type='button'
            style={{ marginLeft: '10px', background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}
            onClick={() => removeNotification(id)}
          >
            ✖
          </button>
        </div>
      ))}
    </div>
  );
};

export default SnackBarComponent;
