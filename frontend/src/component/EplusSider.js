import React, { useState } from 'react';
import { Layout, Menu, Image, Affix } from 'antd';
import { MenuFoldOutlined, MenuUnfoldOutlined, NotificationOutlined, LaptopOutlined } from '@ant-design/icons';

const { SubMenu } = Menu;
const { Header, Content, Footer, Sider } = Layout;

var refreshCount=0;

const EplusSider = () => {

    const [autoHide, setAutoHide] = useState(false);
    const [leftSliderCollapsed, setLeftSliderCollapsed] = useState(true);
    setTimeout(()=>{if(refreshCount<2)setLeftSliderCollapsed(false); refreshCount+=1;}, 2000);

    return (<>
        <Sider collapsible collapsed={leftSliderCollapsed} onCollapse={()=>{setLeftSliderCollapsed(!leftSliderCollapsed); setAutoHide(!leftSliderCollapsed);}}
                    onMouseLeave={()=>setTimeout(()=>setLeftSliderCollapsed(autoHide&&true),1000)}>

            <Affix offsetTop={0} >
            <div className="logo">
                <Image
                    height={"54px"}
                    // src="https://gw.alipayobjects.com/zos/rmsportal/KDpgvguMpGfqaHPjicRK.svg"
                    // src="https://www.educarepk.com/wp-content/uploads/2020/07/Epistemology.png"
                    src="http://lab.wubinray.com/logo.png"
                />
            </div>
                <Menu
                    multiple
                    theme={"dark"}
                    mode="inline"
                    defaultSelectedKeys={["collapsed"]}
                    defaultOpenKeys={leftSliderCollapsed?[]:['sub1', 'sub2']}
                >
                    <Menu.Item key="collapsed" icon={leftSliderCollapsed?(<MenuUnfoldOutlined/>):(<MenuFoldOutlined/>)} 
                            style={{position:"relative", top:0}}
                            onClick={()=>{setLeftSliderCollapsed(!leftSliderCollapsed); setAutoHide(!leftSliderCollapsed)}}
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
            </Affix>
        </Sider>
    </>);
}

export default EplusSider;