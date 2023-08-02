import './App.css';
import { TodoWrapper } from './components/TodoWrapper';
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';
import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';

function App() {

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLogin, setShowLogin] = useState(false);

  useEffect(() => {
    // Check if a token exists in the cookie
    const token = Cookies.get('jwtToken');
    if (token) {
      setIsLoggedIn(true);
    } else {
      setShowLogin(true);
    }
  }, []);

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
    setShowLogin(false);
  };

  const handleRegisterSuccess = () => {
    setShowLogin(true);
  };


  const handleLoginFailure = () => {
    setShowLogin(false);
  };

  const handleLogout = () => {
    Cookies.remove('jwtToken');
    setIsLoggedIn(false);
    setShowLogin(true);
  };

  return (
    <div className="App">
      <div className="Logout">
        {isLoggedIn ? (
        <button onClick={handleLogout}>Logout</button>
        ):<h1>Welcome to Todo DApp</h1>}
        
      </div>
     {isLoggedIn ? (
        <TodoWrapper />
      ) : showLogin ? (
        <LoginForm onLoginSuccess={handleLoginSuccess} onLoginFailure={handleLoginFailure} />
      ) : (
        <RegisterForm onRegisterSuccess={handleRegisterSuccess} />
      )}
    </div>
  );
}

export default App;
