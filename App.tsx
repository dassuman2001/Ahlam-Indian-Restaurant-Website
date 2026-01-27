import React, { useState, useEffect } from 'react';
import Home from './pages/Home';
import AdminDashboard from './components/AdminDashboard';

const App: React.FC = () => {
  const [route, setRoute] = useState(window.location.hash);

  useEffect(() => {
    const handleHashChange = () => {
      setRoute(window.location.hash);
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Simple Router Logic
  if (route === '#/admin') {
    return <AdminDashboard />;
  }

  return <Home />;
};

export default App;