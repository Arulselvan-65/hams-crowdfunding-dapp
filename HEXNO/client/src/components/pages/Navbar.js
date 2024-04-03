import React, { useState, useEffect } from 'react';
import '../CssFiles/nav.css';
import { Web3 } from 'web3';
import { Link } from 'react-router-dom';

function Navbar() {

  const [message, setMessage] = useState();
  const [isLoggedin, setIsLoggedin] = useState(false);
  const [loggedUser, setLoggedUser] = useState('');


  useEffect(() => {
    window.ethereum.on('accountsChanged', async () => {
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      const web3Instance = new Web3(window.ethereum);
      await web3Instance.eth.getAccounts().then((accounts) => {
        setMessage('');
        setIsLoggedin(false);
        setLoggedUser(accounts[0]);
      })
      localStorage.clear();
    })

    if (localStorage.getItem('loggedUser') !== undefined) {
      setMessage(localStorage.getItem('message'));
      setLoggedUser(localStorage.getItem('loggedUser'));
      setIsLoggedin(true);
    }
  });

  const handleConnectWallet = async () => {

    if (window.ethereum !== undefined) {
      let user;
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      const web3Instance = new Web3(window.ethereum);
      await web3Instance.eth.getAccounts().then((accounts) => {
        user = accounts[0];
      })

      if (user) {
        let d = new Date();
        let hours = d.getHours();
        const minutes = d.getMinutes();
        const seconds = d.getSeconds();
        const ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12;
        hours = hours ? hours : 12;
        const paddedMinutes = minutes < 10 ? '0' + minutes : minutes;
        const paddedSeconds = seconds < 10 ? '0' + seconds : seconds;
        const currentTime = ' ' + hours + ':' + paddedMinutes + ':' + paddedSeconds + ' ' + ampm;
        const date = `${d.getUTCDate()}/${d.getUTCMonth() + 1}/${d.getUTCFullYear()}`
        const message = `Sign the message:\n\nThis is only for account verification: \n\nDATE:  ${date} \nTIME:  ${currentTime}`;

        try {
          await web3Instance.eth.personal.sign(message, user, '').then((e) => {
            if (e) {
              setMessage(e);
              setLoggedUser(user);
              localStorage.setItem("loggedUser", `${user}`);
              localStorage.setItem("message", `${e}`);
              setIsLoggedin(true);
            }
          });
        }
        catch (err) {
          window.alert("Sign the Message to Continue.")
        }
      }
      else {
        window.alert("Install Metamask to continue!!!")
      }
    }
  };


  return (
    <>
    <div className='main-div'>
      <div className='logo-div'>
        H A M S
      </div>
      <div className='route-div'>
        <Link to="/crowdfunding">
          <button className='rou-btn'>Projects</button>
        </Link>
        <Link to="/profile">
          <button className='rou-btn'>Profile</button>
        </Link>
        <Link to="/create">
          <button className='rou-btn'>Create</button>
        </Link>
        {(isLoggedin || message) && loggedUser ?
          <div className='add-div'>
            <p className='text-[18px] font-roboto'>{loggedUser.substring(0, 10) + '....'}</p>
          </div>
          :
          <div>
            <button className='create-bt' onClick={handleConnectWallet}>Connect Wallet</button>
          </div>
        }
      </div>
      </div>
    </>
  )
}

export default Navbar;