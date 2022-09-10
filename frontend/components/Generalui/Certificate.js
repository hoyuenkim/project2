import { Card, Typography } from 'antd';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useRouter } from 'next/router';

const Certificate = ({ username }) => {
  const router = useRouter();
  const { push } = router;

  const [domain, setDomain] = useState();

  useEffect(() => {
    setDomain(
      'https://www.' +
        username.slice(username.indexOf('@') + 1, username.length + 1)
    );
  }, []);

  return (
    <Card style={{ height: '100vh' }}>
      <Typography.Title>회원가입을 축하드립니다!</Typography.Title>
      <Typography.Paragraph ellipsis={true} type={'success'}>
        {username}로 이메일이 송부되었습니다. 이메일 인증을 실시해주세요.
      </Typography.Paragraph>
      <a onClick={() => push(domain)}>{domain}</a>으로 이동하기
    </Card>
  );
};

export default Certificate;
