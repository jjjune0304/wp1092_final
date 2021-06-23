import { Row, Col, Tabs, Spin  } from 'antd';
import React, { useState, useEffect } from 'react';
import { LoginOutlined, UsergroupAddOutlined, HomeOutlined } from '@ant-design/icons';
import { useHistory } from "react-router-dom";

import LoginPanel from '../component/login/LoginPanel.js'
import SignUpPanel from '../component/login/SignUpPanel.js'

import 'antd/dist/antd.css'
import './Login.css'

const { TabPane } = Tabs;

const LoginPage = ({token, setToken, activeKey, setActiveKey}) => {

    const history = useHistory();

    // redirect to home page (w/ login)
    useEffect(()=>{
            if (token!=="")
                history.push('/home');
        },[token]);

    // redirect to home page (w/o login)
    useEffect(()=>{
            if (activeKey==='home')
                setTimeout(()=>history.push('/home'), 500);
        },[activeKey])

    return (
        <Row align="middle" style={{background: "#001529", height: "100vh"}}>
            <Col span={15} style={{background: "white", padding: "0px 40px", height: "100vh"}}>
                <Tabs activeKey={activeKey} 
                    animated={{tabPane: true}} 
                    centered="true" 
                    size="large" 
                    type="line"
                    onChange={(key) => setActiveKey(key)}> 
                    <TabPane tab={ <> <LoginOutlined/>Login </> } key="login">
                        <LoginPanel setActiveKey={setActiveKey} setToken={setToken}/>
                    </TabPane>
                    <TabPane tab={ <> <UsergroupAddOutlined/>SignUp</> } key="signup">
                        <SignUpPanel setActiveKey={setActiveKey} />
                        <> Copyright © 2021 epistemologyplus.com </>
                    </TabPane>
                    <TabPane tab={ <> <HomeOutlined />Home</> } key="home">
                        <br/><br/><Spin tip="Loading..." size="large" /><br/><br/>
                        <> Copyright © 2021 epistemologyplus.com </>
                    </TabPane>
                </Tabs>
            </Col>
            <Col span={8} >
                <h1 style={{ color: '#00CCCC', height: "100%" }}>
                    Epistemology+
                </h1>
            </Col>
        </Row>
    );

}

export default LoginPage;