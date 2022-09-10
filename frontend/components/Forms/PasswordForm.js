import { Form, Input } from 'antd';

const PasswordForm = ({
  password,
  passwordCheck,
  onChangePassword,
  onChangePasswordCheck,
}) => {
  return (
    <>
      <Form.Item
        name="password"
        rules={[
          {
            required: true,
            message: '비밀번호를 확인해주세요',
          },
          {
            pattern: /^[A-Za-z0-9]{6,12}$/,
            message: '비밀번호가 형식에 맞지 않습니다',
          },
        ]}
      >
        <Input.Password
          prefix={`* 비밀번호`}
          size={`large`}
          value={password}
          onChange={onChangePassword}
          placeholder="비밀번호를 입력해주세요"
        />
      </Form.Item>
      <Form.Item
        name="passwordCheck"
        dependencies={['password']}
        rules={[
          {
            required: true,
            message: '비밀번호를 확인해 주세요',
          },
          ({ getFieldValue }) => ({
            validator(rule, value) {
              if (!value || getFieldValue('password') === value) {
                return Promise.resolve();
              }
              return Promise.reject('비밀번호가 일치하지 않습니다.');
            },
          }),
        ]}
      >
        <Input.Password
          prefix={`* 비밀번호 확인`}
          size={`large`}
          value={passwordCheck}
          onChange={onChangePasswordCheck}
          placeholder="다시 비밀번호를 입력해주세요"
        />
      </Form.Item>
    </>
  );
};

export default PasswordForm;
