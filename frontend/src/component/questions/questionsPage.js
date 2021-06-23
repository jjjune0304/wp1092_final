import { Link  } from "react-router-dom";
import React, { useState, useEffect } from 'react';
import { gql, useQuery, useMutation } from '@apollo/client';
import { List, Avatar, Space, Popover, Button, Tag, Spin, Image, BackTop } from 'antd';
import { MessageOutlined, LikeOutlined, StarOutlined, EyeOutlined, QuestionOutlined, AntDesignOutlined } from '@ant-design/icons';

import { LATEST_QUESTIONS_QUERY } from '../../graphql'
import { avatars, standardAvatar, isNull, makeShorter, getMoment } from '../../utils'


const QuestionsPage = () => {

  const {loading: latestQuestionsLoading, error: latestQuestionsError, data: latestQuestionsData} = useQuery(LATEST_QUESTIONS_QUERY,{
    variables: {num: 100}
  })

  // if loading
  if (latestQuestionsLoading)
    return (<Spin tip="Loading..." size="large"></Spin>);

  // render questions
  let questions = latestQuestionsData ? latestQuestionsData.latest : [] ;
  questions = questions.map((q)=>({...q, href: "/question/"+q.id }))

  const IconLink = ({ src, text }) => (
    <div className="example-link">
      <img className="example-link-icon" src={src} alt={text} />
      {text}
    </div>
  );

  const IconText = ({ icon, text }) => (
    <Space>
      {React.createElement(icon)}
      {text}
    </Space>
  );

  return (
    <List
        style={{"backgroundColor":"white"}}
        itemLayout="vertical"
        size="small"
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
            actions={[

              <Link to={item.href} target="_blank">
                <IconLink
                  src="https://gw.alipayobjects.com/zos/rmsportal/MjEImQtenlyueSmVEfUD.svg"
                  text=" View"
                />
              </Link>,
              // <IconText icon={LikeOutlined} text={isNull(item.like, 0)} key="list-vertical-like-o" />,
              <IconText icon={EyeOutlined} text={isNull(item.views, 0)} key="list-vertical-star-o" />,
              <IconText icon={MessageOutlined} text={item.answers.length} key="list-vertical-message" />,
              <Space>💰{isNull(item.reward, "-")}</Space>
            ]}
            extra={
              <>
              {item.answers.slice(3).map((ans)=>(
                  <p>
                    <Popover content={<div>{makeShorter(ans.body,50)}</div>} title="Title" trigger="hover">
                        <Button>@{makeShorter(ans.username,20)}'s reply</Button>
                    </Popover>
                  </p>
                ))}
              </>
            }
            className="Shadow"
          >

            <List.Item.Meta
              avatar={
                <>
                  <Avatar size="large" src={isNull(item.author.avatar, standardAvatar)} draggable={true} /> <br/>
                  {item.author.username}
                </>
              }
              title={<Link to={item.href} target="_blank">{ "Question: " + makeShorter(item.title, 100) }</Link>}
              description={<>created {item.createdAt===null? "-" : getMoment(item.createdAt)}</>}
            />
            { makeShorter(item.body, 200) }
          </List.Item>
        )}
      />
    );
};

export default QuestionsPage;