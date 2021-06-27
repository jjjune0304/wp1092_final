import { Affix, Statistic, Row, Col } from 'antd';
import { LikeOutlined, MailOutlined } from '@ant-design/icons';

const EplusRightContent = () => {

    return (
        <Affix offsetTop={20} >
            <div style={{padding: "15px 15px", backgroundColor: "white", minHeight: "50vh"}}>
                <Row gutter={16}>
                    <Col span={12}>
                        <Statistic title="Feedback" value={1128} prefix={<LikeOutlined />} size="small" />
                    </Col>
                    <Col span={12}>
                        <Statistic title="Message" value={93} suffix="/100" prefix={<MailOutlined />} />
                    </Col>
                </Row>
            </div>
        </Affix>
    );
}

export default EplusRightContent;