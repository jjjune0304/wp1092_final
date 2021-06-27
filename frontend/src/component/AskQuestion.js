import 'braft-editor/dist/index.css'
import React, { useState } from "react";
import BraftEditor from 'braft-editor'
import { gql, useQuery, useMutation } from '@apollo/client';
import { ME_QUERY } from '../graphql'
import { CREATE_QUESTION_MUTATION } from '../graphql'
import { Form, Button, Spin, Input, InputNumber, Space, Divider, message, Typography } from 'antd'

const { Text } = Typography;

const Ask = ({ userProfile, authClient}) => {
    const [editorState, setEditorState] = useState(BraftEditor.createEditorState(null));
    const [reward, setReward] = useState(20);
    const [outputHTML, setOutputHTML] = useState('<p></p>');

    const {loading: meLoading, error: meError, data: meData} = useQuery(ME_QUERY);
    const [createQuestion, { loading: createQuestionLoading, data: createQuestionData, error: createQuestionError }] = useMutation(CREATE_QUESTION_MUTATION);

    if (meLoading)
        return (<Spin tip="Loading..." size="large"></Spin>);

    console.log(meData);
    const points = (!meError)?meData.me.points:0;

    const controls = ['bold', 'italic', 'underline', 'text-color', 'separator', 'link', 'separator']

    const handleContentChange = (editorState) => {
        setEditorState(editorState)
        setOutputHTML(editorState.toHTML())
    }

    const handleRewardChange = (e) => {
        setReward(e)
    }

    const onFinish = async (values) => {
        try {
            var newQuestion = await createQuestion({
                variables: {
                    title: values.title,
                    body: outputHTML,
                    reward: reward,
                },
                client: authClient
            });
            console.log(newQuestion);
            window.scroll({top: 0, behavior: 'smooth' })
            setTimeout(()=>{
                setEditorState(BraftEditor.createEditorState(null));
                window.open("/question/"+newQuestion.data.createQuestion.id, "_self");
            }, 500);

        } catch(error) {
            if (error.message.toString().includes('log in')) {
                message.error("Please login first");
                setTimeout(()=>window.open("/login", "_blank"), 500);
            }
            return;
        }

        message.success("Success ask question");
    }

    return (
        
        <div style={{backgroundColor:"white", height:"100%", minHeight:"100vh", padding:"15px 15px"}}>
            <h1 style={{fontSize: 32, color:"#001529"}}>
                <strong>Ask Question ?</strong>
            </h1>
            <Form style={{border: '3px dashed gray', padding: '20px', borderRadius: "10px 100px / 120px"}} name="nest-messages" onFinish={onFinish} >
                <Form.Item>
                    <Space style={{fontSize:"16px", float:"left"}}>
                    <Text> Your assets</Text><Text>💰 : {points} </Text>
                    </Space>
                </Form.Item>
                <Form.Item
                    rules={[
                        { required: true, message: 'Please input your rewards!'}
                    ]}
                >
                    <Space style={{fontSize:"16px", float:"left"}}>
                    <Text mark> Set reward</Text><Text>🤑 : </Text>
                    <InputNumber 
                            defaultValue={Math.min(20,points)}
                            placeholder={'0~'+points}
                            max={points}
                            min={0}
                            size="small"
                            onChange={handleRewardChange}
                        /> 
                    <Text>({'0~'+points})</Text>
                    </Space>
                </Form.Item>
                <Divider orientation="center" style={{color:"yellow", backgroundColor: "#001529"}}>Question</Divider>
                <Form.Item name='title' style={{borderBottom: '1px solid gray'}} rules={[{ required: true, message: 'Title is required' }]}>
                    <Input size="large" placeholder='Title' bordered={false}/>
                </Form.Item>
                <Form.Item style={{borderBottom: '1px solid gray'}}>
                    <BraftEditor
                        value={editorState}
                        onChange={handleContentChange}
                        controls={controls}
                    />
                </Form.Item>
                <Form.Item style={{padding: "0px 50px", textAlign:'left'}}>
                    <Button size="large" type="primary" htmlType="submit" onClick={()=>window.scroll({top: 0, behavior: 'smooth' })}>
                        Submit
                    </Button>
                    <Button size="large" style={{float:'right'}} onClick={()=>{
                            setReward(Math.min(20, points)); 
                            setEditorState(BraftEditor.createEditorState(null));
                        }}>
                        <img style={{width:"2vw"}} 
                             className="example-link-icon" 
                             src="https://image.flaticon.com/icons/png/512/542/542673.png" alt="trash" />
                    </Button>
                </Form.Item>
            </Form>
        </div>
    )
}
export default Ask;