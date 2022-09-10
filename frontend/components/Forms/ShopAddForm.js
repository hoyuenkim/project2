import { Form, Input, Button } from 'antd';
import KakaoAddress from '../Generalui/KakaoAddress';
import AddressDetail from './AddressDetailForm';
import BizcodeForm from '../Forms/BizcodeForm';

const ShopAddForm = ({
  onChangeShopName,
  address,
  setAddress,
  onChangeAddressDetail,
  onFinish,
  bizcode,
  onChangeBizcode,
  setCoordinates,
}) => {
  return (
    <Form onFinish={onFinish}>
      <Form.Item
        name={'shopName'}
        rules={[{ required: true, message: '점포명을 입력해주세요' }]}
      >
        <Input prefix={'* 점포명'} size={'large'} onChange={onChangeShopName} />
      </Form.Item>
      <BizcodeForm bizcode={bizcode} onChange={onChangeBizcode} />
      <KakaoAddress
        address={address}
        setAddress={setAddress}
        setCoordinates={setCoordinates}
      />
      <AddressDetail onChangeAddressDetail={onChangeAddressDetail} />
      <Form.Item>
        <Button type="primary" htmlType="submit" style={{ width: `100%` }}>
          제출
        </Button>
      </Form.Item>
    </Form>
  );
};

export default ShopAddForm;
