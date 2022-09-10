import { Card, Col, Space, Row, Divider, message, Typography, Modal, Tag } from "antd";
import NumberFormat from "react-number-format";
import StockToggle from "./Generalui/StockToggle";
import { useDispatch } from "react-redux";
import { ADD_CART_ITEM_REQUEST, CLEAR_CART_REQUEST } from "../reducers/cart";

import Countdown from "react-countdown";

import { useSelector } from "react-redux";
import { useState, useEffect } from "react";
import { onClickPayment } from "./Generalui/Payment";
import ModalInterface from "./Generalui/Modal";
import { INITIATE_STOCK_QUANTITY_SUCCESS } from "../reducers/stock";

const Product = ({ product, quantity, discount, stock, id, dueDate, shop }) => {
  const [toggleModal, setToggleModal] = useState(false);
  const [IMP, setIMP] = useState();
  const onChangeToggleModal = () => setToggleModal((prev) => !prev);
  const dispatch = useDispatch();

  const { isLoggedIn, session } = useSelector((state) => state.user);

  useEffect(() => {
    const { IMP } = window;
    setIMP(IMP);
  }, []);

  console.log(quantity);

  const onClickAddCart = () => {
    const discountedProduct = {
      id,
      product,
      discount,
      quantity,
      stock,
      ShopId: shop.id,
      isLoggedIn,
      ShopName: shop.name,
      session,
    };
    dispatch({
      type: ADD_CART_ITEM_REQUEST,
      product: discountedProduct,
    });
    dispatch({ type: INITIATE_STOCK_QUANTITY_SUCCESS, data: { id } });
  };

  const paymentStart = () => {
    dispatch({ type: CLEAR_CART_REQUEST });
    dispatch({ type: INITIATE_STOCK_QUANTITY_SUCCESS, data: { id } });
    return onClickPayment({
      type: "single",
      id,
      product,
      discount,
      quantity,
      ShopId: shop.id,
      isLoggedIn,
      ShopName: shop.name,
      session,
      onChangeToggleModal,
    });
  };

  return (
    <>
      <ModalInterface
        content={"로그인을 하셔야 합니다."}
        toggleModal={toggleModal}
        onChangeToggleModal={onChangeToggleModal}
        title={"경고"}
      />
      <Card
        key={product.id}
        title={
          <>
            <Space>
              <Typography.Title level={3}>{product.title}</Typography.Title>{" "}
              <Tag color={"magenta"}>-{discount * 100}%</Tag>
            </Space>
            <br />
            <Typography.Text level={5} type={"secondary"}>
              마감: <Countdown key={id} daysInHours={true} date={dueDate} />
            </Typography.Text>
          </>
        }
        actions={[
          <div onClick={paymentStart}>즉시 구매</div>,
          <div onClick={onClickAddCart}>장바구니</div>,
        ]}
        cover={
          <img
            style={{ border: `1px solid #EFF2F5` }}
            src={
              product &&
              product.Images[0] &&
              `${process.env.BACKEND_IP}/uploads/${product.Images[0].url}`
            }
          />
        }
        hoverable
      >
        <Card.Meta
          description={
            <>
              <Row gutter={[16, 16]} align={"middle"} justify={"end"}>
                <Col md={16} xs={13} style={{ display: "inline-block" }}>
                  <>
                    <Space align="end">
                      가격
                      <Tag size={"small"}>
                        <NumberFormat
                          style={{ fontSize: "50%" }}
                          value={product.price}
                          displayType={"text"}
                          thousandSeparator={true}
                        />
                        원
                      </Tag>
                    </Space>
                    <Typography.Title level={2} style={{ color: "#FF5733", fontWeight: "bold" }}>
                      <NumberFormat
                        value={Math.ceil(product.price * (1 - discount))}
                        displayType={"text"}
                        thousandSeparator={true}
                      />
                      원
                    </Typography.Title>
                  </>
                </Col>
                <Col md={8} xs={11}>
                  <Space direction={"vertical"}>
                    <Row gutter={[0, 10]}>
                      <Col span={14}>남은수량:</Col>
                      <Col span={10}>{stock}개</Col>
                    </Row>
                    <StockToggle id={id} quantity={quantity} stock={stock} />
                  </Space>
                </Col>
              </Row>
              <Divider />
              <Row align={"middle"} justify={"center"}>
                <Col span={8} xs={8}>
                  <div>총 주문금액</div>
                </Col>
                <Col span={16} xs={16}>
                  <div style={{ textAlign: "right" }}>
                    <h1>
                      <NumberFormat
                        value={Math.ceil(product.price * (1 - discount)) * quantity}
                        displayType={"text"}
                        thousandSeparator={true}
                      />
                      원
                    </h1>
                  </div>
                </Col>
              </Row>
            </>
          }
        />
      </Card>
    </>
  );
};

export default Product;
