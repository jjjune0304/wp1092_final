import React, { useState, useEffect } from 'react';
import { List, Avatar, Space, Popover, Button, Tag } from 'antd';
import { MessageOutlined, LikeOutlined, StarOutlined, EyeOutlined, QuestionOutlined } from '@ant-design/icons';

const makeShorter = (s, max_len=10) => {
  return (s.length<max_len) ? s : s.substring(0, max_len)+'...';
}

const QuestionsPage = () => {

  const listData = [];

  for (let i = 0; i < 23; i++) {
    listData.push({
      href: 'question/<id>',
      // avatar: 'https://avatars1.githubusercontent.com/u/8186664?s=460&v=4',
      avatar: 'https://www.fountain.org.tw/upload/repository/74a7f73b7f18d193ddebff71c0b8afeaimage_normal.jpg',
      title: 'ant design part ${i} ant design partant design partant design partaaaaaaaaaaaaaaaaaaant design partaaaaaaaaaaaa',
      body:
        'We supply a series of design principles, practical patterns and high quality design resources (Sketch and Axure), to help people create their product prototypes beautifully and efficiently.',
    });
  }
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

  console.log(listData);

  return (
    <List
        style={{"background-color":"white"}}
        itemLayout="vertical"
        size="small"
        pagination={{
          onChange: page => {
            console.log(page);
          },
          pageSize: 6,
        }}
        dataSource={listData}
        footer={
          <div>
            <b>ant design</b> footer part
          </div>
        }
        renderItem={item => (
          <List.Item
            key={item.title}
            actions={[
              <a href={item.href}>
              <IconLink
                src="https://gw.alipayobjects.com/zos/rmsportal/MjEImQtenlyueSmVEfUD.svg"
                text=" Go challenge"
              /></a>,
              <IconText icon={LikeOutlined} text="156" key="list-vertical-like-o" />,
              <IconText icon={EyeOutlined} text="156" key="list-vertical-star-o" />,
              <IconText icon={MessageOutlined} text="2" key="list-vertical-message" />,
            ]}
            extra={
              <>
              <p>
                <Popover content={<div>The arrow points to the center of the target element, which set</div>} title="Title" trigger="hover">
                    <Button>@wubin's reply</Button>
                </Popover>
              </p>
              <p>
                <Popover content={<div>The arrow points to the center of the target element, which set</div>} title="Title" trigger="hover">
                    <Button>@wubin's reply</Button>
                </Popover>
              </p>
              <p>
                <Popover content={<div>The arrow points to the center of the target element, which set</div>} title="Title" trigger="hover">
                    <Button>@wubin's reply</Button>
                </Popover>
              </p>
              </>
            }
          >
            <List.Item.Meta
              avatar={<Avatar src={item.avatar} />}
              title={<a href={item.href}>{"Question: "+makeShorter(item.title, 100)}</a>}
            />
            { makeShorter(item.body, 200) }
          </List.Item>
        )}
      />
    );
};

export default QuestionsPage;