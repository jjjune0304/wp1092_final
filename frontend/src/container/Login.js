import { Row, Col, Tabs, Spin  } from 'antd';
import React, { useState, useEffect } from 'react';
import { LoginOutlined, UsergroupAddOutlined, HomeOutlined } from '@ant-design/icons';
import { Link, useHistory } from "react-router-dom";

import LoginPanel from '../component/login/LoginPanel.js'
import SignUpPanel from '../component/login/SignUpPanel.js'

import 'antd/dist/antd.css'
import './Login.css'

const { TabPane } = Tabs;

const LoginPage = ({token, setToken, activeKey, setActiveKey}) => {

    const history = useHistory();

    // redirect to home page (w/ login)
    useEffect(()=>{
            if (token!="")
                history.push('/home');
        },[token]);

    // redirect to home page (w/o login)
    useEffect(()=>{
            if (activeKey=='home')
                setTimeout(()=>history.push('/home'), 500);
        },[activeKey])

    return (
        <Row align="center">
            <Col span={14}>
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
                    </TabPane>
                    <TabPane tab={ <> <HomeOutlined />Home</> } key="home">
                        <br/><br/><Spin tip="Loading..." size="large" /><br/><br/>
                    </TabPane>
                </Tabs>
            </Col>
        </Row>
    );

}

export default LoginPage;