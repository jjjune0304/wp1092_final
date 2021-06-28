import React, { useState } from 'react';
import { Layout, Menu, Image, Affix, Spin } from 'antd';
import { gql, useQuery } from '@apollo/client';
import { Link  } from "react-router-dom";
import { MenuFoldOutlined, MenuUnfoldOutlined, NotificationOutlined, LaptopOutlined } from '@ant-design/icons';

import { makeShorter } from '../utils'
import { HOTTEST_QUESTIONS_QUERY, VALUABLE_QUESTIONS_QUERY } from '../graphql'

const { SubMenu } = Menu;
const { Sider } = Layout;

var refreshCount=0;

const EplusSider = () => {
    const numHottestQuestions = 5;
    const numValuableQuestions = 5;
    const [autoHide, setAutoHide] = useState(false);
    const [leftSliderCollapsed, setLeftSliderCollapsed] = useState(true);
    const {loading: hottestQuestionsLoading, error: hottestQuestionsError, data: hottestQuestionsData} = useQuery(HOTTEST_QUESTIONS_QUERY, {
        variables: {num: numHottestQuestions}
    });
    const {loading: valuableQuestionsLoading, error: valuableQuestionsError, data: valuableQuestionsData} = useQuery(VALUABLE_QUESTIONS_QUERY, {
        variables: {num: numValuableQuestions}
    });

    if (hottestQuestionsLoading || valuableQuestionsLoading)
        return (<></>);//<Spin tip="Loading..." size="large"></Spin>);

    let itemKey = 1;
    let hottestQuestions = hottestQuestionsData.hottest.map((q)=> <Link to={"/question/"+q.id}><Menu.Item key={'hot_'+(itemKey++)}>{makeShorter(q.title, 20)}</Menu.Item></Link>)
    let valuableQuestions = valuableQuestionsData.valuable.map((q)=> <Link to={"/question/"+q.id}><Menu.Item key={'value_'+(itemKey++)}>{makeShorter(q.title, 20)}</Menu.Item></Link>)

    setTimeout(()=>{if(refreshCount<2)setLeftSliderCollapsed(false); refreshCount+=1;}, 300);

    return (<>
        <Sider collapsible collapsed={leftSliderCollapsed} onCollapse={()=>{setLeftSliderCollapsed(!leftSliderCollapsed); setAutoHide(!leftSliderCollapsed);}}
                    // onMouseLeave={()=>setTimeout(()=>setLeftSliderCollapsed(autoHide&&true),1000)}
                    scrollable
                    style={{overflow: 'auto'}}
                    >

            <Affix offsetTop={0} >
                <div>
                    <div className="logo">
                        <Image
                            width={"auto"}
                            height={"auto"}
                            preview={false}
                            // src="https://gw.alipayobjects.com/zos/rmsportal/KDpgvguMpGfqaHPjicRK.svg"
                            // src="https://www.educarepk.com/wp-content/uploads/2020/07/Epistemology.png"
                            src="http://lab.wubinray.com/eplus/logo.png"
                        />
                    </div>
                    <Menu
                        multiple
                        theme={"dark"}
                        mode="vertical"
                        defaultSelectedKeys={["collapsed"]}
                        defaultOpenKeys={leftSliderCollapsed?[]:['sub1', 'sub2']}
                    >
                        <Menu.Item key="collapsed" icon={leftSliderCollapsed?(<MenuUnfoldOutlined/>):(<MenuFoldOutlined/>)} 
                                style={{position:"relative", top:0}}
                                onClick={()=>{setLeftSliderCollapsed(!leftSliderCollapsed); setAutoHide(!leftSliderCollapsed)}}
                                ></Menu.Item>
                        <SubMenu key="sub1" icon={<LaptopOutlined />} title="最熱燒的討論串">
                            {hottestQuestions}
                        </SubMenu>
                        <SubMenu key="sub2" icon={<NotificationOutlined />} title="高獎勵的討論串" >
                            {valuableQuestions}
                        </SubMenu>
                    </Menu> 
                </div>
            </Affix>
        </Sider>
    </>);
}

export default EplusSider;