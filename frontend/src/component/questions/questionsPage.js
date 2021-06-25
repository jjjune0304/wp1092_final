import { Link  } from "react-router-dom";
import React, { useState, useEffect } from 'react';
import { gql, useQuery, useMutation } from '@apollo/client';
import { List, Avatar, Space, Popover, Button, Tag, Spin, Image, BackTop, Col, Typography } from 'antd';
import { MessageOutlined, LikeOutlined, StarOutlined, EyeOutlined, QuestionOutlined, AntDesignOutlined, ApartmentOutlined } from '@ant-design/icons';

import { LATEST_QUESTIONS_QUERY } from '../../graphql'
import { avatars, standardAvatar, isNull, makeShorter, getMoment } from '../../utils'

const {Text} = Typography;

const QuestionsPage = () => {

  const {loading: latestQuestionsLoading, error: latestQuestionsError, data: latestQuestionsData} = useQuery(LATEST_QUESTIONS_QUERY,{
    variables: {num: 25}
  })

  // if loading
  if (latestQuestionsLoading)
    return (<Spin tip="Loading..." size="large"></Spin>);

  // render questions
  let questions = latestQuestionsData.latest;
  questions = questions.map((q)=>({...q, href: "/question/"+q.id }))

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
              <IconText icon={MessageOutlined} text={item.comments.length} key={"comments"+item.id} />,
              <IconText icon={ApartmentOutlined} text={item.answers.length} key={"answers"+item.id} />,
              <Space>🤑{isNull(item.reward, "-")}</Space>,
              <Link to={item.href} target="_blank">
                <IconLink
                  src="https://gw.alipayobjects.com/zos/rmsportal/MjEImQtenlyueSmVEfUD.svg"
                  text=" View"
                />
              </Link>,
            ]}
            extra={
              <Col span={3}>
              {item.answers.slice(0,2).map((ans)=>(
                  <p>
                    <Popover content={<div>{makeShorter(ans.body,50)}</div>} title="Ans" trigger="hover" placement="rightTop">
                        <Button>@ {makeShorter(ans.author.username,7)}</Button>
                    </Popover>
                  </p>
                ))}
              </Col>
            }
            className="Shadow"
          >
            <List.Item.Meta
              style={{textAlign:"left"}}
              avatar={
                <>
                <p style={{textAlign:"center", minWidth:"10vw"}}>
                  <Avatar size="large" src={isNull(item.author.avatar, standardAvatar)}  /> <br/>
                  <Text><strong>{makeShorter(item.author.username,10)}</strong></Text>
                </p>
                </> 
              }
              title={<Link to={item.href} target="_blank">
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