import { useEffect } from 'react';
import { Affix, Statistic, Row, Col } from 'antd';
import { LikeOutlined, MailOutlined } from '@ant-design/icons';
import { useQuery, useSubscription } from '@apollo/client';

import { ME_QUERY, USER_QUERY, FEEDBACK_SUBSCRIPTION } from '../graphql';

const EplusRightContent = ({userProfile, authClient}) => {

    const { data: userData, loading: userLoading, error: userError, subscribeToMore } = useQuery(ME_QUERY, {client: authClient});

    const subscribeToMoreFeedback = () => {
        const unsubscribe = subscribeToMore({
            document: FEEDBACK_SUBSCRIPTION,
            client: authClient,
            updateQuery: (prev, { subscriptionData }) => {
                if (!subscriptionData.data) return prev;
                console.log("SubFeedBack", subscriptionData.data.feedback)
                return {
                    me: {feedback: subscriptionData.data.feedback}
                }
            }
        });
        return unsubscribe;
    }

    useEffect(() => {
        console.log("SubFeedBack")
        const unsubscribe = subscribeToMoreFeedback();
        return () => unsubscribe(); // clean up
    },[]);
   
    return (
        <Affix offsetTop={20} >
            <div style={{padding: "15px 15px", backgroundColor: "white", minHeight: "50vh"}}>
                <Row gutter={16}>
                    <Col span={12}>
                        <Statistic title="Feedback" value={(!userLoading&&!userError)?userData.me.feedback:0} prefix={<LikeOutlined />} size="small" />
                    </Col>
                    {/*<Col span={12}>
                        <Statistic title="Message" value={93} suffix="/100" prefix={<MailOutlined />} />
                    </Col>*/}
                </Row>
            </div>
        </Affix>
    );
}

export default EplusRightContent;