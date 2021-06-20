import { useState, useEffect } from "react";
import 'antd/dist/antd.css';
import { Layout, Menu, Input, Image, Button } from 'antd';
import { LaptopOutlined, NotificationOutlined } from '@ant-design/icons';
import { LoginOutlined, LogoutOutlined, UsergroupAddOutlined } from '@ant-design/icons';
import LoginPage from './Login.js';

const { SubMenu } = Menu;
const { Header, Content, Footer, Sider } = Layout;
const { Search } = Input;

const getToken = () => localStorage.getItem('token');

const checkToken = () => {
    let old_time = localStorage.getItem('Epistemology_token_timestamp');
    let now_time = new Date().getTime();
    if ((now_time - old_time) > 5 * 1000) // 10分鐘，把token清掉(需重新登入)
        localStorage.setItem('token', '');
    return getToken();
}

const onSearch = value => console.log(value);

const Home = () => {

    const [token, setToken] = useState(checkToken());
    const [activeKey, setActiveKey] = useState("home");

    const HomePage = <div>home page</div>
    const HomePageLogin = <div>welcome</div>

    useEffect(() => {
        if (token != '')
            localStorage.setItem('Epistemology_token_timestamp', new Date().getTime());
        localStorage.setItem('token', token);
    }, [token]);

    return (
        <Layout style={{minHeight: "100vh"}}>
            <Header className="header" style={{ position: 'fixed' , zIndex: 1, width: '100%' }}>
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
                        <>  
                        <Button danger type="text" style={{ color: 'white' }} onClick={()=>{setActiveKey('login')}}><LoginOutlined/>Log in</Button> 
                        <Button type="text" style={{ color: 'white' }} onClick={()=>{setActiveKey('signup')}}><UsergroupAddOutlined/>Sign up</Button> 
                        </>
                        : 
                        <Button type="text" style={{ color: 'white' }} onClick={()=>{setActiveKey('home'); setToken('')}}><LogoutOutlined />Log out</Button>
                    }
                    
                </div>
            </Header>
            <Content style={{ padding: '64px 50px' }}>
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
                    <Content style={{ padding: '0 24px' }}>
                        {activeKey==='login' || activeKey==='signup'?
                            <LoginPage activeKey={activeKey} setActiveKey={setActiveKey} setToken={setToken} />
                            :
                            <></>
                        }
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