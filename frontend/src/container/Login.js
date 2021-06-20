import LoginPanel from '../component/login/LoginPanel'
import SignUpPanel from '../component/login/SignUpPanel'
import './Login.css'

import React, { useState } from 'react';
import { Row, Col, Tabs  } from 'antd';
import { LoginOutlined, UsergroupAddOutlined } from '@ant-design/icons';
import 'antd/dist/antd.css'

const { TabPane } = Tabs;

const LoginPage = ({setToken, activeKey, setActiveKey}) => {

    // const [ activeKey, setActiveKey ] = useState("1");

    return (
        <Row align="center">
            <Col span={14}>
                <Tabs activeKey={activeKey} 
                    animated={{tabPane: true}} 
                    centered="true" 
                    size="large" 
                    type="line"
                    onChange={(key) => setActiveKey(key)}> 
                    <TabPane tab={ <> <LoginOutlined/>Login </> } key="login">
                        <LoginPanel setActiveKey={setActiveKey} setToken={setToken}/>
                    </TabPane>
                    <TabPane tab={ <> <UsergroupAddOutlined/>SignUp</> } key="signup">
                        <SignUpPanel setActiveKey={setActiveKey} />
                    </TabPane>
                </Tabs>
            </Col>
        </Row>
    );

}

export default LoginPage;