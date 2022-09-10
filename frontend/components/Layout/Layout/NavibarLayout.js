import { Menu, Input, Modal, Popover, Space, List, Empty, Tag } from "antd";
import { ArrowLeftOutlined, UserOutlined, SearchOutlined } from "@ant-design/icons";
import { useSelector, useDispatch } from "react-redux";
import Router from "next/router";
import { LOG_OUT_SUCCESS } from "../../reducers/user";
import LoginModal from "../Forms/Login";
import SearchBarModal from "../Forms/SearchBar";
import ChangePassword from "../Forms/ChangePassword";
import { useState } from "react";
import { useRouter } from "next/router";
import { useInput } from "../Generalui/CustomHooks";
import axios from "axios";
import { SET_COORDINATES_SUCCESS, SET_SHOPCOORDINATES_SUCCESS } from "../../reducers/shop";
import { isMobile } from "react-device-detect";

const NavibarLayout = () => {
  const router = useRouter();
  axios.defaults.baseURL = `${process.env.BACKEND_IP}`;

  const [username, onChangeUsername, setUsername] = useInput();
  const [password, onChangePassword, setPassword] = useInput();

  const [toggleLogin, setToggleLogin] = useState(false);
  const [toggleSearch, setToggleSearch] = useState(false);
  const [toggleChangePassword, setToggleChangePassword] = useState(false);
  const [visible, setVisible] = useState(false);
  const [list, setList] = useState([]);

  const { pageInfo } = useSelector((state) => state.admin);

  const [show, setShow] = useState(false);

  const hideHandler = () => {
    setShow(false);
  };

  const showHandler = (show) => {
    setShow(show);
  };

  const onToggleChangePassword = () => {
    hideHandler();
    setToggleChangePassword((prev) => !prev);
  };

  const dispatch = useDispatch();
  const onClickLogout = () => {
    setPassword(undefined);
    setUsername(undefined);
    console.log(username);
    console.log(password);
    dispatch({ type: LOG_OUT_SUCCESS });
  };

  const onToggleLogin = () => {
    setPassword(undefined);
    setUsername(undefined);
    console.log(username);
    console.log(password);
    setToggleLogin((prev) => !prev);
  };

  const onToggleSearch = () => {
    setToggleSearch((prev) => !prev);
  };

  const onVisible = () => {
    setVisible((prev) => !prev);
  };

  const onClickPayments = () => {
    router.push("/payments");
    hideHandler();
  };

  const onClickAdmin = () => {
    router.push("/shop/admin");
    hideHandler();
  };

  const onClickShopList = (coordinates) => {
    axios
      .post("/", { coordinates: { lat: Number(coordinates.x), lng: Number(coordinates.y) } })
      .then((result) => {
        dispatch(
          {
            type: SET_COORDINATES_SUCCESS,
            data: [Number(coordinates.x), Number(coordinates.y)],
          },
          [],
        );
        dispatch({ type: SET_SHOPCOORDINATES_SUCCESS, data: result.data }, []);
        setVisible(false);
      });
  };

  const { isLoggedIn, session } = useSelector((state) => state.user);

  console.log(`isMobile: ${isMobile}`);

  return (
    <>
      <Modal title={"Login"} visible={toggleLogin} onCancel={onToggleLogin} footer={null}>
        <LoginModal
          setToggleLogin={setToggleLogin}
          username={username}
          setUsername={setUsername}
          onChangeUsername={onChangeUsername}
          password={password}
          setPassword={setPassword}
          onChangePassword={onChangePassword}
        />
      </Modal>
      <Modal
        title={"Search"}
        visible={toggleSearch}
        onCancel={onToggleSearch}
        setVisible={setVisible}
        footer={null}
      >
        <SearchBarModal
          type={pageInfo}
          setToggleSearch={setToggleSearch}
          setVisible={setVisible}
          setList={setList}
        />
      </Modal>
      <Modal title={"검색결과"} visible={visible} onCancel={onVisible} footer={null}>
        {list.length > 0 ? (
          <List
            dataSource={list}
            renderItem={(item) => {
              return (
                <List.Item onClick={() => onClickShopList(item)}>
                  <List.Item.Meta title={item.place_name} description={item.road_address_name} />
                </List.Item>
              );
            }}
          />
        ) : (
          <Empty>검색 결과가 존재하지 않습니다.</Empty>
        )}
      </Modal>
      <Modal
        title={"Change Password"}
        visible={toggleChangePassword}
        onCancel={onToggleChangePassword}
        footer={null}
      >
        <ChangePassword setToggleChangePassword={setToggleChangePassword} />
      </Modal>
      <Menu mode="horizontal">
        <Menu.Item key={"back"}>
          <ArrowLeftOutlined onClick={() => Router.back()} />
        </Menu.Item>

        <Menu.Item
          key={"search"}
          style={isMobile ? (isLoggedIn ? { marginLeft: "20%" } : { marginLeft: "55%" }) : null}
        >
          {isMobile ? (
            <Tag color={"blue"} visible={isLoggedIn} onClick={onToggleSearch}>
              {"  "} Search <SearchOutlined /> {"  "}
            </Tag>
          ) : (
            <Input.Search
              enterButton
              style={{ verticalAlign: "middle" }}
              onClick={onToggleSearch}
              visible={pageInfo === ("store" || "menu" || "index") ? true : false}
              readOnly
            />
          )}
        </Menu.Item>

        {!isLoggedIn
          ? [
              <Menu.Item key={"login"}>
                <a onClick={onToggleLogin}>로그인</a>
              </Menu.Item>,
            ]
          : [
              <Menu.Item key={"profile"}>
                <Popover
                  trigger={"click"}
                  placement={"bottom"}
                  title={session.name}
                  visible={show}
                  onVisibleChange={showHandler}
                  content={
                    <>
                      <Space direction={"vertical"}>
                        <div style={{ cursor: "pointer" }} onClick={onToggleChangePassword}>
                          비밀번호 변경
                        </div>
                        <div style={{ cursor: "pointer" }} onClick={onClickPayments}>
                          결제이력
                        </div>
                        {session.division === true && (
                          <div style={{ cursor: "pointer" }} onClick={onClickAdmin}>
                            매장관리 페이지
                          </div>
                        )}
                      </Space>
                    </>
                  }
                >
                  <UserOutlined />
                </Popover>
              </Menu.Item>,
              <Menu.Item key={"logout"}>
                <a onClick={onClickLogout}>로그아웃</a>
              </Menu.Item>,
            ]}
      </Menu>
    </>
  );
};

export default NavibarLayout;
