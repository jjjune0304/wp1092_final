import { Link  } from "react-router-dom";
import React, { useState, useEffect } from 'react';
import { gql, useQuery, useMutation } from '@apollo/client';
import { List, Avatar, Space, Popover, Button, Tag, Spin, Image, BackTop, Col, Typography } from 'antd';
import { MessageOutlined, LikeOutlined, StarOutlined, EyeOutlined, QuestionOutlined, AntDesignOutlined, ApartmentOutlined } from '@ant-design/icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { fas } from '@fortawesome/free-solid-svg-icons'
import { far } from '@fortawesome/free-regular-svg-icons'
import { fab } from '@fortawesome/free-brands-svg-icons'

import { LATEST_QUESTIONS_QUERY } from '../../graphql'
import { avatars, standardAvatar, isNull, makeShorter, getMoment } from '../../utils'
import { PopoverAnswer, AnswerCount, CommentCount, QuestionAuthor } from './questionItems.js'

const {Text} = Typography;

const QuestionsPage = () => {
  const {loading: latestQuestionsLoading, error: latestQuestionsError, data: latestQuestionsData} = useQuery(LATEST_QUESTIONS_QUERY,{
    variables: {num: 100}
  });

  // if loading
  if (latestQuestionsLoading)
    return (<Spin tip="Loading..." size="large"></Spin>);

  let questions = {};
  questions = latestQuestionsData.latest.map((q)=>({...q, href: "/question/"+q.id }))

  const IconLink = ({ src, text }) => (
    <Space>
      <img className="example-link-icon" src={src} alt={text} />
      {text}
    </Space>
  );

  const IconText = ({ icon, text }) => (
    <Space>
      {React.createElement(icon)}
      {text}
    </Space>
  );

  return (
    <List
        style={{"backgroundColor":"white", minHeight: "100vh"}}
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
              // <IconText icon={LikeOutlined} text={isNull(item.like, 0)} key={"like"+item.id} />,
              <IconText icon={EyeOutlined} text={isNull(item.views, 0)} key={"view"+item.id} />,
              <IconText icon={MessageOutlined} text={(<CommentCount questionID={item.id}/>)} key={"comments"+item.id} />,
              <IconText icon={ApartmentOutlined} text={(<AnswerCount questionID={item.id}/>)} key={"answers"+item.id} />,
              <Space><FontAwesomeIcon style={{color:"orange"}} icon={fas.faMoneyBillWave} />{isNull(item.reward, "-")}</Space>,
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
    );
};

export default QuestionsPage;