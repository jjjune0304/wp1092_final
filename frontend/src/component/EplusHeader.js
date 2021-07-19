import React, { useState, useEffect } from 'react'
import { useQuery } from '@apollo/client';
import { Link, useHistory } from "react-router-dom";
import { Layout, Button, Input, Typography, Avatar, Badge, Menu, Drawer, notification, Divider, Row, Col, Empty } from "antd";
import { LoginOutlined, LogoutOutlined, UsergroupAddOutlined, SmileOutlined } from '@ant-design/icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { fas } from '@fortawesome/free-solid-svg-icons'
import { far } from '@fortawesome/free-regular-svg-icons'
import { fab } from '@fortawesome/free-brands-svg-icons'

import { isNull, standardAvatar, makeShorter, getMoment } from '../utils'
import { INBOX_ME_QUERY, INBOX_SUBSCRIPTION } from '../graphql'

const { Paragraph, Text } = Typography;
const { Search } = Input;
const { Header } = Layout;

function reverse(array){
  return array.map((item,idx) => array[array.length-1-idx])
}

const InboxAvatar = ({username, avatar, authClient}) => {
    
    const [inboxVisible, setInboxVisible] = useState(false);

    const { loading:loadingInbox, error: errorInbox, data: dataInbox, subscribeToMore } = useQuery(INBOX_ME_QUERY, {client:authClient});

    const subscribeToMoreInbox = () =>
        subscribeToMore({
            document: INBOX_SUBSCRIPTION,
            updateQuery: (prev, { subscriptionData }) => {
                if (!subscriptionData.data) return prev;
                    openNotification({message:subscriptionData.data.inbox.message})
                    return {
                        me: {inbox: [...(dataInbox)?dataInbox.me.inbox:[], subscriptionData.data.inbox] }
                    }
            }});

    useEffect(() => {
        subscribeToMoreInbox();
    },[]);
    
    const showDrawer = () => {
        // openNotification({message:'testing'});
        setInboxVisible(true);
    };

    const onClose = () => {
        setInboxVisible(false);
    };
    
    const openNotification = ({message, description}) => {
        notification.success({
            message,
            // message: 'Notification Title',
            // description:
            //   'This is the content ',
            icon: <FontAwesomeIcon style={{color:'#00CCCC'}} icon={fas.faEnvelope} /> , //<SmileOutlined style={{ color: '#108ee9' }} />,
            placement: 'bottomRight'
        });
    };

    const messageTypeIcon = {'ASK': <FontAwesomeIcon style={{color:'gray'}} icon={fas.faQuestion} />,
                             'NOTIFICATION': <FontAwesomeIcon style={{color:'brown'}} icon={fas.faReply} /> , //<FontAwesomeIcon style={{color:'brown'}} icon={fas.faInbox} />,
                             'ANSWER': <FontAwesomeIcon style={{color:'gray'}} icon={fas.faNetworkWired} />,
                             'COMMENT': <FontAwesomeIcon style={{color:'gray'}} icon={far.faCommentDots} />,
                             'REPLY': <FontAwesomeIcon style={{color:'gray'}} icon={far.faCommentDots} />}

    return (
        <>
            <Button style={{backgroundColor:'transparent', border:'none', padding:0}} onClick={showDrawer}>
                <Badge size="big" count={dataInbox?dataInbox.me.inbox.length:0} className="Bigger">
                    <Avatar size="middle" src={avatar?isNull(avatar, standardAvatar):standardAvatar} />
                </Badge>
            </Button>
            <Drawer
                title={<Row>
                        <Col span={16}>
                            <Button onClick={onClose} size="large" style={{border:0, padding:0}}>
                                <Text mark={true} underline italic > @{username}'s inbox </Text>
                            </Button>
                        </Col>
                        <Col span={8}>
                            <Button onClick={onClose} size="large" type="text" > 
                                <Text> &ensp; Close &ensp; >>> </Text>
                            </Button>
                        </Col>
                    </Row>}
                placement="right"
                closable={false}
                onClose={onClose}
                visible={inboxVisible}
                width="45%"
            >
                {(loadingInbox||errorInbox)?
                    (<>
                        <Paragraph>Loading ...</Paragraph>
                    </>)
                    :
                    (<>
                        {/*Inbox messages*/}
                        {reverse(dataInbox.me.inbox).map( (mail) => (
                            <>
                                <Row className="Shadow" style={{width:'100%', margin:"0px 0 10px 0", borderBottom:"1px dashed #DCDCDC"}} >
                                    <Col span={20}>
                                        <Paragraph style={{width:'100%'}} > 
                                            {(mail.type==='NOTIFICATION')?
                                                (<>
                                                    {messageTypeIcon[mail.type]} &thinsp; {getMoment(mail.time)}, <br/>
                                                    <strong>{makeShorter(mail.message,200)}</strong>
                                                </>)
                                                :
                                                (<>
                                                    {messageTypeIcon[mail.type]} &thinsp; {makeShorter(mail.message,200)} , {getMoment(mail.time)}
                                                </>)
                                            }
                                        </Paragraph>
                                    </Col>
                                    <Col span={3}>
                                        <Link to={'/question/'+mail.qID+((mail.refID)?("/"+mail.refID):"")} target="_blank">
                                            <Text style={{color:'#1890FF'}} >
                                                <FontAwesomeIcon icon={far.faPaperPlane}/> View
                                            </Text>
                                        </Link>
                                    </Col>
                                    <Col span={1}>
                                        <Button></Button>
                                    </Col>
                                </Row>
                                {/*<Divider style={{padding:0, margin:0}} />*/}
                            </>
                            ) )}

                        {/*Inbox Editor*/}
                        <Row type="flex" justify="end" style={{width:'100%', padding:"5px 0px", margin:"0 0 15px 0", borderBottom:"0px dashed #DCDCDC"}}>
                            <Col span={2}>
                                <Button size="small" style={{border:0}}>
                                    <FontAwesomeIcon  style={{fontSize:'20px', color:"#001529"}} icon={fas.faPenSquare} /> &thinsp; Edit
                                </Button>
                            </Col>
                        </Row>
                    </>)
                }
            </Drawer>
        </>
    );
}

const EplusHeader = ({token, setToken, activeKey, setActiveKey, authClient, userProfile, logout, position}) => {

    const history = useHistory();

    const onSearch = (e)=>{
        if (e) {
            history.push("/search/"+e.trim().replaceAll(' ', '_'));
        }
    };

    position = position? position:"relative";

    return (<>
            {/* Header */}
            <Header style={{ width:'100%', zIndex:100, position:position, top:0}}>
                <Menu theme="dark" mode="horizontal" style={{ width:'100%', height:'100%'}} selectedKeys={[]} >
                    {/* Logo */}
                    <Menu.Item key="logo" style={{backgroundColor: '#001529', padding:0}} >
                        <Link to="/" >
                            <Button style={{backgroundColor:'transparent', border:'none', padding:0}}>
                                <h2 style={{ color: '#00CCCC' }} className="Bigger">
                                    Epistemology+
                                </h2>
                            </Button>
                        </Link>
                    </Menu.Item>

                    {/* Ask */}
                    <Menu.Item key="ask" style={{backgroundColor: '#001529'}}>
                        <Button type="primary" shape="round" style={{ color: 'white' }} className="AskButton" 
                                onClick={()=>{history.push('/ask')}}>
                            Ask
                        </Button>
                    </Menu.Item>

                    {/* Search */}
                    <Menu.Item key="search" style={{backgroundColor: '#001529', padding:'0px 24px 0px 0px'}}>
                        <Search
                            placeholder="search"
                            allowClear
                            enterButton
                            size="large"
                            onSearch={onSearch}
                            style={{ padding: '12px 0px' }}
                        />
                    </Menu.Item>

                    {token==='' ? 
                        <Menu.SubMenu theme="dark" title={
                                <Link to="/login" >
                                    <Button type="text" style={{backgroundColor: '#001529', color: 'white' }} onClick={()=>{setActiveKey('login')}} className="Bigger">
                                        <LoginOutlined/>Login | SignUp<UsergroupAddOutlined/>
                                    </Button>
                                </Link>
                            } key="login_signup" style={{backgroundColor: '#001529'}}>
                            <Menu.Item key="login" >
                                <Link to="/login">
                                    <Button type="text" style={{ color: 'white' }} onClick={()=>{setActiveKey('login')}} className="Bigger">
                                        <LoginOutlined/>Log in
                                    </Button> 
                                </Link>
                            </Menu.Item>
                            <Menu.Divider/>
                            <Menu.Item key="signup">
                                <Link to="/login">
                                    <Button type="text" style={{ color: 'white' }} onClick={()=>{setActiveKey('signup')}} className="Bigger">
                                        <UsergroupAddOutlined/>Sign up
                                    </Button> 
                                </Link>
                            </Menu.Item>
                        </Menu.SubMenu>
                        : 
                        <>  
                            <Menu.Item key="user" style={{backgroundColor: '#001529', padding:0}}>
                                
                                {/* Hi, name */}
                                <Text style={{ color: 'white' }}>
                                    Hi, {userProfile?makeShorter(userProfile.username,10):"yo~"}
                                </Text>
                                
                                {/* Avatar */}
                                <Text style={{ color: 'white' }} className="Bigger">
                                    &ensp;
                                    <InboxAvatar
                                        username={userProfile?makeShorter(userProfile.username, 30):"yo~"}
                                        avatar={userProfile?isNull(userProfile.avatar, standardAvatar):standardAvatar}
                                        authClient={authClient}
                                    />
                                    &ensp; &ensp;
                                </Text>

                            </Menu.Item>

                            <Menu.Item key="logout" style={{backgroundColor: '#001529', padding:0}}>
                                {/* points */}
                                <Text style={{ color: 'white' }}>
                                    | 💰 {userProfile?userProfile.points:0}
                                </Text>
                                
                                {/* log out */}
                                <Text style={{ color: 'white' }}>
                                    <Link to="/home">
                                        <Button type="text" style={{ color: 'white' }} onClick={()=>{logout();}} className="Bigger">
                                            |<LogoutOutlined />Log out
                                        </Button>
                                    </Link>
                                </Text>
                            </Menu.Item>
                        </>
                    }
                </Menu>
            </Header>
    </>);
} 

export default EplusHeader;