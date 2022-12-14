import { Button, Form, Input, Card, Space, Switch } from 'antd';
import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useInput, useChecked } from '../../components/Generalui/CustomHooks';
import Terms from '../../components/Generalui/Terms';
import axios from 'axios';
import { SIGN_UP_REQUEST } from '../../reducers/user';
import Router from 'next/router';
import { PAGE_CHANGE_SUCCESS } from '../../reducers/admin';
import KakaoAddress from '../../components/Generalui/KakaoAddress';
import AddressDetailForm from '../../components/Forms/AddressDetailForm';
import BizcodeForm from '../../components/Forms/BizcodeForm';
import EmailForm from '../../components/Forms/EmailForm';

axios.defaults.baseURL = `${process.env.BACKEND_IP}`;

const Signup = () => {
  const [email, onChangeEmail] = useInput();
  const [password, onChangePassword] = useInput();
  const [passwordCheck, onChangePasswordCheck] = useInput();
  const [name, onChangeName] = useInput();
  const [shopName, onChangeShopName] = useInput();
  const [bizcode, setBizcode] = useState();
  const [address, setAddress] = useState();
  const [addressDetail, onChangeAddressDetail] = useInput();
  const [termToggle, setTermToggle] = useState(false);
  const [termError, setTermError] = useState(false);
  const [divisionToggle, setDivisionToggle] = useState(false);
  const [coordinates, setCoordinates] = useState([]);
  const [
    personalInformationTerm,
    togglePersonalInformationTerm,
    setPersonalInformationTerm,
  ] = useChecked(false);
  const [
    thirdPartyIngormationTerm,
    toggleThirdPartyInformationTerm,
    setThirdPartyInformationTerm,
  ] = useChecked(false);

  const [locationTerm, toggleLocationTerm, setLocationTerm] = useChecked(false);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch({ type: PAGE_CHANGE_SUCCESS, data: 'signup' });
  });

  console.log(address);

  const onClickTermToggle = () => {
    return setTermToggle(!termToggle);
  };

  const onFinish = () => {
    dispatch({
      type: SIGN_UP_REQUEST,
      data: {
        username: email,
        password,
        name,
        bizcode,
        address,
        addressDetail,
        coordinates,
        shopName,
        division: divisionToggle,
      },
    });
  };

  const onChangeBizcode = (e) => {
    setBizcode(e.target.value);
  };

  return (
    <>
      <Card>
        <Form onFinish={onFinish} encType={'multipart/form-data'}>
          <Space direction="vertical" size={'large'} style={{ width: '100%' }}>
            <Terms
              setTerms={[
                [
                  personalInformationTerm,
                  togglePersonalInformationTerm,
                  setPersonalInformationTerm,
                ],
                [
                  thirdPartyIngormationTerm,
                  toggleThirdPartyInformationTerm,
                  setThirdPartyInformationTerm,
                ],
              ]}
            />
            <EmailForm onChangeEmail={onChangeEmail} />
            <Form.Item
              name="password"
              rules={[
                {
                  required: true,
                  message: '??????????????? ??????????????????',
                },
                {
                  pattern: /^[A-Za-z0-9]{6,12}$/,
                  message: '??????????????? ????????? ?????? ????????????',
                },
              ]}
            >
              <Input.Password
                prefix={`* ????????????`}
                size={`large`}
                value={password}
                onChange={onChangePassword}
                placeholder="??????????????? ??????????????????"
              />
            </Form.Item>
            <Form.Item
              name="passwordCheck"
              dependencies={['password']}
              rules={[
                {
                  required: true,
                  message: '??????????????? ????????? ?????????',
                },
                ({ getFieldValue }) => ({
                  validator(rule, value) {
                    if (!value || getFieldValue('password') === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject('??????????????? ???????????? ????????????.');
                  },
                }),
              ]}
            >
              <Input.Password
                prefix={`* ???????????? ??????`}
                size={`large`}
                value={passwordCheck}
                onChange={onChangePasswordCheck}
                placeholder="?????? ??????????????? ??????????????????"
              />
            </Form.Item>
            <Form.Item
              name="name"
              rules={[{ required: true, message: '????????? ??????????????????' }]}
            >
              <Input
                prefix={'* ????????????'}
                size={`large`}
                onChange={onChangeName}
                value={name}
              />
            </Form.Item>

            <Form.Item
              name={'shopName'}
              rules={[{ required: true, message: '???????????? ??????????????????' }]}
            >
              <Input
                prefix={'* ?????????'}
                size={`large`}
                onChange={onChangeShopName}
                value={shopName}
              />
            </Form.Item>
            <BizcodeForm onChangeBizcode={onChangeBizcode} />
            <KakaoAddress
              address={address}
              setAddress={setAddress}
              setCoordinates={setCoordinates}
            />
            <AddressDetailForm onChangeAddressDetail={onChangeAddressDetail} />
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                style={{ width: `100%` }}
              >
                ??????
              </Button>
            </Form.Item>
          </Space>
        </Form>
      </Card>
    </>
  );
};

export default Signup;
