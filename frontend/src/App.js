import react, { useState, useEffect } from 'react';
import { BrowserRouter, Switch, Redirect, Route, Link } from 'react-router-dom';

import newAppolloClient from './hooks/appolloClient.js'
import LoginPage from './container/Login.js';
import Home from './container/Home.js'
import QuestionsPage from './component/questions/questionsPage.js'
import SingleQuestionPage from './container/SingleQuestionPage.js'

import './App.css';

const getToken = () => localStorage.getItem('token');

const checkToken = ({token, setToken}) => {
    let old_token = localStorage.getItem('token');
    let old_time = localStorage.getItem('Epistemology_token_timestamp');
    let now_time = new Date().getTime();
    if ((now_time - old_time) > 10 * 60 * 1000 && old_token!="") // 10分鐘，把token清掉(需重新登入)
        localStorage.setItem('token', '');
    else if (token!="")
        localStorage.setItem('Epistemology_token_timestamp', new Date().getTime());

    // login page成功拿到token
    if (token!=getToken())
        setToken(getToken());

    setTimeout(()=>checkToken({token, setToken}), 500);
}

const checkUserProfile = ({userProfile, setUserProfile}) => {
    let storageUserProfile = JSON.parse(localStorage.getItem("userProfile"));
    console.log(storageUserProfile);
    if (storageUserProfile && userProfile.username!=storageUserProfile.username)
        setUserProfile(storageUserProfile);

    // setTimeout(()=>checkUserProfile({userProfile, setUserProfile}), 1000);
}

var othersLogout=0;

function App() {

    const [token, setToken] = useState("");
    const [activeKey, setActiveKey] = useState("login");
    const [authClient, setAuthClient] = useState(newAppolloClient());
    const [userProfile, setUserProfile] = useState({username:"", email:"", avatar:"", points:0})

    checkToken({token, setToken});
    checkUserProfile({userProfile, setUserProfile});

    useEffect( ()=>{setAuthClient(newAppolloClient(token))}, [token]);

    const logout = () => {
        setActiveKey('home'); 
        setToken(''); 
        localStorage.setItem('token',"");
        localStorage.setItem('userProfile', JSON.stringify({username:"", email:"", avatar:"", points:0}));
    }

    // if (localStorage.getItem('token')==="" && othersLogout===0) {setToken(""); othersLogout+=1;}

    return (
        <div className="App">
            <BrowserRouter>
                <Switch>
                    <Redirect exact from="/" to="/home" />
                    <Route path="/login" render={(props)=>
                        <LoginPage {...props} 
                            token={token} setToken={setToken} 
                            activeKey={activeKey} setActiveKey={setActiveKey} />
                    } />
                    <Route path="/home" render={(props)=>
                        <Home {...props} 
                            token={token} setToken={setToken} 
                            activeKey={activeKey} setActiveKey={setActiveKey} 
                            authClient={authClient}
                            userProfile={userProfile}
                            logout={logout} />
                    } />
                    {/*<Route path="/questions"><QuestionsPage/></Route>*/}
                    <Route path="/question/:id" render={(props)=>
                        <SingleQuestionPage {...props} 
                            token={token} setToken={setToken}
                            activeKey={activeKey} setActiveKey={setActiveKey} 
                            authClient={authClient} 
                            userProfile={userProfile}
                            logout={logout} />
                    } />
                    <Route path="/ask" render={(props)=>
                        <Home {...props} 
                            token={token} setToken={setToken} 
                            activeKey={activeKey} setActiveKey={setActiveKey} 
                            authClient={authClient}
                            userProfile={userProfile}
                            logout={logout} />
                    } />
                </Switch>
                <Route path={["/home","/ask","/question/:id"]}><> Copyright © 2021 epistemologyplus.com </></Route>
            </BrowserRouter>
        </div>
    );
}

export default App;
