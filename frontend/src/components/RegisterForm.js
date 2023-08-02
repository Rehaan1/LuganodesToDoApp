
import React, { useState } from 'react';

const RegisterForm = ({ onRegisterSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [address, setAddress] = useState('')
  const [walletAddress, setWalletAddress] = useState('')

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    const endpoint = "/api/auth/auth/email/register";
    const baseUrl = window.location.protocol + "//" + window.location.hostname;


    try {
      const response = await fetch(baseUrl+endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: email, password: password, first_name:firstName, last_name:lastName, address: address, wallet_address: walletAddress }),
      });

      if (response.status === 200) {
        onRegisterSuccess(); // Notify App.js about successful registration
      } else {
        console.log('Registration failed. Please try again.');
      }
    } catch (error) {
      console.error('Error occurred during registration:', error);
    }
  };

  return (
    <div className="RegisterForm">
      <h2>Register</h2>
      <form onSubmit={handleFormSubmit}>
      <div  className="form-group">
        <label>Email:</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        required />
      </div>
      <div  className="form-group">
        <label>Password:</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        required />
      </div>
      <div  className="form-group">
        <label>First Name:</label>
        <input
          type="text"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
        required />
      </div>
      <div  className="form-group">
        <label>Last Name:</label>
        <input
          type="text"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
        required />
      </div>
      <div  className="form-group">
        <label>Address:</label>
        <input
          type="text"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        required />
      </div>
      <div  className="form-group">
        <label>Wallet Address:</label>
        <input
          type="text"
          value={walletAddress}
          onChange={(e) => setWalletAddress(e.target.value)}
         />
      </div>
      <button type="submit">Register</button>
    </form>
    </div>
    
  );
};

export default RegisterForm;
