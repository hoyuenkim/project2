import {
  List,
  Button,
  Space,
  Modal,
  Avatar,
  Card,
  Empty,
  Checkbox,
  Popconfirm,
  Affix,
  message,
  Tag,
} from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import {
  ADMIN_PRODUCTS_REQUEST,
  CHECK_ALL_PRODUCTS_SUCCESS,
  CHECK_PRODUCT_SUCCESS,
  DELETE_PRODUCT_REQUEST,
} from '../../../../reducers/shop';
import PropTypes from 'prop-types';

import EditProduct from '../../../../components/Forms/EditProduct';
import DiscountForm from '../../../../components/Forms/DiscountForm';
import MenuNavibarLayout from '../../../../components/Layout/MenuNavibarLayout ';
import NumberFormat from 'react-number-format';
import { PAGE_CHANGE_SUCCESS } from '../../../../reducers/admin';

import Link from 'next/link';

const Console = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { query } = useRouter();
  const { session } = useSelector((state) => state.user);
  useEffect(() => {
    dispatch({ type: PAGE_CHANGE_SUCCESS, data: 'admin' });
  }, []);

  const ShopId = query.ShopId;

  if (!session || session.division === false) {
    return router.back();
  } else {
    useEffect(() => {
      dispatch({ type: ADMIN_PRODUCTS_REQUEST, ShopId });
    }, []);
  }

  message.config({ top: 100 });

  const [edit, setEdit] = useState(false);
  const [discount, setDiscount] = useState(false);
  const [product, setProduct] = useState();
  const [category, setCategory] = useState(0);

  const onToggleEdit = (item) => {
    setProduct(item);
    setEdit((prev) => !prev);
  };

  const onClickCheckBox = ({ id }) => {
    dispatch({ type: CHECK_PRODUCT_SUCCESS, id });
  };

  const onClickCheckAllBoxs = (e) => {
    dispatch({ type: CHECK_ALL_PRODUCTS_SUCCESS, checked: e.target.checked });
  };

  const onToggleDiscount = () => {
    const checked = products.filter((product) => product.checked == true);
    if (checked.length == 0) {
      message.error('한가지 제품이라도 선택해주세요');
    } else {
      setDiscount((prev) => !prev);
    }
  };

  const onToggleOneDiscount = (item) => {
    setProduct(item);
    setDiscount((prev) => !prev);
  };

  const { products, categories, originProducts } = useSelector(
    (state) => state.shop
  );

  return (
    <>
      <Affix>
        <MenuNavibarLayout
          type={'admin'}
          categories={categories}
          setCategory={setCategory}
          ShopId={ShopId}
          products={products}
          originProducts={originProducts}
        />
      </Affix>
      <Card
        title={
          <Space>
            <Link href={`/${query.ShopId}/product/add`}>
              <Button>상품추가</Button>
            </Link>
            <Button type="primary" onClick={onToggleDiscount}>
              선택할인
            </Button>
          </Space>
        }
        extra={<Checkbox onChange={onClickCheckAllBoxs}>전체선택</Checkbox>}
      >
        {discount && (
          <Modal
            title={'세일'}
            visible={discount}
            onCancel={() => {
              setDiscount(false);
            }}
            footer={null}
          >
            <DiscountForm
              products={products}
              product={product}
              setProduct={setProduct}
              setDiscount={setDiscount}
              category={category}
              ShopId={ShopId}
            />
          </Modal>
        )}
        {edit && (
          <Modal
            title={'수정하기'}
            visible={edit}
            onCancel={() => {
              setEdit(false);
              setProduct(null);
            }}
            footer={null}
          >
            <EditProduct
              product={product}
              setEdit={setEdit}
              setProduct={setProduct}
              categories={categories}
            />
          </Modal>
        )}
        {products ? (
          <List
            itemLayout={'horizontal'}
            dataSource={products}
            renderItem={(item) => {
              return (
                <>
                  <List.Item key={item.id}>
                    <Card
                      style={{ width: '100%' }}
                      actions={[
                        <div onClick={() => onToggleOneDiscount(item)}>
                          할인
                        </div>,
                        <div onClick={() => onToggleEdit(item)}>수정</div>,
                        <Popconfirm
                          title={`${item.title}을 정말로 삭제하시겠습니까?`}
                          onConfirm={() =>
                            dispatch({
                              type: DELETE_PRODUCT_REQUEST,
                              id: item.id,
                            })
                          }
                          onCancel={() => console.log('cancel')}
                          okText="Yes"
                          cancelText="No"
                        >
                          <div>삭제</div>
                        </Popconfirm>,
                      ]}
                      extra={
                        <Checkbox
                          checked={item.checked}
                          onClick={() => onClickCheckBox(item)}
                        />
                      }
                      title={item.title}
                    >
                      <List.Item.Meta
                        avatar={
                          <Avatar
                            src={
                              item.Images[0] &&
                              `${process.env.BACKEND_IP}/uploads/${item.Images[0].url}`
                            }
                            shape={'square'}
                            size={'large'}
                          />
                        }
                        description={
                          <>
                            <p>
                              {!item.Discount ? (
                                <Space direction={'horizontal'} align={'start'}>
                                  <Tag>가격</Tag>
                                  <NumberFormat
                                    value={item.price}
                                    displayType={'text'}
                                    thousandSeparator={true}
                                  />
                                  원
                                </Space>
                              ) : (
                                <Space direction={'horizontal'} align={'start'}>
                                  <Tag color={'magenta'}>
                                    -{item.Discount.rate}%
                                  </Tag>
                                  <NumberFormat
                                    value={
                                      item.price *
                                      (100 - item.Discount.rate) *
                                      0.01
                                    }
                                    displayType={'text'}
                                    thousandSeparator={true}
                                  />
                                  원
                                </Space>
                              )}
                            </p>
                            <p>
                              <Tag>상세</Tag>
                              {item.description}
                            </p>
                          </>
                        }
                      />
                    </Card>
                  </List.Item>
                </>
              );
            }}
          />
        ) : (
          <>
            <Empty />
          </>
        )}
      </Card>
    </>
  );
};

Console.protoType = {
  productList: PropTypes.object.isRequired,
};

export default Console;
