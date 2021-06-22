import react, { useState, useEffect } from 'react';
import { BrowserRouter, Switch, Redirect, Route, Link } from 'react-router-dom';

import newAppolloClient from './hooks/appolloClient.js'
import LoginPage from './container/Login.js';
import Home from './container/Home.js'
import QuestionsPage from './component/questions/questionsPage.js'

import './App.css';

const getToken = () => localStorage.getItem('token');

const checkToken = () => {
    let old_time = localStorage.getItem('Epistemology_token_timestamp');
    let now_time = new Date().getTime();
    if ((now_time - old_time) > 10 * 60 * 1000) // 10分鐘，把token清掉(需重新登入)
        localStorage.setItem('token', '');
    return getToken();
}


function App() {

    const [token, setToken] = useState(checkToken());
    const [activeKey, setActiveKey] = useState("login");
    const [authClient, setAuthClient] = useState(newAppolloClient());

    useEffect( ()=>setAuthClient(newAppolloClient(token)), [token]);

    return (
        <div className="App">
            <BrowserRouter>
                <Switch>
                    <Route path="/login" render={(props)=>
                        <LoginPage {...props} 
                            token={token} setToken={setToken} 
                            activeKey={activeKey} setActiveKey={setActiveKey} />
                    } />
                    <Redirect exact from="/" to="/home" />
                </Switch>
                <Route path={["/home","/ask"]} render={(props)=>
                    <Home {...props} 
                        token={token} setToken={setToken} 
                        activeKey={activeKey} setActiveKey={setActiveKey} 
                        authClient={authClient}/>
                } />
                <Route path="/"><> Copyright © 2021 epistemologyplus.com </></Route>
                <Route path={["/questions"]}><QuestionsPage/></Route>
            </BrowserRouter>
        </div>
    );
}

export default App;
