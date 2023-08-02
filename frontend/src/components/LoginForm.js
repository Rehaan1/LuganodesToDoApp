import React, { useState } from 'react';
import Cookies from 'js-cookie';
import Web3 from 'web3';

const LoginForm = ({ onLoginSuccess, onLoginFailure }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [walletAddress, setWalletAddress] = useState("");
  const [metaMaskBrowser, setMetaMaskBrowser] = useState(true)

  // For MetaMask
  const detectCurrentProvider = () =>{
    let provider;
    if(window.ethereum)
    {
      provider = window.ethereum;
    } 
    else if(window.web3)
    {
      provider = window.web3.currentProvider;
    }
    else
    {
      console.log("Non-ethereum browser detected. Install MetaMask")
    }

    return provider;
  };


  const onConnect = async() =>{
    try{
      const currentProvider = detectCurrentProvider();

      if(currentProvider)
      {
        await currentProvider.request({method: 'eth_requestAccounts'});
        const web3 = new Web3(currentProvider);
        const userAccount = await web3.eth.requestAccounts();
        const walletAddress = userAccount[0];
        setWalletAddress(walletAddress);
        handleMetaMaskLogin();
      }
      else
      {
        setMetaMaskBrowser(false)
      }
    }
    catch(err)
    {
      console.log(err);
    }
  }

  const handleMetaMaskLogin = async ()=>{

    const endpoint = "/api/auth/auth/metaMask/login";
    const baseUrl = window.location.protocol + "//" + window.location.hostname;


    try {
      const response = await fetch(baseUrl+endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ wallet_address: walletAddress }),
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
  }



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
    
    <div>
        <div>
        {
            metaMaskBrowser ? (
            <div>
                <button className="metaMaskLogin" onClick={onConnect}>
                    Metamask Login
                </button>
            </div>
            ):(<h1>Install MetaMask</h1>)
        }

        </div>
        <div>
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
        </div>
    </div>
  );
};

export default LoginForm;
