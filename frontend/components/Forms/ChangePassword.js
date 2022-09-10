import { useDispatch, useSelector } from 'react-redux';
import { Form, Input, Button, Card } from 'antd';
import { useInput } from '../Generalui/CustomHooks';
import { useCallback } from 'react';
import axios from 'axios';
import { PASSWORD_CHANGE_REQUEST } from '../../reducers/user';

const ChangePassword = ({ setToggleChangePassword }) => {
  const dispatch = useDispatch();
  const [presentPassword, onChangePresentPassword, setPresentPassword] = useInput();
  const [password, onChangePassword, setPassword] = useInput();
  const [passwordCheck, onChangePasswordCheck, setChangePasswordCheck] = useInput();

  const { session, isLoggedIn } = useSelector((state) => state.user);

  const onFinish = useCallback(() => {
    dispatch({
      type: PASSWORD_CHANGE_REQUEST,
      data: {
        id: session.id,
        password,
      },
    });
    setToggleChangePassword((prev) => !prev);
    setPresentPassword(null);
    setPassword(null);
    setChangePasswordCheck(null);
  }, [password, passwordCheck]);

  return (
    <>
      <Card style={{ verticalAlign: 'middle' }}>
        <Form onFinish={onFinish}>
          <Form.Item
            name="presentPassword"
            validateTrigger="onBlur"
            rules={[
              {
                required: true,
                message: '기존 비밀번호를 입력해주세요',
              },
              () => ({
                async validator(rule, value) {
                  const regex = new RegExp(/^[A-Za-z0-9]{6,12}$/);
                  if (value && value.match(regex)) {
                    const result = await axios.post('/user/confirm/password', {
                      id: session.id,
                      password: value,
                    });
                    if (!result.data) {
                      // console.log(result);
                      return Promise.reject('기존 비밀번호가 일치하지 않습니다.');
                    } else {
                      return Promise.resolve();
                    }
                  } else {
                    return Promise.reject('형식에 맞지 않는 비밀번호입니다');
                  }
                },
              }),
            ]}
          >
            <Input.Password
              size={`large`}
              prefix={`* 기존 패스워드`}
              value={presentPassword}
              onChange={onChangePresentPassword}
              placeholder="기존 비밀번호를 입력해주세요"
            />
          </Form.Item>
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
          <Button type={'primary'} htmlType={'submit'} style={{ width: '100%' }}>
            비밀번호 변경
          </Button>
        </Form>
      </Card>
    </>
  );
};

export default ChangePassword;
