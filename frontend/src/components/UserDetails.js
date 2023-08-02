import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';

const UserDetail = ({onBack}) => {
  const [userDetails, setUserDetails] = useState({});
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [address, setAddress] = useState('');
  const [walletAddress, setWalletAddress] = useState('')

  useEffect(() => {
    
    const endpoint = "/api/auth/user/";
    const baseUrl = window.location.protocol + "//" + window.location.hostname;

    var token =  Cookies.get('jwtToken');

    fetch(baseUrl + endpoint, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setUserDetails(data.data);
        setFirstName(data.data.first_name);
        setLastName(data.data.last_name);
        setWalletAddress(data.data.wallet_address);
        setAddress(data.data.address);
      })
      .catch((error) => {
        console.error('Error fetching user details:', error);
      });
  }, []);

  const handleUpdate = () => {
    
    const endpoint = "/api/auth/user/update";
    const baseUrl = window.location.protocol + "//" + window.location.hostname;

    var token =  Cookies.get('jwtToken');

    fetch(baseUrl+endpoint, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ first_name: firstName, last_name:lastName, address:address }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log('User details updated successfully:', data);
        setUserDetails(data);
      })
      .catch((error) => {
        console.error('Error updating user details:', error);
      });
  };

  return (
    <div className="UserDetail">
      <button type="button" onClick={onBack}>
          Back
      </button>
      <h2>User Details</h2>
      <form>
        <div>
          <label>First Name:</label>
          <input
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
        </div>
        <div>
          <label>Last Name:</label>
          <input
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />
        </div>
        <div>
          <label>Address:</label>
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
        </div>
        <div>
          <label>Wallet Address:</label>
          <input
            type="text"
            value={walletAddress}
            readOnly
          />
        </div>
        <button type="button" onClick={handleUpdate}>
          Update
        </button>
      </form>
    </div>
  );
};

export default UserDetail;
