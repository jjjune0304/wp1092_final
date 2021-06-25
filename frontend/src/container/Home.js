import React, { useState, useEffect } from "react";
import { useQuery, useMutation } from '@apollo/client';
import { Switch, Link, Route, useHistory, BrowserRouter } from "react-router-dom";
import { Layout, Menu, Input, Image, Button, Empty, Row, Col, Statistic, Avatar, BackTop, Affix } from 'antd';
import { LaptopOutlined, NotificationOutlined } from '@ant-design/icons';
import { LoginOutlined, LogoutOutlined, UsergroupAddOutlined, MenuUnfoldOutlined, MenuFoldOutlined, LikeOutlined } from '@ant-design/icons';

import { USER_QUERY, CREATE_QUESTION_MUTATION } from '../graphql'
import { standardAvatar } from '../utils'
import EplusHeader from '../component/EplusHeader.js'
import EplusSider from '../component/EplusSider.js'
import EplusRightContent from '../component/EplusRightContent.js'
import LoginPage from './Login.js';
import QuestionsPage from '../component/questions/questionsPage.js'
import Ask from '../component/AskQuestion'

import 'antd/dist/antd.css';

const { SubMenu } = Menu;
const { Header, Content, Footer, Sider } = Layout;
const { Search } = Input;

const onSearch = value => console.log(value);

var refreshCount=0;

const Home = ({ token, setToken, activeKey, setActiveKey, userProfile, logout, authClient }) => {

    const history = useHistory();

    return (
        <Layout >
            {/* Sider */}
            <EplusSider />

            {/* Header + Main */}
            <Layout className="site-layout" style={{padding: '0px 0px 0px 0px', width:'100%'}}>

                {/* Header */}
                <EplusHeader token={token} setToken={setToken} activeKey={activeKey} setActiveKey={setActiveKey} 
                             userProfile={userProfile} logout={logout}/>
                
                {/* Main Panel */}
                <Content style={{padding: '0px 0px 0px 0px', minHeight: "100vh"}}>
                    <Row>
                        {/* Center Content */}
                        <Col span={18} style={{padding: "20px 10px 20px 20px"}} >
                            <Switch>

                                {/* Questions content */}
                                <Route exact path="/home"> <QuestionsPage /> </Route>

                                {/* Ask content */}
                                <Route path="/ask"> <Ask token={token} userProfile={userProfile} authClient={authClient}/> </Route>

                            </Switch>
                        </Col>

                        {/* Right Content */}
                        <Col span={6} style={{padding: "20px 20px 20px 10px"}}>
                            <EplusRightContent />
                        </Col>
                    </Row>
                </Content>
            
            </Layout>
            
            <BackTop />

        </Layout>

    );
};
export default Home;