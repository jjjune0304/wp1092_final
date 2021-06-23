import React, { useState, useEffect } from "react";
import { useQuery, useMutation } from '@apollo/client';
import { Switch, Link, Route, useHistory, BrowserRouter } from "react-router-dom";
import { Layout, Menu, Input, Image, Button, Empty, Row, Col, Avatar, BackTop } from 'antd';
import { LaptopOutlined, NotificationOutlined } from '@ant-design/icons';
import { LoginOutlined, LogoutOutlined, UsergroupAddOutlined, MenuUnfoldOutlined, MenuFoldOutlined } from '@ant-design/icons';

import { USER_QUERY, CREATE_QUESTION_MUTATION } from '../graphql'
import { standardAvatar } from '../utils'
import LoginPage from './Login.js';
import QuestionsPage from '../component/questions/questionsPage.js'

import 'antd/dist/antd.css';

const { SubMenu } = Menu;
const { Header, Content, Footer, Sider } = Layout;
const { Search } = Input;

const onSearch = value => console.log(value);

var refreshCount=0;

const Home = ({ token, setToken, activeKey, setActiveKey, authClient }) => {

    // Test

    // const [makeQ, {loading:createQuesutionLoading, error:createQuesutionError, data:createQuesutionData}] = useMutation(CREATE_QUESTION_MUTATION);

    // if (token!="")
    //     makeQ({
    //         variables: {title: "請問今天台灣總共有幾個人", body: "現金台灣有23000個人口", reward: 3},
    //         client: authClient
    //     });

    // Test

    const history = useHistory();

    const [colorMode, setColorMode] = useState('dark');

    const [leftSliderCollapsed, setLeftSliderCollapsed] = useState(false);
    setTimeout(()=>{if(refreshCount<2)setLeftSliderCollapsed(true); refreshCount+=1;}, 2000);

    // 這邊不能刪!!! (刷新頁面才能繼續登入)
    useEffect(() => {
        if (token != '') {
            localStorage.setItem('Epistemology_token_timestamp', new Date().getTime());
            history.push('/home'); // back to home page
        }
        localStorage.setItem('token', token);
    }, [token]);

    return (
        <Layout >

            <Sider collapsible collapsed={leftSliderCollapsed} onCollapse={()=>{setLeftSliderCollapsed(!leftSliderCollapsed)}}
                    onMouseLeave={()=>setTimeout(()=>setLeftSliderCollapsed(true),1500)}>
                <div className="logo">
                    <Image
                        height={"54px"}
                        // src="https://gw.alipayobjects.com/zos/rmsportal/KDpgvguMpGfqaHPjicRK.svg"
                        src="https://www.educarepk.com/wp-content/uploads/2020/07/Epistemology.png"
                    />
                </div>
                <Menu
                    multiple
                    theme={colorMode}
                    mode="inline"
                    defaultSelectedKeys={["collapsed"]}
                    defaultOpenKeys={['sub1', 'sub2']}
                >
                    <Menu.Item key="collapsed" icon={leftSliderCollapsed?(<MenuUnfoldOutlined/>):(<MenuFoldOutlined/>)} 
                            style={{position:"relative", top:0}}
                            onClick={()=>{setLeftSliderCollapsed(!leftSliderCollapsed)}}
                            ></Menu.Item>
                    <SubMenu key="sub1" icon={<NotificationOutlined />} title="最新的討論串" >
                        <Menu.Item key="1">hack1hack1hack1hack1hack1hack1hack1hack1hack1hack1hack1hack1hack1hack1</Menu.Item>
                        <Menu.Item key="2">hack2</Menu.Item>
                        <Menu.Item key="3">hack3</Menu.Item>
                        <Menu.Item key="4">hack4</Menu.Item>
                    </SubMenu>
                    <SubMenu key="sub2" icon={<LaptopOutlined />} title="最近瀏覽">
                        <Menu.Item key="5">hw5</Menu.Item>
                        <Menu.Item key="6">hw6</Menu.Item>
                        <Menu.Item key="7">hw7</Menu.Item>
                        <Menu.Item key="8">hw8</Menu.Item>
                    </SubMenu>
                </Menu>
            </Sider>


            {/* Header + Main */}
            <Layout className="site-layout" style={{padding: '0px 0px 0px 0px', width:'100%'}}>

                {/* Header */}
                <Header theme="light" className="header" style={{ width:'100%', zIndex:100}}>
                    <div className="logo" style={{ float:'left'}}>
                        <Link to="/">
                            <h2 style={{ color: '#00CCCC' }} className="Bigger">
                                Epistemology+
                            </h2>
                        </Link>
                    </div>
                    <div style={{ float:'left', padding: '0 24px' }}>
                        <Link to="/ask">
                            <Button type="primary" shape="round" style={{ color: 'white' }} className="AskButton">Ask</Button>
                        </Link>
                    </div>
                    <Search
                        placeholder="input search text"
                        allowClear
                        enterButton
                        size="large"
                        onSearch={onSearch}
                        style={{ float:'left', width: '30%', padding: '12px 24px' }}
                    />
                    <div style={{ float:'right' }}>
                        {token==='' ? 
                            <>  
                            <Link to="/login">
                                <Button danger type="text" style={{ color: 'white' }} onClick={()=>{setActiveKey('login')}} className="Bigger">
                                    <LoginOutlined/>Log in
                                </Button> 
                            </Link>
                            <Link to="/login">
                                <Button type="text" style={{ color: 'white' }} onClick={()=>{setActiveKey('signup')}} className="Bigger">
                                    <UsergroupAddOutlined/>Sign up
                                </Button> 
                            </Link>
                            </>
                            : 
                            <>
                            <Avatar size="middle" src={standardAvatar} draggable={true} />
                            <Link to="/home">
                                <Button type="text" style={{ color: 'white' }} onClick={()=>{setActiveKey('home'); setToken(''); localStorage.setItem('token',"");}} className="Bigger">
                                    Log out<LogoutOutlined />
                                </Button>
                            </Link>
                            </>
                        }
                        
                    </div>
                    </Header>
                


                    {/* Main Panel */}
                    <Content style={{padding: '0px 0px 0px 0px'}}>
                    <Row>
                        {/* Center Content */}
                        <Col span={18} style={{padding: "10px 10px"}} >
                            <Switch>

                                {/* Questions content */}
                                <Route exact path="/home"> 
                                    <QuestionsPage/> 
                                </Route>

                                {/* Ask content */}
                                <Route path="/ask"> Ask! <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} /> </Route>

                            </Switch>
                        </Col>

                        {/* Right Commercial */}
                        <Col span={6}>
                            <div >
                                <Image
                                    width={200}
                                    preview={false}
                                    src="https://gw.alipayobjects.com/zos/antfincdn/aPkFc8Sj7n/method-draw-image.svg"
                                />
                                <Image
                                    width={200}
                                    preview={false}
                                    src="https://gw.alipayobjects.com/zos/antfincdn/aPkFc8Sj7n/method-draw-image.svg"
                                />
                            </div>
                        </Col>
                    </Row>
                    </Content>
                </Layout>
            
            <BackTop />

        </Layout>

    );
};
export default Home;