import { Menu, Input, Modal, Popover, Space } from "antd";
import Link from "next/link";
import { ArrowLeftOutlined, UserOutlined } from "@ant-design/icons";
import { useSelector, useDispatch } from "react-redux";
import Router from "next/router";
import { LOG_OUT_SUCCESS } from "../../reducers/user";
import LoginModal from "../Generalui/Login";
import SearchBarModal from "../Generalui/SearchBar";
import ChangePassword from "../Generalui/ChangePassword";
import { useState } from "react";

const NavibarLayout = () => {
  const [toggleSearch, setToggleSearch] = useState(false);

  const onToggleSearch = () => {
    setToggleSearch((prev) => !prev);
  };

  const { isLoggedIn, session } = useSelector((state) => state.user);

  return (
    <>
      <Modal title={"Search"} visible={toggleSearch} onCancel={onToggleSearch} footer={null}>
        <SearchBarModal setToggleSearch={setToggleSearch} />
      </Modal>
      <div style={{ marginTop: "10px", backGroundColor: "white" }}>
        <Menu mode="horizontal">
          <Menu.Item key={"search"} style={{ float: "right" }}>
            <Input.Search
              enterButton
              style={{ verticalAlign: "middle" }}
              onClick={onToggleSearch}
              readOnly
            />
          </Menu.Item>
        </Menu>
      </div>
    </>
  );
};

export default NavibarLayout;
