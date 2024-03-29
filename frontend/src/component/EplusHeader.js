import React from 'react'
import { useParams, Link, useHistory } from "react-router-dom";
import { Layout, Button, Input, Typography, Avatar, Space, Affix } from "antd";
import { LoginOutlined, LogoutOutlined, UsergroupAddOutlined } from '@ant-design/icons';

import { isNull, standardAvatar, makeShorter } from '../utils'

const { Paragraph, Text } = Typography;
const { Search, TextArea } = Input;
const { Header, Content, Footer, Sider } = Layout;

const EplusHeader = ({token, setToken, activeKey, setActiveKey, userProfile, logout, position}) => {

    const history = useHistory();

    const onSearch = (e)=>{
        if (e) {
            history.push("/search/"+e.trim().replaceAll(' ', '_'));
        }
    };

    position = position? position:"relative";

    return (<>
            {/* Header */}
            <Header theme="light" className="header" style={{ width:'100%', zIndex:100, position:position, top:0}}>

                <div className="logo" style={{ float:'left'}}>
                    <Link to="/">
                        <h2 style={{ color: '#00CCCC' }} className="Bigger">
                            Epistemology+
                        </h2>
                    </Link>
                </div>
                <div style={{ float:'left', padding: '0 24px' }}>
                    <Button type="primary" shape="round" style={{ color: 'white' }} className="AskButton" 
                            onClick={()=>{history.push('/ask')}}>
                        Ask
                    </Button>
                </div>
                <Search
                    placeholder="search questions"
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
                        <Space >
                        <Avatar size="middle" src={userProfile?isNull(userProfile.avatar, standardAvatar):standardAvatar} />
                        <Text style={{ color: 'white' }}>Hi, {userProfile?makeShorter(userProfile.username,10):""}</Text>
                        <Text style={{ color: 'white' }}>| 💰 {userProfile?userProfile.points:0}</Text>
                        <Link to="/home">
                            <Button type="text" style={{ color: 'white' }} onClick={()=>{logout();}} className="Bigger">
                                |<LogoutOutlined />Log out
                            </Button>
                        </Link>
                        </Space>
                        </>
                    }
                    
                </div>
            </Header>
    </>);
} 

export default EplusHeader;