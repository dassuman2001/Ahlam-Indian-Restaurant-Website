import React, { useState, useEffect } from 'react';
import Home from './pages/Home';
import AdminDashboard from './components/AdminDashboard';

const App: React.FC = () => {
  const [currentPath, setCurrentPath] = useState(window.location.pathname);
  const [currentHash, setCurrentHash] = useState(window.location.hash);

  useEffect(() => {
    const handleNavigation = () => {
      setCurrentPath(window.location.pathname);
      setCurrentHash(window.location.hash);
    };

    window.addEventListener('popstate', handleNavigation);
    window.addEventListener('hashchange', handleNavigation);
    
    return () => {
      window.removeEventListener('popstate', handleNavigation);
      window.removeEventListener('hashchange', handleNavigation);
    };
  }, []);

  // Router Logic
  // Support Clean URL: /admin
  // Support Hash URL: /#/admin (Common in static deployments or bookmarks)
  const isAdmin = 
    currentPath.replace(/\/$/, '') === '/admin' || 
    currentHash.includes('/admin');

  if (isAdmin) {
    return <AdminDashboard />;
  }

  return <Home />;
};

export default App;