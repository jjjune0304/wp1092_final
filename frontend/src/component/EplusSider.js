import React, { useEffect, useState } from 'react';
import { Layout, Menu, Image, Affix, Spin } from 'antd';
import { gql, useQuery } from '@apollo/client';
import { Link  } from "react-router-dom";
import { MenuFoldOutlined, MenuUnfoldOutlined, SketchOutlined, FireOutlined } from '@ant-design/icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { fas } from '@fortawesome/free-solid-svg-icons'
import { far } from '@fortawesome/free-regular-svg-icons'
import { fab } from '@fortawesome/free-brands-svg-icons'

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

    // submenu selection
    var rootSubmenuKeys = ['sub1', 'sub2'];

    const [openKeys, setOpenKeys] = React.useState(['subx']);

    const onOpenChange = keys => {
        console.log("OLDKEY", openKeys)
        console.log("KEY", keys)
        const latestOpenKey = keys.find(key => openKeys.indexOf(key!="collapsed"?key:"") === -1);
        if (rootSubmenuKeys.indexOf(latestOpenKey) === -1) {
            setOpenKeys(keys);
        } else {
            setOpenKeys(latestOpenKey ? [latestOpenKey] : []);
        }
    };

    // load hot/valuable questions
    if (hottestQuestionsLoading || valuableQuestionsLoading)
        return (<></>);
    let itemKey = 1;
    let hottestQuestions = hottestQuestionsData.hottest.map((q, index)=> <Link key={'hot_'+index} to={"/question/"+q.id}><Menu.Item key={'hotItem_'+index}>{makeShorter(q.title, 20)}</Menu.Item></Link>)
    let valuableQuestions = valuableQuestionsData.valuable.map((q, index)=> <Link key={'value_'+index} to={"/question/"+q.id}><Menu.Item key={'valueItem_'+index}>{makeShorter(q.title, 20)}</Menu.Item></Link>)

    setTimeout(()=>{if(refreshCount<2)setLeftSliderCollapsed(false); refreshCount+=1;}, 300);



    return (<>
        <Sider collapsible collapsed={leftSliderCollapsed} onCollapse={()=>{setLeftSliderCollapsed(!leftSliderCollapsed); setAutoHide(!leftSliderCollapsed);}}
                    // onMouseLeave={()=>setTimeout(()=>setLeftSliderCollapsed(autoHide&&true),1000)}
                    scrollable="true"
                    style={{overflow: 'auto'}}
                    >

            <Affix offsetTop={0} >
                <div>
                    <div className="logo">
                        <img
                            height={"auto"}
                            width={"70px"}
                            preview={false}
                            // src="https://gw.alipayobjects.com/zos/rmsportal/KDpgvguMpGfqaHPjicRK.svg"
                            // src="https://www.educarepk.com/wp-content/uploads/2020/07/Epistemology.png"
                            // src="http://lab.wubinray.com/eplus/logo.png"
                            src={process.env.PUBLIC_URL+'/logo.png'}
                        />
                    </div>
                    <Menu
                        multiple
                        theme={"dark"}
                        mode="inline"
                        // defaultSelectedKeys={["collapsed"]}
                        // defaultOpenKeys={leftSliderCollapsed?[]:['sub1', 'sub2']}
                        openKeys={openKeys} onOpenChange={onOpenChange}
                        selectable={false}
                    >
                        <Menu.Item key="collapsed" icon={leftSliderCollapsed?(<MenuUnfoldOutlined/>):(<MenuFoldOutlined/>)} 
                                style={{position:"relative", top:0}}
                                onClick={()=>{setLeftSliderCollapsed(!leftSliderCollapsed); setOpenKeys(openKeys.map(k=>(k==="collapsed")?"":k))}}
                                ></Menu.Item>
                        <SubMenu key="sub1" title="最熱燒的討論串" onMouseOver={()=>{setLeftSliderCollapsed(false);}} 
                                 icon={<FontAwesomeIcon icon={fab.faHotjar} style={{color:"orange", fontSize:"20px"}}/>} >
                            {hottestQuestions}
                        </SubMenu>
                        <SubMenu key="sub2" title="高獎勵的討論串" onMouseOver={()=>{setLeftSliderCollapsed(false);}} 
                                 icon={<FontAwesomeIcon icon={fas.faGem} style={{color:"#0066FF", fontSize:"16px"}}/>} >
                            {valuableQuestions}
                        </SubMenu>
                    </Menu> 
                </div>
            </Affix>
        </Sider>
    </>);
}

export default EplusSider;