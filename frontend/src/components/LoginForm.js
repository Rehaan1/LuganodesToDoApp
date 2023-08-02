import React, { useState } from 'react';
import Cookies from 'js-cookie';

const LoginForm = ({ onLoginSuccess, onLoginFailure }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    const endpoint = "/api/auth/auth/email/login";
    const baseUrl = window.location.protocol + "//" + window.location.hostname;


    try {
      const response = await fetch(baseUrl+endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: email,password: password }),
      });

      const data = await response.json();

      if (data && data.token) 
      {
        Cookies.set('jwtToken', data.token); 
        onLoginSuccess();
        console.log('Login Successful');
      } 
      else 
      {
        onLoginFailure();
        console.log('Login failed. Check your credentials.');
      }
    } catch (error) {
      console.error('Error occurred during login:', error);
    }
  };

  return (
    <form onSubmit={handleFormSubmit}>
      <div>
        <label>Email:</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <div>
        <label>Password:</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <button type="submit">Login</button>
    </form>
  );
};

export default LoginForm;
