import React from 'react';
import { useParams, useHistory } from "react-router-dom";
import { Link  } from "react-router-dom";
import { List, Avatar, Space, Popover, Button, Tag, Spin, Image, BackTop, Row, Col, Typography, Divider, Tooltip } from 'antd';
import { MessageOutlined, LikeOutlined, StarOutlined, EyeOutlined, QuestionOutlined, 
         AntDesignOutlined, ApartmentOutlined, DollarOutlined } from '@ant-design/icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { fas } from '@fortawesome/free-solid-svg-icons'
import { far } from '@fortawesome/free-regular-svg-icons'
import { fab } from '@fortawesome/free-brands-svg-icons'
import { useQuery } from '@apollo/client';

import { SEARCH_QUERY } from '../graphql'
import EplusHeader from '../component/EplusHeader.js'
import { avatars, standardAvatar, isNull, makeShorter, getMoment } from '../utils'
import { PopoverAnswer, AnswerCount, CommentCount, QuestionAuthor } from '../component/questions/questionItems.js'


const {Text} = Typography;

const SearchPage = ({ token, setToken, activeKey, setActiveKey, authClient, userProfile, logout })=> {

    let { searchtext } = useParams();

    const history = useHistory();

    const {loading: searchLoading, error: searchError, data: searchData} = useQuery(SEARCH_QUERY,{
        variables: {keyword: searchtext}
    });

        
    let questions = {};
    if (!searchLoading)
        questions = searchData.search.map((q)=>({...q, href: "/question/"+q.id }))

    const IconLink = ({ src, text }) => (
        <Space>
          <img className="example-link-icon" src={src} alt={text} />
          {text}
        </Space>
    );

    const IconText = ({ icon, text, tip }) => (
        <Tooltip placement="top" title={tip}>
        <Space>
          {React.createElement(icon)}
          {text}
        </Space>
        </Tooltip>
    );

    return (<>
        <div style={{backgroundColor:"#EEEEEE", height:"100%", minHeight:"100vh", padding:"15px 0px"}}>

        {/* Header */}
        <EplusHeader token={token} setToken={setToken} activeKey={activeKey} setActiveKey={setActiveKey} 
                             userProfile={userProfile} logout={logout} history={history} position="fixed" />
        
        {/* Main (searched questions) */}
        <Row justify="center">
        <Col span={18} style={{"backgroundColor":"white", height: "100%", margin: "64px 0px 0px 0px", padding: "15px 0px"}}>
            
        {questions?(<h3>Found {questions.length} results realted to '{searchtext}' </h3>):(<></>)}

        {searchLoading?
            (<>
            <Spin tip={"Loading..." + searchtext + " relative questions"} 
                  size="large" 
                  style={{ backgroundColor:"white", width:"100%" }}/>
            </>)
            :
            (<>
            <Divider />
            <List
                itemLayout="vertical"
                size="large"
                pagination={{
                  onChange: page => {
                    console.log(page);
                    window.scroll({top: 0, behavior: 'smooth' })
                  },
                  pageSize: 10,
                }}
                dataSource={questions}
                footer={
                  <></>
                }
                renderItem={item => (
                  <List.Item
                    key={item.id}
                    style={{textAlign:"left"}}
                    actions={[
                      <Text style={{color:"gray", minWidth:"16vw"}}>created {item.createdAt===null? "-" : getMoment(item.createdAt)}</Text>,
                      // view 
                      <IconText icon={EyeOutlined} tip="view" text={isNull(item.views, 0)} key={"view"+item.id} />,
                      // comments
                      <IconText icon={MessageOutlined} tip="comments" text={(<CommentCount questionID={item.id}/>)} key={"comments"+item.id} />,
                      // answers
                      <IconText icon={ApartmentOutlined} tip="answers" text={(<AnswerCount questionID={item.id}/>)} key={"answers"+item.id} />,
                      // reward
                      <IconText icon={DollarOutlined} tip="rewards" text={isNull(item.reward, "-")} key={"rewards"+item.id} />,
                      <Link to={item.href} >
                        <IconLink
                          src="https://gw.alipayobjects.com/zos/rmsportal/MjEImQtenlyueSmVEfUD.svg"
                          text=" View"
                        />
                      </Link>,
                    ]}
                    extra={
                      <Col span={3}>
                          <PopoverAnswer questionID={item.id} />
                      </Col>
                    }
                    className="Shadow"
                  >
                    <List.Item.Meta
                      style={{textAlign:"left"}}
                      avatar={
                        <>
                        <p style={{textAlign:"center", minWidth:"10vw"}}>
                            <QuestionAuthor questionID={item.id} />
                        </p>
                        </> 
                      }
                      title={<Link to={item.href}>
                                <Text><strong> { "Q : " + makeShorter(item.title, 100) } </strong></Text>
                            </Link>}
                      // description={<>created {item.createdAt===null? "-" : getMoment(item.createdAt)}</>}
                    />
                      { /*makeShorter(item.body, 200)*/ }
                  </List.Item>
                )}
            />
            </>)
        }
        </Col>
        </Row>

        <BackTop />
        </div>
    </>);

}

export default SearchPage;