import { SIGNUP_MUTATION } from '../../graphql'

import React, { useState, useEffect } from 'react';
import { Form, Input, Cascader, Select, Row, Col, Checkbox, Button, AutoComplete, Alert, Spin, Space } from 'antd';
import { MailOutlined } from '@ant-design/icons';
import { useMutation } from "@apollo/client";

const { Option } = Select;

const SignUpPanel = ({setActiveKey}) => {

    const [alertion, setAlertion] = useState("");
    const [signUp, {loading: signUpLoading, data: signUpData, error: signUpError}] = useMutation(SIGNUP_MUTATION)

    const confirmPassword = (_, confirm, getFieldValue) => {
        if (!confirm || getFieldValue('password')==confirm) {
            return Promise.resolve();
        }
        return Promise.reject(new Error('The two passwords are not match!'));
    }

    useEffect( () => {
        // error message
        if ( signUpError ) {            
            setAlertion(signUpError.message.toString());
            // console.log(JSON.stringify(signUpError, null, 2));
        }

        // signup success
        if ( signUpData ) {
            setAlertion("New account registered success !");
            setTimeout(()=>{setActiveKey("login");},1300);
            
            const newUser = signUpData.signup;
            console.log(newUser);
        }

    }, [ signUpData, signUpError ])

    const onFinish = async (values) => {
        console.log(values);

        try {
            await signUp({
              variables: {
                email: values.email,
                username: values.name, 
                password: values.password,
                prefix: values.prefix,
                phone: values.phone,
                residences: values.residence 
              }
            });
        } catch(error) {}
    }

    const formItemLayout = {
      labelCol: {
        xs: { span: 16 },
        sm: { span: 8 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 24 },
      },
    };

    const tailFormItemLayout = {
      wrapperCol: {
        xs: { span: 9, offset: 0 },
        sm: { span: 24, offset: 0 },
      },
    };

    const residences = [
      {
        value: 'asia',
        label: 'Asia',
        children: [
          { value: 'taiwan', label: 'Taiwan' },
          { value: 'china', label: 'China' },
          { value: 'japan', label: 'Japan' },
          { value: 'korea', label: 'Korea' },
        ],
      },
      {
        value: 'eruope',
        label: 'Eruope',
        children: [
            { value: 'england', label: 'England'}
        ]
      },
      {
        value: 'america',
        label: 'America',
        children: [
        ]
      },
      {
        value: 'africa',
        label: 'Africa',
        children: [
        ]
      }
    ];

    return (
        <Form
            {...formItemLayout}
            name="register"
            onFinish={onFinish}
            scrollToFirstError
        >

            {alertion?(
              <Form.Item>
                <Alert message={alertion} type={alertion=="New account registered success !"?"success":"error"} showIcon />
              </Form.Item>
            ):(<></>)} 

            <Form.Item
                name="name"
                label="Name"
                rules={[{ required: true, message: 'Please input your name!' }]}
            >
                <Input placeholder="nick name"/>
            </Form.Item>

            <Form.Item
                name="email"
                label="E-mail"
                rules={[{type:'email', message:'Not a valid E-mail'},
                        {required:true, message:'Please input your E-mail'}]}
            >
                <Input 
                    prefix={<MailOutlined className="site-form-item-icon" />} 
                    placeholder="handsome@epistemologyplus.com" 
                />
            </Form.Item>

            <Form.Item
                name="password"
                label="Password"
                rules={[{required:true, message:'Please input your password'}]}
                hasFeedback
            >
                <Input.Password />
            </Form.Item>

            <Form.Item
                name="confirm"
                label="Confirm Password"
                dependencies={['password']}
                rules={[{required:true, message:'Please confirm your password'},
                         ({ getFieldValue }) => ({
                            validator(_, value) {
                              if (!value || getFieldValue('password') === value) {
                                return Promise.resolve();
                              }

                              return Promise.reject(new Error('The two passwords that you entered do not match!'));
                            },
                          }),
                        ]}
                hasFeedback
            >
                <Input.Password />
            </Form.Item>
            <Form.Item
                name="phone"
                label="Phone Number"
                rules={[]}
            >
                <Input
                  addonBefore={
                    <Form.Item name="prefix" initialValue="886" noStyle>
                      <Select style={{ width: 80 }} >
                        <Option value="886">+886</Option>
                        <Option value="86">+86</Option>
                      </Select>
                    </Form.Item>
                  }
                  style={{ width: '100%' }}
                />
            </Form.Item>

            <Form.Item
                name="residence"
                label="Reside Place"
                tooltip="Select a reside area. So we can recommend questions which locally close to you!"
                rules={[
                  { type: 'array', required: false, message: 'Please select your habitual residence!'},
                ]}
                initialValue={["Asia", "Taiwan"]}
              >
                <Cascader options={residences} />
              </Form.Item>

            <Form.Item
                name="agreement"
                valuePropName="checked"
                rules={[
                    { validator: (_, value) => 
                        (value ? Promise.resolve() : Promise.reject(new Error('Should accept agreement')) ) }
                ]}
                {...tailFormItemLayout}
            >
                <Checkbox>
                    I have read the <a href="http://google.com">agreement</a>
                </Checkbox>
            </Form.Item>

            <Form.Item {...tailFormItemLayout}>
                <Space size="middle">
                    <Button type="primary" htmlType="submit">
                        Register
                    </Button>
                    {(signUpLoading)?(<Spin />):(<></>)}
                </Space>
            </Form.Item>
        </Form>
    );
};

export default SignUpPanel;