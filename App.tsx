import React, { useState, useEffect } from 'react';
import Home from './pages/Home';
import AdminDashboard from './components/AdminDashboard';

const App: React.FC = () => {
  const [currentPath, setCurrentPath] = useState(window.location.pathname);

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Simple Router Logic based on Pathname
  // Matches '/admin' or '/admin/'
  const isAdmin = currentPath.replace(/\/$/, '') === '/admin';

  if (isAdmin) {
    return <AdminDashboard />;
  }

  return <Home />;
};

export default App;