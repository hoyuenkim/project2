import ShopAddForm from '../Forms/ShopAddForm';
import { useInput } from './CustomHooks';
import { useRouter } from 'next/router';
import { useSelector, useDispatch } from 'react-redux';
import { useState } from 'react';
import { Card, Button, Modal, List, Avatar } from 'antd';
import { ADD_SHOP_REQUEST } from '../../reducers/user';

const ShopInfo = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { session } = useSelector((state) => state.user);
  const [modal, setModal] = useState(false);
  const [shopName, onChangeShopName] = useInput();
  const [address, setAddress] = useState();
  const [addressDetail, onChangeAddressDetail] = useInput();
  const [coordinates, setCoordinates] = useState();
  const [bizcode, onChangeBizcode] = useInput();

  const onClickAddShop = () => {
    return setModal((prev) => !prev);
  };

  const onFinish = () => {
    dispatch({
      type: ADD_SHOP_REQUEST,
      data: {
        UserId: session.id,
        shopName,
        address,
        addressDetail,
        bizcode,
        onChangeBizcode,
        coordinates,
      },
    });
    return setModal(false);
  };
  return (
    <>
      <Modal
        visible={modal}
        onCancel={onClickAddShop}
        title={'점포 추가'}
        footer={null}
      >
        <ShopAddForm
          onFinish={onFinish}
          onChangeShopName={onChangeShopName}
          bizcode={bizcode}
          onChangeBizcode={onChangeBizcode}
          address={address}
          setAddress={setAddress}
          onChangeAddressDetail={onChangeAddressDetail}
          setCoordinates={setCoordinates}
        />
      </Modal>
      <Card
        title={session && `${session.name}님의 매장 리스트`}
        extra={<Button onClick={onClickAddShop}>매장추가</Button>}
      >
        <List
          layout={'horizental'}
          dataSource={session.Shops}
          renderItem={(shop) => {
            return (
              <List.Item
                actions={[
                  <div onClick={() => router.push(`/${shop.id}`)}>
                    매장관리
                  </div>,
                  <div>매장삭제</div>,
                ]}
              >
                <List.Item.Meta
                  avatar={<Avatar>{shop.name[0]}</Avatar>}
                  title={shop.name}
                />
              </List.Item>
            );
          }}
        />
      </Card>
    </>
  );
};

export default ShopInfo;
