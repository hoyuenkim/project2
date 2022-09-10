import { Form, Input } from "antd";
import axios from "axios";

const EmailForm = ({ onChangeEmail }) => {
  axios.defaults.baseURL = process.env.BACKEND_IP;
  return (
    <Form.Item
      name="email"
      validateTrigger="onBlur"
      rules={[
        {
          required: true,
          message: "이메일를 입력해 주세요!",
        },
        () => ({
          async validator(rule, value) {
            const regex = new RegExp(
              /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]{2,3}$/i,
            );
            if (value && value.match(regex)) {
              const result = await axios.post("/user/confirm/email", {
                email: value,
              });
              if (result.data) {
                return Promise.reject("이미 존재하는 이메일입니다");
              } else {
                return Promise.resolve();
              }
            } else {
              return Promise.reject("형식에 맞지 않는 이메일입니다");
            }
          },
        }),
      ]}
    >
      <Input
        size={`large`}
        prefix={`* Email`}
        onChange={onChangeEmail}
        placeholder="Email을 입력해주세요"
      />
    </Form.Item>
  );
};

export default EmailForm;
