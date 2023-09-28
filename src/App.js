import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
import './App.css'; 

function App() {
  const [isConnected, setIsConnected] = useState(false);
  const [ethBalance, setEthBalance] = useState('');
  const [contract, setContract] = useState(null);
  const [username, setUsername] = useState('');
  const [registrationStatus, setRegistrationStatus] = useState('');
  const [web3, setWeb3] = useState(null);

  useEffect(() => {
    initializeWeb3();
  }, []);

  const initializeWeb3 = async () => {
    try {
      // Check if MetaMask is installed and accessible
      if (window.ethereum) {
        const web3Instance = new Web3(window.ethereum);
        await window.ethereum.request({ method: 'eth_requestAccounts' }); // Use the new method

 // Request user permission to connect

        // Load your contract ABI and address here
        const contractAddress = '0x6342B3c8bc24d480240Bd2522fEE6f9f45b7EFbf';
        const contractABI = [
          {
            "constant": true,
            "inputs": [
              {
                "name": "",
                "type": "address"
              }
            ],
            "name": "users",
            "outputs": [
              {
                "name": "username",
                "type": "bytes32"
              },
              {
                "name": "exists",
                "type": "bool"
              }
            ],
            "payable": false,
            "stateMutability": "view",
            "type": "function"
          },
          {
            "constant": true,
            "inputs": [
              {
                "name": "",
                "type": "bytes32"
              }
            ],
            "name": "usernames",
            "outputs": [
              {
                "name": "",
                "type": "address"
              }
            ],
            "payable": false,
            "stateMutability": "view",
            "type": "function"
          },
          {
            "anonymous": false,
            "inputs": [
              {
                "indexed": true,
                "name": "userAddress",
                "type": "address"
              },
              {
                "indexed": false,
                "name": "username",
                "type": "string"
              }
            ],
            "name": "UserRegistered",
            "type": "event"
          },
          {
            "constant": false,
            "inputs": [
              {
                "name": "username",
                "type": "string"
              }
            ],
            "name": "registerUser",
            "outputs": [],
            "payable": false,
            "stateMutability": "nonpayable",
            "type": "function"
          },
          {
            "constant": true,
            "inputs": [
              {
                "name": "userAddress",
                "type": "address"
              }
            ],
            "name": "isUserRegistered",
            "outputs": [
              {
                "name": "",
                "type": "bool"
              }
            ],
            "payable": false,
            "stateMutability": "view",
            "type": "function"
          },
          {
            "constant": true,
            "inputs": [
              {
                "name": "username",
                "type": "bytes32"
              }
            ],
            "name": "usernamesExist",
            "outputs": [
              {
                "name": "",
                "type": "bool"
              }
            ],
            "payable": false,
            "stateMutability": "view",
            "type": "function"
          },
          {
            "constant": true,
            "inputs": [],
            "name": "authenticateUser",
            "outputs": [
              {
                "name": "",
                "type": "string"
              }
            ],
            "payable": false,
            "stateMutability": "view",
            "type": "function"
          }
        ];

        const deployedContract = new web3Instance.eth.Contract(contractABI, contractAddress);
        setContract(deployedContract);
        setWeb3(web3Instance); // Store the web3 instance

        // Fetch and display user's Ethereum address
        const accounts = await web3Instance.eth.getAccounts();
        const userAddress = accounts[0];
        setIsConnected(true);

        // Fetch and display user's ETH balance
        const balance = await web3Instance.eth.getBalance(userAddress);
        setEthBalance(web3Instance.utils.fromWei(balance, 'ether'));
      } else {
        console.log('MetaMask not detected. Please install it.');
      }
    } catch (error) {
      console.error('Error connecting to MetaMask:', error);
    }
  };

  const onDisconnect = async () => {
    try {
      if (window.ethereum) {
        await window.ethereum.request({ method: 'eth_accounts' }); // Request accounts to trigger the disconnect
        setIsConnected(false);
      }
    } catch (error) {
      console.error('Error disconnecting from MetaMask:', error);
    }
  };

  const registerUser = async () => {
    try {
      if (!username) {
        setRegistrationStatus('Please enter a username.');
        return;
      }
  
      const accounts = await web3.eth.getAccounts(); // Use the stored web3 instance
      const userAddress = accounts[0];
      await contract.methods.registerUser(username).send({ from: userAddress });
      setRegistrationStatus('User registered successfully');
      setUsername(''); // Clear the input field after successful registration
    } catch (error) {
      setRegistrationStatus('Error registering user. Please try again.');
      console.error('Error registering user:', error);
    }
  };
  

  return (
    <div className="app">
      <div className="app-header">
        <h1>React dApp Authentication with MetaMask</h1>
        <h4>By Prakhar</h4>
      </div>
      <div className="app-wrapper">
        {!isConnected ? (
          <div>
            <button className="app-button__login" onClick={initializeWeb3}>
              Connect to MetaMask
            </button>
          </div>
        ) : (
          <div className="app-details">
            <h2>You are connected to MetaMask.</h2>
            <div className="app-balance">
              <span>Balance: </span>
              {ethBalance} ETH
            </div>
            <div className="app-registration">
              <input
                type="text"
                placeholder="Enter username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
              <button className="app-button__register" onClick={registerUser}>
                Register User
              </button>
              <p>{registrationStatus}</p>
            </div>
            <button className="app-button__logout" onClick={onDisconnect}>
              Disconnect
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
