import { useState, useEffect } from 'react';
import { useLazyQuery } from '@apollo/client';
import { BrowserRouter, Switch, Redirect, Route } from 'react-router-dom';

import newAppolloClient from './hooks/appolloClient.js'
import Home from './container/Home.js'
import LoginPage from './container/Login.js'
import SingleQuestionPage from './container/SingleQuestionPage.js'
import SearchPage from './container/SearchPage.js'
import ScrollToTop from './container/ScrollToTop.js'
import { ME_QUERY } from './graphql'
import { useInterval } from './hooks/UseInterval.js'

import './App.css';


const defaultUserProfile = {username:"", email:"", avatar:"", points:0, feedback:0, inbox:[]};

function App() {
    
    useEffect(() => { document.title = "Epistemology+" }, [])

    const [token, setToken] = useState("");
    const [activeKey, setActiveKey] = useState("login");
    const [authClient, setAuthClient] = useState(newAppolloClient({token:""}));
    const [userProfile, setUserProfile] = useState(defaultUserProfile);

    const [getMe, { data:dataMe }] = useLazyQuery(ME_QUERY, {client: authClient});

    useEffect( () => { setAuthClient(newAppolloClient({token})); }, [token]);
    useEffect( () => { getMe(); }, [authClient]);
    useEffect( () => { setUserProfile(dataMe?dataMe.me:userProfile); }, [dataMe] );

    // checkToken (如果其他分頁地方有登入)
    const checkToken = () => {
        const new_token = localStorage.getItem('Epistemology_token');
        let old_time = localStorage.getItem('Epistemology_token_timestamp');
        let now_time = new Date().getTime();
        if ((now_time - old_time) > 10 * 60 * 1000 && new_token!=="") // 10分鐘，把token清掉(需重新登入)
            localStorage.setItem('Epistemology_token', '');
        else if (token!=="")
            localStorage.setItem('Epistemology_token_timestamp', new Date().getTime());

        // login page成功拿到token
        if (token!==new_token)
            setToken(new_token);
    }
    useInterval(checkToken, 500);

    const logout = () => {
        localStorage.setItem('Epistemology_token',"");
        setActiveKey('home');
        // setUserProfile(defaultUserProfile);
    }

    return (
        <div className="App">
            <BrowserRouter>
                <ScrollToTop>
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
                    <Route path={["/question/:qID/:refID", "/question/:qID"]} render={(props)=>
                        <SingleQuestionPage {...props} 
                            token={token} setToken={setToken}
                            activeKey={activeKey} setActiveKey={setActiveKey} 
                            authClient={authClient} 
                            userProfile={userProfile}
                            logout={logout} />
                    } />
                    <Route path="/search/:searchtext" render={(props)=>
                        <SearchPage {...props}
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
                <Route path={["/home","/ask","/question/:id","/search/:searchtext"]}><> Copyright © 2021 epistemologyplus.com </></Route>
                </ScrollToTop>
            </BrowserRouter>
        </div>
    );
}

export default App;
