import React, { useState } from 'react';
import Cookies from 'js-cookie';
import Web3 from 'web3';

const LoginForm = ({ onLoginSuccess, onLoginFailure }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [walletAddress, setWalletAddress] = useState("");
  const [metaMaskBrowser, setMetaMaskBrowser] = useState(true)

  const [forgotPasswordMode, setForgotPasswordMode] = useState(false);
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState('');


  const toggleForgotPasswordMode = () => {
    setForgotPasswordMode(!forgotPasswordMode);
  };


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
        const walletAddressAcc = userAccount[0];
        setWalletAddress(walletAddressAcc);
        handleMetaMaskLogin(walletAddressAcc);
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

  const handleMetaMaskLogin = async (wallet)=>{

    const endpoint = "/api/auth/auth/metaMask/login";
    const baseUrl = window.location.protocol + "//" + window.location.hostname;


    try {
      const response = await fetch(baseUrl+endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ wallet_address: wallet }),
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


  const handleForgotPasswordSubmit = async (e) => {
    e.preventDefault();

    const endpoint = "/api/auth/auth/recover-password";
    const baseUrl = window.location.protocol + "//" + window.location.hostname

    try {
      const response = await fetch(baseUrl + endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: forgotPasswordEmail }),
      })

      if(response.status == 200)
      {
        window.alert("Password Recovery Email Sent");
        toggleForgotPasswordMode()
      }
      else
      {
        console.log("Password Recovery Failed")
        window.alert("Password Recovery Failed")
        toggleForgotPasswordMode()
      }

    } catch (error) {
      console.error('Error occurred while requesting password reset:', error)
      window.alert("Password Recovery Failed")
      toggleForgotPasswordMode()
    }
  }

  return (
    
    <div className="LoginForm">
        <div>
        {
            metaMaskBrowser ? (
            <div>
                <button className="metaMaskLogin" onClick={onConnect}>
                    Metamask Login
                </button>
            </div>
            ):(<h1 className="install-metaMask">Install MetaMask</h1>)
        }

        </div>
        <div>
        {forgotPasswordMode ? (
          <form onSubmit={handleForgotPasswordSubmit}>
            <div className="form-group">
              <label>Enter your email:</label>
              <input
                type="email"
                value={forgotPasswordEmail}
                onChange={(e) => setForgotPasswordEmail(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="forgot-password-button">
              Send Reset Email
            </button>
          </form>
        ) : (
          <form onSubmit={handleFormSubmit}>
            <div className="form-group">
              <label>Email:</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Password:</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <button type="submit" className="login-button">
              Login
            </button>
            <button type="button" className="forgot-password-button" onClick={toggleForgotPasswordMode}>
              Forgot Password?
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default LoginForm;
