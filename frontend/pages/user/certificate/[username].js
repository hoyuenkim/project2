import { useRouter } from "next/router";
import { Card, Typography, tag } from "antd";
import { useEffect, useState } from "react";
import { PAGE_CHANGE_SUCCESS } from "../../../reducers/admin";
import { useDispatch } from "react-redux";

const Certificate = () => {
  const dispatch = useDispatch();
  const { query, push } = useRouter();
  const { username } = query;
  const [domain, setDomain] = useState();

  useEffect(() => {
    setDomain("https://www." + username.slice(username.indexOf("@") + 1, username.length + 1));
  }, []);

  useEffect(() => {
    dispatch({ type: PAGE_CHANGE_SUCCESS, data: "certificate" });
  });
  return (
    <Card style={{ height: "100vh" }}>
      <Typography.Title>회원가입을 축하드립니다!</Typography.Title>
      <Typography.Paragraph ellipsis={true} type={"success"}>
        {username}로 이메일이 송부되었습니다. 이메일 인증을 실시해주세요.
      </Typography.Paragraph>
      <a onClick={() => push(domain)}>{domain}</a>으로 이동하기
    </Card>
  );
};

export default Certificate;
