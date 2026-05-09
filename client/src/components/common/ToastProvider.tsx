import { Toaster } from 'react-hot-toast';

export const ToastProvider = () => {
  return (
    <Toaster
      position="top-right"
      reverseOrder={false}
      gutter={8}
      toastOptions={{
        duration: 5000,
        style: {
          background: 'var(--bg-color)',
          color: 'var(--text-color)',
          border: '1px solid var(--border-color)',
        },
        success: {
          duration: 3000,
          iconTheme: {
            primary: 'green',
            secondary: 'white',
          },
        },
        error: {
          duration: 3000,
          iconTheme: {
            primary: 'red',
            secondary: 'white',
          },
        },
      }}
    />
  );
};
