import LoginPanel from '../component/login/loginPanel.js'
import SignUpPanel from '../component/login/signUpPanel.js'
import './login.css'

import React, { useState } from 'react';
import { Row, Col, Tabs  } from 'antd';
import { LoginOutlined, UsergroupAddOutlined } from '@ant-design/icons';
import 'antd/dist/antd.css'

const { TabPane } = Tabs;

const LoginPage = ({setToken}) => {

    const [ activeKey, setActiveKey ] = useState("1");

    return (
        <Row align="center">
        <Col span={8}>
        <Tabs activeKey={activeKey} 
              animated={{tabPane: true}} 
              centered="true" 
              size="large" 
              type="card"
              onChange={(key) => setActiveKey(key)}> 
            <TabPane tab={ <> <LoginOutlined/>Login </> } key="1">
                <LoginPanel setToken={setToken}/>
            </TabPane>
            <TabPane tab={ <> <UsergroupAddOutlined/>SignUp</> } key="2">
                <SignUpPanel setActiveKey={setActiveKey} />
            </TabPane>
        </Tabs>
        </Col>
        </Row>
    );

}

export default LoginPage;