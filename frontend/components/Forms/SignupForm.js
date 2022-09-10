import { Button, Form, Input, Card, Space, Switch } from 'antd';
import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useInput, useChecked } from '../Generalui/CustomHooks';
import Terms from '../Generalui/Terms';
import Certificate from '../Generalui/Certificate';
import axios from 'axios';
import { SIGN_UP_REQUEST } from '../../reducers/user';
import KakaoAddress from '../Generalui/KakaoAddress';
import AddressDetailForm from './AddressDetailForm';
import BizcodeForm from './BizcodeForm';
import EmailForm from './EmailForm';
import PasswordForm from './PasswordForm';

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
  const [isSubmit, setIsSubmit] = useState(false);
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
    setIsSubmit(true);
  };

  const onChangeBizcode = (e) => {
    setBizcode(e.target.value);
  };

  return (
    <>
      <Card>
        {isSubmit ? (
          <Certificate username={email} />
        ) : (
          <Form onFinish={onFinish}>
            <Space
              direction="vertical"
              size={'large'}
              style={{ width: '100%' }}
            >
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
              <PasswordForm
                password={password}
                passwordCheck={passwordCheck}
                onChangePassword={onChangePassword}
                onChangePasswordCheck={onChangePasswordCheck}
              />
              <Form.Item
                name="name"
                rules={[{ required: true, message: '대표자명을 입력해주세요' }]}
              >
                <Input
                  prefix={'* 대표자명'}
                  size={`large`}
                  onChange={onChangeName}
                  value={name}
                />
              </Form.Item>
              <Form.Item
                name={'shopName'}
                rules={[{ required: true, message: '점포명을 입력해주세요' }]}
              >
                <Input
                  prefix={'* 점포명'}
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
              <AddressDetailForm
                onChangeAddressDetail={onChangeAddressDetail}
              />
              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  style={{ width: `100%` }}
                >
                  제출
                </Button>
              </Form.Item>
            </Space>
          </Form>
        )}
      </Card>
    </>
  );
};

export default Signup;
