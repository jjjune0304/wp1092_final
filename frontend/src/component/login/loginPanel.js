import SocialButton from './socialButton.js'
import { USER_QUERY, LOGIN_MUTATION } from '../../graphql'

import { useState, useEffect } from 'react'
import { Form, Input, Button, Checkbox, Divider, Alert, Spin, Space } from 'antd';
import { FacebookOutlined, GoogleOutlined, GithubOutlined, 
         UserOutlined, LockOutlined } from '@ant-design/icons';
import { useLazyQuery, useMutation } from "@apollo/client";


const LoginPanel = ({setToken}) => {

  const handleGithubLogin = (user) => {
    console.log(user)
  };

  const handleGithubFailure = (err) => {
    console.error(err)
  };

  const handleGoogleLogin = (user) => {
    console.log(user)
  };

  const handleGoogleFailure = (err) => {
    console.error(err)
  };

  const handleFacebookLogin = (user) => {
    console.log(user)
  };

  const handleFacebookFailure = (err) => {
    console.error(err)
  };

  const validatePassword = (passowrd) => {
    passowrd=="" ? Promise.reject(new Error("please input")):Promise.resolve()
  }

  const [alertion, setAlertion] = useState("");
  const [getToken, { loading: tokenDataLoading, data: tokenData, error: loginError }] = useMutation(LOGIN_MUTATION);

  useEffect(() => {
    // error message
    if ( loginError ) {
      setAlertion(loginError.message.toString());
      // console.log(JSON.stringify(loginError, null, 2));
    }

    // get token success
    if ( tokenData ) {
      setAlertion("");
      const token = tokenData.login.token;

      setToken(token);
      console.log("token: " + token + "\n Success Login");
    }
  }, [tokenData, loginError]);

  const onFinish = async (values) => {

    // set email/password cache
    console.log('Received values of form: ', values);
    if (values.remember) {
      localStorage.setItem('email', values.email);
      localStorage.setItem('password', values.password);
    } else {
      localStorage.setItem('email', "");
      localStorage.setItem('password', "");
    }

    // get login token
    console.log({ email: values.email, password: values.password });
    try {
      await getToken({ variables: { email: values.email, password: values.password } });
    } catch(error) {}

  };

  return ( <>
            <Form
              name="normal_login"
              className="login-form"
              initialValues={{
                remember: true,
              }}
              onChange={()=>setAlertion("")}
              onFinish={onFinish}
            >   

              <Divider plain>Third-part Login</Divider>

              <Form.Item>
                <div className="site-button-ghost-wrapper">
                  <div className="site-button-padding">
                    <SocialButton
                      provider='github'
                      appId='738344743166221'
                      onLoginSuccess={handleGithubLogin}
                      onLoginFailure={handleGithubFailure}
                    >
                      Login with Github <GithubOutlined style={{color:"#800080"}}/>
                    </SocialButton>
                  </div>
                  <div className="site-button-padding">
                    <SocialButton
                      provider='facebook'
                      appId='738344743166221'
                      onLoginSuccess={handleGoogleLogin}
                      onLoginFailure={handleGoogleFailure}
                    >
                     Login with Google <GoogleOutlined style={{color:"#EB4537"}}/> 
                    </SocialButton> 
                  </div>
                  <div className="site-button-padding">
                    <SocialButton
                      provider='facebook'
                      appId='738344743166221'
                      onLoginSuccess={handleFacebookLogin}
                      onLoginFailure={handleFacebookFailure}
                    >
                      Login with Facebook <FacebookOutlined style={{color:"#3b5998"}}/>
                    </SocialButton>
                  </div>
                </div>
              </Form.Item>

              <Divider plain>Epistemology+ Account Login</Divider>  

              {alertion?(
                  <Form.Item>
                    <Alert message={alertion} type="error" showIcon />
                  </Form.Item>
                ):(<></>)} 

              <Form.Item
                name="email"
                initialValue={localStorage.getItem('email')} 
                rules={[{required: true, message: 'Please input your Email!'}]}
              >
                <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Email"/>
              </Form.Item>

              <Form.Item
                name="password"
                initialValue={localStorage.getItem('password')}
                rules={[{required: true, message: 'Please input your Password!'},
                  // { validator: (_, passowrd) => validatePassword(passowrd) }
                  ]}
              >
                <Input
                  prefix={<LockOutlined className="site-form-item-icon" />}
                  type="password"
                  placeholder="Password"
                />
              </Form.Item>

              <Form.Item>
                <Form.Item name="remember" valuePropName="checked" noStyle>
                  <Checkbox>Remember me</Checkbox>
                </Form.Item>
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                <a className="login-form-forgot" href="">
                  Forgot password &nbsp;&nbsp;
                </a>
              </Form.Item>

              <Form.Item>
                <Space size="middle">
                  <Button type="primary" htmlType="submit" className="login-form-button">
                   &nbsp; Log in &nbsp;
                  </Button>
                  {tokenDataLoading? (<Spin />):(<></>)}
                </Space>
              </Form.Item>
            </Form>
          </>
  );
};

export default LoginPanel;