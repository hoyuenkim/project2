import {
  List,
  Tag,
  Avatar,
  Card,
  Empty,
  Rate,
  DatePicker,
  Modal,
  Input,
  Button,
  Form,
  Space,
  Select,
  Row,
  Col,
} from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { useInput } from '../../components/Generalui/CustomHooks';

import NumberFormat from 'react-number-format';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import {
  PAYMENT_HISTORY_REMOVE_REQUEST,
  LOAD_PAYMENT_HISTORY_REQUEST,
  RATING_REQUEST,
  SEARCH_HISTORY_REQUEST,
} from '../../reducers/payment';
import { PAGE_CHANGE_SUCCESS } from '../../reducers/admin';

const { RangePicker } = DatePicker;

const Payment = () => {
  const dispatch = useDispatch();
  const router = useRouter();

  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();
  const [text, onChangeText, setText] = useInput();
  const [select, setSelect] = useState('product');

  const [toggleSearch, setToggleSearch] = useState(false);

  const [searchError, setSearchError] = useState(false);

  const { isLoggedIn, session } = useSelector((state) => state.user);
  const { history } = useSelector((state) => state.payment);
  if (!isLoggedIn || !session) {
    router.back();
  }

  useEffect(() => {
    dispatch({
      type: LOAD_PAYMENT_HISTORY_REQUEST,
      division: session.division,
      id: session.id,
    });
  }, []);

  useEffect(() => {
    dispatch({ type: PAGE_CHANGE_SUCCESS, data: 'payment' });
  }, []);

  const onChangeDatePicker = (e) => {
    if (e === null) {
      setStartDate(null);
      setEndDate(null);
    } else {
      const start = new Date(e[0]._d);
      const end = new Date(e[1]._d);
      setStartDate(start);
      setEndDate(end);
    }
  };

  const onToggleSearch = () => {
    if (searchError) {
      setSearchError(false);
    }
    setToggleSearch((prev) => !prev);
  };

  const dateFormat = 'YYYY/MM/DD';

  const onChangeSelect = (e) => {
    setSelect(e);
  };

  const onFinishSearch = () => {
    dispatch({
      type: SEARCH_HISTORY_REQUEST,
      data: {
        startDate,
        endDate,
        text,
        select,
        division: session.division,
        UserId: session.id,
      },
    });
    setStartDate(null);
    setEndDate(null);
    setText(null);
    return setToggleSearch(false);
  };

  return (
    <>
      <Modal
        title={'Search'}
        visible={toggleSearch}
        onCancel={onToggleSearch}
        footer={null}
      >
        <Form onFinish={onFinishSearch}>
          <Space direction={'vertical'} style={{ width: '100%' }}>
            <Row gutter={[10, 10]}>
              <Col span={6}>
                <Select
                  defaultValue={'title'}
                  onChange={onChangeSelect}
                  style={{ width: '100%' }}
                >
                  <Select.Option value={'title'}>메뉴명</Select.Option>
                  {session && session.division == true ? (
                    <Select.Option value={'user'}>고객명</Select.Option>
                  ) : (
                    <Select.Option value={'shop'}>매장명</Select.Option>
                  )}
                </Select>
              </Col>
              <Col span={18}>
                <Input
                  onChange={onChangeText}
                  value={text}
                  style={{ width: '100%' }}
                />
              </Col>
              <Col span={24}>
                <RangePicker
                  style={{ verticalAlign: 'middle', width: '100%' }}
                  format={dateFormat}
                  onChange={onChangeDatePicker}
                  defaultValue={[startDate, endDate]}
                  inputReadOnly
                />
              </Col>
            </Row>
            <Button
              type={'primary'}
              style={{ width: '100%' }}
              htmlType={'submit'}
            >
              검색
            </Button>
          </Space>
        </Form>
      </Modal>

      {history.length === 0 ? (
        <Card
          style={{ height: '100vh' }}
          extra={<Button onClick={onToggleSearch}>검색</Button>}
        >
          <div style={{ textAlign: 'center' }}>
            <Empty />
            <h1>거래내역이 존재하지 않습니다</h1>
          </div>
        </Card>
      ) : (
        <Card
          extra={
            <Button onClick={onToggleSearch} type={'primary'}>
              검색
            </Button>
          }
        >
          <List
            itemLayout="horizontal"
            dataSource={history}
            renderItem={(item) => {
              const date = new Date(item.createdAt);
              const localeDate = date.toLocaleString();

              const onChangeRating = (value) => {
                dispatch({
                  type: RATING_REQUEST,
                  data: {
                    PaymentsId: item.id,
                    UserId: session.id,
                    rate: value,
                    ProductId: item.Product.id,
                  },
                });
              };

              const onClickRemoveHistory = () => {
                dispatch({
                  type: PAYMENT_HISTORY_REMOVE_REQUEST,
                  data: {
                    id: item.id,
                    imp_uid: item.imp_uid,
                    UserId: session.id,
                    division: session.division,
                    amount: item.amount,
                  },
                });
              };

              return (
                <List.Item>
                  <Card
                    style={{ width: '100%' }}
                    extra={
                      session && session.division == 0 ? (
                        item.status == 0 ? (
                          <Button
                            onClick={onClickRemoveHistory}
                            type={'primary'}
                          >
                            결제취소
                          </Button>
                        ) : item.status == 1 ? (
                          <Button readOnly danger>
                            결제취소 진행 중
                          </Button>
                        ) : (
                          <Button disabled>결제취소 완료</Button>
                        )
                      ) : item.status == 0 ? (
                        <Button onClick={onClickRemoveHistory} type={'primary'}>
                          결제취소
                        </Button>
                      ) : item.status == 1 ? (
                        <Button danger onClick={onClickRemoveHistory}>
                          결제취소 요청접수
                        </Button>
                      ) : (
                        <Button disabled>결제취소 완료</Button>
                      )
                    }
                  >
                    <List.Item.Meta
                      title={
                        <>
                          {item.Shop.name}_{item.Product.title}_{localeDate}
                        </>
                      }
                      description={
                        <>
                          {session && session.division == true && item.User && (
                            <p>{item.User.name}</p>
                          )}
                          <p>
                            결제수량:{' '}
                            <NumberFormat
                              value={item.quantity}
                              displayType={'text'}
                              thousandSeparator={true}
                            />
                            개, 결제단가:{' '}
                            <NumberFormat
                              value={item.price / item.quantity}
                              displayType={'text'}
                              thousandSeparator={true}
                            />
                            원
                          </p>
                          <h3>
                            결제금액:{' '}
                            <NumberFormat
                              value={item.price}
                              displayType={'text'}
                              thousandSeparator={true}
                            />
                            원
                          </h3>
                          {session && session.division == true ? (
                            <Rate
                              disabled
                              defaultValue={
                                item.Rating && item.Rating.rate
                                  ? item.Rating.rate
                                  : null
                              }
                            />
                          ) : (
                            <Rate
                              defaultValue={
                                item.Rating && item.Rating.rate
                                  ? item.Rating.rate
                                  : null
                              }
                              onChange={onChangeRating}
                            />
                          )}
                        </>
                      }
                      avatar={
                        <Avatar
                          size={50}
                          shape="square"
                          src={`${process.env.BACKEND_IP}/uploads/${item.Product.Images[0].url}`}
                        />
                      }
                    />
                  </Card>
                </List.Item>
              );
            }}
          />
        </Card>
      )}
    </>
  );
};

export default Payment;
