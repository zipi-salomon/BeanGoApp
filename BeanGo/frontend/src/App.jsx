
import { useEffect, useState } from 'react';
import './App.css';
import './styles/MainContent.css';
import Header from './components/Header.jsx';
import { Outlet } from 'react-router-dom';
import { UserProvider } from './context/UserContext.jsx';

function App() {
  const [error, setError] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
    }
  }, []);

  return (
    <UserProvider> 
      <div className="app-container">
        <Header />
        <div className="main-content">
          <Outlet />
        </div>
      </div>
    </UserProvider>
  );
}

export default App;
