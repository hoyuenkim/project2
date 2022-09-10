import { useState, useCallback, useEffect } from 'react';
import {
  Form,
  Input,
  Button,
  Upload,
  PageHeader,
  Space,
  Card,
  Select,
} from 'antd';
import { useInput } from '../../../../components/Generalui/CustomHooks';
import ImgCrop from 'antd-img-crop';
import { useDispatch, useSelector } from 'react-redux';
import { ADD_PRODUCT_REQUEST } from '../../../../reducers/menu';
import { ADMIN_PRODUCTS_REQUEST } from '../../../../reducers/shop';
import {
  GiftOutlined,
  DollarOutlined,
  ProfileOutlined,
} from '@ant-design/icons';
import { useRouter } from 'next/router';
import { PAGE_CHANGE_SUCCESS } from '../../../../reducers/admin';

const Regist = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { query } = useRouter();

  const { session, isLoggedIn } = useSelector((state) => state.user);
  const { categories } = useSelector((state) => state.shop);
  useEffect(() => {
    dispatch({ type: PAGE_CHANGE_SUCCESS, data: 'admin' });
  }, []);

  if (!session || isLoggedIn === false || session.division === false)
    router.push('/');

  useEffect(() => {
    dispatch({ type: ADMIN_PRODUCTS_REQUEST, ShopId: session.Shops[0].id });
  }, []);

  const [title, onChangeTitle] = useInput();
  const [price, onChangePrice] = useInput();
  const [description, onChangeDecription] = useInput();
  const [fileList, setFileList] = useState([]);
  const [fileError, setFileError] = useState();

  const onImagesChange = ({ fileList: newFileList }) => {
    setFileList(newFileList);
    setFileError(false);
  };

  const onPreview = async (file) => {
    let src = file.url;
    if (!src) {
      src = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(file.originFileObj);
        reader.onload = () => resolve(reader.result);
      });
    }
    const image = new Image();
    image.src = src;
    const imgWindow = window.open(src);
    imgWindow.document.write(image.outerHTML);
  };

  const onChangeCategory = (e) => {
    console.log(e);
    setCategory(e);
  };

  const onFinish = () => {
    const formData = new FormData();
    formData.append('title', title);
    formData.append('price', price);
    formData.append('description', description);
    fileList.forEach(({ originFileObj }) => {
      formData.append('files', originFileObj);
    });
    formData.append('ShopId', query.ShopId);
    formData.append('UserId', session.id);
    formData.append('CategoryId', category);
    if (fileList.length > 0) {
      dispatch({
        type: ADD_PRODUCT_REQUEST,
        formData,
      });
      return router.push(`/${query.ShopId}/product`);
    } else {
      return setFileError(true);
    }
  };
  const [category, setCategory] = useState(categories[0].id);

  return (
    <Form
      encType={'multipart/form-data'}
      onFinish={onFinish}
      style={{ height: '100vh' }}
      layout={'vertical'}
    >
      <Card
        title={<PageHeader className={'site-page-header'} title="상품등록" />}
      >
        <Space direction={'vertical'} size={'middle'} style={{ width: '100%' }}>
          <Form.Item
            name={'title'}
            rules={[{ required: true, message: '상품명을 입력해주세요' }]}
          >
            <Input
              name={'title'}
              prefix={<GiftOutlined />}
              size={'large'}
              onChange={onChangeTitle}
            />
          </Form.Item>
          <Form.Item
            name="price"
            rules={[
              { required: true, message: '가격을 입력해주세요' },
              { pattern: /^[0-9]/g, message: '숫자를 입력해주세요' },
            ]}
          >
            <Input
              name="price"
              prefix={<DollarOutlined />}
              size={'large'}
              value={price}
              onChange={onChangePrice}
            />
          </Form.Item>
          <Form.Item
            name="description"
            label="설명"
            rules={[{ required: true, message: '상세내역을 입력해주세요' }]}
          >
            <Input.TextArea
              name="description"
              prefix={<ProfileOutlined />}
              size={'large'}
              placeholder={'상세사항을 입력해주세요'}
              maxLength={200}
              onChange={onChangeDecription}
            />
          </Form.Item>
          <Form.Item name="category" label="카테고리">
            <Select onChange={onChangeCategory} defaultValue={categories[0].id}>
              {categories.map((category, index) => (
                <Select.Option key={index} value={category.id}>
                  {category.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Card title={`image`}>
            <ImgCrop rotate aspect={4 / 3} name={'image'}>
              <Upload
                action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                listType="picture-card"
                fileList={fileList}
                onChange={onImagesChange}
                onPreview={onPreview}
              >
                {fileList.length < 5 && '+ Upload'}
              </Upload>
            </ImgCrop>
            {fileError && (
              <div style={{ color: 'red' }}>파일을 업로드 해주세요</div>
            )}
          </Card>
          <Button type="primary" htmlType="submit" style={{ width: `100%` }}>
            제출
          </Button>
        </Space>
      </Card>
    </Form>
  );
};

export default Regist;
