import Home from './container/Home'

import react, { useState } from 'react';
import './App.css';

function App() {

  let oldTokenTimestamp = localStorage.getItem('token_timestamp');
  let nowTimestamp = new Date().getTime();

  const [token, setToken] = useState((nowTimestamp-oldTokenTimestamp)>60*60 ? "" : localStorage.getItem('token')); //token有1小時quota
  
  localStorage.setItem('token_timestamp', nowTimestamp);

  return (
    <div className="App">
      <Home />
    </div>
  );
}

export default App;
