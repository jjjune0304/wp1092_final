import { useState } from "react";
import 'antd/dist/antd.css';
import { Layout, Menu, Input, Image, Button, Row, Col } from 'antd';
import { LaptopOutlined, NotificationOutlined } from '@ant-design/icons';
import LoginPage from './Login';
import LoginPanel from '../component/login/LoginPanel'
import SignUpPanel from '../component/login/SignUpPanel'

const { SubMenu } = Menu;
const { Header, Content, Footer, Sider } = Layout;
const { Search } = Input;

const onSearch = value => console.log(value);

const Home = () => {
    let oldTokenTimestamp = localStorage.getItem('token_timestamp');
    let nowTimestamp = new Date().getTime();

    const [ token, setToken ] = useState((nowTimestamp-oldTokenTimestamp)>60*60 ? "" : localStorage.getItem('token')); //token有1小時quota
    const [ activeKey, setActiveKey ] = useState("home");

    localStorage.setItem('token_timestamp', nowTimestamp);

    const HomePage = <div>home page</div>
    const HomePageLogin = <div>welcome</div>

    return (
        <Layout>
            <Header className="header">
                <a type="text" href='/' className="logo" style={{ float:'left', padding: '0 24px' }}>
                    <h2 style={{ color: '#00CCCC' }}>
                        Epistemology+
                    </h2>
                </a>
                <div style={{ float:'left', padding: '0 24px' }}>
                    <Button type="primary" shape="round" style={{ color: 'white' }}>Ask</Button>
                </div>
                <Search
                    placeholder="input search text"
                    allowClear
                    enterButton
                    size="large"
                    onSearch={onSearch}
                    style={{ float:'left', width: '30%', padding: '12px 24px' }}
                />
                <div style={{ float:'right', display: 'inline' }}>
                    {token==='' ? 
                    <Button type="text" style={{ color: 'white' }} onClick={()=>{setActiveKey('login')}}>Log in</Button> : 
                    <Button type="text" style={{ color: 'white' }} onClick={()=>{setActiveKey('home'); setToken('')}}>Log out</Button>}
                    <Button type="text" style={{ color: 'white' }} onClick={()=>{setActiveKey('signup')}}>Sign up</Button>
                </div>
            </Header>
            <Content style={{ padding: '0 50px' }}>
                <Layout className="site-layout-background" style={{ padding: '24px 0'}}>
                    <Sider className="site-layout-background" width={200}>
                        <Menu
                            mode="inline"
                            defaultOpenKeys={['sub1', 'sub2']}
                            style={{ height: '100%' }}
                        >
                            <SubMenu key="sub1" icon={<NotificationOutlined />} title="最新的討論串">
                                <Menu.Item key="1">hack1</Menu.Item>
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
                    <Content style={{ padding: '0 24px', minHeight: 280 }}>
                        {token==='' ?
                        (activeKey==='login' ? <Row align="center"><Col span={14}><LoginPanel setToken={setToken}/></Col></Row> : 
                        activeKey==='signup' ? <Row align="center"><Col span={14}><SignUpPanel setActiveKey={setActiveKey}/></Col></Row> : 
                        HomePage) : HomePageLogin}
                    </Content>
                    <div style={{ width: 200 }}>
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
                </Layout>
            </Content>
        </Layout>
    );
};
export default Home;