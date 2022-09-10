import {
  List,
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
import { useInput } from '../../../components/Generalui/CustomHooks';

import NumberFormat from 'react-number-format';

import { useEffect, useState } from 'react';
import { useWindowSize } from '@react-hook/window-size';
import { useRouter } from 'next/router';
import {
  CLIENT_HISTORY_REMOVE_REQUEST,
  LOAD_PAYMENT_HISTORY_REQUEST,
  RATING_REQUEST,
  SEARCH_HISTORY_REQUEST,
} from '../../../reducers/payment';

import { PAGE_CHANGE_SUCCESS } from '../../../reducers/admin';

const { RangePicker } = DatePicker;

const History = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  useEffect(() => {
    dispatch({ type: PAGE_CHANGE_SUCCESS, data: 'admin' });
  });

  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();
  const [text, onChangeText, setText] = useInput();
  const [select, setSelect] = useState('product');

  const [toggleSearch, setToggleSearch] = useState(false);

  const [searchError, setSearchError] = useState(false);

  const { isLoggedIn, session } = useSelector((state) => state.user);
  const { history } = useSelector((state) => state.payment);
  useEffect(() => {
    dispatch({
      type: LOAD_PAYMENT_HISTORY_REQUEST,
      division: session.division,
      id: session.id,
    });
  }, []);

  if (!isLoggedIn) {
    router.back();
  }

  const [windowWidth, windowHeight] = useWindowSize();

  const onWindowScroll = () => {
    window.scrollTo({ top: 0 });
  };

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
                  <Select.Option value={'shop'}>매장명</Select.Option>
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
          <div style={{ marginTop: windowHeight * 0.3, textAlign: 'center' }}>
            <Empty />
            <h1>거래내역이 존재하지 않습니다</h1>
          </div>
        </Card>
      ) : (
        <Card extra={<Button onClick={onToggleSearch}>검색</Button>}>
          <List
            itemLayout="horizontal"
            dataSource={history}
            renderItem={(item) => {
              const date = new Date(item.createdAt);
              const localeDate = date.toLocaleString();

              const onClickRemoveHistory = () => {
                dispatch({
                  type: CLIENT_HISTORY_REMOVE_REQUEST,
                  PaymentId: item.id,
                });
              };

              return (
                <List.Item>
                  <Card
                    style={{ width: '100%' }}
                    actions={[
                      <div onClick={onClickRemoveHistory}>결제취소</div>,
                    ]}
                    extra={item.status ? '결제완료' : '취소요청'}
                  >
                    <List.Item.Meta
                      title={
                        <>
                          {item.Shop.name}_{item.Product.title}_{localeDate}
                        </>
                      }
                      description={
                        <>
                          <p>
                            결제수량:{' '}
                            <NumberFormat
                              value={item.quantity}
                              displayType={'text'}
                              thousandSeparator={true}
                            />
                            개, 결제단가:{' '}
                            <NumberFormat
                              value={item.price}
                              displayType={'text'}
                              thousandSeparator={true}
                            />
                            원
                          </p>
                          <h3>
                            결제금액:{' '}
                            <NumberFormat
                              value={item.price * item.quantity}
                              displayType={'text'}
                              thousandSeparator={true}
                            />
                            원
                          </h3>
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

export default History;
