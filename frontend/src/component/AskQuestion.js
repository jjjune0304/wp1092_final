import 'braft-editor/dist/index.css'
import React, { useState, useEffect } from "react";
import BraftEditor from 'braft-editor'
import { gql, useQuery, useMutation } from '@apollo/client';
import { USER_QUERY } from '../graphql'
import { CREATE_QUESTION_MUTATION } from '../graphql'
import { Form, Button, Spin, Input, InputNumber } from 'antd'

const Ask = (token, setToken, activeKey, setActiveKey, authClient) => {
    const [editorState, setEditorState] = useState(BraftEditor.createEditorState(null));
    const [reward, setReward] = useState(20);
    const [outputHTML, setOutputHTML] = useState('<p></p>');

    const {loading: userLoading, error: userError, data: userData} = useQuery(USER_QUERY,{
        variables: {email: 'tt@gmail.com'}
    })

    const [createQuestion, { loading: createQuestionLoading, data: createQuestionData, error: createQuestionError }] = useMutation(CREATE_QUESTION_MUTATION);

    if (userLoading || createQuestionLoading)
        return (<Spin tip="Loading..." size="large"></Spin>);

    const points = userData.user.points

    const controls = ['bold', 'italic', 'underline', 'text-color', 'separator', 'link', 'separator']

    const handleContentChange = (editorState) => {
        setEditorState(editorState)
        setOutputHTML(editorState.toHTML())
    }

    const handleRewardChange = (e) => {
        setReward(e)
    }

    const layout = {
        labelCol: { span: 4 },
        wrapperCol: { span: 8 },
    };

    const onFinish = async (values) => {
        console.log(reward)
        console.log(values.title)
        console.log(outputHTML)

        try {
            if (token!="")
                await createQuestion({
                    variables: {
                        title: values.title,
                        body: outputHTML,
                        reward: reward,
                    },
                    client: authClient
                });
        } catch(error) {console.log(error)}

        setEditorState(BraftEditor.createEditorState(null))
    }

    const validateMessages = {
        required: 'Title is required!',
    }

    return (
        
        <div>
            <div>
                <h2>Your Points: {points}</h2>
                <h2>
                    Reward: <InputNumber 
                        style={{width: 100, textAlign: 'center'}}
                        defaultValue={20}
                        placeholder='0~10000'
                        max={10000}
                        min={0}
                        onChange={handleRewardChange}
                    />
                </h2>
            </div>
            <Form style={{border: '1px solid gray', padding: '0 16px'}} name="nest-messages" onFinish={onFinish} validateMessages={validateMessages}>
                <Form.Item name='title' style={{borderBottom: '1px solid gray'}} rules={[{ required: true }]}>
                    <Input size="large" placeholder='Title' bordered={false}/>
                </Form.Item>
                <Form.Item style={{borderBottom: '1px solid gray'}}>
                    <BraftEditor
                    value={editorState}
                    onChange={handleContentChange}
                    controls={controls}
                    />
                </Form.Item>
                <Form.Item style={{textAlign:'left'}}>
                    <Button size="large"
                    type="primary"
                    htmlType="submit">Summit</Button>
                </Form.Item>
            </Form>
        </div>
    )
}
export default Ask;