import { Row, Col, Card } from 'antd';
import Login from '../components/Forms/Login';
import ShopInfo from '../components/Generalui/ShopInfo';
import { useSelector } from 'react-redux';

const Index = () => {
  const { session } = useSelector((state) => state.user);
  return (
    <Card style={{ height: '100vh' }}>
      {session ? (
        <ShopInfo />
      ) : (
        <Row>
          <Col offset={8} span={8}>
            <Login />
          </Col>
        </Row>
      )}
    </Card>
  );
};

export default Index;
