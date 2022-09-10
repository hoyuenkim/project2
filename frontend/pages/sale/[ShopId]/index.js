import { List, Button, Modal, Card, Typography } from 'antd';
import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import NumberFormat from 'react-number-format';
import { useRouter } from 'next/router';
import { ADMIN_PRODUCTS_REQUEST } from '../../../reducers/shop';
import { LOAD_LIST_REQUEST } from '../../../reducers/stock';

const Sale = () => {
  const dispatch = useDispatch();
  const { query, push } = useRouter();
  const { ShopId } = query;
  useEffect(() => {
    dispatch({
      type: LOAD_LIST_REQUEST,
      ShopId,
    });
  }, []);
  const { stocks, originalStocks } = useSelector((state) => state.products);
  return (
    <>
      <Card
        title={''}
        extra={<Button onClick={push(`/${ShopId}/add`)}>상품추가</Button>}
      >
        <List
          dataSource={stocks}
          renderItems={(stock) => (
            <List.Item>
              <List.Item.Meta
                avatar={
                  <Avatar
                    src={`${process.env.CDN_DOMAIN}/${stock.Images[0].url}`}
                  />
                }
                title={
                  <Typography.Title level={3}>{stock.title}</Typography.Title>
                }
                description={stock.description}
              />
            </List.Item>
          )}
        />
      </Card>
    </>
  );
};
