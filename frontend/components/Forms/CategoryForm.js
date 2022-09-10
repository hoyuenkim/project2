import { Form, Input, Button } from 'antd';
import { useDispatch } from 'react-redux';
import { useState } from 'react';
import { ADD_CATEGORY_REQUEST, EDIT_CATEGORY_REQUEST } from '../../reducers/shop';

const CategoryForm = ({ item, setCategory, ShopId, setItem }) => {
  const dispatch = useDispatch();
  const [name, setName] = useState(item && item.name);
  const onChangeName = (e) => {
    return setName(e.target.value);
  };

  const onFinish = () => {
    if (item) {
      dispatch({ type: EDIT_CATEGORY_REQUEST, data: { id: item.id, name, ShopId } });
      setCategory(false);
      setItem(null);
    } else {
      dispatch({ type: ADD_CATEGORY_REQUEST, data: { name, ShopId } });
      setCategory(false);
      setItem(null);
    }
  };
  return (
    <Form onFinish={onFinish}>
      <Form.Item>
        <Input placeholder={'카테고리명을 입력해주세요'} value={name} onChange={onChangeName} />
      </Form.Item>
      <Button htmlType={'submit'}>제출</Button>
    </Form>
  );
};

export default CategoryForm;
