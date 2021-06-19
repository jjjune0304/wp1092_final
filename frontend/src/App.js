import LoginPage from './container/login.js';

import react, { useState } from 'react';
import logo from './logo.svg';
import './App.css';

function App() {

  let oldTokenTimestamp = localStorage.getItem('token_timestamp');
  let nowTimestamp = new Date().getTime();

  const [token, setToken] = useState((nowTimestamp-oldTokenTimestamp)>60*60 ? "" : localStorage.getItem('token')); //token有1小時quota
  
  localStorage.setItem('token_timestamp', nowTimestamp);

  return (
    <div className="App">
      { token ? 
          (
            <>
              Home page
            </>
          )
          :
          (
            <LoginPage setToken={setToken} />
          )
      }
    </div>
  );
}

export default App;
