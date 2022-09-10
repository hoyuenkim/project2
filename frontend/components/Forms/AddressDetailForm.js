import { Form, Input } from "antd";

const AddressDetailForm = ({ onChangeAddressDetail }) => {
  return (
    <Form.Item>
      <Input
        prefix="* 상세주소"
        name={"addressDetail"}
        onChange={onChangeAddressDetail}
        size={"large"}
      />
    </Form.Item>
  );
};

export default AddressDetailForm;
