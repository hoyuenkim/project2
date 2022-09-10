import { useDispatch, useSelector } from 'react-redux';
import { Form, Button, Input, Slider, Col, Row } from 'antd';
import { DELETE_DISCOUNT_REQUEST, DISCOUNT_PRODUCT_REQUEST } from '../../reducers/shop';
import { useState } from 'react';

const DiscountForm = ({ products, product, setDiscount, setProduct, category, ShopId }) => {
  const dispatch = useDispatch();
  const [rate, setRate] = useState(product && product.Discount !== null ? product.Discount.rate : 0);
  let ProductIds = [];

  const onChangeRate = (e) => {
    setRate(e);
  };

  const onChangeInputRate = (e) => {
    setRate(e.target.value);
  };

  const onFinish = () => {
    if (product) {
      ProductIds = [{ ProductId: product.id }];
    } else {
      const checkedProduct = products.filter((v) => v.checked == true);
      checkedProduct.map((v) => ProductIds.push({ ProductId: v.id }));
    }

    dispatch({
      type: DISCOUNT_PRODUCT_REQUEST,
      data: {
        ProductIds,
        rate,
        ShopId,
        CategoryId: category,
      },
    });
    setProduct(null);
    setDiscount(false);
  };

  const onClickDelete = () => {
    if (product) {
      ProductIds = [{ ProductId: product.id }];
    } else {
      const checkedProduct = products.filter((v) => v.checked == true);
      checkedProduct.map((v) => ProductIds.push({ ProductId: v.id }));
    }

    dispatch({
      type: DELETE_DISCOUNT_REQUEST,
      data: {
        ProductIds,
        ShopId,
        CategoryId: category,
      },
    });
    setProduct(null);
    setDiscount(false);
  };

  return (
    <>
      <Form onFinish={onFinish}>
        <Form.Item>
          <Row gutter={[10, 10]}>
            <Col span={20}>
              <Slider
                value={rate}
                onChange={onChangeRate}
                tooltipVisible
                tipFormatter={(e) => `${e}%`}
              />
            </Col>
            <Col span={3}>
              <Input value={rate} onChange={onChangeInputRate} />
            </Col>
            <Col span={1}>%</Col>
          </Row>
        </Form.Item>
        <Row gutter={[10, 10]}>
          <Col span={12}>
            <Button htmlType={'submit'} type={'primary'} style={{ width: '100%' }}>
              등록
            </Button>
          </Col>
          <Col span={12}>
            <Button onClick={onClickDelete} style={{ width: '100%' }}>
              삭제
            </Button>
          </Col>
        </Row>
      </Form>
    </>
  );
};

export default DiscountForm;
