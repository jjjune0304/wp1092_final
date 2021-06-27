import { Link  } from "react-router-dom";
import React, { useState, useEffect } from 'react';
import { useQuery } from '@apollo/client';
import { List, Avatar, Space, Popover, Button, Tag, Spin, Image, BackTop, Col, Typography } from 'antd';


import { QUESTION_AUTHOR_QUERY_LITE, QUESTION_ANSWERS_COUNT_QUERY, QUESTION_COMMENTS_COUNT_QUERY } from '../../graphql'
import { POPOVER_QUESTION_ANSWERS_QUERY } from '../../graphql'
import { avatars, standardAvatar, isNull, makeShorter } from '../../utils'

const {Text} = Typography;

const PopoverAnswer = ({questionID, showN}) => {
  const {loading: answersLoading, error: answersError, data: answersData} = useQuery(POPOVER_QUESTION_ANSWERS_QUERY, {
    variables: {questionID: questionID}
  })

  return ((answersLoading || answersError)?
    (<></>)
    :
    (<>
      {answersData.question.answers.slice(0,showN?showN:2).map((ans)=>(
          <p>
              <Popover content={<div>{makeShorter(ans.body,50)}</div>} title="Ans" trigger="hover" placement="rightTop">
                  <Button>@ {makeShorter(ans.author.username,7)}</Button>
              </Popover>
          </p>
      ))}
    </>)
  );
}

const AnswerCount = ({questionID}) => {
  const {loading, error, data} = useQuery(QUESTION_ANSWERS_COUNT_QUERY, {
    variables: { questionID}
  })
  return (loading || error)? (0) : (data.question.answers.length);
}

const CommentCount = ({questionID}) => {
  const {loading, error, data} = useQuery(QUESTION_COMMENTS_COUNT_QUERY, {
    variables: {questionID}
  })
  return (loading || error)? (0) : (data.question.comments.length);
}

const QuestionAuthor = ({questionID}) => {
  const {loading, error, data} = useQuery(QUESTION_AUTHOR_QUERY_LITE, {
    variables: {questionID}
  })
  return ((loading || error)?
      (<>
          <Avatar size="large" src={standardAvatar}  /> <br/>
          <Text><strong>-</strong></Text>
      </>)
      :
      (<>
          <Avatar size="large" src={isNull(data.question.author.avatar, standardAvatar)}  /> <br/>
          <Text><strong>{makeShorter(data.question.author.username,10)}</strong></Text>
      </>)
    );
}

export { PopoverAnswer, AnswerCount, CommentCount, QuestionAuthor };