import React, { useState, useEffect, useMemo } from 'react';
import { gql, useQuery, useMutation } from '@apollo/client';
import { useParams, Link, useHistory } from "react-router-dom";
import { Layout, Menu, Input, Image, Button, Empty, Row, Col, Divider, message } from 'antd';
import { PageHeader, Dropdown, Tag, Typography, Space, Spin, List, Comment, Tooltip, Form, BackTop } from 'antd';
import { MessageOutlined, LikeOutlined, StarOutlined, EyeOutlined, LoginOutlined, LogoutOutlined, LikeFilled,
    VerticalAlignMiddleOutlined, VerticalAlignBottomOutlined, 
    UsergroupAddOutlined, EllipsisOutlined, HeartOutlined, PlusCircleOutlined, ApartmentOutlined } from '@ant-design/icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { fas } from '@fortawesome/free-solid-svg-icons'
import { far } from '@fortawesome/free-regular-svg-icons'
import { fab } from '@fortawesome/free-brands-svg-icons'
import moment from 'moment';

import EplusHeader from '../component/EplusHeader.js'
import { QUESTION_QUERY, QUESTION_AUTHOR_QUERY, QUESTION_COMMENTS_QUERY, QUESTION_ANSWERS_QUERY } from '../graphql'
import { CREATE_ANSWER_MUTATION, CREATE_COMMENT_MUTATION, LIKE_ANSWER_MUTATION } from '../graphql'
import { standardAvatar, isNull, timeConverter, getMoment, showQuestionCreateUpdateTime } from '../utils'

const { Paragraph } = Typography;
const { Search, TextArea } = Input;
const { Header, Content, Footer, Sider } = Layout;

const onSearch = value => console.log(value);

const MyComment = ({id, author, avatar, content, timeString}) => {

    const [like, setLike] = useState(false);

    const actions = [ 
        // <span onClick={()=>setLike(!like)}>{React.createElement(like ? LikeFilled : LikeOutlined)} {0} </span>,
        // <span key={"comment-list-reply-to-"+id}>Reply to</span>
    ]

    return (<Comment
                author={author}
                avatar={avatar}
                content={(<p>{content}</p>)}
                actions={actions}
                datetime={(<span>{getMoment(timeString)}</span>)}
            />);
}


const MyAnswer = ({id, author, avatar, content, _likeCount, timeString, _childrenComments, authClient, makeComment, userProfile}) => {

    const [like, setLike] = useState(false);
    const [likeCount, setLikeCount] = useState(_likeCount?_likeCount:0);
    const [makingCommentVisible, setMakingCommentVisible] = useState(false);
    const [childrenComments, setChildrenComments] = useState(_childrenComments);

    const [likeAnswer, {loading:likeAnswerLoading, error:likeAnswerError}] = useMutation(LIKE_ANSWER_MUTATION);

    const actions = [ 
        <span onClick={ async () => {
                // setLike(!like);
                setLike(true);
                if (like===true) return;
                var likeReturn;
                try {
                    likeReturn = await likeAnswer({
                        variables: {aID: id},
                        client: authClient
                    });
                    setLikeCount(likeReturn.data.likeAnswer);
                } catch(error) {
                    if (error.message.toString().includes('log in')) {
                        message.error("Please login first");
                        setTimeout(()=>window.open("/login", "_blank"), 500);
                    }
                }
            }}>{React.createElement(like ? LikeFilled : LikeOutlined)} {likeCount} </span>,
        <span key={"comment-list-reply-to-"+id} onClick={()=>setMakingCommentVisible(!makingCommentVisible)}>Reply to</span>
    ]

    return (<li key={"answer"+id}>
                <Comment
                    author={author}
                    avatar={avatar}
                    content={(<p>{content}</p>)}
                    actions={actions}
                    datetime={(<span>{getMoment(timeString)}</span>)}
                >
                {childrenComments?
                    (childrenComments.map((item)=>(
                    <MyComment id={item.id} 
                               author={item.author.username} 
                               avatar={isNull(item.author.avatar, standardAvatar)} 
                               content={item.text} 
                               timeString={item.createdAt} />))
                    )
                    :
                    (<></>)
                }
                {makingCommentVisible? 
                    <CommentEditor postID={id} 
                                   postType="answer" 
                                   setVisible={setMakingCommentVisible} 
                                   authClient={authClient}
                                   makeComment={makeComment}
                                   commentsData={childrenComments}
                                   setCommentsData={setChildrenComments}
                                   userProfile={userProfile} />
                    :
                    (<></>)
                }
                </Comment>
            </li>);
}

const CommentEditor = ({ postID, postType, setVisible, authClient, makeComment, commentsData, setCommentsData, userProfile }) => {

    const [value, setValue] = useState("");
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async () => {
        if (value==="") return;

        setSubmitting(true);

        try {
            await makeComment({
                variables: {text:value, postID, postType},
                client: authClient
            })
        } catch (error) {
            setSubmitting(false);
            if (error.message.toString().includes('log in')) {
                message.error("Please login first");
                setTimeout(()=>window.open("/login", "_blank"), 500);
            }
            return;
        }

        setCommentsData([
            ...commentsData,
            {
                author: {
                    username:userProfile.username, 
                    avatar:isNull(userProfile.avatar,standardAvatar)
                },
                text: value
            }
        ])
        setValue("");
        setSubmitting(false);
        setVisible(false);
    };

    return (<>
        <Form.Item>
            <TextArea rows={1} onChange={(e)=>setValue(e.target.value)} value={value} />
        </Form.Item>
        <Form.Item>
            <Button loading={submitting} onClick={handleSubmit} type="primary" disabled={value===""}> Add Comment </Button>
            <Button style={{float:"right"}} onClick={()=>setVisible(false)}> close </Button>
        </Form.Item>
    </>);
}

const AnswerEditor = ({ questionID, authClient, makeAnswer, answersData, setAnswersData, userProfile }) => {

    const [value, setValue] = useState("");
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async () => {
        if (value==="") return;

        setSubmitting(true);

        var newAnswer;
        
        try { 
            newAnswer = await makeAnswer({
                variables: {body: value, postID: questionID},
                client: authClient
            });
            
            console.log(newAnswer);

        } catch(error) { 
            setSubmitting(false);
            if (error.message.toString().includes('log in')) {
                message.error("Please login first");
                setTimeout(()=>window.open("/login", "_blank"), 500);
            }
            return;
        }


        setAnswersData([
            ...answersData,
            {
                id: newAnswer.data.createAnswer.id,
                author: {
                    username: userProfile.username,//newAnswer.data.createAnswer.author.username, 
                    avatar: userProfile.avatar//isNull(newAnswer.data.createAnswer.author.avatar,standardAvatar)
                },
                body: <p>{newAnswer.data.createAnswer.body}</p>,
                comments: [],
                datetime: getMoment(newAnswer.data.createAnswer.createdAt),
            }
        ])
        setValue("");
        setSubmitting(false);
    }

    return (<>
        <Form.Item>
            <TextArea rows={3} onChange={(e)=>setValue(e.target.value)} value={value} />
        </Form.Item>
        <Form.Item>
            <Button loading={submitting} onClick={handleSubmit} type="primary" disabled={value===""}> Add Answer </Button>
        </Form.Item>
    </>);
}

let firsttime=0;

const SingleQustionPage = ({ token, setToken, activeKey, setActiveKey, authClient, userProfile, logout }) => {

    let { id } = useParams();

    const history = useHistory();

    // showing state
    const [showComments, setShowComments] = useState(true);
    const [showAnswers, setShowAnswers] = useState(true);

    // question, answer, comment query
    const [questionData, setQuestionData] = useState(null);
    const [authorData, setAuthorData] = useState(null);
    const [answersData, setAnswersData] = useState(null);
    const [commentsData, setCommentsData] = useState();

    const {loading: questionLoading, error: questionError, data: questionDataQ} = useQuery(QUESTION_QUERY, {variables:{questionID:id}});
    const {loading: authorLoading, error: authorError, data: authorDataQ} = useQuery(QUESTION_AUTHOR_QUERY, {variables:{questionID:id}});
    const {loading: answersLoading, error: answersError, data: answersDataQ} = useQuery(QUESTION_ANSWERS_QUERY, {variables:{questionID:id}});
    const {loading: commentsLoading, error: commentsError, data: commentsDataQ} = useQuery(QUESTION_COMMENTS_QUERY, {variables:{questionID:id}})

    useEffect(()=>{if(!questionLoading)setQuestionData(questionDataQ.question)}, [questionDataQ]);
    // useEffect(()=>{if(!authorLoading)setQuestionData(authorDataQ.question.author)}, [authorDataQ]); 
    useEffect(()=>{if(!answersLoading)setAnswersData(answersDataQ.question.answers)}, [answersDataQ]);
    useEffect(()=>{if(!commentsLoading)setCommentsData(commentsDataQ.question.comments)}, [commentsDataQ])

    // create answer, comment mutations
    const [makeComment, {loading:makeCommentLoading, error:makeCommentError}] = useMutation(CREATE_COMMENT_MUTATION);
    const [makeAnswer, {loading:makeAnswerLoading, error:makeAnswerError}] = useMutation(CREATE_ANSWER_MUTATION);

    // make comment Input bar visibility
    const [makingCommentVisible, setMakingCommentVisible] = useState(false);

    const questionRoutes = [
      { path: 'home', breadcrumbName: 'home' },
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

    const questionContents = questionData?(
      <>
        <Paragraph>
            {/*questionData.body*/}
            <div dangerouslySetInnerHTML={{__html: questionData.body}} className='innerhtml'></div>
        </Paragraph>
        <div>
              <IconText icon={EyeOutlined} text={isNull(questionData.views, 0)} key={"view"+questionData.id} />, &ensp;&ensp;
              <IconText icon={MessageOutlined} text={!commentsData?"loading":commentsData.length} key={"comments"+questionData.id} />, &ensp;&ensp;
              <IconText icon={ApartmentOutlined} text={!answersData?"loading":answersData.length} key={"answers"+questionData.id} />, &ensp;&ensp;
              <Space><FontAwesomeIcon style={{color:"orange"}} icon={far.faMoneyBillAlt} />{isNull(questionData.reward, '-')}</Space>
        </div>
      </>
    ):(<></>);

    return (
        <div style={{backgroundColor:"#EEEEEE", height:"100%", minHeight:"100vh", padding:"15px 0px"}}>
            {/* Header */}
            <EplusHeader token={token} setToken={setToken} activeKey={activeKey} setActiveKey={setActiveKey} 
                         userProfile={userProfile} logout={logout} position="fixed"/>

            {(questionData) ? (<>

            {/* Main */}
            <PageHeader
                className="site-page-header"
                breadcrumb={{ routes: questionRoutes }}
                title={"@"+questionData.author.username}
                subTitle={[
                    // showQuestionCreateUpdateTime(questionData)
                    "created " + getMoment(questionData.createdAt)
                    ]}
                extra={[
                    <Button key="favorite"><HeartOutlined />Favorite</Button>,
                    <Button key="follow"><PlusCircleOutlined />Follow</Button>,
                ]}
                avatar={{ src: isNull(questionData.author.avatar, standardAvatar) }}
                style={{ backgroundColor:"white", width:"80vw", 
                         margin:"0vh 10vw 0vh 10vw", 
                         padding:"12vh 5vw 5vh 5vw", 
                         textAlign:"left"
                     }}
            >

                {/* Question title */}
                <h2>
                    <strong>Question:</strong> {questionData.title}
                </h2>

                {/* Question tags */}
                <p>
                    {[<Tag color="blue">Running</Tag>,<Tag color="orange">Running</Tag>,<Tag color="blue">Running</Tag>]}
                </p>

                {/* Question content */}
                <Content
                    
                >
                    {questionContents}
                </Content>

                {/* Comment list */}
                {(commentsData && commentsData.length>=0 && showComments)?
                    (<>
                        <br></br>
                        <h4><strong>{commentsData.length} comments : </strong></h4>
                        <List
                            className="comments-list"
                            // header={<><strong>{commentsData.length} comments :</strong></>}
                            itemLayout="horizontal"
                            // dataSource=
                        >
                            {commentsData.map((item)=>(
                                <li key={"comment"+item.id}>
                                    <MyComment id={item.id} 
                                               author={item.author.username} 
                                               avatar={isNull(item.author.avatar ,standardAvatar)} 
                                               content={item.text} 
                                               timeString={item.createdAt} />
                                </li>
                            ))}
                        </List>
                        <Button style={{float:"right"}} onClick={()=>setShowComments(false)}><VerticalAlignMiddleOutlined /></Button>
                    
                    </>
                    ) 
                    :
                    (<>
                        <br></br>
                        <h4><strong>{!commentsData?0:commentsData.length} comments : ...</strong></h4>                      
                        <Button style={{float:"right"}} onClick={()=>setShowComments(true)}><VerticalAlignBottomOutlined /></Button>
                    </>
                    )
                }

                {/* make comment (to question) */}
                <Button type="text" style={{color:"gray", backgroundColor:"#FAFAFA"}} onClick={()=>setMakingCommentVisible(!makingCommentVisible)}>Comment to question</Button>                        
                {makingCommentVisible?
                    (<> <br></br><br></br>
                        <CommentEditor postID={id} 
                                    postType="question" 
                                    setVisible={setMakingCommentVisible} 
                                    authClient={authClient} 
                                    makeComment={makeComment} 
                                    commentsData={commentsData} 
                                    setCommentsData={setCommentsData} 
                                    userProfile={userProfile}
                        />
                    </>)
                    :
                    (<></>)
                }

                {/* Answer list */}
                {(answersData && answersData.length>0)?
                    (<><Divider plain><strong>{answersData.length} Answers :</strong></Divider>
                        <List
                            className="answers-list"
                            // header={`${data.length} replies`}
                            itemLayout="horizontal"
                        >
                            {answersData.map((item)=>(
                                <MyAnswer id={item.id}
                                          author={item.author.username}
                                          avatar={isNull(item.author.avatar, standardAvatar)}
                                          content={item.body}
                                          _likeCount={item.like}
                                          timeString={item.createdAt}
                                          _childrenComments={item.comments}
                                          authClient={authClient}
                                          makeComment={makeComment}
                                          userProfile={userProfile}
                                />
                            ))}
                        </List>
                    </>)
                    :
                    (<><Divider plain><strong>0 Answers :</strong></Divider></>)
                }
                <AnswerEditor questionID={id} 
                              authClient={authClient} 
                              makeAnswer={makeAnswer} 
                              answersData={answersData} 
                              setAnswersData={setAnswersData}
                              userProfile={userProfile} />

            </PageHeader>
            
            </>)
            :
            (<Spin tip="Loading..." 
                   size="large" 
                   style={{ 
                        backgroundColor:"white", width:"80vw", margin:"0vh 10vw 0vh 10vw", 
                        padding:"12vh 5vw 5vh 5vw", textAlign:"center" 
                   }}
            />)
            }
            
            <BackTop />

        </div>
    );

}

export default SingleQustionPage;