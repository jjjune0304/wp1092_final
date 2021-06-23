import React, { useState, useEffect } from 'react';
import { gql, useQuery, useMutation } from '@apollo/client';
import { useParams, Link, useHistory } from "react-router-dom";
import { Layout, Menu, Input, Image, Button, Empty, Row, Col, Divider } from 'antd';
import { PageHeader, Dropdown, Tag, Typography, Space, Spin, List, Comment, Tooltip, BackTop } from 'antd';
import { MessageOutlined, LikeOutlined, StarOutlined, EyeOutlined, LoginOutlined, LogoutOutlined, 
    UsergroupAddOutlined, EllipsisOutlined, HeartOutlined, PlusCircleOutlined } from '@ant-design/icons';
import moment from 'moment';

import { QUESTION_QUERY, QUESTION_AUTHOR_QUERY, QUESTION_ANSWERS_QUERY } from '../../graphql'
import { standardAvatar, isNull, timeConverter, getMoment, showQuestionCreateUpdateTime } from '../../utils'

const { Search } = Input;
const { Paragraph } = Typography;
const { Header, Content, Footer, Sider } = Layout;

const onSearch = value => console.log(value);

const data = [
  {
    actions: [<span key="comment-list-reply-to-0">Reply to</span>],
    author: 'Han Solo',
    avatar: 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png',
    content: (
      <p>
        We supply a series of design principles, practical patterns and high quality design
        resources (Sketch and Axure), to help people create their product prototypes beautifully and
        efficiently.
      </p>
    ),
    datetime: (
      <Tooltip title={moment().subtract(1, 'days').format('YYYY-MM-DD HH:mm:ss')}>
        <span>{getMoment(1624341649872)}</span>
      </Tooltip>
    ),
  },
  {
    actions: [<span key="comment-list-reply-to-0">Reply to</span>],
    author: 'Han Solo',
    avatar: 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png',
    content: (
      <p>
        We supply a series of design principles, practical patterns and high quality design
        resources (Sketch and Axure), to help people create their product prototypes beautifully and
        efficiently.
      </p>
    ),
    datetime: (
      <Tooltip title={moment().subtract(2, 'days').format('YYYY-MM-DD HH:mm:ss')}>
        <span>{moment().subtract(1624341649872, 'secs').fromNow()}</span>
      </Tooltip>
    ),
  },
];

const SingleQustionPage = ({ token, setToken, activeKey, setActiveKey, authClient }) => {

    let { id } = useParams();

    const history = useHistory();

    const {loading: questionLoading, error: questionError, data: questionData} = useQuery(QUESTION_QUERY, {variables:{questionID:id}});
    const {loading: authorLoading, error: authorError, data: authorData} = useQuery(QUESTION_AUTHOR_QUERY, {variables:{questionID:id}});
    const {loading: answersLoading, error: answersError, data: answersData} = useQuery(QUESTION_ANSWERS_QUERY, {variables:{questionID:id}});

    // Still loading Question
    if (questionLoading)
        return (<Spin tip="Loading..." size="large" />);

    // Render Question
    console.log(questionData.question.createdAt);

    const routes = [
      { path: '/home', breadcrumbName: 'home' },
      { path: '/questions', breadcrumbName: 'questions' },
      { path: '/question'+id, breadcrumbName: id }
    ];

    const IconLink = ({ src, text }) => (
      <a className="example-link">
        <img className="example-link-icon" src={src} alt={text} />
        {text}
      </a>
    );

    const IconText = ({ icon, text }) => (
        <Space>
          {React.createElement(icon)}
          {text}
        </Space>
    );

    const content = (
      <>
        <Paragraph>
            {questionData.question.body}
        </Paragraph>
        <div>
              {/*<IconText icon={LikeOutlined} text={isNull(questionData.question.like, 0)} key="list-vertical-like-o" />, &ensp;&ensp;*/}
              <IconText icon={EyeOutlined} text={isNull(questionData.question.views, 0)} key="list-vertical-star-o" />, &ensp;&ensp;
              <IconText icon={MessageOutlined} text={answersLoading?"loading":answersData.question.answers.length} key="list-vertical-message" />, &ensp;&ensp;
              <Space>💰{isNull(questionData.question.reward, '-')}</Space>
        </div>
      </>
    );

    return (
        <div style={{backgroundColor:"#EEEEEE", height:"100%"}}>
            {/* Header */}
            <Header theme="light" className="header" style={{ width:'100%', zIndex:100, position:"fixed", top:0}}>
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
                        <Link to="/login" target="_blank">
                            <Button danger type="text" style={{ color: 'white' }} onClick={()=>{setActiveKey('login')}} className="Bigger">
                                <LoginOutlined/>Log in
                            </Button> 
                        </Link>
                        <Link to="/login" target="_blank">
                            <Button type="text" style={{ color: 'white' }} onClick={()=>{setActiveKey('signup')}} className="Bigger">
                                <UsergroupAddOutlined/>Sign up
                            </Button> 
                        </Link>
                        </>
                        : 
                        <Link>
                            <Button type="text" style={{ color: 'white' }} onClick={()=>{setActiveKey('home'); setToken(''); localStorage.setItem('token',"");}} className="Bigger">
                                <LogoutOutlined />Log out
                            </Button>
                        </Link>
                    }
                    
                </div>
            </Header>

            {/* Main */}
            <PageHeader
                title={"@"+questionData.question.author.username}
                className="site-page-header"
                subTitle={[
                    showQuestionCreateUpdateTime(questionData)
                    ]}
                // tags={[<Tag color="blue">Running</Tag>,<Tag color="orange">Running</Tag>,<Tag color="blue">Running</Tag>]}
                extra={[
                    <Button key="3"><HeartOutlined />Favorite</Button>,
                    <Button key="2"><PlusCircleOutlined />Follow</Button>,
                ]}
                avatar={{ src: isNull(questionData.question.author.avatar, standardAvatar) }}
                breadcrumb={{ routes }}
                style={{backgroundColor:"white", width:"80vw", margin:"0vh 10vw 0vh 10vw", padding:"15vh 5vw 5vh 5vw"}}
            >

                {/* title */}
                <h2>
                    <strong>Question:</strong> {questionData.question.title}
                </h2>

                {/* tags */}
                <p>
                    {[<Tag color="blue">Running</Tag>,<Tag color="orange">Running</Tag>,<Tag color="blue">Running</Tag>]}
                </p>

                {/* question content */}
                <Content
                    extraContent={
                        <img
                            src="https://gw.alipayobjects.com/zos/antfincdn/K%24NnlsB%26hz/pageHeader.svg"
                            alt="content"
                            width="100%"
                        />
                    }
                >
                    {content}
                </Content>

                <Divider plain><strong>Answers:</strong></Divider>

                {/* answers */}
                <List
                    className="comment-list"
                    header={`${data.length} replies`}
                    itemLayout="horizontal"
                    dataSource={data}
                    renderItem={item => (
                      <li>
                        <Comment
                          actions={item.actions}
                          author={item.author}
                          avatar={item.avatar}
                          content={item.content}
                          datetime={item.datetime}
                        >
                            <Comment
                              actions={item.actions}
                              author={item.author}
                              avatar={item.avatar}
                              content={item.content}
                              datetime={item.datetime}
                            />
                        </Comment>
                      </li>
                    )}
                  />

            </PageHeader>

            <BackTop />

        </div>
    );

}

export default SingleQustionPage;